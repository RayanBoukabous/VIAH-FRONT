/**
 * API client. Auth uses HTTP-only cookies (session + refresh).
 *
 * In the browser, requests go to same-origin `/api/v1` (see next.config rewrites → API_UPSTREAM).
 * That way cookies set after login are stored for your app host (e.g. localhost), not only for the API domain.
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
 * POST /auth/refresh once; concurrent 401s share the same call.
 * Returns true if rotation succeeded (200).
 */
async function tryRefreshSession(): Promise<boolean> {
  if (refreshInFlight) return refreshInFlight;
  refreshInFlight = (async () => {
    const res = await fetch(apiUrl('/auth/refresh'), {
      method: 'POST',
      credentials: 'include',
      headers: { Accept: 'application/json' },
    });
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
  provider: string;
  lastLogin: string;
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
};

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
  const specialityLabel =
    pickRelationName(user.speciality) ??
    pickRelationName(user.specialty) ??
    pickRelationName(s?.speciality) ??
    pickRelationName(s?.specialty);

  const levelLabel =
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
    specialityId: string;
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
}

export async function getMe(): Promise<AuthUser> {
  const res = await fetchWithAuthRetry(apiUrl('/auth/me'), {
    method: 'GET',
    headers: { Accept: 'application/json' },
  });
  if (!res.ok) {
    throw new ApiError(res.status, await parseErrorBody(res));
  }
  return res.json() as Promise<AuthUser>;
}

/** Manual refresh only — not wrapped in fetchWithAuthRetry (avoids recursion). */
export async function refreshSession(): Promise<void> {
  const res = await fetch(apiUrl('/auth/refresh'), {
    method: 'POST',
    credentials: 'include',
    headers: { Accept: 'application/json' },
  });
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
  return mapLevel(raw);
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
