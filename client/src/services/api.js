// ⚠️  STUB — REPLACE WITH M1's api.js
// This file is intentionally written to match exactly what M1's spec requires.
// Safe to DELETE and OVERWRITE this entire file when M1 submits their work.
// All of Member 2's pages import this as: import api from '../services/api'

import axios from "axios";

const api = axios.create({
  baseURL: "/api/v1",
});

// Request interceptor: attach Bearer token from localStorage on every request
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Response interceptor: on 401 → clear storage + redirect to /login
// Also normalises error messages so catch(err) => err.message always works
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error?.response?.status === 401) {
      //localStorage.removeItem("token");
      //localStorage.removeItem("user");
      //window.location.href = "/login";
    }
    const msg =
      error?.response?.data?.message ||
      error.message ||
      "Something went wrong";
    return Promise.reject(new Error(msg));
  }
);

export default api;
