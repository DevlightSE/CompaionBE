import { Configuration, RedirectRequest } from '@azure/msal-browser';

// Ensure redirect URI matches exactly with Azure App Registration
const redirectUri = 'http://localhost:5173/auth/sign-in';
console.log('Microsoft Auth Redirect URI:', redirectUri);

// MSAL configuration for Microsoft authentication
export const msalConfig: Configuration = {
  auth: {
    clientId: import.meta.env.VITE_AZURE_CLIENT_ID,
    authority: 'https://login.microsoftonline.com/common',
    redirectUri,
    postLogoutRedirectUri: 'http://localhost:5173',
    navigateToLoginRequestUrl: true,
  },
  cache: {
    cacheLocation: 'sessionStorage',
    storeAuthStateInCookie: false,
  },
  system: {
    allowNativeBroker: false,
    loggerOptions: {
      logLevel: 3,
      piiLoggingEnabled: false
    }
  }
};

// Add here scopes for id token to be used at MS Identity Platform endpoints.
export const loginRequest: RedirectRequest = {
  scopes: ['openid', 'profile', 'email', 'User.Read', 'offline_access'],
  prompt: 'select_account',
};

// Add here the endpoints for MS Graph API services you would like to use.
export const graphConfig = {
  graphMeEndpoint: 'https://graph.microsoft.com/v1.0/me',
};
