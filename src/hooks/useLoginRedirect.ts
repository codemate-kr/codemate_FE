import { useCallback } from 'react';
import { useLoginModal } from '../contexts/LoginModalContext';

/**
 * 로그인 모달을 여는 함수를 반환하는 훅
 * 비로그인 상태에서 로그인이 필요한 액션 시 사용
 */
export function useLoginRedirect(): () => void {
  const { openLoginModal } = useLoginModal();
  return useCallback(() => {
    openLoginModal();
  }, [openLoginModal]);
}
