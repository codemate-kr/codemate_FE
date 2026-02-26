import type { TeamActivityMember } from '../../../../../api/teams';
import { DayRangeToggle, MemberAvatar } from './common';

interface LeaderboardTabProps {
  members: TeamActivityMember[];
  currentMemberId: number;
  dayRange: 7 | 30;
  onDayRangeChange: (range: 7 | 30) => void;
}

export default function LeaderboardTab({
  members,
  currentMemberId,
  dayRange,
  onDayRangeChange,
}: LeaderboardTabProps) {
  const myRank = members.find((m) => m.memberId === currentMemberId)?.rank || 0;
  const myIndex = members.findIndex((m) => m.memberId === currentMemberId);

  return (
    <div className="space-y-3 max-sm:space-y-2">
      <div className="flex items-center justify-between">
        <DayRangeToggle dayRange={dayRange} onChange={onDayRangeChange} />
        <div className="text-[11px] max-sm:text-[10px] text-gray-400 text-right">
          최근 {dayRange}일 기준
        </div>
      </div>
      <div className="space-y-1.5 max-sm:space-y-1">
        {members.map((member) => {
          const isMe = member.memberId === currentMemberId;
          return (
            <div
              key={member.memberId}
              className={`flex items-center gap-3 max-sm:gap-2 p-2.5 max-sm:p-2 rounded-lg border ${
                isMe ? 'bg-blue-50 border-blue-200' : 'bg-white border-gray-200'
              }`}
            >
              <div className="w-6 max-sm:w-5 text-center text-sm max-sm:text-xs font-bold text-gray-500">
                {member.rank}
              </div>
              <MemberAvatar handle={member.handle} isMe={isMe} size="md" />
              <div className="flex-1 min-w-0">
                <p className="text-sm max-sm:text-xs font-medium text-gray-700 truncate">
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
                    '(미인증)'
                  )}
                  {isMe && <span className="text-blue-600 ml-1">(나)</span>}
                </p>
              </div>
              <span className="text-sm max-sm:text-xs font-medium text-gray-600 flex-shrink-0">{member.totalSolved}문제</span>
            </div>
          );
        })}
      </div>

      {myRank > 1 && myIndex > 0 && (
        <div className="text-center text-xs max-sm:text-[10px] text-gray-500 pt-2 border-t border-gray-100">
          {members[myIndex - 1].totalSolved - members[myIndex].totalSolved}문제만 더 풀면 {myRank - 1}위!
        </div>
      )}
    </div>
  );
}
