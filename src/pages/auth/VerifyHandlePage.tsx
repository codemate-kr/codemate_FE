import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useMutation } from '@tanstack/react-query';
import { toast } from 'react-hot-toast';
import { memberApi } from '../../api/member';
import { useAuthStore } from '../../store/authStore';

export default function VerifyHandlePage() {
  const [handle, setHandle] = useState('');
  const [showConfirm, setShowConfirm] = useState(false);
  const navigate = useNavigate();
  const { updateUser } = useAuthStore();

  const verifyMutation = useMutation({
    mutationFn: (handle: string) => memberApi.verifySolvedAc(handle),
    onSuccess: (data) => {
      updateUser({ handle: data.handle });
      toast.success('백준 아이디가 등록되었습니다');
      navigate('/dashboard');
    },
    onError: (error: any) => {
      setShowConfirm(false);
      if (error.response?.status === 404) {
        toast.error('존재하지 않는 백준 아이디입니다');
      } else {
        toast.error('아이디 등록에 실패했습니다');
      }
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!handle.trim()) {
      toast.error('백준 아이디를 입력해주세요');
      return;
    }
    // 확인 모달 표시
    setShowConfirm(true);
  };

  const handleConfirm = () => {
    verifyMutation.mutate(handle.trim());
  };

  const handleCancel = () => {
    setShowConfirm(false);
  };

  return (
    <div className="min-h-screen w-full flex items-start justify-center bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 px-4 pt-16 pb-12">
      <div className="w-full max-w-md">
        {/* 로고 및 헤더 */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center mb-4">
            <img src="/logo.svg" alt="CodeMate" className="w-16 h-16 transform hover:scale-105 transition-transform drop-shadow-lg" />
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2 tracking-tight">
            환영합니다!
          </h1>
          <p className="text-base text-gray-600">
            CodeMate 시작을 위해 <span className="font-semibold text-gray-700">백준 아이디</span>를 등록해주세요
          </p>
        </div>

        {/* 폼 카드 */}
        <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-2xl p-6 border border-white/20">
          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label htmlFor="handle" className="block text-sm font-bold text-gray-700 mb-2 flex items-center">
                <span className="bg-blue-100 text-blue-700 rounded-lg px-2 py-1 text-xs font-semibold mr-2">
                  필수
                </span>
                백준 아이디
              </label>
              <div className="relative">
                <input
                  type="text"
                  id="handle"
                  value={handle}
                  onChange={(e) => setHandle(e.target.value)}
                  placeholder="baekjoon123"
                  className="w-full px-4 py-3 bg-gray-50 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-blue-500 focus:bg-white transition-all text-base font-medium"
                  disabled={verifyMutation.isPending}
                  autoFocus
                />
              </div>
              <div className="mt-2 flex items-start space-x-2">
                <svg className="w-4 h-4 text-gray-400 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <p className="text-xs text-gray-500 leading-relaxed">
                  <a href="https://solved.ac" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:text-blue-700 font-medium underline">solved.ac</a>에 등록된 백준 아이디를 입력해주세요
                </p>
              </div>
            </div>

            <button
              type="submit"
              disabled={verifyMutation.isPending}
              className="w-full bg-gradient-to-r from-[#1f6bff] to-[#2f88ff] text-white py-3 px-6 rounded-xl font-bold text-base hover:from-[#1a5ee6] hover:to-[#2a7ae6] disabled:from-gray-400 disabled:to-gray-400 disabled:cursor-not-allowed transition-all shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 active:translate-y-0"
            >
              {verifyMutation.isPending ? (
                <span className="flex items-center justify-center">
                  <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  등록 중...
                </span>
              ) : (
                '시작하기'
              )}
            </button>
          </form>
        </div>

        {/* 푸터 링크 */}
        <div className="mt-6 text-center space-y-2">
          <p className="text-xs text-gray-600">
            백준 계정이 없으신가요?
          </p>
          <div className="flex items-center justify-center space-x-3 text-xs">
            <a
              href="https://www.acmicpc.net"
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 hover:text-blue-700 font-semibold hover:underline"
            >
              백준 가입하기
            </a>
            <span className="text-gray-300">|</span>
            <a
              href="https://solved.ac"
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 hover:text-blue-700 font-semibold hover:underline"
            >
              solved.ac 연동하기
            </a>
          </div>
        </div>
      </div>

      {/* 확인 모달 */}
      {showConfirm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50 animate-in fade-in duration-200">
          <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-6 animate-in zoom-in-95 duration-200">
            <div className="text-center mb-6">
              <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-blue-100 mb-4">
                <svg className="h-6 w-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h3 className="text-lg font-bold text-gray-900 mb-2">
                백준 아이디 확인
              </h3>
              <p className="text-sm text-gray-600 mb-4">
                입력하신 아이디가 맞는지 확인해주세요.
              </p>
              <div className="bg-blue-50 border-2 border-blue-200 rounded-xl p-4">
                <p className="text-xs text-gray-600 mb-1">백준 아이디</p>
                <p className="text-xl font-bold text-blue-600">{handle}</p>
              </div>
            </div>

            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3 mb-6">
              <div className="flex items-start gap-2">
                <svg className="h-5 w-5 text-yellow-600 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                </svg>
                <div>
                  <p className="text-xs font-semibold text-yellow-800 mb-1">중요 안내</p>
                  <p className="text-xs text-yellow-700 leading-relaxed">
                    백준 아이디는 한 번만 등록할 수 있습니다. 변경이 필요한 경우 관리자에게 문의해주세요.
                  </p>
                </div>
              </div>
            </div>

            <div className="flex gap-3">
              <button
                type="button"
                onClick={handleCancel}
                disabled={verifyMutation.isPending}
                className="flex-1 px-4 py-3 text-sm font-semibold text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-xl transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                취소
              </button>
              <button
                type="button"
                onClick={handleConfirm}
                disabled={verifyMutation.isPending}
                className="flex-1 px-4 py-3 text-sm font-semibold text-white bg-gradient-to-r from-[#1f6bff] to-[#2f88ff] hover:from-[#1a5ee6] hover:to-[#2a7ae6] rounded-xl transition-all disabled:from-gray-400 disabled:to-gray-400 disabled:cursor-not-allowed"
              >
                {verifyMutation.isPending ? (
                  <span className="flex items-center justify-center">
                    <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    등록 중...
                  </span>
                ) : (
                  '등록하기'
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
