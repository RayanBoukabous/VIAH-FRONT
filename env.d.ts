declare namespace NodeJS {
  interface ProcessEnv {
    /** Real API host for Next.js rewrites (no /api/v1 suffix). Default: https://viah.aidaki.ai */
    API_UPSTREAM?: string;
    /** App origin for server-side fetch to /api/v1 (e.g. http://localhost:3003). Browser uses relative /api/v1. */
    NEXT_PUBLIC_APP_URL?: string;
    NEXT_PUBLIC_SIGNUP_LEVEL_ID?: string;
    NEXT_PUBLIC_SIGNUP_SPECIALITY_ID?: string;
  }
}
