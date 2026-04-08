/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_API_BASE_URL: string
  readonly VITE_GOOGLE_CLIENT_ID: string
  readonly VITE_ADSENSE_BANNER_ENABLED: string
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}

interface Window {
  amplitude?: {
    track: (eventName: string, eventProperties?: Record<string, unknown>) => void
    setUserId: (userId: string) => void
    reset: () => void
  }
}
