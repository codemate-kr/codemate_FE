import { AlertTriangle, Calendar, Settings2 } from 'lucide-react';
import usePageMeta from '../../hooks/usePageMeta';

export default function BaekjoonSunsetNoticePage() {
  usePageMeta({
    title: '공지사항 - 문제추천 설정 비활성화 안내',
    description: '백준 서비스 종료에 따라 2026년 4월 28일부로 CodeMate 팀 문제추천 설정이 비활성화됨을 안내합니다.',
    path: '/notice/good-bye-boj',
  });

  return (
    <div className="px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
      <article className="max-w-4xl mx-auto">
        <header className="pb-6 border-b border-gray-200 dark:border-slate-800">
          <div className="inline-flex items-center gap-2 text-sm font-semibold text-amber-700 dark:text-amber-300">
            <AlertTriangle className="h-4 w-4" />
            공지사항
          </div>
          <h1 className="mt-3 text-2xl sm:text-3xl font-bold text-gray-900 dark:text-gray-100">
            백준 서비스 종료에 따른 팀 문제추천 설정 비활성화 안내
          </h1>
          <p className="mt-4 text-sm sm:text-base leading-7 text-gray-700 dark:text-slate-300">
            백준 서비스 종료에 따라 2026년 4월 28일부로 CodeMate의 모든 팀에서
            문제추천 설정이 비활성화됩니다.
          </p>
        </header>

        <section className="pt-6 pb-6 border-b border-gray-200 dark:border-slate-800">
          <h2 className="text-lg sm:text-xl font-bold text-gray-900 dark:text-gray-100">적용 일정</h2>
          <p className="mt-3 inline-flex items-center gap-2 text-sm sm:text-base font-semibold text-gray-900 dark:text-gray-100">
            <Calendar className="h-4 w-4 text-gray-600 dark:text-slate-400" />
            2026년 4월 28일
          </p>
          <p className="mt-2 text-sm sm:text-base leading-7 text-gray-700 dark:text-slate-300">
            해당 일자를 끝으로 모든 팀의 문제추천 설정이 일괄 비활성화됩니다.
          </p>
        </section>

        <section className="pt-6">
          <h2 className="text-lg sm:text-xl font-bold text-gray-900 dark:text-gray-100">영향 범위</h2>
          <ul className="mt-4 space-y-3 text-sm sm:text-base leading-7 text-gray-700 dark:text-slate-300">
            <li className="flex gap-3">
              <Settings2 className="mt-1 h-4 w-4 flex-shrink-0 text-gray-500 dark:text-slate-400" />
              <span>팀별 난이도·태그 기반 문제추천 설정이 비활성화됩니다.</span>
            </li>
            <li className="flex gap-3">
              <Settings2 className="mt-1 h-4 w-4 flex-shrink-0 text-gray-500 dark:text-slate-400" />
              <span>문제추천 관련 기능은 종료 일정 이후 사용할 수 없습니다.</span>
            </li>
          </ul>

          <p className="mt-10 text-sm font-semibold tracking-wide text-gray-500 dark:text-slate-400">
            #Good_Bye_BOJ
          </p>
        </section>
      </article>
    </div>
  );
}
