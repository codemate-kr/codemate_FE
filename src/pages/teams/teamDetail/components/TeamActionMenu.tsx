import { useState, useRef, useEffect } from 'react';
import { MoreVertical, LogOut, Trash2, X, Globe, Lock, Sparkles } from 'lucide-react';

interface TeamActionMenuProps {
  isTeamLeader: boolean;
  isTeamMember: boolean;
  isPrivate?: boolean;
  onLeaveClick: () => void;
  onDeleteClick: () => void;
  onVisibilityClick?: () => void;
}

export default function TeamActionMenu({
  isTeamLeader,
  isTeamMember,
  isPrivate,
  onLeaveClick,
  onDeleteClick,
  onVisibilityClick,
}: TeamActionMenuProps) {
  // 팀원이 아니면 액션 메뉴 표시 안함
  if (!isTeamMember) {
    return null;
  }
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

    // 모바일 환경 감지 (768px 이하)
    const isMobile = window.innerWidth < 768;

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
      document.addEventListener('keydown', handleEscape);
      // 모바일에서만 스크롤 방지
      if (isMobile) {
        document.body.style.overflow = 'hidden';
      }
    } else {
      if (isMobile) {
        document.body.style.overflow = 'unset';
      }
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('keydown', handleEscape);
      if (isMobile) {
        document.body.style.overflow = 'unset';
      }
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
        className="relative p-2 text-gray-400 hover:text-gray-600 active:bg-gray-200 hover:bg-gray-100 rounded-lg transition-colors touch-manipulation"
        aria-label="팀 설정"
      >
        <MoreVertical className="h-5 w-5" />
        {/* 팀장에게만 NEW 배지 표시 */}
        {isTeamLeader && onVisibilityClick && (
          <span className="absolute -top-1 -right-1 flex h-4 w-4">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-purple-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-4 w-4 bg-purple-500 items-center justify-center text-[8px] text-white font-bold">N</span>
          </span>
        )}
      </button>

      {isOpen && (
        <>
          {/* 모바일: 바텀 시트 오버레이 */}
          <div className="fixed inset-0 bg-black bg-opacity-50 z-40 md:hidden animate-in fade-in duration-200" />

          {/* 데스크톱: 드롭다운 메뉴 */}
          <div className="hidden md:block absolute right-0 mt-2 w-48 rounded-lg shadow-lg bg-white ring-1 ring-black ring-opacity-5 z-50 animate-in fade-in zoom-in-95 duration-100">
            <div className="py-1">
              {isTeamLeader ? (
                <>
                  {onVisibilityClick && (
                    <button
                      onClick={() => handleMenuItemClick(onVisibilityClick)}
                      className="w-full flex items-center justify-between px-4 py-3 text-sm text-purple-700 bg-purple-50 hover:bg-purple-100 active:bg-purple-200 transition-colors touch-manipulation"
                    >
                      <span className="flex items-center">
                        {isPrivate ? (
                          <>
                            <Globe className="h-4 w-4 mr-3" />
                            공개로 전환
                          </>
                        ) : (
                          <>
                            <Lock className="h-4 w-4 mr-3" />
                            비공개로 전환
                          </>
                        )}
                      </span>
                      <span className="flex items-center gap-1 px-1.5 py-0.5 text-xs font-semibold bg-purple-200 text-purple-800 rounded animate-pulse">
                        <Sparkles className="h-3 w-3" />
                        NEW
                      </span>
                    </button>
                  )}
                  <button
                    onClick={() => handleMenuItemClick(onDeleteClick)}
                    className="w-full flex items-center px-4 py-3 text-sm text-red-700 hover:bg-red-50 active:bg-red-100 transition-colors touch-manipulation"
                  >
                    <Trash2 className="h-4 w-4 mr-3" />
                    팀 해산
                  </button>
                </>
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
                  <>
                    {onVisibilityClick && (
                      <button
                        onClick={() => handleMenuItemClick(onVisibilityClick)}
                        className="w-full flex items-center justify-between px-4 py-4 text-base font-medium text-purple-700 bg-purple-50 hover:bg-purple-100 active:bg-purple-200 rounded-lg transition-colors touch-manipulation"
                      >
                        <span className="flex items-center">
                          {isPrivate ? (
                            <>
                              <Globe className="h-5 w-5 mr-3" />
                              공개로 전환
                            </>
                          ) : (
                            <>
                              <Lock className="h-5 w-5 mr-3" />
                              비공개로 전환
                            </>
                          )}
                        </span>
                        <span className="flex items-center gap-1 px-2 py-1 text-xs font-semibold bg-purple-200 text-purple-800 rounded animate-pulse">
                          <Sparkles className="h-3 w-3" />
                          NEW
                        </span>
                      </button>
                    )}
                    <button
                      onClick={() => handleMenuItemClick(onDeleteClick)}
                      className="w-full flex items-center px-4 py-4 text-base font-medium text-red-700 bg-red-50 hover:bg-red-100 active:bg-red-200 rounded-lg transition-colors touch-manipulation"
                    >
                      <Trash2 className="h-5 w-5 mr-3" />
                      팀 해산
                    </button>
                  </>
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
