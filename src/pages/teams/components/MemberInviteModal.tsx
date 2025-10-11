import { useState, useEffect, useRef } from 'react';
import { X, Search, UserPlus, Loader2, CheckCircle } from 'lucide-react';
import { memberApi, type MemberSearchResponse } from '../../../api/member';
import { teamsApi } from '../../../api/teams';

interface MemberInviteModalProps {
  teamId: number;
  onClose: () => void;
  onShowToast: (message: string) => void;
  onInviteSuccess: () => void;
}

export function MemberInviteModal({ teamId, onClose, onShowToast, onInviteSuccess }: MemberInviteModalProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<MemberSearchResponse[]>([]);
  const [selectedMembers, setSelectedMembers] = useState<MemberSearchResponse[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [isInviting, setIsInviting] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false);
  const searchTimeoutRef = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // 검색 입력 시 디바운스 처리
  useEffect(() => {
    if (searchTimeoutRef.current) {
      clearTimeout(searchTimeoutRef.current);
    }

    if (searchQuery.trim().length === 0) {
      setSearchResults([]);
      setShowDropdown(false);
      return;
    }

    searchTimeoutRef.current = setTimeout(() => {
      handleSearch();
    }, 300);

    return () => {
      if (searchTimeoutRef.current) {
        clearTimeout(searchTimeoutRef.current);
      }
    };
  }, [searchQuery]);

  // 모달 열릴 때 입력창 자동 포커싱
  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  // 외부 클릭 시 드롭다운 닫기
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setShowDropdown(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSelectMember = (member: MemberSearchResponse) => {
    // 이미 선택된 멤버인지 확인
    if (selectedMembers.find(m => m.id === member.id)) {
      onShowToast('이미 초대 리스트에 추가된 멤버입니다.');
      return;
    }

    setSelectedMembers([...selectedMembers, member]);
    setSearchQuery('');
    setSearchResults([]);
    setShowDropdown(false);
  };

  const handleRemoveSelected = (memberId: number) => {
    setSelectedMembers(selectedMembers.filter(m => m.id !== memberId));
  };

  const handleSearch = async () => {
    if (searchQuery.trim().length === 0) {
      return;
    }

    setIsSearching(true);
    try {
      const results = await memberApi.getByHandle(searchQuery.trim());
      // 인증된 유저를 상단에 정렬 (verified: true가 우선)
      const sortedResults = results.sort((a, b) => {
        if (a.verified && !b.verified) return -1;
        if (!a.verified && b.verified) return 1;
        return 0;
      });
      setSearchResults(sortedResults);
      setShowDropdown(true);
    } catch (error) {
      console.error('멤버 검색 실패:', error);
      setSearchResults([]);
      setShowDropdown(false);
    } finally {
      setIsSearching(false);
    }
  };

  const handleInvite = async () => {
    if (selectedMembers.length === 0) {
      onShowToast('초대할 멤버를 선택해주세요.');
      return;
    }

    setIsInviting(true);

    try {
      // 각 멤버를 순차적으로 초대
      const results = await Promise.allSettled(
        selectedMembers.map(member =>
          teamsApi.inviteMember(teamId, { memberId: member.id })
            .catch(error => {
              // 에러 메시지 추출
              const errorMessage = error?.response?.data?.message || error?.message || '알 수 없는 오류';
              throw new Error(errorMessage);
            })
        )
      );

      const successCount = results.filter(r => r.status === 'fulfilled').length;
      const failCount = results.filter(r => r.status === 'rejected').length;

      // 실패한 이유 수집
      const failedReasons = results
        .filter(r => r.status === 'rejected')
        .map(r => (r as PromiseRejectedResult).reason?.message)
        .filter(Boolean);

      // 이미 팀 멤버인 경우 체크
      const alreadyMemberCount = failedReasons.filter(msg =>
        msg.includes('이미') || msg.includes('already') || msg.includes('exist')
      ).length;

      if (successCount > 0) {
        if (alreadyMemberCount > 0) {
          onShowToast(`${successCount}명 초대 완료. ${alreadyMemberCount}명은 이미 팀 멤버입니다.`);
        } else if (failCount > 0) {
          onShowToast(`${successCount}명의 멤버를 초대했습니다. (${failCount}명 실패)`);
        } else {
          onShowToast(`${successCount}명의 멤버를 초대했습니다.`);
        }
        onInviteSuccess();
        onClose();
      } else {
        // 모두 실패한 경우
        if (alreadyMemberCount === failCount) {
          onShowToast('선택한 멤버가 모두 이미 팀에 속해있습니다.');
        } else {
          onShowToast('멤버 초대에 실패했습니다. 다시 시도해주세요.');
        }
      }
    } catch (error) {
      console.error('멤버 초대 실패:', error);
      onShowToast('멤버 초대에 실패했습니다.');
    } finally {
      setIsInviting(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-md">
        {/* 헤더 */}
        <div className="flex items-center justify-between p-4 border-b border-gray-200">
          <h2 className="text-lg font-semibold text-gray-900">멤버 초대</h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* 본문 */}
        <div className="p-4 space-y-4">
          {/* 검색 입력 */}
          <div className="relative" ref={dropdownRef}>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              백준 핸들로 검색
            </label>
            <div className="relative">
              <input
                ref={inputRef}
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    e.preventDefault();
                    handleSearch();
                  }
                }}
                placeholder="백준 핸들 입력..."
                className="w-full px-4 py-2 pr-10 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
              <button
                type="button"
                onClick={handleSearch}
                className="absolute right-3 top-1/2 -translate-y-1/2 hover:opacity-70 transition-opacity"
              >
                {isSearching ? (
                  <Loader2 className="h-5 w-5 text-gray-400 animate-spin" />
                ) : (
                  <Search className="h-5 w-5 text-gray-400" />
                )}
              </button>
            </div>

            {/* 검색 결과 드롭다운 */}
            {showDropdown && searchResults.length > 0 && (
              <div className="absolute z-10 w-full mt-1 bg-white border border-gray-200 rounded-lg shadow-lg max-h-64 overflow-y-auto">
                {searchResults.map((member) => (
                  <button
                    key={member.id}
                    onClick={() => handleSelectMember(member)}
                    className={`w-full px-4 py-3 hover:bg-gray-50 flex items-center gap-3 transition-colors border-b border-gray-100 last:border-b-0 ${
                      member.verified ? 'bg-green-50/30' : ''
                    }`}
                  >
                    <div className={`h-10 w-10 rounded-full flex items-center justify-center font-medium ${
                      member.verified
                        ? 'bg-green-100 text-green-700'
                        : 'bg-gray-100 text-gray-600'
                    }`}>
                      {member.handle[0].toUpperCase()}
                    </div>
                    <div className="flex-1 text-left min-w-0">
                      <div className="flex items-center gap-1.5">
                        <p className="text-sm font-medium text-gray-900">@{member.handle}</p>
                        {member.verified && (
                          <>
                            <CheckCircle className="h-4 w-4 text-green-600 flex-shrink-0" />
                            <span className="text-xs px-1.5 py-0.5 bg-green-100 text-green-700 rounded flex-shrink-0">
                              인증됨
                            </span>
                          </>
                        )}
                      </div>
                      <p className="text-xs text-gray-500 truncate">{member.email}</p>
                    </div>
                  </button>
                ))}
              </div>
            )}

            {showDropdown && searchResults.length === 0 && !isSearching && searchQuery.trim() && (
              <div className="absolute z-10 w-full mt-1 bg-white border border-gray-200 rounded-lg shadow-lg p-4">
                <p className="text-sm text-gray-500 text-center">검색 결과가 없습니다.</p>
              </div>
            )}
          </div>

          {/* 선택된 멤버 리스트 */}
          {selectedMembers.length > 0 && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                초대할 멤버 ({selectedMembers.length})
              </label>
              <div className="space-y-2 max-h-48 overflow-y-auto border border-gray-200 rounded-lg p-3">
                {selectedMembers.map((member) => (
                  <div
                    key={member.id}
                    className="flex items-center justify-between p-2 bg-gray-50 rounded-lg"
                  >
                    <div className="flex items-center gap-3">
                      <div className="h-8 w-8 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 font-medium text-sm">
                        {member.handle[0].toUpperCase()}
                      </div>
                      <div>
                        <div className="flex items-center gap-1.5">
                          <p className="text-sm font-medium text-gray-900">@{member.handle}</p>
                          {member.verified && (
                            <CheckCircle className="h-3.5 w-3.5 text-green-600 flex-shrink-0" />
                          )}
                        </div>
                        <p className="text-xs text-gray-500">{member.email}</p>
                      </div>
                    </div>
                    <button
                      onClick={() => handleRemoveSelected(member.id)}
                      className="text-gray-400 hover:text-red-600 transition-colors"
                    >
                      <X className="h-4 w-4" />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* 푸터 */}
        <div className="flex items-center justify-end gap-2 p-4 border-t border-gray-200 bg-gray-50 rounded-b-lg">
          <button
            onClick={onClose}
            disabled={isInviting}
            className="px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-100 rounded-lg transition-colors disabled:opacity-50"
          >
            취소
          </button>
          <button
            onClick={handleInvite}
            disabled={isInviting || selectedMembers.length === 0}
            className="px-4 py-2 text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
          >
            {isInviting ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />
                초대 중...
              </>
            ) : (
              <>
                <UserPlus className="h-4 w-4" />
                초대하기
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
