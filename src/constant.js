const API_KEY = import.meta.env.VITE_RUDRA_AI_API;

export const URL = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${API_KEY}`;
