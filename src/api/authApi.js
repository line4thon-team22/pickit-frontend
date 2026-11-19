import client from "./client";

// 이메일 로그인
export const login = (email, password) => {
  return client.post("/api/auth/login", {
    email,
    password,
  });
};

// 토큰 갱신
export const refreshToken = (refreshToken) => {
  return client.post("/api/auth/refresh", {
    refreshToken,
  });
};

// 로그아웃
export const logout = (refreshToken) => {
  return client.post("/api/auth/logout", {
    refreshToken,
  });
};

// 로그인한 사용자 정보 조회
export const getMyInfo = () => {
  return client.get("/api/users/me");
};
