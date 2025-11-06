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
        // 팝업 창인지 확인
        const isPopup = window.opener && !window.opener.closed;

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

          // 팝업인 경우 부모 창에 메시지 전달
          if (isPopup) {
            window.opener.postMessage(
              { type: 'oauth-success', user, token: accessToken },
              window.location.origin
            );
            // 메시지 전송 후 약간의 지연을 두고 창 닫기
            setTimeout(() => {
              window.close();
            }, 100);
            return;
          }

          // 일반 창인 경우 기존 로직 (팝업이 아닌 직접 리다이렉션)
          toast.success('로그인 성공!');

          // handle 없으면 verify-handle로, 있으면 dashboard로 이동
          if (!profile.handle) {
            navigate('/verify-handle', { replace: true });
          } else {
            navigate('/dashboard', { replace: true });
          }
        } catch (error) {
          console.error('Token validation error:', error);

          // 팝업인 경우 부모 창에 에러 메시지 전달
          if (isPopup) {
            window.opener.postMessage(
              { type: 'oauth-error', error: String(error) },
              window.location.origin
            );
            window.close();
            return;
          }

          toast.error('로그인 처리 중 오류가 발생했습니다.');
          navigate('/login', { replace: true });
        }
      }
    };

    handleAuthToken();
  }, [location.search, login, navigate]);
};