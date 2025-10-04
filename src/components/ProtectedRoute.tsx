import type { ReactNode } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuthStore } from '../store/authStore';

interface ProtectedRouteProps {
  children: ReactNode;
}

export default function ProtectedRoute({ children }: ProtectedRouteProps) {
  const { isAuthenticated, user } = useAuthStore();
  const location = useLocation();

  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // 백준 핸들이 없으면 핸들 등록 페이지로 리다이렉트
  if (!user?.handle && location.pathname !== '/verify-handle') {
    return <Navigate to="/verify-handle" replace />;
  }

  return <>{children}</>;
}