import { Mail, Calendar, User, Check, X, UserX } from 'lucide-react';
import type { MyProfileResponse } from '../../../api/member';

interface ProfileInfoProps {
  profile: MyProfileResponse;
  onEmailChange: () => void;
  onDeleteAccount: () => void;
}

export default function ProfileInfo({ profile, onEmailChange, onDeleteAccount }: ProfileInfoProps) {
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('ko-KR', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  return (
    <div className="p-4 sm:p-6">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* 이메일 */}
        <div className="space-y-3">
          <label className="flex items-center text-sm font-semibold text-gray-700">
            <Mail className="h-4 w-4 mr-2 text-gray-500" />
            이메일
          </label>
          <div className="bg-gray-50 border border-gray-200 rounded-lg p-3 sm:p-4 hover:border-gray-300 transition-colors cursor-pointer group" onClick={onEmailChange}>
            <div className="flex items-center justify-between gap-3">
              <p className="text-sm text-gray-900 truncate">{profile.email}</p>
              <span className="text-sm text-blue-600 group-hover:text-blue-700 font-medium flex-shrink-0">
                변경
              </span>
            </div>
          </div>
        </div>

        {/* 백준 아이디 */}
        <div className="space-y-3">
          <label className="flex items-center text-sm font-semibold text-gray-700">
            <User className="h-4 w-4 mr-2 text-gray-500" />
            백준 아이디
          </label>
          <div className="bg-gray-50 border border-gray-200 rounded-lg p-3 sm:p-4">
            <div className="flex items-center justify-between gap-3">
              <p className="text-sm text-gray-900 truncate">
                {profile.handle || '미등록'}
              </p>
              {profile.verified ? (
                <span className="flex items-center gap-1 text-xs text-green-600 font-medium flex-shrink-0">
                  <Check className="h-4 w-4" />
                  인증됨
                </span>
              ) : (
                <span className="flex items-center gap-1 text-xs text-gray-500 flex-shrink-0">
                  <X className="h-4 w-4" />
                  미인증
                </span>
              )}
            </div>
          </div>
        </div>

        {/* 가입일 */}
        <div className="space-y-3 lg:col-span-2">
          <label className="flex items-center text-sm font-semibold text-gray-700">
            <Calendar className="h-4 w-4 mr-2 text-gray-500" />
            가입일
          </label>
          <div className="bg-gray-50 border border-gray-200 rounded-lg p-3 sm:p-4">
            <p className="text-sm text-gray-900">{formatDate(profile.joinedAt)}</p>
          </div>
        </div>
      </div>

      {/* 도움말 */}
      <div className="mt-6 bg-blue-50 border border-blue-100 rounded-lg p-4">
        <p className="text-sm text-blue-800">
          <strong>💡 참고:</strong> 백준 아이디는 가입 시 한 번만 등록할 수 있습니다.
          변경이 필요한 경우 관리자에게 문의해주세요.
        </p>
      </div>

      {/* 회원탈퇴 */}
      <div className="mt-6 sm:mt-8 pt-6 border-t border-gray-100">
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <div className="flex items-start gap-3">
            <UserX className="h-5 w-5 text-red-600 mt-0.5 flex-shrink-0" />
            <div className="flex-1 min-w-0">
              <h4 className="text-sm font-semibold text-gray-900 mb-1">회원탈퇴</h4>
              <p className="text-xs text-gray-700 mb-3">
                계정을 삭제하면 모든 데이터가 영구적으로 삭제되며 복구할 수 없습니다.
              </p>
              <button
                onClick={onDeleteAccount}
                className="px-4 py-2 text-sm font-medium text-red-700 bg-white border border-red-300 rounded-lg hover:bg-red-50 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 transition-colors"
              >
                회원탈퇴
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
