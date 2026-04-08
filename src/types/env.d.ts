/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_API_BASE_URL: string
  
  readonly VITE_OAUTH_BASE_URL: string
  readonly VITE_GOOGLE_CLIENT_ID: string
  readonly VITE_NODE_ENV: string
  readonly VITE_APP_TITLE: string
  readonly VITE_APP_DESCRIPTION: string
  readonly VITE_DEBUG_MODE: string
  readonly VITE_ADSENSE_BANNER_ENABLED: string
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}