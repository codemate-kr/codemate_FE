import { useState, useEffect, useRef } from 'react';
import { X, Users } from 'lucide-react';

const MAX_SQUAD_NAME_LENGTH = 10;

interface CreateSquadModalProps {
  initialName?: string;
  isEdit?: boolean;
  isLoading?: boolean;
  onClose: () => void;
  onSubmit: (name: string) => Promise<void>;
}

export default function CreateSquadModal({ initialName = '', isEdit = false, isLoading = false, onClose, onSubmit }: CreateSquadModalProps) {
  const [name, setName] = useState(initialName);
  const [submitLoading, setSubmitLoading] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const trimmed = name.trim();
    if (!trimmed) return;

    setSubmitLoading(true);
    try {
      await onSubmit(trimmed);
    } finally {
      setSubmitLoading(false);
    }
  };

  const loading = isLoading || submitLoading;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
      <div
        className="bg-white rounded-xl shadow-2xl w-full max-w-sm"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-blue-50 rounded-lg">
              <Users className="h-5 w-5 text-blue-600" />
            </div>
            <h3 className="text-lg font-bold text-gray-900">
              {isEdit ? '스쿼드 이름 수정' : '스쿼드 만들기'}
            </h3>
          </div>
          <button
            onClick={onClose}
            disabled={loading}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <X className="h-5 w-5 text-gray-400" />
          </button>
        </div>

        {/* Content */}
        <form onSubmit={handleSubmit} className="px-6 py-5">
          <label className="block text-sm font-medium text-gray-700 mb-1.5">
            스쿼드 이름
            <span className="text-red-500 ml-0.5">*</span>
          </label>
          <input
            ref={inputRef}
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="예: 스쿼드 A"
            maxLength={MAX_SQUAD_NAME_LENGTH}
            disabled={loading}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:opacity-50"
          />
          <p className="mt-1 text-xs text-gray-400 text-right">{name.length}/{MAX_SQUAD_NAME_LENGTH}</p>

          {/* Footer */}
          <div className="flex justify-end gap-2 mt-5">
            <button
              type="button"
              onClick={onClose}
              disabled={loading}
              className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 transition-colors"
            >
              취소
            </button>
            <button
              type="submit"
              disabled={loading || !name.trim()}
              className="px-5 py-2 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center gap-2"
            >
              {loading ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent" />
                  저장 중...
                </>
              ) : (
                isEdit ? '수정' : '만들기'
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
