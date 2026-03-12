import { ExternalLink, Github, Mail, MessageSquare, NotebookPen } from 'lucide-react';
import Layout from '../../components/common/Layout';
import useDocumentTitle from '../../hooks/useDocumentTitle';

const channels = [
  {
    icon: Mail,
    title: '이메일 문의',
    description: '서비스 문의, 계정 관련 요청, 운영 관련 제안은 이메일로 받고 있습니다.',
    action: 'codemate.study.official@gmail.com',
    href: 'mailto:codemate.study.official@gmail.com',
  },
  {
    icon: MessageSquare,
    title: '피드백 폼',
    description: '사용 중 불편했던 점이나 필요한 기능 제안은 간단한 폼으로 남길 수 있습니다.',
    action: '피드백 보내기',
    href: 'https://forms.gle/F1DsQs64bsWUQXgy6',
  },
  {
    icon: Github,
    title: 'GitHub',
    description: '프로젝트 정보와 공개 저장소는 GitHub에서 확인할 수 있습니다.',
    action: 'github.com/codemate-kr',
    href: 'https://github.com/codemate-kr',
  },
];

export default function ContactPage() {
  useDocumentTitle('문의 및 운영 정보');

  return (
    <Layout showFooter>
      <div className="px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
        <div className="max-w-5xl mx-auto space-y-8 sm:space-y-10">
          <section className="rounded-3xl border border-gray-200 bg-white p-7 sm:p-10">
            <p className="text-sm font-semibold tracking-[0.24em] text-blue-600 uppercase">Contact</p>
            <h1 className="mt-3 text-3xl sm:text-5xl font-bold tracking-tight text-gray-900">
              문의와 운영 정보를
              <br />
              한곳에서 확인할 수 있습니다
            </h1>
            <p className="mt-5 max-w-3xl text-base sm:text-lg leading-8 text-gray-600">
              CodeMate는 알고리즘 학습 흐름을 다듬는 데 집중하고 있으며, 서비스 운영과 관련된 문의는
              아래 채널로 받고 있습니다. 계정, 기능, 제안, 오류 제보 모두 같은 흐름으로 확인합니다.
            </p>
          </section>

          <section className="grid gap-4 lg:grid-cols-3">
            {channels.map(({ icon: Icon, title, description, action, href }) => (
              <article
                key={title}
                className="rounded-3xl border border-gray-200 bg-white p-6 shadow-sm shadow-gray-100"
              >
                <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-blue-50 text-blue-600">
                  <Icon className="h-5 w-5" />
                </div>
                <h2 className="mt-4 text-lg font-semibold text-gray-900">{title}</h2>
                <p className="mt-2 text-sm leading-7 text-gray-600">{description}</p>
                <a
                  href={href}
                  target={href.startsWith('http') ? '_blank' : undefined}
                  rel={href.startsWith('http') ? 'noopener noreferrer' : undefined}
                  className="mt-5 inline-flex items-center text-sm font-semibold text-blue-700 hover:text-blue-800"
                >
                  {action}
                  <ExternalLink className="ml-2 h-4 w-4" />
                </a>
              </article>
            ))}
          </section>

          <section className="grid gap-6 lg:grid-cols-[0.95fr_1.05fr]">
            <article className="rounded-3xl bg-gray-900 p-7 sm:p-8 text-white">
              <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-white/10 text-blue-300">
                <NotebookPen className="h-5 w-5" />
              </div>
              <h2 className="mt-4 text-2xl font-bold">운영 메모</h2>
              <p className="mt-4 text-sm sm:text-base leading-7 text-gray-300">
                현재 CodeMate는 알고리즘 학습과 스터디 운영을 더 단순하게 정리하는 방향으로 기능을
                개선하고 있습니다. 무리하게 많은 기능을 붙이기보다, 실제로 자주 쓰는 흐름을 안정적으로
                다듬는 것을 우선순위로 두고 있습니다.
              </p>
            </article>

            <article className="rounded-3xl border border-gray-200 bg-white p-7 sm:p-8">
              <h2 className="text-2xl font-bold text-gray-900">자주 오는 문의</h2>
              <div className="mt-5 space-y-5">
                <div>
                  <h3 className="text-base font-semibold text-gray-900">백준 핸들 변경 문의</h3>
                  <p className="mt-2 text-sm sm:text-base leading-7 text-gray-600">
                    계정 정보와 연동 상태에 따라 확인이 필요할 수 있어 이메일 문의를 권장합니다.
                  </p>
                </div>
                <div>
                  <h3 className="text-base font-semibold text-gray-900">기능 제안</h3>
                  <p className="mt-2 text-sm sm:text-base leading-7 text-gray-600">
                    피드백 폼이나 이메일로 제안을 남기면 운영 중 우선순위를 검토합니다.
                  </p>
                </div>
                <div>
                  <h3 className="text-base font-semibold text-gray-900">오류 제보</h3>
                  <p className="mt-2 text-sm sm:text-base leading-7 text-gray-600">
                    문제가 발생한 화면과 상황을 함께 보내주면 확인이 훨씬 빠릅니다.
                  </p>
                </div>
              </div>
            </article>
          </section>
        </div>
      </div>
    </Layout>
  );
}
