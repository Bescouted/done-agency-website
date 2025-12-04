const isProduction = import.meta.env.PROD;

export const API_URL = isProduction
    ? 'https://done-agency-website.onrender.com'
    : ''; // In dev, we use the Vite proxy (relative path)
