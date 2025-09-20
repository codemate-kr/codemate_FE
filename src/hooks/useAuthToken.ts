import { useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useAuthStore } from '../store/authStore';
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

          // 임시 사용자 정보로 로그인 (실제 프로필은 Layout에서 로딩)
          const mockUser = {
            id: 'temp-id',
            email: 'temp@example.com',
            name: '백준 미인증',
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
          };

          // 스토어에 사용자 정보와 토큰 저장
          login(mockUser, accessToken);

          toast.success('로그인 성공!');
          navigate('/dashboard', { replace: true });
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