import dotenv from "dotenv";

dotenv.config();

export const PORT = process.env.PORT || 4040;
export const JWT_SECRET = process.env.JWT_SECRET as string;
export const COOKIES_NAME = process.env.COOKIES_NAME as string;

export const CLIENT_ID = process.env.CLIENT_ID as string;
export const CLIENT_SECRET = process.env.CLIENT_SECRET as string;
export const REDIRECT_URI = process.env.REDIRECT_URI as string;
export const REFRESH_TOKEN = process.env.REFRESH_TOKEN as string;
export const USER_EMAIL = process.env.USER_EMAIL as string;

export const DATABASE_URL = process.env.DATABASE_URL as string;

export const Cloud_Name = process.env.Cloud_Name as string;
export const API_Key = process.env.API_Key as string;
export const API_secret = process.env.API_secret as string;
export const CLOUDINARY_URL = process.env.CLOUDINARY_URL as string;
