const production = process.env.NODE_ENV === 'production';

const APP_URL_PRODUCTION = 'http://46.101.211.180:3000';
const APP_URL_DEVELOPMENT = 'http://localhost:3000';

export const APP_URL = production ? APP_URL_PRODUCTION : APP_URL_DEVELOPMENT;
