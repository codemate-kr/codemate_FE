import { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { CheckCircle, XCircle, Loader2 } from 'lucide-react';
import { memberApi } from '../../api/member';
import { useAuthStore } from '../../store/authStore';
import useDocumentTitle from '../../hooks/useDocumentTitle';

export default function VerifyEmailPage() {
  useDocumentTitle('이메일 인증');

  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { updateUser } = useAuthStore();

  const [status, setStatus] = useState<'loading' | 'success' | 'error'>('loading');
  const [errorMessage, setErrorMessage] = useState('');
  const [newEmail, setNewEmail] = useState('');

  useEffect(() => {
    const verifyEmailToken = async () => {
      const token = searchParams.get('token');

      if (!token) {
        setStatus('error');
        setErrorMessage('인증 토큰이 없습니다.');
        return;
      }

      try {
        setStatus('loading');
        const updatedProfile = await memberApi.verifyEmail(token);

        // 인증 성공 - 사용자 정보 업데이트
        updateUser({
          email: updatedProfile.email,
        });

        setNewEmail(updatedProfile.email);
        setStatus('success');

        // 3초 후 마이페이지로 이동
        setTimeout(() => {
          navigate('/profile');
        }, 3000);
      } catch (error: any) {
        console.error('이메일 인증 실패:', error);
        setStatus('error');

        if (error.response?.status === 400) {
          setErrorMessage('유효하지 않거나 만료된 토큰입니다.');
        } else if (error.response?.status === 404) {
          setErrorMessage('토큰을 찾을 수 없습니다.');
        } else {
          setErrorMessage('이메일 인증에 실패했습니다. 다시 시도해주세요.');
        }
      }
    };

    verifyEmailToken();
  }, [searchParams, navigate, updateUser]);

  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 px-4 py-12">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center mb-4">
            <img src="/logo.svg" alt="CodeMate" className="w-16 h-16 transform hover:scale-105 transition-transform drop-shadow-lg" />
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2 tracking-tight">
            이메일 인증
          </h1>
        </div>

        <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-2xl p-8 border border-white/20">
          {status === 'loading' && (
            <div className="text-center py-8">
              <div className="inline-flex items-center justify-center w-20 h-20 bg-blue-100 rounded-full mb-6 animate-pulse">
                <Loader2 className="h-10 w-10 text-blue-600 animate-spin" />
              </div>
              <h2 className="text-xl font-bold text-gray-900 mb-2">
                인증 처리 중...
              </h2>
              <p className="text-sm text-gray-600">
                잠시만 기다려주세요.
              </p>
            </div>
          )}

          {status === 'success' && (
            <div className="text-center py-8">
              <div className="inline-flex items-center justify-center w-20 h-20 bg-green-100 rounded-full mb-6">
                <CheckCircle className="h-10 w-10 text-green-600" />
              </div>
              <h2 className="text-xl font-bold text-gray-900 mb-2">
                이메일이 변경되었습니다!
              </h2>
              <p className="text-sm text-gray-600 mb-4">
                새 이메일: <span className="font-semibold text-gray-900">{newEmail}</span>
              </p>
              <p className="text-xs text-gray-500 mb-6">
                잠시 후 마이페이지로 이동합니다...
              </p>
              <button
                onClick={() => navigate('/profile')}
                className="inline-flex items-center justify-center px-6 py-3 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 transition-colors"
              >
                마이페이지로 이동
              </button>
            </div>
          )}

          {status === 'error' && (
            <div className="text-center py-8">
              <div className="inline-flex items-center justify-center w-20 h-20 bg-red-100 rounded-full mb-6">
                <XCircle className="h-10 w-10 text-red-600" />
              </div>
              <h2 className="text-xl font-bold text-gray-900 mb-2">
                인증 실패
              </h2>
              <p className="text-sm text-gray-600 mb-6">
                {errorMessage}
              </p>
              <div className="flex flex-col gap-3">
                <button
                  onClick={() => navigate('/profile')}
                  className="inline-flex items-center justify-center px-6 py-3 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 transition-colors"
                >
                  마이페이지로 돌아가기
                </button>
                <button
                  onClick={() => navigate('/')}
                  className="inline-flex items-center justify-center px-6 py-3 bg-white text-gray-700 rounded-lg font-semibold border border-gray-300 hover:bg-gray-50 transition-colors"
                >
                  홈으로 이동
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
