// import { config } from 'dotenv';
// config();

export const serverURL = process.env.SERVER_URL || 'http://localhost:5000/api/v1/';
export const tokenSecret = process.env.TOKEN_SECRET || 'backend';