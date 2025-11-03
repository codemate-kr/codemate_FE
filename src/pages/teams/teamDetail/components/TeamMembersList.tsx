import type { TeamMemberResponse } from '../../../../api/teams';

interface TeamMembersListProps {
  members: TeamMemberResponse[];
}

export default function TeamMembersList({ members }: TeamMembersListProps) {
  return (
    <div className="bg-white border border-gray-200 rounded-lg p-4">
      <h3 className="text-sm font-semibold text-gray-900 mb-3">
        멤버 ({members.length})
      </h3>
      <div className="space-y-2">
        {members.map((member) => (
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
                @{member.handle || '핸들 없음'}
                {member.isMe && <span className="ml-1 text-xs text-blue-600">(나)</span>}
              </p>
              <p className="text-xs text-gray-500 truncate">{member.email}</p>
            </div>
            {member.role === 'LEADER' && (
              <span className="text-xs px-2 py-0.5 bg-blue-100 text-blue-700 rounded">팀장</span>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
