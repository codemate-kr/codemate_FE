import { useEffect, useState } from 'react';
import { useAuthStore } from '../store/authStore';
import { setAuthToken } from '../api/client';
import { memberApi } from '../api/member';

interface AuthInitializerProps {
  children: React.ReactNode;
}

export default function AuthInitializer({ children }: AuthInitializerProps) {
  const { token, isAuthenticated, updateUser } = useAuthStore();
  const [isInitialized, setIsInitialized] = useState(false);

  useEffect(() => {
    const initialize = async () => {
      // 앱 시작 시 저장된 토큰이 있으면 API 클라이언트에 설정
      if (token) {
        setAuthToken(token);

        // 인증된 상태면 프로필 로드
        if (isAuthenticated) {
          try {
            const profile = await memberApi.getMe();
            updateUser({
              id: profile.id.toString(),
              email: profile.email,
              handle: profile.handle,
              name: profile.handle || profile.email,
            });
          } catch (error) {
            console.error('프로필 로드 실패:', error);
          }
        }
      }
      setIsInitialized(true);
    };

    initialize();
  }, [token, isAuthenticated, updateUser]);

  // 초기화 완료될 때까지 로딩 표시
  if (!isInitialized) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-gray-500">Loading...</div>
      </div>
    );
  }

  return <>{children}</>;
}