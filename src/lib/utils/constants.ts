// path: src/utils/constants.ts
//region Domains for the current environment

const PRODUCTION_DOMAIN = "https://erp-exam.vercel.app/";

// Local development domain for testing purposes
const DEVELOPMENT_DOMAIN = "http://localhost:3000";

// Domain for the current environment
export const DOMAIN = process.env.NODE_ENV === 'production'
    ? PRODUCTION_DOMAIN
    : DEVELOPMENT_DOMAIN;
//endregion


//region API Domains for the current environment
// api base url
const API_VERSION = "v1";
// api url
export const API_BASE_URL = `/api/${API_VERSION}`;
export const API_DOMAIN = `${DOMAIN}${API_BASE_URL}`;
//endregion

