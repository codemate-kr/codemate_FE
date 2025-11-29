import confetti from 'canvas-confetti';
import { memberApi } from '../api/member';
import { toast } from '../components/common/toast';
import { useAuthStore } from '../store/authStore';

/**
 * 문제 해결 인증 시 팡파레 효과
 */
export function triggerSuccessConfetti() {
  confetti({
    particleCount: 500,
    spread: 240,
    origin: { x: 0.25 },
  });
  confetti({
    particleCount: 500,
    spread: 240,
    origin: { x: 0.75 },
  });
  confetti({
    particleCount: 500,
    spread: 240,
    origin: { x: 0.5 },
  });
}

export type VerifyErrorType = 'rate-limit' | 'not-found' | 'not-solved' | 'already-verified' | 'unknown';

interface VerifyProblemOptions {
  /** 인증 성공 시 호출 */
  onSuccess?: () => void;
  /** 이미 인증된 문제일 때 호출 */
  onAlreadyVerified?: () => void;
  /** 에러 발생 시 호출 (토스트 표시 전) */
  onError?: (errorType: VerifyErrorType) => void;
  /** 커스텀 토스트 함수 사용 (제공하면 기본 toast 대신 사용) */
  customToast?: (message: string, type?: 'success' | 'error' | 'warning' | 'info') => void;
}

/**
 * 문제 해결 인증 처리
 * @returns true if verification succeeded, false otherwise
 */
export async function verifyProblemSolved(
  problemId: number,
  options?: VerifyProblemOptions
): Promise<boolean> {
  const showToast = options?.customToast || toast;

  try {
    await memberApi.verifyProblemSolved(problemId);

    // 팡파레 효과
    triggerSuccessConfetti();

    // 유저의 총 해결 문제 수 증가
    const { user, updateUser } = useAuthStore.getState();
    if (user) {
      updateUser({ solvedCount: (user.solvedCount ?? 0) + 1 });
    }

    showToast('문제 해결을 축하합니다!');
    options?.onSuccess?.();
    return true;
  } catch (error: any) {
    const status = error?.response?.status;
    let errorType: VerifyErrorType = 'unknown';

    if (status === 429) {
      errorType = 'rate-limit';
      options?.onError?.(errorType);
      showToast(
        error.userMessage || 'solved.ac API 호출 제한에 도달했습니다. 잠시 후 다시 시도해주세요.',
        'warning'
      );
    } else if (status === 404) {
      errorType = 'not-found';
      options?.onError?.(errorType);
      showToast('문제를 찾을 수 없습니다.', 'error');
    } else if (status === 400) {
      errorType = 'not-solved';
      options?.onError?.(errorType);
      showToast('아직 해결되지 않은 문제입니다.', 'error');
    } else if (status === 409) {
      errorType = 'already-verified';
      options?.onError?.(errorType);
      showToast('이미 인증된 문제입니다.', 'warning');
      options?.onAlreadyVerified?.();
    } else {
      options?.onError?.(errorType);
      showToast('문제 인증에 실패했습니다.', 'error');
    }
    return false;
  }
}
