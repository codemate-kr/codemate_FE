import { useState } from 'react';
import { AlertTriangle, X } from 'lucide-react';

interface DeleteAccountModalProps {
  onClose: () => void;
  onConfirm: () => Promise<void>;
  isDeleting: boolean;
}

export default function DeleteAccountModal({
  onClose,
  onConfirm,
  isDeleting
}: DeleteAccountModalProps) {
  const [confirmText, setConfirmText] = useState('');
  const CONFIRM_PHRASE = '회원탈퇴';
  const isConfirmValid = confirmText === CONFIRM_PHRASE;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isConfirmValid && !isDeleting) {
      await onConfirm();
    }
  };

  return (
    <div
      className="fixed inset-0 bg-black bg-opacity-50 overflow-y-auto h-full w-full z-50 flex items-center justify-center p-4 animate-in fade-in duration-200"
      onClick={onClose}
    >
      <div
        className="relative mx-auto w-full max-w-md animate-in zoom-in-95 duration-200"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-2xl border border-gray-100 dark:border-gray-700">
          {/* 헤더 */}
          <div className="px-6 py-5 border-b border-gray-100 dark:border-gray-700">
            <div className="flex items-start justify-between">
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 rounded-full bg-red-100 dark:bg-red-900/30 flex items-center justify-center flex-shrink-0">
                  <AlertTriangle className="h-5 w-5 text-red-600 dark:text-red-300" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                    회원탈퇴
                  </h3>
                  <p className="text-sm text-gray-600 dark:text-gray-300 mt-0.5">
                    정말 탈퇴하시겠습니까?
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={onClose}
                disabled={isDeleting}
                className="text-gray-400 dark:text-gray-500 hover:text-gray-600 dark:hover:text-gray-300 transition-colors disabled:opacity-50"
              >
                <X className="h-5 w-5" />
              </button>
            </div>
          </div>

          {/* 본문 */}
          <form onSubmit={handleSubmit} className="p-6 space-y-5">
            {/* 경고 메시지 */}
            <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800/40 rounded-lg p-4 space-y-3">
              <p className="text-sm font-semibold text-red-900 dark:text-red-200">
                탈퇴 시 다음 정보가 영구 삭제됩니다:
              </p>
              <ul className="text-sm text-red-800 dark:text-red-300 space-y-1.5 list-disc list-inside">
                <li>계정 및 프로필 정보</li>
                <li>가입한 팀 및 팀 활동 기록</li>
                <li>문제 풀이 기록 및 통계</li>
                <li>모든 개인 설정</li>
              </ul>
              <p className="text-sm text-red-900 dark:text-red-200 font-medium pt-2 border-t border-red-200 dark:border-red-800/40">
                ⚠️ 삭제된 데이터는 복구할 수 없습니다
              </p>
            </div>

            {/* 확인 입력 */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-2">
                탈퇴를 진행하시려면 '<span className="font-semibold text-red-600">{CONFIRM_PHRASE}</span>'를 입력해주세요
              </label>
              <input
                type="text"
                value={confirmText}
                onChange={(e) => setConfirmText(e.target.value)}
                placeholder={CONFIRM_PHRASE}
                className="block w-full px-4 py-2.5 border border-gray-300 dark:border-gray-600 dark:bg-gray-900 dark:text-white rounded-lg shadow-sm focus:ring-2 focus:ring-red-500 focus:border-red-500 transition-colors"
                disabled={isDeleting}
                autoFocus
              />
              <p className="mt-2 text-xs text-gray-500 dark:text-gray-400">
                정확히 '{CONFIRM_PHRASE}'를 입력해주세요 (따옴표 제외)
              </p>
            </div>

            {/* 추가 안내 */}
            <div className="bg-gray-50 dark:bg-gray-700/50 border border-gray-200 dark:border-gray-600 rounded-lg p-3">
              <p className="text-xs text-gray-700 dark:text-gray-300">
                <strong>안내:</strong> 탈퇴 후 동일한 이메일로 재가입이 가능하지만,
                이전 데이터는 복구되지 않습니다.
              </p>
            </div>

            {/* 버튼 */}
            <div className="flex justify-end gap-3 pt-2">
              <button
                type="button"
                onClick={onClose}
                disabled={isDeleting}
                className="px-5 py-2.5 text-sm font-medium text-gray-700 dark:text-gray-200 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 dark:focus:ring-offset-gray-900 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                취소
              </button>
              <button
                type="submit"
                disabled={!isConfirmValid || isDeleting}
                className="px-5 py-2.5 text-sm font-medium text-white bg-red-600 border border-transparent rounded-lg hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 dark:focus:ring-offset-gray-900 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                {isDeleting ? (
                  <span className="flex items-center gap-2">
                    <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                    </svg>
                    탈퇴 처리 중...
                  </span>
                ) : '회원탈퇴'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
