import { useState, useRef, useEffect } from 'react';
import { MoreVertical, LogOut, Trash2, X } from 'lucide-react';

interface TeamActionMenuProps {
  isTeamLeader: boolean;
  onLeaveClick: () => void;
  onDeleteClick: () => void;
}

export default function TeamActionMenu({
  isTeamLeader,
  onLeaveClick,
  onDeleteClick,
}: TeamActionMenuProps) {
  const [isOpen, setIsOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
      document.addEventListener('keydown', handleEscape);
      // 모바일에서 스크롤 방지
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('keydown', handleEscape);
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  const handleMenuItemClick = (action: () => void) => {
    setIsOpen(false);
    action();
  };

  return (
    <div className="relative" ref={menuRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="p-2 text-gray-400 hover:text-gray-600 active:bg-gray-200 hover:bg-gray-100 rounded-lg transition-colors touch-manipulation"
        aria-label="팀 설정"
      >
        <MoreVertical className="h-5 w-5" />
      </button>

      {isOpen && (
        <>
          {/* 모바일: 바텀 시트 오버레이 */}
          <div className="fixed inset-0 bg-black bg-opacity-50 z-40 md:hidden animate-in fade-in duration-200" />

          {/* 데스크톱: 드롭다운 메뉴 */}
          <div className="hidden md:block absolute right-0 mt-2 w-48 rounded-lg shadow-lg bg-white ring-1 ring-black ring-opacity-5 z-50 animate-in fade-in zoom-in-95 duration-100">
            <div className="py-1">
              {isTeamLeader ? (
                <button
                  onClick={() => handleMenuItemClick(onDeleteClick)}
                  className="w-full flex items-center px-4 py-3 text-sm text-red-700 hover:bg-red-50 active:bg-red-100 transition-colors touch-manipulation"
                >
                  <Trash2 className="h-4 w-4 mr-3" />
                  팀 해산
                </button>
              ) : (
                <button
                  onClick={() => handleMenuItemClick(onLeaveClick)}
                  className="w-full flex items-center px-4 py-3 text-sm text-gray-700 hover:bg-gray-100 active:bg-gray-200 transition-colors touch-manipulation"
                >
                  <LogOut className="h-4 w-4 mr-3" />
                  팀 탈퇴
                </button>
              )}
            </div>
          </div>

          {/* 모바일: 바텀 시트 */}
          <div className="md:hidden fixed inset-x-0 bottom-0 z-50 bg-white rounded-t-2xl shadow-2xl animate-in slide-in-from-bottom duration-300">
            <div className="p-4">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-gray-900">팀 설정</h3>
                <button
                  onClick={() => setIsOpen(false)}
                  className="p-2 text-gray-400 hover:text-gray-600 active:bg-gray-200 rounded-lg transition-colors touch-manipulation"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>

              <div className="space-y-2">
                {isTeamLeader ? (
                  <button
                    onClick={() => handleMenuItemClick(onDeleteClick)}
                    className="w-full flex items-center px-4 py-4 text-base font-medium text-red-700 bg-red-50 hover:bg-red-100 active:bg-red-200 rounded-lg transition-colors touch-manipulation"
                  >
                    <Trash2 className="h-5 w-5 mr-3" />
                    팀 해산
                  </button>
                ) : (
                  <button
                    onClick={() => handleMenuItemClick(onLeaveClick)}
                    className="w-full flex items-center px-4 py-4 text-base font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 active:bg-gray-300 rounded-lg transition-colors touch-manipulation"
                  >
                    <LogOut className="h-5 w-5 mr-3" />
                    팀 탈퇴
                  </button>
                )}
              </div>

              {/* Safe area padding for iOS */}
              <div className="h-safe-bottom" />
            </div>
          </div>
        </>
      )}
    </div>
  );
}
