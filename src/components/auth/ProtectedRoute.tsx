import { useEffect, type ReactNode } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuthStore } from '../../store/authStore';
import { useLoginModal } from '../../contexts/LoginModalContext';

interface ProtectedRouteProps {
  children: ReactNode;
}

export default function ProtectedRoute({ children }: ProtectedRouteProps) {
  const { isAuthenticated, user } = useAuthStore();
  const location = useLocation();
  const { openLoginModal } = useLoginModal();

  useEffect(() => {
    if (!isAuthenticated) {
      openLoginModal();
    }
  }, [isAuthenticated, openLoginModal]);

  // 비로그인 상태면 현재 페이지에서 모달만 표시 (children은 렌더링하지 않음)
  if (!isAuthenticated) {
    return null;
  }

  // 백준 핸들이 없으면 핸들 등록 페이지로 리다이렉트
  if (!user?.handle && location.pathname !== '/verify-handle') {
    return <Navigate to="/verify-handle" replace />;
  }

  return <>{children}</>;
}