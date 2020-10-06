export { default as CustomValidator } from './custom-validator';
export { default as colors } from './colors';

// APIs
export { default as userAPI } from './user-api';
export { default as todoAPI } from './todo-api';

// String Manipulations
export { default as capitalize } from './capitalize';

// Environment Variables
export const GOOGLE_OAUTH_CLIENT_ID: string | any =
  process.env.NEXT_PUBLIC_GOOGLE_OAUTH_CLIENT_ID;
export const GOOGLE_OAUTH_CLIENT_SECRET: string | any =
  process.env.NEXT_PUBLIC_GOOGLE_OAUTH_CLIENT_SECRET;
