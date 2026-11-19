import axios from "axios";

// 공통 API 클라이언트 (모든 도메인 API 파일이 이걸 가져다 씀)
// - 요청: 저장된 Access 토큰이 있으면 Authorization 헤더에 자동으로 붙임
// - 응답: 서버 공통 형식 { status, message, data } 에서 data만 꺼내서 돌려줌
// - 에러: { status, message } 형태로 통일 (status 0 = 네트워크 오류·응답 없음)

export const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

// TODO(로그인): 토큰 저장 위치·키 이름은 로그인 담당과 맞추기 (지금은 localStorage "accessToken" 가정)
// TODO(로그인): 토큰 재발급(401 → /api/auth/refresh)은 로그인 연동 시 응답 인터셉터에 추가
export const getAccessToken = () => {
  try {
    return localStorage.getItem("accessToken");
  } catch {
    return null;
  }
};

// 서버가 주는 이미지 경로(/images/...)를 전체 주소로 바꿈
export const toImageUrl = (path) => {
  if (!path) return "";
  if (path.startsWith("http")) return path;
  return `${API_BASE_URL}${path}`;
};

const client = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
});

client.interceptors.request.use((config) => {
  const token = getAccessToken();
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

client.interceptors.response.use(
  (response) => response.data.data,
  (error) =>
    Promise.reject({
      status: error.response?.status ?? 0,
      message:
        error.response?.data?.message ?? "네트워크 연결을 확인해 주세요",
    }),
);

export default client;
