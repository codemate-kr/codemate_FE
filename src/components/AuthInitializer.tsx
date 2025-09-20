import { useEffect } from 'react';
import { useAuthStore } from '../store/authStore';
import { setAuthToken } from '../api/client';

export default function AuthInitializer() {
  const { token } = useAuthStore();

  useEffect(() => {
    // 앱 시작 시 저장된 토큰이 있으면 API 클라이언트에 설정
    if (token) {
      setAuthToken(token);
    }
  }, [token]);

  return null;
}