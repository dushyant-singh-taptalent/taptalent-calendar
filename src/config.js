export const clientId = import.meta.env.VITE_CLIENT_ID || 'eb47d2332e4548645f5ed85e1a0bc3e1';
export const aurinkoBaseUrl = 'https://api.aurinko.io/v1/book';

export const HOST_NAME =
  import.meta.env.VITE_APP_ENV === "prod" 
    ? "6lq71yx10e.execute-api.ap-south-1.amazonaws.com" 
    : import.meta.env.VITE_APP_ENV === "staging" 
    ? "m032oaaydf.execute-api.ap-south-1.amazonaws.com" 
    : "localhost";

export const backendBaseUrl =
  import.meta.env.VITE_APP_ENV === "prod" 
    ? `https://${HOST_NAME}/prod/` 
    : import.meta.env.VITE_APP_ENV === "staging" 
    ? `https://${HOST_NAME}/staging/` 
    : `http://${HOST_NAME}:5500`; 