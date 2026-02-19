interface Squad {
  squadId: number;
  squadName: string;
}

interface SquadTabBarProps {
  squads: Squad[];
  selectedSquadId: number | null;
  onSelect: (squadId: number | null) => void;
}

export default function SquadTabBar({ squads, selectedSquadId, onSelect }: SquadTabBarProps) {
  if (squads.length === 0) return null;

  return (
    <div className="flex items-center gap-2">
      <span className="text-xs text-gray-400 font-medium shrink-0">스쿼드</span>
      <div className="flex items-center gap-1.5 flex-wrap">
        {squads.map((squad) => (
          <button
            key={squad.squadId}
            onClick={() => onSelect(squad.squadId)}
            className={`px-3 py-1 text-xs font-medium rounded-full border transition-colors ${
              squad.squadId === selectedSquadId
                ? 'bg-blue-600 text-white border-blue-600'
                : 'bg-white text-gray-600 border-gray-300 hover:border-gray-400 hover:text-gray-800'
            }`}
          >
            {squad.squadName}
          </button>
        ))}
      </div>
    </div>
  );
}
