import { Link } from 'react-router-dom';
import { FlaskConical } from 'lucide-react';

export default function DashboardLabsRail() {
  return (
    <Link
      to="/labs"
      aria-label="실험실 이동"
      title="실험실"
      className="relative inline-flex items-center justify-center p-3 bg-white hover:bg-gray-100 active:bg-gray-200 rounded-xl border border-gray-200 transition-colors group"
    >
      <FlaskConical className="h-6 w-6 text-blue-600 group-hover:text-blue-700" />
    </Link>
  );
}
