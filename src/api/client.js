import axios from "axios";

export const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

const ACCESS_TOKEN_KEY = "accessToken";
const REFRESH_TOKEN_KEY = "refreshToken";

export const getAccessToken = () => {
  return localStorage.getItem(ACCESS_TOKEN_KEY);
};

export const getRefreshToken = () => {
  return localStorage.getItem(REFRESH_TOKEN_KEY);
};

export const saveTokens = (accessToken, refreshToken) => {
  localStorage.setItem(ACCESS_TOKEN_KEY, accessToken);
  localStorage.setItem(REFRESH_TOKEN_KEY, refreshToken);
};

export const clearTokens = () => {
  localStorage.removeItem(ACCESS_TOKEN_KEY);
  localStorage.removeItem(REFRESH_TOKEN_KEY);
};

export const toImageUrl = (path) => {
  if (!path) return "";
  if (path.startsWith("http")) return path;

  const baseUrl = API_BASE_URL.replace(/\/+$/, "");
  const imagePath = path.replace(/^\/+/, "");

  return `${baseUrl}/${imagePath}`;
};

const client = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
});

// 토큰 갱신 요청 중복 방지
let refreshPromise = null;

client.interceptors.request.use((config) => {
  const token = getAccessToken();

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});

client.interceptors.response.use(
  (response) => response.data.data,

  async (error) => {
    const originalRequest = error.config;

    if (
      error.response?.status === 401 &&
      originalRequest &&
      !originalRequest._retry &&
      !originalRequest.url?.includes("/api/auth/")
    ) {
      const refreshToken = getRefreshToken();

      if (refreshToken) {
        originalRequest._retry = true;

        try {
          if (!refreshPromise) {
            refreshPromise = axios
              .post(`${API_BASE_URL}/api/auth/refresh`, {
                refreshToken,
              })
              .then((response) => {
                const { accessToken, refreshToken: newRefreshToken } =
                  response.data.data;

                saveTokens(accessToken, newRefreshToken);
                return accessToken;
              })
              .finally(() => {
                refreshPromise = null;
              });
          }

          const newAccessToken = await refreshPromise;

          originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;

          return client(originalRequest);
        } catch {
          clearTokens();
          window.dispatchEvent(new Event("auth:logout"));
        }
      }
    }

    return Promise.reject({
      status: error.response?.status ?? 0,
      message: error.response?.data?.message ?? "네트워크 연결을 확인해 주세요",
    });
  },
);

export default client;
