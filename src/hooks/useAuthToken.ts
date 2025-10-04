import { useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useAuthStore } from '../store/authStore';
import { memberApi } from '../api/member';
import { setAuthToken } from '../api/client';
import { toast } from 'react-hot-toast';

export const useAuthToken = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { login } = useAuthStore();

  useEffect(() => {
    const handleAuthToken = async () => {
      const urlParams = new URLSearchParams(location.search);
      const accessToken = urlParams.get('access_token');

      if (accessToken) {
        try {
          // URL에서 토큰 파라미터 제거
          const newUrl = window.location.pathname;
          window.history.replaceState({}, '', newUrl);

          // 토큰 설정 후 프로필 조회
          setAuthToken(accessToken);
          const profile = await memberApi.getMe();

          // 실제 프로필로 로그인
          const user = {
            id: profile.id.toString(),
            email: profile.email,
            handle: profile.handle,
            name: profile.handle || profile.email,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
          };

          login(user, accessToken);

          toast.success('로그인 성공!');

          // handle 있으면 dashboard, 없으면 verify-handle로 이동
          if (profile.handle) {
            navigate('/dashboard', { replace: true });
          } else {
            navigate('/verify-handle', { replace: true });
          }
        } catch (error) {
          console.error('Token validation error:', error);
          toast.error('로그인 처리 중 오류가 발생했습니다.');
          navigate('/login', { replace: true });
        }
      }
    };

    handleAuthToken();
  }, [location.search, login, navigate]);
};