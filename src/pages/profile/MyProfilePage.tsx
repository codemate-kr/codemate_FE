import { useState, useEffect } from 'react';
import { Mail, Calendar, User, Check, X, UserX } from 'lucide-react';
import { memberApi, type MyProfileResponse } from '../../api/member';
import useDocumentTitle from '../../hooks/useDocumentTitle';
import { Toast } from '../../components/common/Toast';
import DeleteAccountModal from './components/DeleteAccountModal';
import { useAuthStore } from '../../store/authStore';
import { useNavigate } from 'react-router-dom';

export default function MyProfilePage() {
  useDocumentTitle('마이페이지');

  const navigate = useNavigate();
  const logout = useAuthStore((state) => state.logout);

  const [profile, setProfile] = useState<MyProfileResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState('');
  const [toastType, setToastType] = useState<'success' | 'error'>('success');
  const [showEmailModal, setShowEmailModal] = useState(false);
  const [newEmail, setNewEmail] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    loadProfile();
  }, []);

  const loadProfile = async () => {
    try {
      setLoading(true);
      const data = await memberApi.getMe();
      setProfile(data);
    } catch (error) {
      console.error('프로필 로딩 실패:', error);
      showToastMessage('프로필을 불러오는데 실패했습니다', 'error');
    } finally {
      setLoading(false);
    }
  };

  const showToastMessage = (message: string, type: 'success' | 'error' = 'success') => {
    setToastMessage(message);
    setToastType(type);
    setShowToast(true);
    setTimeout(() => {
      setShowToast(false);
    }, 3000);
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('ko-KR', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const handleEmailChange = () => {
    setShowEmailModal(true);
  };

  const handleEmailModalClose = () => {
    if (!isSubmitting) {
      setShowEmailModal(false);
      setNewEmail('');
    }
  };



  const handleEmailSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!newEmail.trim()) {
      showToastMessage('이메일을 입력해주세요', 'error');
      return;
    }

    // 이메일 형식 검증
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(newEmail)) {
      showToastMessage('올바른 이메일 형식이 아닙니다', 'error');
      return;
    }

    // 현재 이메일과 동일한지 확인
    if (newEmail === profile?.email) {
      showToastMessage('현재 이메일과 동일합니다', 'error');
      return;
    }

    try {
      setIsSubmitting(true);
      await memberApi.sendEmailVerification(newEmail);

      showToastMessage('인증 이메일이 발송되었습니다. 이메일을 확인해주세요.', 'success');
      handleEmailModalClose();
    } catch (error: any) {
      console.error('이메일 변경 요청 실패:', error);
      if (error.response?.status === 409) {
        showToastMessage('이미 사용 중인 이메일입니다', 'error');
      } else if (error.response?.status === 429) {
        showToastMessage('너무 많은 요청을 보냈습니다. 잠시 후 다시 시도해주세요', 'error');
      } else {
        showToastMessage('이메일 변경 요청에 실패했습니다', 'error');
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDeleteAccount = async () => {
    try {
      setIsDeleting(true);

      // TODO: 백엔드 API 구현 후 주석 해제
      // await memberApi.deleteAccount();

      // 임시: API 호출 시뮬레이션 (1초 대기)
      await new Promise(resolve => setTimeout(resolve, 1000));

      showToastMessage('회원탈퇴가 완료되었습니다', 'success');

      // 1초 후 로그아웃 및 로그인 페이지로 이동
      setTimeout(() => {
        logout();
        navigate('/login');
      }, 1000);

    } catch (error: any) {
      console.error('회원탈퇴 실패:', error);
      showToastMessage('회원탈퇴에 실패했습니다. 다시 시도해주세요.', 'error');
      setIsDeleting(false);
      setShowDeleteModal(false);
    }
  };

  if (loading) {
    return (
      <div className="px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto">
          <div className="animate-pulse space-y-6">
            <div className="h-10 bg-gray-200 rounded w-48"></div>
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
              <div className="h-32 bg-gray-200"></div>
              <div className="p-6 space-y-4">
                {[1, 2, 3, 4].map((n) => (
                  <div key={n} className="h-20 bg-gray-100 rounded-lg"></div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto text-center py-12">
          <p className="text-gray-500">프로필을 불러올 수 없습니다.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="px-4 sm:px-6 lg:px-8">
      {showToast && <Toast message={toastMessage} type={toastType} />}

      <div className="max-w-4xl mx-auto">
        {/* 헤더 */}
        <div className="mb-6">
          <h1 className="text-xl sm:text-2xl font-semibold text-gray-900">마이페이지</h1>
          <p className="mt-2 text-sm text-gray-700">
            내 계정 정보를 확인하고 관리할 수 있습니다
          </p>
        </div>

        {/* 프로필 카드 */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
          {/* 프로필 헤더 */}
          <div className="bg-gradient-to-r from-blue-50 to-blue-50/50 px-4 sm:px-6 py-4 sm:py-6 border-b border-blue-100">
            <div className="flex items-center gap-3 sm:gap-4">
              <div className="h-14 w-14 sm:h-16 sm:w-16 rounded-full bg-blue-600 flex items-center justify-center flex-shrink-0">
                <User className="h-7 w-7 sm:h-8 sm:w-8 text-white" />
              </div>
              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-2 flex-wrap">
                  <h2 className="text-lg sm:text-xl font-bold text-gray-900 truncate">
                    {profile.handle || '미인증'}
                  </h2>
                  {profile.verified && (
                    <span className="flex items-center gap-1 bg-green-100 text-green-700 rounded-full px-2 py-0.5 text-xs font-medium flex-shrink-0">
                      <Check className="h-3 w-3" />
                      인증됨
                    </span>
                  )}
                </div>
                <div className="flex items-center gap-2 mt-1 flex-wrap">
                  <span className="text-xs sm:text-sm text-gray-600 truncate">{profile.email}</span>
                </div>
              </div>
            </div>
          </div>

          {/* 프로필 정보 */}
          <div className="p-4 sm:p-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* 이메일 */}
              <div className="space-y-3">
                <label className="flex items-center text-sm font-semibold text-gray-700">
                  <Mail className="h-4 w-4 mr-2 text-gray-500" />
                  이메일
                </label>
                <div className="bg-gray-50 border border-gray-200 rounded-lg p-3 sm:p-4 hover:border-gray-300 transition-colors cursor-pointer group" onClick={handleEmailChange}>
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

            {/* 알림 설정 */}
            {/* <div className="mt-6 sm:mt-8 pt-6 border-t border-gray-100">
              <h3 className="text-base font-semibold text-gray-900 mb-4">알림 설정</h3>
              <div className="bg-gray-50 border border-gray-200 rounded-lg p-3 sm:p-4">
                <div className="flex items-center justify-between gap-3">
                  <div className="flex items-start gap-3 min-w-0 flex-1">
                    <Bell className="h-5 w-5 text-gray-500 mt-0.5 flex-shrink-0" />
                    <div className="min-w-0">
                      <p className="text-sm font-medium text-gray-900">이메일 알림 수신</p>
                      <p className="text-xs text-gray-500 mt-1">
                        팀 활동, 문제 추천 등의 알림을 이메일로 받습니다
                      </p>
                    </div>
                  </div>
                  <button
                    onClick={() => showToastMessage('알림 설정 기능은 개발 중입니다')}
                    className="relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent bg-gray-200 transition-colors duration-200 ease-in-out hover:bg-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                  >
                    <span className="translate-x-0 inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out"></span>
                  </button>
                </div>
              </div>
            </div> */}

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
                      onClick={() => setShowDeleteModal(true)}
                      className="px-4 py-2 text-sm font-medium text-red-700 bg-white border border-red-300 rounded-lg hover:bg-red-50 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 transition-colors"
                    >
                      회원탈퇴
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>


      </div>

      {/* 이메일 변경 모달 */}
      {showEmailModal && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 overflow-y-auto h-full w-full z-50 flex items-center justify-center p-4 animate-in fade-in duration-200"
          onClick={handleEmailModalClose}
        >
          <div
            className="relative mx-auto w-full max-w-md animate-in zoom-in-95 duration-200"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="bg-white rounded-xl shadow-2xl border border-gray-100">
              <div className="px-6 py-5 border-b border-gray-100">
                <h3 className="text-lg font-semibold text-gray-900">
                  이메일 변경
                </h3>
                <p className="text-sm text-gray-600 mt-1">
                  새 이메일 주소로 인증 링크를 보내드립니다
                </p>
              </div>
              <form onSubmit={handleEmailSubmit} className="p-6 space-y-5">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    현재 이메일
                  </label>
                  <div className="px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-lg">
                    <p className="text-sm text-gray-600">{profile?.email}</p>
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    새 이메일 <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="email"
                    value={newEmail}
                    onChange={(e) => setNewEmail(e.target.value)}
                    required
                    placeholder="example@email.com"
                    className="block w-full px-4 py-2.5 border border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                    disabled={isSubmitting}
                    autoFocus
                  />
                </div>
                <div className="bg-blue-50 border border-blue-100 rounded-lg p-3">
                  <p className="text-xs text-blue-800">
                    <strong>안내:</strong> 입력한 이메일로 인증 링크가 발송됩니다.
                    이메일의 링크를 클릭하여 변경을 완료해주세요.
                  </p>
                </div>
                <div className="flex justify-end gap-3 pt-2">
                  <button
                    type="button"
                    onClick={handleEmailModalClose}
                    disabled={isSubmitting}
                    className="px-5 py-2.5 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                  >
                    취소
                  </button>
                  <button
                    type="submit"
                    disabled={isSubmitting || !newEmail.trim()}
                    className="px-5 py-2.5 text-sm font-medium text-white bg-blue-600 border border-transparent rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                  >
                    {isSubmitting ? (
                      <span className="flex items-center gap-2">
                        <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                        </svg>
                        발송 중...
                      </span>
                    ) : '인증 이메일 발송'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* 회원탈퇴 모달 */}
      {showDeleteModal && (
        <DeleteAccountModal
          onClose={() => setShowDeleteModal(false)}
          onConfirm={handleDeleteAccount}
          isDeleting={isDeleting}
        />
      )}
    </div>
  );
}
