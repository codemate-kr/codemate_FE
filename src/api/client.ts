import axios from 'axios';
import { useAuthStore } from '../store/authStore';
import { env } from '../config/env';

const API_BASE_URL = env.API_BASE_URL;

export const apiClient = axios.create({
  baseURL: API_BASE_URL,
  withCredentials: true, // 쿠키 포함
  headers: {
    'Content-Type': 'application/json',
  },
});

// 토큰 설정 함수
export const setAuthToken = (token: string) => {
  apiClient.defaults.headers.Authorization = `Bearer ${token}`;
};

// 토큰 제거 함수
export const removeAuthToken = () => {
  delete apiClient.defaults.headers.Authorization;
};

apiClient.interceptors.request.use((config) => {
  const token = useAuthStore.getState().token;
  if (token && !config.headers.Authorization) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// 리프레시 토큰 요청 중복 방지를 위한 변수
let isRefreshing = false;
let isRedirecting = false;
let failedQueue: Array<{
  resolve: (token: string) => void;
  reject: (error: any) => void;
}> = [];

const processQueue = (error: any, token: string | null = null) => {
  failedQueue.forEach(({ resolve, reject }) => {
    if (error) {
      reject(error);
    } else {
      resolve(token!);
    }
  });

  failedQueue = [];
};

apiClient.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    // 리프레시 요청 자체는 인터셉터에서 제외
    if (originalRequest?.url?.includes('/auth/refresh')) {
      return Promise.reject(error);
    }

    if (error.response?.status === 401 && !originalRequest._retry) {
      if (isRefreshing) {
        // 이미 리프레시 중이면 큐에 추가
        return new Promise((resolve, reject) => {
          failedQueue.push({
            resolve: (token: string) => {
              originalRequest.headers.Authorization = `Bearer ${token}`;
              resolve(apiClient(originalRequest));
            },
            reject: (err: any) => {
              reject(err);
            }
          });
        });
      }

      originalRequest._retry = true;
      isRefreshing = true;

      try {
        // 리프레시 토큰으로 새 액세스 토큰 획득
        // NOTE: 인터셉터 우회를 위해 axios를 직접 사용 (authApi.refreshToken 사용 불가)
        const response = await axios.post(`${API_BASE_URL}/auth/refresh`, {}, {
          withCredentials: true,
          headers: {
            'Content-Type': 'application/json',
          }
        });

        // API 응답 구조: { data: { access_token: string, expires_in: number } }
        const accessToken = response.data.data.access_token;

        if (!accessToken) {
          throw new Error('No access token in refresh response');
        }

        // 기존 사용자 정보 유지하면서 토큰만 업데이트
        const currentUser = useAuthStore.getState().user;
        if (currentUser) {
          useAuthStore.getState().login(currentUser, accessToken);
        } else {
          throw new Error('No current user found');
        }
        setAuthToken(accessToken);

        processQueue(null, accessToken);

        // 원래 요청 재시도
        originalRequest.headers.Authorization = `Bearer ${accessToken}`;
        return apiClient(originalRequest);
      } catch (refreshError: any) {

        processQueue(refreshError, null);

        // 리프레시 실패 시 로그아웃 (중복 방지)
        if (!isRedirecting) {
          isRedirecting = true;

          try {
            // 서버에 로그아웃 요청 (쿠키 정리 등)
            try {
              // 서버 로그아웃 요청
              // NOTE: 인터셉터 우회를 위해 axios 직접 사용 (authApi.logout 사용 불가)
              await axios.post(`${API_BASE_URL}/auth/logout`, {}, { withCredentials: true });
            } catch (logoutApiError) {
              // 서버 로그아웃 실패해도 클라이언트 정리는 계속 진행
            }

            // 클라이언트 상태 정리
            useAuthStore.getState().logout();
            removeAuthToken();

            // 즉시 페이지 이동
            if (window.location.pathname !== '/login') {
              window.location.replace('/login');
            }

          } catch (logoutError) {
            // 에러가 발생해도 클라이언트 정리와 페이지 이동은 시도
            useAuthStore.getState().logout();
            removeAuthToken();
            if (window.location.pathname !== '/login') {
              window.location.replace('/login');
            }
          }
        }

        return Promise.reject(refreshError);
      } finally {
        isRefreshing = false;
      }
    }

    return Promise.reject(error);
  }
);

export interface ApiResponse<T> {
  data: T;
  message: string;
  status: string;
}