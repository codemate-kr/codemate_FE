import { AlertTriangle, ChevronRight } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function BaekjoonSunsetNoticeBanner() {
  return (
    <Link
      to="/notice/good-bye-boj"
      className="block w-full border-b border-amber-300 bg-amber-50 text-amber-900 transition-colors hover:bg-amber-100/70 dark:border-amber-500/40 dark:bg-amber-500/10 dark:text-amber-100 dark:hover:bg-amber-400/10"
      aria-label="백준 서비스 종료 공지 상세 보기"
    >
      <div className="mx-auto flex max-w-7xl items-center gap-2 px-3 py-2 text-xs sm:px-6 sm:text-sm lg:px-8">
        <AlertTriangle className="h-4 w-4 flex-shrink-0" aria-hidden="true" />
        <p className="flex-1">
          공지: 백준 서비스 종료에 따라 2026년 4월 28일부로 모든 팀의 문제추천 설정이 비활성화됩니다.
        </p>
        <ChevronRight className="h-4 w-4 flex-shrink-0" aria-hidden="true" />
      </div>
    </Link>
  );
}
