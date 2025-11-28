import { useState, useEffect } from 'react';
import { memberApi, type MyProfileResponse } from '../../api/member';
import useDocumentTitle from '../../hooks/useDocumentTitle';
import { toast } from '../../components/common/toast';
import DeleteAccountModal from './components/DeleteAccountModal';
import EmailChangeModal from './components/EmailChangeModal';
import ProfileHeader from './components/ProfileHeader';
import ProfileInfo from './components/ProfileInfo';
import { useAuthStore } from '../../store/authStore';
import { useNavigate, useLocation } from 'react-router-dom';

export default function MyProfilePage() {
  useDocumentTitle('마이페이지');

  const navigate = useNavigate();
  const location = useLocation();
  const logout = useAuthStore((state) => state.logout);

  const [profile, setProfile] = useState<MyProfileResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [showEmailModal, setShowEmailModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    loadProfile();
  }, []);

  // URL state로부터 이메일 모달 자동 열기
  useEffect(() => {
    if (location.state?.openEmailModal) {
      setShowEmailModal(true);
      // state 초기화 (뒤로가기 시 재실행 방지)
      window.history.replaceState({}, document.title);
    }
  }, [location]);

  const loadProfile = async () => {
    try {
      setLoading(true);
      const data = await memberApi.getMe();
      setProfile(data);
    } catch (error) {
      console.error('프로필 로딩 실패:', error);
      toast('프로필을 불러오는데 실패했습니다', 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteAccount = async () => {
    try {
      setIsDeleting(true);
      await memberApi.withdraw();

      toast('회원탈퇴가 완료되었습니다', 'success');

      // 1초 후 로그아웃 및 로그인 페이지로 이동
      setTimeout(() => {
        logout();
        navigate('/login');
      }, 1000);

    } catch (error: any) {
      console.error('회원탈퇴 실패:', error);

      const status = error?.response?.status;
      const errorCode = error?.response?.data?.code;

      if (status === 409 && errorCode === '3013') {
        toast('팀에 소속되어 있어 탈퇴할 수 없습니다.\n모든 팀에서 탈퇴 후 다시 시도해주세요.', 'error');
      } else {
        toast('회원탈퇴에 실패했습니다. 다시 시도해주세요.', 'error');
      }

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
          <ProfileHeader profile={profile} />
          <ProfileInfo
            profile={profile}
            onEmailChange={() => setShowEmailModal(true)}
            onDeleteAccount={() => setShowDeleteModal(true)}
          />
        </div>


      </div>

      {/* 이메일 변경 모달 */}
      {showEmailModal && profile && (
        <EmailChangeModal
          currentEmail={profile.email}
          onClose={() => setShowEmailModal(false)}
          onSuccess={(message) => toast(message, 'success')}
          onError={(message) => toast(message, 'error')}
        />
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
