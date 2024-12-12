import { Configuration, RedirectRequest } from '@azure/msal-browser';

const redirectUri = `${window.location.origin}/auth/sign-in`;
console.log('Microsoft Auth Redirect URI:', redirectUri);

// MSAL configuration for Microsoft authentication
export const msalConfig: Configuration = {
  auth: {
    clientId: import.meta.env.VITE_AZURE_CLIENT_ID ?? '',
    authority: 'https://login.microsoftonline.com/common', // Use 'common' for multi-tenant + personal accounts
    redirectUri,
    postLogoutRedirectUri: window.location.origin,
    navigateToLoginRequestUrl: true
  },
  cache: {
    cacheLocation: 'sessionStorage',
    storeAuthStateInCookie: false,
  },
  system: {
    allowNativeBroker: false,
    loggerOptions: {
      logLevel: 3, // Error
      piiLoggingEnabled: false
    }
  }
};

// Add here scopes for id token to be used at MS Identity Platform endpoints.
export const loginRequest: RedirectRequest = {
  scopes: ['User.Read', 'profile', 'email', 'openid'],
  prompt: 'select_account' // Always show account picker
};

// Add here the endpoints for MS Graph API services you would like to use.
export const graphConfig = {
  graphMeEndpoint: 'https://graph.microsoft.com/v1.0/me',
};
