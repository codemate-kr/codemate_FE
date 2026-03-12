import { ArrowRight, BookOpen, Clock3, Mail, Users } from 'lucide-react';
import { Link } from 'react-router-dom';
import Layout from '../../components/common/Layout';
import usePageMeta from '../../hooks/usePageMeta';

const principles = [
  {
    icon: Users,
    title: '스터디 운영에 맞춘 흐름',
    description: '팀 생성, 멤버 관리, 공개 팀 탐색까지 스터디에 필요한 동선을 한곳에 모았습니다.',
  },
  {
    icon: BookOpen,
    title: '문제 선정 부담 완화',
    description: '난이도와 태그를 기준으로 매일 문제를 추천해 반복되는 선정 작업을 줄입니다.',
  },
  {
    icon: Clock3,
    title: '지속 가능한 학습 리듬',
    description: '오늘의 문제와 진행 현황을 함께 보여줘 스터디가 흐트러지지 않도록 돕습니다.',
  },
];

const highlights = [
  '혼자 또는 팀 단위로 알고리즘 학습 흐름을 정리할 수 있습니다.',
  'solved.ac 기반 데이터로 팀원 간 풀이 현황을 한눈에 확인할 수 있습니다.',
  '이메일 알림과 팀 활동 보드로 매일 학습 루틴을 이어가기 쉽습니다.',
];

export default function AboutPage() {
  usePageMeta({
    title: '서비스 소개',
    description: 'CodeMate가 어떤 문제를 해결하려는 서비스인지, 알고리즘 스터디 운영에 어떤 흐름을 제공하는지 소개합니다.',
    path: '/about',
  });

  return (
    <Layout showFooter>
      <div className="px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
        <div className="max-w-5xl mx-auto space-y-8 sm:space-y-12">
          <section className="overflow-hidden rounded-3xl border border-blue-100 bg-gradient-to-br from-blue-50 via-white to-sky-50">
            <div className="px-6 py-10 sm:px-10 sm:py-14">
              <p className="text-sm font-semibold tracking-[0.24em] text-blue-600 uppercase">About CodeMate</p>
              <h1 className="mt-3 text-3xl sm:text-5xl font-bold tracking-tight text-gray-900">
                알고리즘 스터디를
                <br />
                더 꾸준하게 운영하기 위한 공간
              </h1>
              <p className="mt-5 max-w-3xl text-base sm:text-lg leading-8 text-gray-600">
                CodeMate는 백준 스터디를 운영할 때 반복되는 문제 선정, 진행 확인, 팀원 간 공유를
                조금 더 단순하게 만들기 위해 시작한 서비스입니다. 학습 기록을 과하게 포장하기보다,
                매일 문제를 풀고 함께 확인하는 흐름 자체에 집중합니다.
              </p>

              <div className="mt-8 flex flex-wrap gap-3">
                <Link
                  to="/guide"
                  className="inline-flex items-center rounded-xl bg-blue-600 px-5 py-3 text-sm font-semibold text-white transition-colors hover:bg-blue-700"
                >
                  이용 가이드 보기
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
                <Link
                  to="/contact"
                  className="inline-flex items-center rounded-xl border border-gray-200 bg-white px-5 py-3 text-sm font-semibold text-gray-700 transition-colors hover:border-blue-200 hover:text-blue-700"
                >
                  문의 및 운영 정보
                </Link>
              </div>
            </div>
          </section>

          <section className="grid gap-4 sm:grid-cols-3">
            {principles.map(({ icon: Icon, title, description }) => (
              <article
                key={title}
                className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm shadow-gray-100"
              >
                <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-blue-50 text-blue-600">
                  <Icon className="h-5 w-5" />
                </div>
                <h2 className="mt-4 text-lg font-semibold text-gray-900">{title}</h2>
                <p className="mt-2 text-sm leading-7 text-gray-600">{description}</p>
              </article>
            ))}
          </section>

          <section className="grid gap-6 lg:grid-cols-[1.1fr_0.9fr]">
            <article className="rounded-3xl border border-gray-200 bg-white p-7 sm:p-8">
              <h2 className="text-2xl font-bold text-gray-900">무엇을 해결하려고 하나요</h2>
              <div className="mt-5 space-y-4 text-sm sm:text-base leading-8 text-gray-600">
                <p>
                  스터디를 오래 운영하다 보면 문제를 어떤 기준으로 고를지, 누가 어디까지 풀었는지,
                  오늘 학습이 실제로 진행됐는지를 매번 따로 확인해야 합니다. CodeMate는 이 과정을
                  한 화면에서 이어 보도록 설계했습니다.
                </p>
                <p>
                  팀별 추천 설정과 활동 보드를 통해 학습 리듬을 유지하고, 개인 학습에서도 하루 단위로
                  무엇을 할지 정리할 수 있게 돕습니다. 화려한 기능보다 매일 열어볼 수 있는 화면을
                  만드는 데 초점을 두고 있습니다.
                </p>
              </div>
            </article>

            <aside className="rounded-3xl bg-gray-900 p-7 sm:p-8 text-white">
              <h2 className="text-2xl font-bold">CodeMate의 기준</h2>
              <ul className="mt-5 space-y-3 text-sm sm:text-base leading-7 text-gray-300">
                {highlights.map((item) => (
                  <li key={item} className="flex gap-3">
                    <span className="mt-2 h-2 w-2 flex-shrink-0 rounded-full bg-blue-400" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </aside>
          </section>

          <section className="rounded-3xl border border-gray-200 bg-white p-7 sm:p-8">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
              <div>
                <h2 className="text-2xl font-bold text-gray-900">더 자세한 내용이 필요하다면</h2>
                <p className="mt-2 text-sm sm:text-base leading-7 text-gray-600">
                  이용 방식과 운영 정보를 각각 분리해두었습니다. 서비스 소개는 짧고 명확하게,
                  실제 사용 흐름은 별도 페이지에서 확인할 수 있습니다.
                </p>
              </div>
              <div className="flex flex-wrap gap-3">
                <Link
                  to="/guide"
                  className="inline-flex items-center rounded-xl border border-blue-200 bg-blue-50 px-4 py-2.5 text-sm font-semibold text-blue-700 transition-colors hover:bg-blue-100"
                >
                  <BookOpen className="mr-2 h-4 w-4" />
                  이용 가이드
                </Link>
                <Link
                  to="/contact"
                  className="inline-flex items-center rounded-xl border border-gray-200 px-4 py-2.5 text-sm font-semibold text-gray-700 transition-colors hover:border-gray-300 hover:bg-gray-50"
                >
                  <Mail className="mr-2 h-4 w-4" />
                  문의하기
                </Link>
              </div>
            </div>
          </section>
        </div>
      </div>
    </Layout>
  );
}
