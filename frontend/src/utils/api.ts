// src/utils/api.ts
import axios from "axios";

const API_BASE = process.env.NEXT_PUBLIC_API_BASE || "http://localhost:8000/api/";

const api = axios.create({
  baseURL: API_BASE,
  withCredentials: true, // send cookies if httpOnly
});

export const setAuthToken = (token: string) => {
  api.defaults.headers.common["Authorization"] = `Bearer ${token}`;
};

export default api;
