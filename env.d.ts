declare namespace NodeJS {
  interface ProcessEnv {
    /** Real API host for the proxy (no /api/v1 suffix). Default: https://viah.aidaki.ai */
    API_UPSTREAM?: string;
    /** Public backend origin (same as API_UPSTREAM). Fallback for proxy if API_UPSTREAM is unset. */
    NEXT_PUBLIC_API_URL?: string;
    /** App origin for server-side fetch to /api/v1 (e.g. http://localhost:3003). Browser uses relative /api/v1. */
    NEXT_PUBLIC_APP_URL?: string;
    NEXT_PUBLIC_SIGNUP_LEVEL_ID?: string;
    NEXT_PUBLIC_SIGNUP_SPECIALITY_ID?: string;
  }
}
