// Environment configuration utility

export const env = {
  // API Configuration
  API_BASE_URL: import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080/api',

  // Google OAuth Configuration
  GOOGLE_CLIENT_ID: import.meta.env.VITE_GOOGLE_CLIENT_ID || '',

  // Environment Configuration
  NODE_ENV: import.meta.env.VITE_NODE_ENV || 'development',

  // App Configuration
  APP_TITLE: import.meta.env.VITE_APP_TITLE || 'StudyHalp',
  APP_DESCRIPTION: import.meta.env.VITE_APP_DESCRIPTION || 'Algorithm Study Helper Platform',

  // Debugging
  DEBUG_MODE: import.meta.env.VITE_DEBUG_MODE === 'true',

  // Computed values
  get IS_DEVELOPMENT() {
    return this.NODE_ENV === 'development';
  },

  get IS_PRODUCTION() {
    return this.NODE_ENV === 'production';
  }
};

// Validation function to ensure required environment variables are set
export function validateEnv() {
  const requiredVars = [
    'VITE_API_BASE_URL',
  ];

  const missingVars = requiredVars.filter(varName => !import.meta.env[varName]);

  if (missingVars.length > 0) {
    console.error('Missing required environment variables:', missingVars);
    throw new Error(`Missing required environment variables: ${missingVars.join(', ')}`);
  }
}

// Log environment info in development
if (env.IS_DEVELOPMENT && env.DEBUG_MODE) {
  console.log('Environment Configuration:', {
    NODE_ENV: env.NODE_ENV,
    API_BASE_URL: env.API_BASE_URL,
    APP_TITLE: env.APP_TITLE,
    DEBUG_MODE: env.DEBUG_MODE,
  });
}