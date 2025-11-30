import { Sparkles } from 'lucide-react';

export default function NewBadge() {
  return (
    <span className="flex items-center gap-1 px-1.5 py-0.5 text-xs font-semibold bg-purple-200 text-purple-800 rounded animate-pulse">
      <Sparkles className="h-3 w-3" />
      NEW
    </span>
  );
}
