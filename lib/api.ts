/**
 * API client. Auth uses HTTP-only cookies (session + refresh).
 *
 * In the browser, requests go to same-origin `/api/v1`, proxied by `app/api/v1/[...path]/route.ts`
 * to `API_UPSTREAM` (or `NEXT_PUBLIC_API_URL` if unset) with `Cookie` forwarded.
 *
 * For server-side fetch, set NEXT_PUBLIC_APP_URL to your app origin (e.g. http://localhost:3003).
 */

export function getApiBaseUrl(): string {
  if (typeof window !== 'undefined') {
    return '/api/v1';
  }
  const origin =
    process.env.NEXT_PUBLIC_APP_URL?.replace(/\/+$/, '') ||
    (process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : null) ||
    'http://localhost:3000';
  return `${origin}/api/v1`;
}

export class ApiError extends Error {
  constructor(
    public status: number,
    public body: unknown
  ) {
    super(typeof body === 'string' ? body : `Request failed (${status})`);
    this.name = 'ApiError';
  }
}

function apiUrl(path: string): string {
  const base = getApiBaseUrl();
  const p = path.startsWith('/') ? path : `/${path}`;
  return `${base}${p}`;
}

/** Routes where 401 means invalid credentials / no session — do not chain refresh. */
function shouldAttemptRefreshAfter401(requestUrl: string): boolean {
  const path = requestUrl.replace(/^https?:\/\/[^/]+/, '').split('?')[0] ?? '';
  if (path.includes('/auth/login')) return false;
  if (path.includes('/auth/signup')) return false;
  if (path.includes('/auth/refresh')) return false;
  if (path.includes('/auth/google')) return false;
  return true;
}

let refreshInFlight: Promise<boolean> | null = null;

/**
 * POST /api/v1/auth/refresh — refresh access token using the HttpOnly refresh cookie (no body / query).
 * Backend rotates both tokens; old refresh is revoked.
 */
async function postAuthRefresh(): Promise<Response> {
  return fetch(apiUrl('/auth/refresh'), {
    method: 'POST',
    credentials: 'include',
    headers: { Accept: 'application/json' },
    cache: 'no-store',
  });
}

/**
 * POST /auth/refresh once; concurrent 401s share the same call.
 * Returns true if rotation succeeded (2xx).
 */
async function tryRefreshSession(): Promise<boolean> {
  if (refreshInFlight) return refreshInFlight;
  refreshInFlight = (async () => {
    const res = await postAuthRefresh();
    return res.ok;
  })();
  try {
    return await refreshInFlight;
  } finally {
    refreshInFlight = null;
  }
}

/**
 * For cookie auth: if access token expired (401), rotate via refresh cookie then retry once.
 */
async function fetchWithAuthRetry(input: string, init?: RequestInit): Promise<Response> {
  const res = await fetch(input, { ...init, credentials: 'include' });
  if (res.status !== 401 || !shouldAttemptRefreshAfter401(input)) {
    return res;
  }
  const ok = await tryRefreshSession();
  if (!ok) {
    return res;
  }
  return fetch(input, { ...init, credentials: 'include' });
}

async function parseErrorBody(res: Response): Promise<unknown> {
  const text = await res.text();
  if (!text) return null;
  try {
    return JSON.parse(text);
  } catch {
    return text;
  }
}

/** Relation often returned expanded from GET /auth/me (id + name). */
export type NamedRef = {
  id?: string;
  name?: string;
};

/**
 * GET /auth/me — Swagger shows core fields; backend may add level/speciality (flat or under `student`).
 */
export type AuthUser = {
  id: string;
  username: string;
  email: string;
  firstName: string;
  lastName: string;
  /** Profile photo URL when returned by GET /auth/me (field name may vary by API version). */
  imageUrl?: string;
  avatarUrl?: string;
  profileImageUrl?: string;
  provider?: string;
  lastLogin: string;
  role?: string;
  level?: NamedRef | string | null;
  speciality?: NamedRef | string | null;
  specialty?: NamedRef | string | null;
  studyYear?: string | null;
  student?: {
    level?: NamedRef | string | null;
    speciality?: NamedRef | string | null;
    specialty?: NamedRef | string | null;
    age?: number;
  } | null;
  /** Newer API shape (student profile + nested relations) */
  studentProfile?: {
    age?: number;
    curriculum?: NamedRef & { code?: string; termCount?: number };
    level?: NamedRef & { code?: string };
    speciality?: NamedRef & { code?: string; description?: string; terms?: unknown[] };
  } | null;
};

const LS_SPECIALITY_ID = 'viah_specialityId';

/** Reads speciality id from /auth/me (studentProfile.speciality, or legacy student/speciality objects). */
export function extractSpecialityIdFromUser(user: AuthUser): string | null {
  const sp = user.studentProfile?.speciality;
  if (sp && typeof sp === 'object' && typeof sp.id === 'string' && sp.id) return sp.id;
  if (user.speciality && typeof user.speciality === 'object' && 'id' in user.speciality) {
    const id = (user.speciality as NamedRef).id;
    if (typeof id === 'string' && id) return id;
  }
  const st = user.student?.speciality;
  if (st && typeof st === 'object' && 'id' in st) {
    const id = (st as NamedRef).id;
    if (typeof id === 'string' && id) return id;
  }
  return null;
}

export function persistSpecialityIdFromMe(user: AuthUser): void {
  if (typeof window === 'undefined') return;
  const id = extractSpecialityIdFromUser(user);
  if (id) localStorage.setItem(LS_SPECIALITY_ID, id);
}

export function getStoredSpecialityId(): string | null {
  if (typeof window === 'undefined') return null;
  return localStorage.getItem(LS_SPECIALITY_ID);
}

/** Resolve profile picture URL from /auth/me (supports several backend field names). */
export function getProfileImageUrl(user: AuthUser | null | undefined): string | null {
  if (!user) return null;
  const top = user as unknown as Record<string, unknown>;
  const candidates: unknown[] = [
    user.imageUrl,
    user.avatarUrl,
    user.profileImageUrl,
    top.photoUrl,
    top.picture,
    top.avatar,
  ];
  if (user.student && typeof user.student === 'object') {
    const s = user.student as Record<string, unknown>;
    candidates.push(s.imageUrl, s.avatarUrl, s.photoUrl);
  }
  if (user.studentProfile && typeof user.studentProfile === 'object') {
    const sp = user.studentProfile as Record<string, unknown>;
    candidates.push(sp.imageUrl, sp.avatarUrl);
  }
  for (const c of candidates) {
    if (typeof c === 'string') {
      const t = c.trim();
      if (t && /^https?:\/\//i.test(t)) return t;
    }
  }
  return null;
}

function pickRelationName(value: NamedRef | string | null | undefined): string | null {
  if (value == null || value === '') return null;
  if (typeof value === 'string') return value.trim() || null;
  if (typeof value === 'object' && typeof value.name === 'string' && value.name.trim()) {
    return value.name.trim();
  }
  return null;
}

/** Normalise /auth/me for UI (handles several API shapes). */
export function getMeDisplay(user: AuthUser) {
  const s = user.student;
  const sp = user.studentProfile;
  const specialityLabel =
    pickRelationName(sp?.speciality) ??
    pickRelationName(user.speciality) ??
    pickRelationName(user.specialty) ??
    pickRelationName(s?.speciality) ??
    pickRelationName(s?.specialty);

  const levelLabel =
    pickRelationName(sp?.level) ??
    pickRelationName(user.level) ??
    pickRelationName(s?.level) ??
    (typeof user.studyYear === 'string' && user.studyYear.trim() ? user.studyYear.trim() : null);

  const first = user.firstName?.trim() ?? '';
  const last = user.lastName?.trim() ?? '';
  const fullName = `${first} ${last}`.trim() || user.username || '—';
  const initials =
    first && last
      ? `${first[0]!}${last[0]!}`.toUpperCase()
      : (user.username?.slice(0, 2).toUpperCase() ?? '?');

  return {
    fullName,
    initials,
    email: user.email,
    username: user.username,
    provider: user.provider,
    lastLogin: user.lastLogin,
    levelLabel: levelLabel ?? '—',
    specialityLabel: specialityLabel ?? '—',
  };
}

export type LoginBody = {
  username: string;
  password: string;
};

export type SignupBody = {
  email: string;
  username: string;
  firstName: string;
  lastName: string;
  password: string;
  studentData: {
    age: number;
    levelId: string;
    /** From GET /curriculums/public */
    curriculumId: string;
    /** Required for senior secondary (e.g. Grade 11–12); omitted for lower grades if API allows */
    specialityId?: string;
  };
};

export function getGoogleAuthUrl(): string {
  return apiUrl('/auth/google');
}

export async function login(body: LoginBody): Promise<void> {
  const res = await fetch(apiUrl('/auth/login'), {
    method: 'POST',
    credentials: 'include',
    headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
    body: JSON.stringify(body),
  });
  if (!res.ok) {
    throw new ApiError(res.status, await parseErrorBody(res));
  }
}

export async function logout(): Promise<void> {
  const res = await fetchWithAuthRetry(apiUrl('/auth/logout'), {
    method: 'POST',
    headers: { Accept: 'application/json' },
  });
  if (!res.ok) {
    throw new ApiError(res.status, await parseErrorBody(res));
  }
  if (typeof window !== 'undefined') {
    localStorage.removeItem(LS_SPECIALITY_ID);
  }
}

export async function getMe(): Promise<AuthUser> {
  const res = await fetchWithAuthRetry(apiUrl('/auth/me'), {
    method: 'GET',
    headers: { Accept: 'application/json' },
  });
  if (!res.ok) {
    throw new ApiError(res.status, await parseErrorBody(res));
  }
  const user = (await res.json()) as AuthUser;
  persistSpecialityIdFromMe(user);
  return user;
}

/** Manual refresh — same as automatic rotation: POST /api/v1/auth/refresh with cookies (not inside fetchWithAuthRetry, avoids recursion). */
export async function refreshSession(): Promise<void> {
  const res = await postAuthRefresh();
  if (!res.ok) {
    throw new ApiError(res.status, await parseErrorBody(res));
  }
}

export async function signup(body: SignupBody): Promise<void> {
  const res = await fetch(apiUrl('/auth/signup'), {
    method: 'POST',
    credentials: 'include',
    headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
    body: JSON.stringify(body),
  });
  if (!res.ok) {
    throw new ApiError(res.status, await parseErrorBody(res));
  }
}

export async function uploadProfileImage(file: File): Promise<void> {
  const form = new FormData();
  form.append('file', file);
  const res = await fetchWithAuthRetry(apiUrl('/auth/me/image'), {
    method: 'POST',
    body: form,
  });
  if (!res.ok) {
    throw new ApiError(res.status, await parseErrorBody(res));
  }
}

/** Public catalog for signup: GET /levels/public and GET /specialities/public (optional ?levelId=). */
export type Level = {
  id: string;
  name: string;
};

export type Speciality = {
  id: string;
  name: string;
  description?: string;
  /** From nested `level.id` (GET /specialities/public) */
  levelId?: string;
  /** From nested `curriculum.id` */
  curriculumId?: string;
};

function normalizeJsonArray<T>(raw: unknown): unknown[] {
  if (Array.isArray(raw)) return raw;
  if (raw && typeof raw === 'object' && 'data' in raw && Array.isArray((raw as { data: unknown }).data)) {
    return (raw as { data: unknown[] }).data;
  }
  if (raw && typeof raw === 'object' && 'items' in raw && Array.isArray((raw as { items: unknown }).items)) {
    return (raw as { items: unknown[] }).items;
  }
  return [];
}

function pickLabel(o: Record<string, unknown>): string {
  if (typeof o.name === 'string') return o.name;
  if (typeof o.title === 'string') return o.title;
  if (typeof o.label === 'string') return o.label;
  return '';
}

function mapLevel(raw: unknown): Level | null {
  if (!raw || typeof raw !== 'object') return null;
  const o = raw as Record<string, unknown>;
  const id = typeof o.id === 'string' ? o.id : undefined;
  if (!id) return null;
  const name = pickLabel(o) || id;
  return { id, name };
}

function mapSpeciality(raw: unknown): Speciality | null {
  if (!raw || typeof raw !== 'object') return null;
  const o = raw as Record<string, unknown>;
  const id = typeof o.id === 'string' ? o.id : null;
  if (!id) return null;
  const name = pickLabel(o) || id;
  const description = typeof o.description === 'string' ? o.description : undefined;
  let levelId: string | undefined;
  let curriculumId: string | undefined;
  if (o.level && typeof o.level === 'object') {
    const l = o.level as Record<string, unknown>;
    if (typeof l.id === 'string') levelId = l.id;
  }
  if (o.curriculum && typeof o.curriculum === 'object') {
    const c = o.curriculum as Record<string, unknown>;
    if (typeof c.id === 'string') curriculumId = c.id;
  }
  return { id, name, description, levelId, curriculumId };
}

export async function getLevels(): Promise<Level[]> {
  const res = await fetch(apiUrl('/levels/public'), {
    method: 'GET',
    credentials: 'omit',
    headers: { Accept: 'application/json' },
  });
  if (!res.ok) {
    throw new ApiError(res.status, await parseErrorBody(res));
  }
  const json: unknown = await res.json();
  return normalizeJsonArray(json)
    .map(mapLevel)
    .filter((x): x is Level => x !== null);
}

/** GET /curriculums/public — same shape as levels (id + name). */
export type Curriculum = Level;

export async function getCurriculums(): Promise<Curriculum[]> {
  const res = await fetch(apiUrl('/curriculums/public'), {
    method: 'GET',
    credentials: 'omit',
    headers: { Accept: 'application/json' },
  });
  if (!res.ok) {
    throw new ApiError(res.status, await parseErrorBody(res));
  }
  const json: unknown = await res.json();
  return normalizeJsonArray(json)
    .map(mapLevel)
    .filter((x): x is Curriculum => x !== null);
}

/** Optional `levelId` query filters specialities for that level (API contract). */
export async function getSpecialities(levelId?: string): Promise<Speciality[]> {
  const qs = new URLSearchParams();
  if (levelId) qs.set('levelId', levelId);
  const suffix = qs.toString() ? `?${qs.toString()}` : '';
  const res = await fetch(apiUrl(`/specialities/public${suffix}`), {
    method: 'GET',
    credentials: 'omit',
    headers: { Accept: 'application/json' },
  });
  if (!res.ok) {
    throw new ApiError(res.status, await parseErrorBody(res));
  }
  const json: unknown = await res.json();
  return normalizeJsonArray(json)
    .map(mapSpeciality)
    .filter((x): x is Speciality => x !== null);
}

/** GET /terms/my — current user's terms (shape may vary by API). */
export type UserTerm = {
  id: string;
  name: string;
  description?: string;
  startDate?: string;
  endDate?: string;
  raw?: Record<string, unknown>;
};

function mapUserTerm(raw: unknown): UserTerm | null {
  if (!raw || typeof raw !== 'object') return null;
  const o = raw as Record<string, unknown>;
  const id = typeof o.id === 'string' ? o.id : null;
  if (!id) return null;
  const name =
    (typeof o.name === 'string' && o.name.trim()) ||
    (typeof o.title === 'string' && o.title.trim()) ||
    (typeof o.label === 'string' && o.label.trim()) ||
    id;
  const description =
    typeof o.description === 'string'
      ? o.description
      : typeof o.summary === 'string'
        ? o.summary
        : undefined;
  return {
    id,
    name,
    description,
    startDate: typeof o.startDate === 'string' ? o.startDate : typeof o.start === 'string' ? o.start : undefined,
    endDate: typeof o.endDate === 'string' ? o.endDate : typeof o.end === 'string' ? o.end : undefined,
    raw: o,
  };
}

export async function getMyTerms(): Promise<UserTerm[]> {
  const res = await fetchWithAuthRetry(apiUrl('/terms/my'), {
    method: 'GET',
    headers: { Accept: 'application/json' },
  });
  if (!res.ok) {
    throw new ApiError(res.status, await parseErrorBody(res));
  }
  const json: unknown = await res.json();
  return normalizeJsonArray(json)
    .map(mapUserTerm)
    .filter((x): x is UserTerm => x !== null);
}

/** GET /courses/my?termId= — courses for current user in a term. */
export type UserCourse = {
  id: string;
  name: string;
  description?: string;
  order?: number;
  durationSec?: number;
  isPublished?: boolean;
  imageUrl?: string;
  createdAt?: string;
  /** Slug for navigation to module page when present */
  module?: string;
  moduleSlug?: string;
  moduleName?: string;
  moduleImageUrl?: string;
  moduleId?: string;
  termId?: string;
  termTitle?: string;
  progress?: number;
  raw?: Record<string, unknown>;
};

function mapUserCourse(raw: unknown): UserCourse | null {
  if (!raw || typeof raw !== 'object') return null;
  const o = raw as Record<string, unknown>;
  const id = typeof o.id === 'string' ? o.id : null;
  if (!id) return null;
  const name =
    (typeof o.name === 'string' && o.name.trim()) ||
    (typeof o.title === 'string' && o.title.trim()) ||
    id;
  const description =
    typeof o.description === 'string' ? o.description : typeof o.summary === 'string' ? o.summary : undefined;
  let progress: number | undefined;
  if (typeof o.progress === 'number') progress = o.progress;
  else if (typeof o.progressPercent === 'number') progress = o.progressPercent;

  // nested module object
  let moduleName: string | undefined;
  let moduleImageUrl: string | undefined;
  let moduleId: string | undefined;
  let moduleSlug: string | undefined;
  if (o.module && typeof o.module === 'object') {
    const m = o.module as Record<string, unknown>;
    if (typeof m.id === 'string') moduleId = m.id;
    if (typeof m.name === 'string' && m.name.trim()) moduleName = m.name.trim();
    if (typeof m.imageUrl === 'string' && m.imageUrl.trim()) moduleImageUrl = m.imageUrl.trim();
    if (typeof m.slug === 'string' && m.slug.trim()) moduleSlug = m.slug.trim();
  } else if (typeof o.module === 'string') {
    moduleSlug = o.module;
  }
  if (!moduleSlug && typeof o.moduleSlug === 'string') moduleSlug = o.moduleSlug;
  if (!moduleId && typeof o.moduleId === 'string') moduleId = o.moduleId;

  // nested term object
  let termId: string | undefined;
  let termTitle: string | undefined;
  if (o.term && typeof o.term === 'object') {
    const t = o.term as Record<string, unknown>;
    if (typeof t.id === 'string') termId = t.id;
    if (typeof t.title === 'string' && t.title.trim()) termTitle = t.title.trim();
    else if (typeof t.name === 'string' && t.name.trim()) termTitle = t.name.trim();
  }
  if (!termId && typeof o.termId === 'string') termId = o.termId;

  return {
    id,
    name,
    description,
    order: typeof o.order === 'number' ? o.order : undefined,
    durationSec: typeof o.durationSec === 'number' ? o.durationSec : undefined,
    isPublished: typeof o.isPublished === 'boolean' ? o.isPublished : undefined,
    imageUrl: typeof o.imageUrl === 'string' && o.imageUrl.trim() ? o.imageUrl.trim() : undefined,
    createdAt: typeof o.createdAt === 'string' ? o.createdAt : undefined,
    module: moduleSlug,
    moduleSlug,
    moduleName,
    moduleImageUrl,
    moduleId,
    termId,
    termTitle,
    progress,
    raw: o,
  };
}

export async function getMyCourses(
  termId: string,
  options?: { moduleId?: string }
): Promise<UserCourse[]> {
  const qs = new URLSearchParams();
  qs.set('termId', termId);
  const mid = options?.moduleId?.trim();
  if (mid) qs.set('moduleId', mid);
  const res = await fetchWithAuthRetry(apiUrl(`/courses/my?${qs.toString()}`), {
    method: 'GET',
    headers: { Accept: 'application/json' },
    cache: 'no-store',
  });
  if (!res.ok) {
    throw new ApiError(res.status, await parseErrorBody(res));
  }
  const json: unknown = await res.json();
  return normalizeJsonArray(json)
    .map(mapUserCourse)
    .filter((x): x is UserCourse => x !== null);
}

/**
 * GET /courses/my — all courses for the current user (no query).
 * In the browser Network tab this appears as same-origin `…/api/v1/courses/my`.
 * If the backend returns an error (e.g. requires `termId`), falls back to
 * {@link getMyTerms} + {@link getMyCourses} per term and merges by course id.
 */
export async function getAllMyCourses(): Promise<UserCourse[]> {
  const res = await fetchWithAuthRetry(apiUrl('/courses/my'), {
    method: 'GET',
    headers: { Accept: 'application/json' },
    cache: 'no-store',
  });
  if (res.ok) {
    const json: unknown = await res.json();
    return normalizeJsonArray(json)
      .map(mapUserCourse)
      .filter((x): x is UserCourse => x !== null);
  }
  if (res.status === 401) {
    throw new ApiError(401, await parseErrorBody(res));
  }
  const terms = await getMyTerms();
  const merged = new Map<string, UserCourse>();
  for (const t of terms) {
    try {
      const list = await getMyCourses(t.id);
      for (const c of list) merged.set(c.id, c);
    } catch {
      /* skip broken term */
    }
  }
  return Array.from(merged.values());
}

/** Resource attached to a course (GET /courses/{id}). */
export type CourseResource = {
  id: string;
  title: string;
  type: string;
  url: string;
  order?: number;
  courseId?: string;
  createdAt?: string;
  updatedAt?: string;
  raw?: Record<string, unknown>;
};

function mapCourseResource(raw: unknown): CourseResource | null {
  if (!raw || typeof raw !== 'object') return null;
  const o = raw as Record<string, unknown>;
  const id = typeof o.id === 'string' ? o.id : null;
  if (!id) return null;
  const title = (typeof o.title === 'string' && o.title.trim()) || id;
  const type = typeof o.type === 'string' && o.type.trim() ? o.type.trim() : 'OTHER';
  const url = typeof o.url === 'string' && o.url.trim() ? o.url.trim() : '';
  return {
    id,
    title,
    type,
    url,
    order: typeof o.order === 'number' ? o.order : undefined,
    courseId: typeof o.courseId === 'string' ? o.courseId : undefined,
    createdAt: typeof o.createdAt === 'string' ? o.createdAt : undefined,
    updatedAt: typeof o.updatedAt === 'string' ? o.updatedAt : undefined,
    raw: o as Record<string, unknown>,
  };
}

/** GET /courses/{id} — single course detail. */
export type CourseDetail = {
  id: string;
  name: string;
  description?: string;
  order?: number;
  durationSec?: number;
  isPublished?: boolean;
  imageUrl?: string;
  createdAt?: string;
  updatedAt?: string;
  createdBy?: string;
  updatedBy?: string;
  moduleId?: string;
  moduleName?: string;
  moduleImageUrl?: string;
  termId?: string;
  termTitle?: string;
  progress?: number;
  resources?: CourseResource[];
  raw?: Record<string, unknown>;
};

function mapCourseDetail(raw: unknown): CourseDetail | null {
  if (!raw || typeof raw !== 'object') return null;
  let o = raw as Record<string, unknown>;
  if ('data' in o && o.data && typeof o.data === 'object') {
    o = o.data as Record<string, unknown>;
  }
  const id = typeof o.id === 'string' ? o.id : null;
  if (!id) return null;
  const name =
    (typeof o.name === 'string' && o.name.trim()) ||
    (typeof o.title === 'string' && o.title.trim()) ||
    id;
  const description =
    typeof o.description === 'string'
      ? o.description
      : typeof o.summary === 'string'
        ? o.summary
        : undefined;
  let progress: number | undefined;
  if (typeof o.progress === 'number') progress = o.progress;
  else if (typeof o.progressPercent === 'number') progress = o.progressPercent;

  // nested module
  let moduleId: string | undefined;
  let moduleName: string | undefined;
  let moduleImageUrl: string | undefined;
  if (o.module && typeof o.module === 'object') {
    const m = o.module as Record<string, unknown>;
    if (typeof m.id === 'string') moduleId = m.id;
    if (typeof m.name === 'string' && m.name.trim()) moduleName = m.name.trim();
    if (typeof m.imageUrl === 'string' && m.imageUrl.trim()) moduleImageUrl = m.imageUrl.trim();
  }
  if (!moduleId && typeof o.moduleId === 'string') moduleId = o.moduleId;

  // nested term
  let termId: string | undefined;
  let termTitle: string | undefined;
  if (o.term && typeof o.term === 'object') {
    const t = o.term as Record<string, unknown>;
    if (typeof t.id === 'string') termId = t.id;
    if (typeof t.title === 'string' && t.title.trim()) termTitle = t.title.trim();
    else if (typeof t.name === 'string' && t.name.trim()) termTitle = t.name.trim();
  }
  if (!termId && typeof o.termId === 'string') termId = o.termId;

  let resources: CourseResource[] | undefined;
  if (Array.isArray(o.resources)) {
    const mapped = o.resources
      .map(mapCourseResource)
      .filter((x): x is CourseResource => x !== null)
      .sort((a, b) => (a.order ?? 0) - (b.order ?? 0));
    if (mapped.length > 0) resources = mapped;
  }

  return {
    id,
    name,
    description,
    order: typeof o.order === 'number' ? o.order : undefined,
    durationSec: typeof o.durationSec === 'number' ? o.durationSec : undefined,
    isPublished: typeof o.isPublished === 'boolean' ? o.isPublished : undefined,
    imageUrl: typeof o.imageUrl === 'string' && o.imageUrl.trim() ? o.imageUrl.trim() : undefined,
    createdAt: typeof o.createdAt === 'string' ? o.createdAt : undefined,
    updatedAt: typeof o.updatedAt === 'string' ? o.updatedAt : undefined,
    createdBy: typeof o.createdBy === 'string' ? o.createdBy : undefined,
    updatedBy: typeof o.updatedBy === 'string' ? o.updatedBy : undefined,
    moduleId,
    moduleName,
    moduleImageUrl,
    termId,
    termTitle,
    progress,
    resources,
    raw: o as Record<string, unknown>,
  };
}

export async function getCourse(courseId: string): Promise<CourseDetail> {
  const res = await fetchWithAuthRetry(apiUrl(`/courses/${encodeURIComponent(courseId)}`), {
    method: 'GET',
    headers: { Accept: 'application/json' },
  });
  if (!res.ok) {
    throw new ApiError(res.status, await parseErrorBody(res));
  }
  const json: unknown = await res.json();
  const mapped = mapCourseDetail(json);
  if (!mapped) {
    throw new ApiError(res.status, { message: 'Invalid course response' });
  }
  return mapped;
}

/** DELETE /courses/{id} */
export async function deleteCourse(courseId: string): Promise<void> {
  const res = await fetchWithAuthRetry(apiUrl(`/courses/${encodeURIComponent(courseId)}`), {
    method: 'DELETE',
    headers: { Accept: 'application/json' },
  });
  if (!res.ok) {
    throw new ApiError(res.status, await parseErrorBody(res));
  }
}

/** GET /modules/my — current user's modules. */
export type UserModule = {
  id: string;
  name: string;
  /** Path segment for `/dashboard/modules/[slug]` */
  slug: string;
  description?: string;
  /** Cover / hero image (GET /modules/my may expose `imageUrl` or `image`). */
  imageUrl?: string;
  iconUrl?: string;
  courseCount?: number;
  lessonCount?: number;
  raw?: Record<string, unknown>;
};

function slugifyModuleKey(name: string): string {
  const s = name
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .replace(/^-|-$/g, '');
  return s || '';
}

function mapUserModule(raw: unknown): UserModule | null {
  if (!raw || typeof raw !== 'object') return null;
  const o = raw as Record<string, unknown>;
  const id = typeof o.id === 'string' ? o.id : null;
  if (!id) return null;
  const name =
    (typeof o.name === 'string' && o.name.trim()) ||
    (typeof o.title === 'string' && o.title.trim()) ||
    id;
  let slug =
    typeof o.slug === 'string' && o.slug.trim()
      ? o.slug.trim()
      : typeof o.code === 'string' && o.code.trim()
        ? o.code
            .trim()
            .toLowerCase()
            .replace(/\s+/g, '-')
        : '';
  if (!slug) slug = slugifyModuleKey(name);
  if (!slug) slug = id;

  const description =
    typeof o.description === 'string'
      ? o.description
      : typeof o.summary === 'string'
        ? o.summary
        : undefined;

  let imageUrl: string | undefined;
  if (typeof o.imageUrl === 'string' && o.imageUrl.trim()) imageUrl = o.imageUrl.trim();
  else if (typeof o.coverImageUrl === 'string' && o.coverImageUrl.trim()) imageUrl = o.coverImageUrl.trim();
  else if (typeof o.image === 'string' && /^https?:\/\//i.test(o.image)) imageUrl = o.image.trim();

  let iconUrl: string | undefined;
  if (typeof o.iconUrl === 'string' && o.iconUrl.trim()) iconUrl = o.iconUrl.trim();
  else if (typeof o.icon === 'string' && /^https?:\/\//i.test(o.icon)) iconUrl = o.icon;

  let courseCount: number | undefined;
  if (typeof o.courseCount === 'number' && Number.isFinite(o.courseCount)) courseCount = o.courseCount;
  else if (typeof o.courses === 'number' && Number.isFinite(o.courses)) courseCount = o.courses;
  else if (typeof o.coursesCount === 'number' && Number.isFinite(o.coursesCount)) courseCount = o.coursesCount;

  let lessonCount: number | undefined;
  if (typeof o.lessonCount === 'number' && Number.isFinite(o.lessonCount)) lessonCount = o.lessonCount;
  else if (typeof o.lessons === 'number' && Number.isFinite(o.lessons)) lessonCount = o.lessons;
  else if (typeof o.lessonsCount === 'number' && Number.isFinite(o.lessonsCount)) lessonCount = o.lessonsCount;

  return {
    id,
    name,
    slug,
    description,
    imageUrl,
    iconUrl,
    courseCount,
    lessonCount,
    raw: o,
  };
}

export async function getMyModules(): Promise<UserModule[]> {
  const res = await fetchWithAuthRetry(apiUrl('/modules/my'), {
    method: 'GET',
    headers: { Accept: 'application/json' },
  });
  if (!res.ok) {
    throw new ApiError(res.status, await parseErrorBody(res));
  }
  const json: unknown = await res.json();
  return normalizeJsonArray(json)
    .map(mapUserModule)
    .filter((x): x is UserModule => x !== null);
}

/** GET /modules/{id} — single module detail. */
export type ModuleDetail = {
  id: string;
  name: string;
  description?: string;
  imageUrl?: string;
  iconUrl?: string;
  code?: string;
  raw?: Record<string, unknown>;
};

function mapModuleDetail(raw: unknown): ModuleDetail | null {
  if (!raw || typeof raw !== 'object') return null;
  let o = raw as Record<string, unknown>;
  if ('data' in o && o.data && typeof o.data === 'object') o = o.data as Record<string, unknown>;
  const id = typeof o.id === 'string' ? o.id : null;
  if (!id) return null;
  const name =
    (typeof o.name === 'string' && o.name.trim()) ||
    (typeof o.title === 'string' && o.title.trim()) ||
    id;
  const description = typeof o.description === 'string' ? o.description : undefined;
  const code = typeof o.code === 'string' ? o.code : undefined;
  let imageUrl: string | undefined;
  if (typeof o.imageUrl === 'string' && o.imageUrl.trim()) imageUrl = o.imageUrl.trim();
  else if (typeof o.image === 'string' && /^https?:\/\//i.test(o.image)) imageUrl = o.image;
  let iconUrl: string | undefined;
  if (typeof o.iconUrl === 'string' && o.iconUrl.trim()) iconUrl = o.iconUrl.trim();
  else if (typeof o.icon === 'string' && /^https?:\/\//i.test(o.icon)) iconUrl = o.icon;
  return { id, name, description, imageUrl, iconUrl, code, raw: o };
}

export async function getModule(moduleId: string): Promise<ModuleDetail> {
  const res = await fetchWithAuthRetry(apiUrl(`/modules/${encodeURIComponent(moduleId)}`), {
    method: 'GET',
    headers: { Accept: 'application/json' },
  });
  if (!res.ok) {
    throw new ApiError(res.status, await parseErrorBody(res));
  }
  const json: unknown = await res.json();
  const mapped = mapModuleDetail(json);
  if (!mapped) throw new ApiError(200, { message: 'Invalid module response' });
  return mapped;
}

/** Course summary inside a term (from GET /modules/{id}/terms). */
export type TermCourse = {
  id: string;
  title: string;
  description?: string;
  order?: number;
  durationSec?: number;
  isPublished?: boolean;
  imageUrl?: string;
};

/** GET /modules/{moduleId}/terms — optional ?specialityId= for the user's speciality context. */
export type ModuleTerm = {
  id: string;
  name: string;
  description?: string;
  order?: number;
  termNumber?: number;
  startDate?: string;
  endDate?: string;
  isPublished?: boolean;
  imageUrl?: string;
  coverVideoUrl?: string;
  courses?: TermCourse[];
  progress?: number;
  raw?: Record<string, unknown>;
};

function mapTermCourse(raw: unknown): TermCourse | null {
  if (!raw || typeof raw !== 'object') return null;
  const o = raw as Record<string, unknown>;
  const id = typeof o.id === 'string' ? o.id : null;
  if (!id) return null;
  return {
    id,
    title: (typeof o.title === 'string' && o.title.trim()) || id,
    description: typeof o.description === 'string' ? o.description : undefined,
    order: typeof o.order === 'number' ? o.order : undefined,
    durationSec: typeof o.durationSec === 'number' ? o.durationSec : undefined,
    isPublished: typeof o.isPublished === 'boolean' ? o.isPublished : undefined,
    imageUrl: typeof o.imageUrl === 'string' && o.imageUrl.trim() ? o.imageUrl.trim() : undefined,
  };
}

function mapModuleTerm(raw: unknown): ModuleTerm | null {
  if (!raw || typeof raw !== 'object') return null;
  const o = raw as Record<string, unknown>;
  const id = typeof o.id === 'string' ? o.id : null;
  if (!id) return null;
  const name =
    (typeof o.title === 'string' && o.title.trim()) ||
    (typeof o.name === 'string' && o.name.trim()) ||
    id;
  const courses = Array.isArray(o.courses)
    ? (o.courses as unknown[]).map(mapTermCourse).filter((x): x is TermCourse => x !== null)
    : undefined;
  return {
    id,
    name,
    description: typeof o.description === 'string' ? o.description : undefined,
    order: typeof o.order === 'number' ? o.order : undefined,
    termNumber: typeof o.termNumber === 'number' ? o.termNumber : undefined,
    startDate: typeof o.startDate === 'string' ? o.startDate : undefined,
    endDate: typeof o.endDate === 'string' ? o.endDate : undefined,
    isPublished: typeof o.isPublished === 'boolean' ? o.isPublished : undefined,
    imageUrl: typeof o.imageUrl === 'string' && o.imageUrl.trim() ? o.imageUrl.trim() : undefined,
    coverVideoUrl: typeof o.coverVideoUrl === 'string' && o.coverVideoUrl.trim() ? o.coverVideoUrl.trim() : undefined,
    courses,
    progress: typeof o.progress === 'number' ? o.progress : undefined,
    raw: o,
  };
}

export async function getModuleTerms(
  moduleId: string,
  specialityId?: string | null
): Promise<ModuleTerm[]> {
  let path = `/modules/${encodeURIComponent(moduleId)}/terms`;
  const trimmed = typeof specialityId === 'string' ? specialityId.trim() : '';
  if (trimmed) {
    path += `?${new URLSearchParams({ specialityId: trimmed }).toString()}`;
  }
  const res = await fetchWithAuthRetry(apiUrl(path), {
    method: 'GET',
    headers: { Accept: 'application/json' },
  });
  if (!res.ok) {
    throw new ApiError(res.status, await parseErrorBody(res));
  }
  const json: unknown = await res.json();
  return normalizeJsonArray(json)
    .map(mapModuleTerm)
    .filter((x): x is ModuleTerm => x !== null);
}
