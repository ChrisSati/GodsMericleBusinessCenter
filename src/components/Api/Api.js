import axios from "axios";
import jwt_decode from "jwt-decode";

const API_URL = "http://127.0.0.1:8000/api";
const REFRESH_URL = `${API_URL}/token/refresh/`;

const api = axios.create({
  baseURL: API_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

// ------------------
// Token helpers
// ------------------
export const getAccessToken = () => localStorage.getItem("access");
export const getRefreshToken = () => localStorage.getItem("refresh");

export const setTokens = (access, refresh) => {
  localStorage.setItem("access", access);
  localStorage.setItem("refresh", refresh);
  setAuthToken(access);
};

// Set auth token for future requests
export const setAuthToken = (token) => {
  if (token) {
    api.defaults.headers.common["Authorization"] = `Bearer ${token}`;
  } else {
    delete api.defaults.headers.common["Authorization"];
  }
};

// ------------------
// Login
// ------------------
export const loginUser = async (username, password) => {
  try {
    const response = await api.post("/token/", { username, password });
    setTokens(response.data.access, response.data.refresh);
    return response.data;
  } catch (error) {
    throw error.response ? error.response.data : error;
  }
};

// ------------------
// Axios interceptor to refresh token automatically
// ------------------
api.interceptors.request.use(async (config) => {
  let accessToken = getAccessToken();
  const refreshToken = getRefreshToken();

  if (accessToken && refreshToken) {
    const decoded = jwt_decode(accessToken);
    const now = Date.now() / 1000;
    const timeLeft = decoded.exp - now;

    // Refresh 4 minutes (240s) before expiry
    if (timeLeft < 240) {
      try {
        const response = await axios.post(REFRESH_URL, { refresh: refreshToken });
        accessToken = response.data.access;
        setTokens(accessToken, refreshToken); // update localStorage & Axios header
      } catch (err) {
        console.error("Failed to refresh token:", err);
        setTokens(null, null);
        window.location.href = "/login"; // redirect to login if refresh fails
      }
    }
    config.headers["Authorization"] = `Bearer ${accessToken}`;
  }
  return config;
}, (error) => Promise.reject(error));

export default api;







// import axios from "axios";

// const API_URL = "http://127.0.0.1:8000/api";

// const api = axios.create({
//   baseURL: API_URL,
//   headers: {
//     "Content-Type": "application/json",
//   },
// });

// // Login function
// export const loginUser = async (username, password) => {
//   try {
//     const response = await api.post("/token/", { username, password });
//     return response.data; // access & refresh tokens
//   } catch (error) {
//     throw error.response ? error.response.data : error;
//   }
// };

// // Set auth token for future requests
// export const setAuthToken = (token) => {
//   if (token) {
//     api.defaults.headers.common["Authorization"] = `Bearer ${token}`;
//   } else {
//     delete api.defaults.headers.common["Authorization"];
//   }
// };

// export default api;
