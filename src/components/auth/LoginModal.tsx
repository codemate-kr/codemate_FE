import { X } from 'lucide-react';
import { useLoginModal } from '../../contexts/LoginModalContext';

// Google 로고 SVG
function GoogleLogo({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none">
      <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
      <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
      <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
      <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
    </svg>
  );
}

export default function LoginModal() {
  const { isOpen, isLoading, closeLoginModal, handleGoogleLogin } = useLoginModal();

  if (!isOpen) return null;

  const handleBackdropClick = () => {
    if (!isLoading) {
      closeLoginModal();
    }
  };

  return (
    <div
      className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 z-50 animate-in fade-in duration-200"
      onClick={handleBackdropClick}
    >
      <div
        className="bg-white rounded-2xl shadow-2xl max-w-sm w-full overflow-hidden animate-in zoom-in-95 duration-200"
        onClick={(e) => e.stopPropagation()}
      >
        {/* 상단 헤더 */}
        <div className="px-6 pt-8 pb-6 relative">
          {/* 닫기 버튼 */}
          <button
            onClick={closeLoginModal}
            disabled={isLoading}
            className="absolute top-3 right-3 p-1.5 rounded-full text-gray-400 hover:text-gray-600 hover:bg-gray-100 transition-colors disabled:opacity-50"
            aria-label="닫기"
          >
            <X className="h-5 w-5" />
          </button>

          {/* 로고 */}
          <div className="flex justify-center mb-4">
            <img src="/logo.svg" alt="CodeMate" className="h-16 w-16" />
          </div>

          <h2 className="text-2xl font-bold text-gray-900 text-center">
            CodeMate
          </h2>
          <p className="text-gray-500 text-center mt-1 text-sm">
            알고리즘 스터디의 새로운 시작
          </p>
        </div>

        {/* 컨텐츠 영역 */}
        <div className="px-6 py-6">
          {/* Google 로그인 버튼 */}
          <button
            onClick={handleGoogleLogin}
            disabled={isLoading}
            className="w-full flex justify-center items-center gap-3 py-3.5 px-4 bg-white border-2 border-gray-200 rounded-xl font-medium text-gray-700 hover:bg-gray-50 hover:border-gray-300 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-sm hover:shadow"
          >
            {isLoading ? (
              <>
                <div className="h-5 w-5 border-2 border-gray-300 border-t-blue-600 rounded-full animate-spin" />
                <span>로그인 중...</span>
              </>
            ) : (
              <>
                <GoogleLogo className="h-5 w-5" />
                <span>Google로 계속하기</span>
              </>
            )}
          </button>

          {/* 안내 문구 */}
          <div className="mt-5 space-y-3">
            <div className="flex items-start gap-2 text-xs text-gray-500">
              <div className="w-1 h-1 rounded-full bg-gray-400 mt-1.5 flex-shrink-0" />
              <p>로그인 후 백준(BOJ) 계정 연동이 필요해요</p>
            </div>
            <div className="flex items-start gap-2 text-xs text-gray-500">
              <div className="w-1 h-1 rounded-full bg-gray-400 mt-1.5 flex-shrink-0" />
              <p>팀원들과 함께 알고리즘 문제를 풀어보세요</p>
            </div>
          </div>

          {/* 하단 링크 */}
          <div className="mt-6 pt-4 border-t border-gray-100">
            <p className="text-xs text-center text-gray-400">
              계속 진행하면{' '}
              <a href="/terms-of-service" className="text-blue-600 hover:underline">
                이용약관
              </a>
              {' '}및{' '}
              <a href="/privacy-policy" className="text-blue-600 hover:underline">
                개인정보처리방침
              </a>
              에 동의하게 됩니다
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
