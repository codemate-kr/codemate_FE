import { useNavigate } from 'react-router-dom';
import { AlertCircle, Lock, Wifi, Home, RefreshCw } from 'lucide-react';
import type { TeamDetailError } from '../../store/teamStore';

interface TeamDetailErrorProps {
  error: TeamDetailError;
  onRetry?: () => void;
}

export function TeamDetailError({ error, onRetry }: TeamDetailErrorProps) {
  const navigate = useNavigate();

  const getIcon = () => {
    switch (error.type) {
      case 'not-found':
        return <AlertCircle className="h-12 w-12 text-gray-400" />;
      case 'forbidden':
        return <Lock className="h-12 w-12 text-yellow-500" />;
      case 'network':
        return <Wifi className="h-12 w-12 text-red-400" />;
      default:
        return <AlertCircle className="h-12 w-12 text-gray-400" />;
    }
  };

  const getActions = () => {
    switch (error.type) {
      case 'not-found':
      case 'forbidden':
        return (
          <button
            onClick={() => navigate('/teams')}
            className="inline-flex items-center px-4 py-2 text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 rounded-md transition-colors"
          >
            <Home className="h-4 w-4 mr-2" />
            스터디 목록으로 돌아가기
          </button>
        );
      case 'network':
      case 'unknown':
        return (
          <div className="flex gap-3">
            {onRetry && (
              <button
                onClick={onRetry}
                className="inline-flex items-center px-4 py-2 text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 rounded-md transition-colors"
              >
                <RefreshCw className="h-4 w-4 mr-2" />
                다시 시도
              </button>
            )}
            <button
              onClick={() => navigate('/teams')}
              className="inline-flex items-center px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 hover:bg-gray-50 rounded-md transition-colors"
            >
              <Home className="h-4 w-4 mr-2" />
              스터디 목록으로
            </button>
          </div>
        );
    }
  };

  return (
    <div className="px-4 sm:px-6 lg:px-8">
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="text-center max-w-md">
          <div className="flex justify-center mb-4">
            {getIcon()}
          </div>
          <h2 className="text-xl font-semibold text-gray-900 mb-2">
            {error.type === 'not-found' && '스터디를 찾을 수 없습니다'}
            {error.type === 'forbidden' && '접근할 수 없는 스터디입니다'}
            {error.type === 'network' && '네트워크 오류'}
            {error.type === 'unknown' && '오류가 발생했습니다'}
          </h2>
          <p className="text-gray-600 mb-6">
            {error.message}
          </p>
          {getActions()}
        </div>
      </div>
    </div>
  );
}
