import { useLocation } from 'react-router-dom';

/**
 * 현재 페이지 경로를 포함한 로그인 리다이렉트 URL을 반환하는 훅
 * 로그인 후 원래 페이지로 돌아올 수 있도록 redirect 파라미터를 포함
 */
export function useLoginRedirect(): string {
  const location = useLocation();
  return `/login?redirect=${encodeURIComponent(location.pathname + location.search)}`;
}
