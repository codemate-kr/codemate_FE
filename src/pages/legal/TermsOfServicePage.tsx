import { FileText } from 'lucide-react';
import useDocumentTitle from '../../hooks/useDocumentTitle';

export default function TermsOfServicePage() {
  useDocumentTitle('이용약관');

  return (
    <div className="px-4 sm:px-6 lg:px-8 py-8">
      <div className="max-w-4xl mx-auto">
        {/* 헤더 */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-4">
            <div className="h-12 w-12 rounded-lg bg-blue-100 flex items-center justify-center">
              <FileText className="h-6 w-6 text-blue-600" />
            </div>
            <div>
              <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">
                이용약관
              </h1>
              <p className="text-sm text-gray-500 mt-1">
                최종 변경일: 2025년 1월 23일
              </p>
            </div>
          </div>
          <p className="text-gray-600">
            CodeMate 서비스 이용에 관한 기본적인 사항을 규정합니다.
          </p>
        </div>

        {/* 본문 */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="divide-y divide-gray-100">
            {/* 1. 목적 */}
            <section className="p-6">
              <h2 className="text-lg font-bold text-gray-900 mb-4">
                1. 목적
              </h2>
              <p className="text-sm text-gray-600">
                본 약관은 CodeMate(이하 "서비스")가 제공하는 알고리즘 학습 및 스터디 관리 서비스의
                이용조건 및 절차, 회원과 서비스 간의 권리, 의무 및 책임사항을 규정하는 것을 목적으로 합니다.
              </p>
            </section>

            {/* 2. 용어 정의 */}
            <section className="p-6">
              <h2 className="text-lg font-bold text-gray-900 mb-4">
                2. 용어 정의
              </h2>
              <div className="space-y-3">
                <div className="flex items-start gap-3">
                  <div className="h-2 w-2 rounded-full bg-blue-600 mt-2 flex-shrink-0"></div>
                  <div>
                    <p className="text-sm font-medium text-gray-900">"서비스"</p>
                    <p className="text-sm text-gray-600">
                      CodeMate가 제공하는 알고리즘 문제 추천, 스터디 팀 관리, 학습 진도 추적 등의 기능을 포함한 모든 서비스
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="h-2 w-2 rounded-full bg-blue-600 mt-2 flex-shrink-0"></div>
                  <div>
                    <p className="text-sm font-medium text-gray-900">"회원"</p>
                    <p className="text-sm text-gray-600">
                      본 약관에 동의하고 서비스에 가입하여 서비스를 이용하는 사용자
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="h-2 w-2 rounded-full bg-blue-600 mt-2 flex-shrink-0"></div>
                  <div>
                    <p className="text-sm font-medium text-gray-900">"팀"</p>
                    <p className="text-sm text-gray-600">
                      회원이 생성하거나 가입한 알고리즘 스터디 그룹
                    </p>
                  </div>
                </div>
              </div>
            </section>

            {/* 3. 회원 가입 및 탈퇴 */}
            <section className="p-6">
              <h2 className="text-lg font-bold text-gray-900 mb-4">
                3. 회원 가입 및 탈퇴
              </h2>
              <div className="space-y-4">
                <div>
                  <p className="text-sm font-medium text-gray-900 mb-2">가입 조건</p>
                  <ul className="list-disc list-inside text-sm text-gray-600 space-y-1 ml-2">
                    <li>본 약관에 동의한 만 14세 이상의 개인</li>
                    <li>Google 계정을 통한 인증 필수</li>
                    <li>백준 온라인 저지(BOJ) 핸들 등록 필수 (solved.ac 연동)</li>
                  </ul>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-900 mb-2">탈퇴</p>
                  <p className="text-sm text-gray-600">
                    회원은 언제든지 마이페이지에서 탈퇴할 수 있습니다.
                    탈퇴 시 개인정보는 즉시 삭제되며, 복구가 불가능합니다.
                  </p>
                </div>
              </div>
            </section>

            {/* 4. 서비스 제공 */}
            <section className="p-6">
              <h2 className="text-lg font-bold text-gray-900 mb-4">
                4. 서비스 제공
              </h2>
              <p className="text-sm text-gray-600 mb-3">
                CodeMate는 다음과 같은 서비스를 제공합니다:
              </p>
              <ul className="list-disc list-inside text-sm text-gray-600 space-y-2 ml-2">
                <li>백준 온라인 저지(BOJ) 및 solved.ac 기반 알고리즘 문제 추천</li>
                <li>스터디 팀 생성 및 관리</li>
                <li>팀원 간 학습 진도 공유 및 추적</li>
                <li>solved.ac 티어 기반 난이도별 맞춤 문제 추천</li>
                <li>문제 풀이 현황 통계 제공</li>
              </ul>
              <div className="mt-4 bg-amber-50 border border-amber-200 rounded-lg p-4">
                <p className="text-sm text-amber-900">
                  <strong>서비스 중단:</strong> 서비스는 시스템 점검, 업데이트, 긴급 보안 조치 등을 위해 일시적으로 중단될 수 있으며, 이 경우 사전 공지합니다.
                </p>
              </div>
            </section>

            {/* 5. 회원의 의무 */}
            <section className="p-6">
              <h2 className="text-lg font-bold text-gray-900 mb-4">
                5. 회원의 의무
              </h2>
              <p className="text-sm text-gray-600 mb-3">
                회원은 다음 행위를 해서는 안 됩니다:
              </p>
              <div className="space-y-2">
                <div className="flex items-start gap-2 text-sm text-gray-600">
                  <span className="text-red-500 font-bold">✗</span>
                  <p>타인의 개인정보 도용 또는 허위 정보 등록</p>
                </div>
                <div className="flex items-start gap-2 text-sm text-gray-600">
                  <span className="text-red-500 font-bold">✗</span>
                  <p>서비스의 정상적인 운영을 방해하는 행위</p>
                </div>
                <div className="flex items-start gap-2 text-sm text-gray-600">
                  <span className="text-red-500 font-bold">✗</span>
                  <p>불법적인 목적으로 서비스를 이용하는 행위</p>
                </div>
                <div className="flex items-start gap-2 text-sm text-gray-600">
                  <span className="text-red-500 font-bold">✗</span>
                  <p>서비스의 자동화된 시스템을 부정하게 이용하는 행위</p>
                </div>
                <div className="flex items-start gap-2 text-sm text-gray-600">
                  <span className="text-red-500 font-bold">✗</span>
                  <p>타 회원에게 불쾌감을 주거나 명예를 훼손하는 행위</p>
                </div>
              </div>
            </section>

            {/* 6. 저작권 및 지적재산권 */}
            <section className="p-6">
              <h2 className="text-lg font-bold text-gray-900 mb-4">
                6. 저작권 및 지적재산권
              </h2>
              <p className="text-sm text-gray-600 mb-3">
                서비스에서 제공하는 콘텐츠의 저작권은 다음과 같이 귀속됩니다:
              </p>
              <div className="space-y-3">
                <div className="p-3 bg-gray-50 border border-gray-200 rounded-lg">
                  <p className="text-sm font-medium text-gray-900 mb-1">서비스 UI/UX</p>
                  <p className="text-xs text-gray-600">CodeMate에 귀속</p>
                </div>
                <div className="p-3 bg-gray-50 border border-gray-200 rounded-lg">
                  <p className="text-sm font-medium text-gray-900 mb-1">알고리즘 문제 및 데이터</p>
                  <p className="text-xs text-gray-600">백준 온라인 저지(BOJ), solved.ac 및 원저작자에 귀속</p>
                </div>
                <div className="p-3 bg-gray-50 border border-gray-200 rounded-lg">
                  <p className="text-sm font-medium text-gray-900 mb-1">사용자 생성 콘텐츠</p>
                  <p className="text-xs text-gray-600">해당 회원에게 귀속</p>
                </div>
              </div>
            </section>

            {/* 7. 책임의 제한 */}
            <section className="p-6">
              <h2 className="text-lg font-bold text-gray-900 mb-4">
                7. 책임의 제한
              </h2>
              <p className="text-sm text-gray-600 mb-3">
                CodeMate는 다음의 경우 책임을 지지 않습니다:
              </p>
              <ul className="list-disc list-inside text-sm text-gray-600 space-y-2 ml-2">
                <li>천재지변 또는 이에 준하는 불가항력으로 인한 서비스 중단</li>
                <li>회원의 귀책사유로 인한 서비스 이용 장애</li>
                <li>제3자(백준 온라인 저지, solved.ac 등) 서비스의 장애로 인한 문제</li>
                <li>회원이 서비스를 통해 얻은 정보의 정확성 및 신뢰도</li>
                <li>회원 간 또는 회원과 제3자 간의 분쟁</li>
              </ul>
            </section>

            {/* 8. 개인정보 보호 */}
            <section className="p-6">
              <h2 className="text-lg font-bold text-gray-900 mb-4">
                8. 개인정보 보호
              </h2>
              <p className="text-sm text-gray-600">
                서비스는 회원의 개인정보를 보호하기 위해 개인정보처리방침을 수립하고 준수합니다.
                자세한 내용은{' '}
                <a href="/privacy-policy" className="text-blue-600 hover:text-blue-700 font-medium">
                  개인정보처리방침
                </a>
                에서 확인할 수 있습니다.
              </p>
            </section>

            {/* 9. 약관 변경 */}
            <section className="p-6">
              <h2 className="text-lg font-bold text-gray-900 mb-4">
                9. 약관 변경
              </h2>
              <p className="text-sm text-gray-600 mb-3">
                CodeMate는 필요한 경우 관련 법령을 위배하지 않는 범위에서 본 약관을 변경할 수 있습니다.
              </p>
              <div className="space-y-2 text-sm text-gray-600 ml-2">
                <p>• 약관 변경 시 시행일 <strong className="text-gray-900">최소 7일 전</strong>에 서비스 내 공지사항을 통해 사전 고지합니다.</p>
                <p>• 회원에게 불리한 중요 내용 변경 시에는 <strong className="text-gray-900">30일 전</strong>에 이메일 또는 서비스 내 알림으로 개별 통지합니다.</p>
                <p>• 변경된 약관은 시행일 이후 계속 서비스를 이용하는 경우 동의한 것으로 간주됩니다.</p>
                <p>• 변경 내용에 동의하지 않는 회원은 서비스 이용을 중단하고 탈퇴할 수 있습니다.</p>
              </div>
            </section>

            {/* 10. 분쟁 해결 */}
            <section className="p-6 bg-gray-50">
              <h2 className="text-lg font-bold text-gray-900 mb-4">
                10. 분쟁 해결
              </h2>
              <div className="bg-white border border-gray-200 rounded-lg p-4">
                <p className="text-sm text-gray-600 mb-3">
                  서비스 이용과 관련하여 분쟁이 발생한 경우, 다음의 절차를 따릅니다:
                </p>
                <div className="space-y-2">
                  <div className="flex items-start gap-3">
                    <div className="h-6 w-6 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center text-xs font-bold flex-shrink-0">
                      1
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-900">협의</p>
                      <p className="text-xs text-gray-600">회원과 서비스 간의 상호 협의로 해결</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="h-6 w-6 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center text-xs font-bold flex-shrink-0">
                      2
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-900">중재</p>
                      <p className="text-xs text-gray-600">협의가 어려운 경우 관련 법률에 따른 중재 기관 이용</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="h-6 w-6 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center text-xs font-bold flex-shrink-0">
                      3
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-900">관할 법원</p>
                      <p className="text-xs text-gray-600">대한민국 법률을 준거법으로 하며, 관할 법원은 민사소송법에 따름</p>
                    </div>
                  </div>
                </div>
              </div>
            </section>

            {/* 문의 정보 */}
            <section className="p-6 bg-blue-50">
              <h2 className="text-lg font-bold text-gray-900 mb-4">
                문의
              </h2>
              <div className="bg-white border border-blue-200 rounded-lg p-4">
                <p className="text-sm text-gray-600 mb-3">
                  본 약관에 대한 문의사항이 있으시면 아래로 연락주시기 바랍니다.
                </p>
                <p className="text-sm">
                  <strong className="text-gray-900">이메일:</strong>
                  <a href="mailto:codemate.study.official@gmail.com" className="text-blue-600 hover:text-blue-700 ml-2">
                    codemate.study.official@gmail.com
                  </a>
                </p>
              </div>
            </section>
          </div>
        </div>

        {/* 푸터 정보 */}
        <div className="mt-6 text-center text-sm text-gray-500">
          <p>본 이용약관은 2025년 1월 23일에 최종 변경되었습니다.</p>
        </div>
      </div>
    </div>
  );
}
