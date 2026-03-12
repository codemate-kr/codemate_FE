import { BellRing, ChartColumn, Settings2, Users } from 'lucide-react';
import Layout from '../../components/common/Layout';
import useDocumentTitle from '../../hooks/useDocumentTitle';

const steps = [
  {
    icon: Users,
    title: '1. 팀을 만들거나 공개 팀을 탐색합니다',
    description: '혼자 시작해도 되고, 스터디 팀을 만들어 팀원과 함께 운영할 수도 있습니다.',
    detail: '공개 팀 목록을 통해 현재 운영 중인 팀을 둘러보고, 내 학습 스타일에 맞는 구성을 참고할 수 있습니다.',
  },
  {
    icon: Settings2,
    title: '2. 추천 기준을 설정합니다',
    description: '난이도, 알고리즘 태그, 문제 수, 운영 요일을 팀 상황에 맞게 조정합니다.',
    detail: '설정이 정리되면 매일 무엇을 풀지 고민하는 시간을 줄이고, 팀 전체 기준도 자연스럽게 맞출 수 있습니다.',
  },
  {
    icon: BellRing,
    title: '3. 오늘의 문제와 알림으로 루틴을 만듭니다',
    description: '정해진 흐름에 따라 오늘의 문제를 확인하고, 이메일 알림으로 학습을 놓치지 않게 돕습니다.',
    detail: '문제 확인과 풀이 시작이 하나의 루틴으로 연결되도록 화면 구성을 단순하게 유지하고 있습니다.',
  },
  {
    icon: ChartColumn,
    title: '4. 진행 현황을 함께 확인합니다',
    description: '활동 보드와 통계 화면에서 팀원별 진행 상태를 확인하며 스터디 속도를 맞춥니다.',
    detail: '누가 어떤 문제를 해결했는지 매일 쌓이는 흐름을 보는 것이 핵심이며, 과도한 관리 대신 가벼운 점검을 목표로 합니다.',
  },
];

const tips = [
  '처음에는 문제 수를 적게 두고 주 2~3회 리듬부터 만드는 편이 안정적입니다.',
  '팀 설명에 목표와 진행 기간을 적어두면 공개 팀 탐색에서 이해하기 쉽습니다.',
  '혼자 사용하는 경우에도 오늘의 문제와 최근 활동 화면만으로 학습 기록 관리에 도움이 됩니다.',
];

export default function GuidePage() {
  useDocumentTitle('이용 가이드');

  return (
    <Layout showFooter>
      <div className="px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
        <div className="max-w-5xl mx-auto space-y-8 sm:space-y-10">
          <section className="rounded-3xl border border-gray-200 bg-white p-7 sm:p-10">
            <p className="text-sm font-semibold tracking-[0.24em] text-blue-600 uppercase">Guide</p>
            <h1 className="mt-3 text-3xl sm:text-5xl font-bold tracking-tight text-gray-900">
              CodeMate를 사용하는 가장 기본적인 흐름
            </h1>
            <p className="mt-5 max-w-3xl text-base sm:text-lg leading-8 text-gray-600">
              기능을 많이 익히기보다, 팀 운영과 개인 학습이 어떻게 이어지는지만 먼저 이해하면 충분합니다.
              아래 순서대로 보면 현재 서비스 구조를 빠르게 파악할 수 있습니다.
            </p>
          </section>

          <section className="space-y-4">
            {steps.map(({ icon: Icon, title, description, detail }) => (
              <article
                key={title}
                className="rounded-3xl border border-gray-200 bg-white p-6 sm:p-8 shadow-sm shadow-gray-100"
              >
                <div className="flex flex-col gap-5 sm:flex-row sm:items-start">
                  <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-blue-50 text-blue-600">
                    <Icon className="h-5 w-5" />
                  </div>
                  <div className="flex-1">
                    <h2 className="text-xl font-semibold text-gray-900">{title}</h2>
                    <p className="mt-2 text-sm sm:text-base leading-7 text-gray-700">{description}</p>
                    <p className="mt-3 text-sm sm:text-base leading-7 text-gray-600">{detail}</p>
                  </div>
                </div>
              </article>
            ))}
          </section>

          <section className="grid gap-6 lg:grid-cols-[0.95fr_1.05fr]">
            <aside className="rounded-3xl bg-blue-600 p-7 sm:p-8 text-white">
              <h2 className="text-2xl font-bold">처음 사용할 때 권장하는 방식</h2>
              <p className="mt-4 text-sm sm:text-base leading-7 text-blue-50">
                처음부터 복잡한 규칙을 넣기보다 팀 목표와 난이도 범위만 정하고 시작하는 편이 좋습니다.
                실제 운영 중에 문제 수나 태그를 조정하는 쪽이 훨씬 자연스럽습니다.
              </p>
            </aside>

            <article className="rounded-3xl border border-gray-200 bg-white p-7 sm:p-8">
              <h2 className="text-2xl font-bold text-gray-900">운영 팁</h2>
              <ul className="mt-5 space-y-3 text-sm sm:text-base leading-7 text-gray-600">
                {tips.map((tip) => (
                  <li key={tip} className="flex gap-3">
                    <span className="mt-2 h-2 w-2 flex-shrink-0 rounded-full bg-blue-500" />
                    <span>{tip}</span>
                  </li>
                ))}
              </ul>
            </article>
          </section>
        </div>
      </div>
    </Layout>
  );
}
