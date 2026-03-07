/* eslint-disable react-refresh/only-export-components */
import { createContext, useContext, useState, useCallback, type ReactNode } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { toast } from 'react-hot-toast';
import { useAuthStore } from '../store/authStore';
import { env } from '../config/env';

// 로그인 후 대시보드로 이동해야 하는 공개 페이지들
const PUBLIC_PAGES = ['/', '/login', '/privacy-policy', '/terms-of-service'];

interface LoginModalContextType {
  isOpen: boolean;
  isLoading: boolean;
  openLoginModal: () => void;
  closeLoginModal: () => void;
  handleGoogleLogin: () => void;
}

const LoginModalContext = createContext<LoginModalContextType | null>(null);

export function useLoginModal() {
  const context = useContext(LoginModalContext);
  if (!context) {
    throw new Error('useLoginModal must be used within LoginModalProvider');
  }
  return context;
}

interface LoginModalProviderProps {
  children: ReactNode;
}

export function LoginModalProvider({ children }: LoginModalProviderProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const { login } = useAuthStore();

  const isInAppBrowser = useCallback(() => {
    const userAgent = window.navigator.userAgent;

    return [
      /KAKAOTALK/i,
      /Instagram/i,
      /FBAN|FBAV/i,
      /Line/i,
      /NAVER/i,
      /Everytime/i,
      /; wv\)/i,
      /Version\/[\d.]+.*Mobile.*Safari(?!.*CriOS)/i,
    ].some((pattern) => pattern.test(userAgent));
  }, []);

  const copyCurrentUrl = useCallback(async () => {
    if (!window.navigator.clipboard) {
      return false;
    }

    try {
      await window.navigator.clipboard.writeText(window.location.href);
      return true;
    } catch {
      return false;
    }
  }, []);

  const openCurrentUrlInExternalBrowser = useCallback(() => {
    if (!/Android/i.test(window.navigator.userAgent)) {
      return false;
    }

    const currentUrl = window.location.href;
    const scheme = window.location.protocol.replace(':', '');
    const targetUrl = currentUrl.replace(/^https?:\/\//, '');

    window.location.href = `intent://${targetUrl}#Intent;scheme=${scheme};package=com.android.chrome;end`;
    return true;
  }, []);

  const openLoginModal = useCallback(() => {
    setIsOpen(true);
  }, []);

  const closeLoginModal = useCallback(() => {
    if (!isLoading) {
      setIsOpen(false);
    }
  }, [isLoading]);

  const handleGoogleLogin = useCallback(async () => {
    if (isInAppBrowser()) {
      const shouldOpenExternally = window.confirm(
        '앱 내 브라우저에서는 구글 로그인이 제한될 수 있습니다.\n외부 브라우저에서 이 페이지를 여시겠어요?'
      );

      if (!shouldOpenExternally) {
        return;
      }

      const opened = openCurrentUrlInExternalBrowser();

      if (opened) {
        toast('외부 브라우저가 열리지 않으면 앱 메뉴에서 브라우저로 열어주세요.', {
          duration: 4000,
        });
        return;
      }

      const copied = await copyCurrentUrl();
      toast(
        copied
          ? '현재 주소를 복사했습니다. Safari 또는 Chrome에서 붙여넣어 로그인해주세요.'
          : 'iPhone에서는 자동으로 외부 브라우저를 열 수 없습니다. Safari 또는 Chrome에서 현재 페이지를 직접 열어주세요.',
        {
          duration: 5000,
        }
      );
      return;
    }

    setIsLoading(true);

    // 팝업 창 크기 설정
    const width = 500;
    const height = 600;
    const left = window.screen.width / 2 - width / 2;
    const top = window.screen.height / 2 - height / 2;

    // 팝업 창 열기
    const popup = window.open(
      `${env.OAUTH_BASE_URL}/oauth2/authorization/google`,
      'Google Login',
      `width=${width},height=${height},left=${left},top=${top},toolbar=no,menubar=no,scrollbars=yes,resizable=yes`
    );

    if (!popup) {
      toast.error('팝업 차단을 해제해주세요.');
      setIsLoading(false);
      return;
    }

    // 팝업이 닫혔는지 주기적으로 확인
    let checkPopupClosed: NodeJS.Timeout | null = null;

    // 팝업에서 메시지 수신 대기
    const handleMessage = (event: MessageEvent) => {
      // 보안: origin 확인
      if (event.origin !== window.location.origin) {
        return;
      }

      if (event.data.type === 'oauth-success') {
        try {
          if (popup && !popup.closed) {
            popup.close();
          }
        } catch {
          // COOP 에러 무시
        }

        window.removeEventListener('message', handleMessage);
        if (checkPopupClosed) clearInterval(checkPopupClosed);

        // 받은 데이터로 직접 로그인 처리
        const { user, token } = event.data;
        login(user, token);

        setIsLoading(false);
        setIsOpen(false);
        toast.success('로그인 성공!');

        // handle 없으면 verify-handle로 이동
        if (!user?.handle) {
          navigate('/verify-handle', { replace: true });
        } else if (PUBLIC_PAGES.includes(location.pathname)) {
          // 공개 페이지에서 로그인했으면 대시보드로 이동
          navigate('/dashboard', { replace: true });
        } else {
          // 보호된 페이지에서 로그인한 경우 현재 페이지 새로고침
          window.location.reload();
        }
      } else if (event.data.type === 'oauth-error') {
        try {
          if (popup && !popup.closed) {
            popup.close();
          }
        } catch {
          // COOP 에러 무시
        }
        window.removeEventListener('message', handleMessage);
        if (checkPopupClosed) clearInterval(checkPopupClosed);
        toast.error('로그인에 실패했습니다.');
        setIsLoading(false);
      }
    };

    window.addEventListener('message', handleMessage);

    // 팝업이 닫혔는지 주기적으로 확인
    checkPopupClosed = setInterval(() => {
      if (popup.closed) {
        if (checkPopupClosed) clearInterval(checkPopupClosed);
        window.removeEventListener('message', handleMessage);
        setIsLoading(false);
      }
    }, 500);
  }, [copyCurrentUrl, isInAppBrowser, login, navigate, location.pathname, openCurrentUrlInExternalBrowser]);

  return (
    <LoginModalContext.Provider
      value={{
        isOpen,
        isLoading,
        openLoginModal,
        closeLoginModal,
        handleGoogleLogin,
      }}
    >
      {children}
    </LoginModalContext.Provider>
  );
}
