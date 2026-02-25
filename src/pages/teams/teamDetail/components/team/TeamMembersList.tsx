import { useState } from 'react';
import { ChevronDown, ChevronUp } from 'lucide-react';
import type { TeamMemberResponse } from '../../../../../api/teams';
import type { SquadResponse } from '../../../../../api/squads';

interface TeamMembersListProps {
  members: TeamMemberResponse[];
  squads?: SquadResponse[];
}

const DEFAULT_VISIBLE_COUNT = 5;

export default function TeamMembersList({ members, squads }: TeamMembersListProps) {
  const [isExpanded, setIsExpanded] = useState(false);

  const visibleMembers = isExpanded ? members : members.slice(0, DEFAULT_VISIBLE_COUNT);
  const hasMoreMembers = members.length > DEFAULT_VISIBLE_COUNT;

  return (
    <div className="bg-white border border-gray-200 rounded-lg p-4">
      <h3 className="text-sm font-semibold text-gray-900 mb-3">
        멤버 ({members.length})
      </h3>
      <div className="space-y-2">
        {visibleMembers.map((member) => {
          const memberSquadName =
            member.squadName ??
            squads?.find((s) => s.squadId === member.squadId)?.squadName ??
            squads?.find((s) => (s.members ?? []).some((m) => m.memberId === member.memberId))?.squadName;

          return (
            <div
              key={member.memberId}
              className={`flex items-center gap-3 p-2 rounded ${
                member.isMe ? 'bg-blue-50' : ''
              }`}
            >
              <div className={`h-8 w-8 rounded-full flex items-center justify-center text-white text-sm font-medium ${
                member.role === 'LEADER' ? 'bg-blue-600' : 'bg-gray-400'
              }`}>
                {member.handle?.[0]?.toUpperCase() || '?'}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-gray-900 truncate">
                  {member.handle ? (
                    <a
                      href={`https://www.acmicpc.net/user/${member.handle}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="hover:text-blue-600 hover:underline transition-colors"
                    >
                      @{member.handle}
                    </a>
                  ) : (
                    <span>@핸들 없음</span>
                  )}
                  {member.isMe && <span className="ml-1 text-xs text-blue-600">(나)</span>}
                </p>
                <p className="text-xs text-gray-500 truncate">{member.email ?? '이메일 비공개'}</p>
              </div>
              <div className="flex items-center gap-1.5 flex-shrink-0">
                {member.role === 'LEADER' && (
                  <span className="text-xs px-2 py-0.5 bg-blue-100 text-blue-700 rounded">팀장</span>
                )}
                {memberSquadName && (
                  <span className="text-xs px-1.5 py-0.5 bg-gray-100 text-gray-500 rounded">
                    {memberSquadName}
                  </span>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {hasMoreMembers && (
        <button
          onClick={() => setIsExpanded(!isExpanded)}
          className="w-full flex items-center justify-center gap-1 mt-3 py-2 text-xs text-gray-500 hover:text-gray-700 hover:bg-gray-50 rounded-md transition-colors"
        >
          {isExpanded ? (
            <>
              <ChevronUp className="w-4 h-4" />
              접기
            </>
          ) : (
            <>
              <ChevronDown className="w-4 h-4" />
              {members.length - DEFAULT_VISIBLE_COUNT}명 더보기
            </>
          )}
        </button>
      )}
    </div>
  );
}
