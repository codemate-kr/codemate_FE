import { FlaskConical } from 'lucide-react';
import useDocumentTitle from '../../hooks/useDocumentTitle';
import BoardPreviewLab from './components/BoardPreviewLab';

export default function LabsPage() {
  useDocumentTitle('실험실');

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8 sm:py-10">
      <div className="bg-blue-50 border border-blue-200 rounded-2xl p-5 sm:p-6 mb-5">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/80 text-blue-700 text-xs font-semibold mb-3">
          <FlaskConical className="h-3.5 w-3.5" />
          실험실
        </div>

        <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-2">CodeMate 실험실</h1>
        <p className="text-sm sm:text-base text-gray-700 leading-relaxed">
          가볍게 테스트해보는 공간입니다. 실험 내용은 언제든 변경되거나 사라질 수 있습니다.
        </p>
      </div>

      <BoardPreviewLab />
    </div>
  );
}
