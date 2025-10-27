import { FileText } from 'lucide-react';
import useDocumentTitle from '../../hooks/useDocumentTitle';

export default function PrivacyPolicyPage() {
  useDocumentTitle('개인정보처리방침');

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
                개인정보처리방침
              </h1>
              <p className="text-sm text-gray-500 mt-1">
                최종 변경일: 2025년 1월 23일
              </p>
            </div>
          </div>
          <p className="text-gray-600">
            CodeMate는 이용자의 개인정보를 소중히 다루며, 개인정보보호법을 준수합니다.
          </p>
        </div>

        {/* 본문 */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="divide-y divide-gray-100">
            {/* 1. 개인정보의 처리 목적 */}
            <section className="p-6">
              <h2 className="text-lg font-bold text-gray-900 mb-4">
                1. 개인정보의 처리 목적
              </h2>
              <p className="text-sm text-gray-600 mb-3">
                CodeMate는 다음 목적을 위해 개인정보를 처리합니다:
              </p>
              <ul className="list-disc list-inside text-sm text-gray-600 space-y-2 ml-2">
                <li>회원제 서비스 제공 및 회원 식별</li>
                <li>알고리즘 문제 추천 및 학습 진도 관리</li>
                <li>스터디 팀 관리 및 팀원 간 활동 공유</li>
                <li>서비스 개선 및 신규 기능 개발</li>
                <li>고객 문의 및 지원</li>
              </ul>
              <div className="mt-4 bg-blue-50 border border-blue-200 rounded-lg p-4">
                <p className="text-sm text-blue-900 mb-2">
                  <strong>수집 항목:</strong>
                </p>
                <ul className="text-sm text-blue-900 space-y-1 ml-4">
                  <li>• 필수: 이메일 (Google 계정 연동)</li>
                  <li>• 필수: 백준 온라인 저지(BOJ) 핸들</li>
                </ul>
              </div>
            </section>

            {/* 2. 자동으로 수집되는 정보 */}
            <section className="p-6">
              <h2 className="text-lg font-bold text-gray-900 mb-4">
                2. 자동으로 수집되는 정보
              </h2>
              <p className="text-sm text-gray-600 mb-3">
                서비스 이용 과정에서 아래 정보가 자동으로 생성되어 수집될 수 있습니다:
              </p>
              <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
                <div className="space-y-3">
                  <div>
                    <p className="text-sm font-medium text-gray-900 mb-1">쿠키 (Cookie)</p>
                    <p className="text-xs text-gray-600 mb-1">• 수집 항목: 리프레시 토큰 (httpOnly, Secure 쿠키)</p>
                    <p className="text-xs text-gray-600 mb-1">• 수집 목적: 로그인 상태 유지 및 자동 로그인</p>
                    <p className="text-xs text-gray-600">• 보유 기간: 로그아웃 시 또는 토큰 만료 시까지 (최대 14일)</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-900 mb-1">접속 로그</p>
                    <p className="text-xs text-gray-600 mb-1">• 수집 항목: IP 주소, 접속 시간, 서비스 이용 기록</p>
                    <p className="text-xs text-gray-600 mb-1">• 수집 목적: 부정 이용 방지, 서비스 개선</p>
                    <p className="text-xs text-gray-600">• 보유 기간: 3개월</p>
                  </div>
                </div>
              </div>
              <div className="mt-3 bg-amber-50 border border-amber-200 rounded-lg p-3">
                <p className="text-xs text-amber-900">
                  <strong>쿠키 거부 방법:</strong> 브라우저 설정을 통해 쿠키를 차단할 수 있으나, 이 경우 로그인 상태가 유지되지 않아 서비스 이용에 제한이 있을 수 있습니다.
                </p>
              </div>
            </section>

            {/* 3. 개인정보의 처리 및 보유기간 */}
            <section className="p-6">
              <h2 className="text-lg font-bold text-gray-900 mb-4">
                3. 개인정보의 처리 및 보유기간
              </h2>
              <div className="space-y-3">
                <div className="flex items-start gap-3">
                  <div className="h-2 w-2 rounded-full bg-blue-600 mt-2 flex-shrink-0"></div>
                  <div>
                    <p className="text-sm font-medium text-gray-900">회원 정보</p>
                    <p className="text-sm text-gray-600">회원 탈퇴 시까지</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="h-2 w-2 rounded-full bg-blue-600 mt-2 flex-shrink-0"></div>
                  <div>
                    <p className="text-sm font-medium text-gray-900">서비스 이용 기록</p>
                    <p className="text-sm text-gray-600">1년간 보관</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="h-2 w-2 rounded-full bg-blue-600 mt-2 flex-shrink-0"></div>
                  <div>
                    <p className="text-sm font-medium text-gray-900">로그인 기록</p>
                    <p className="text-sm text-gray-600">3개월간 보관 (통신비밀보호법)</p>
                  </div>
                </div>
              </div>
            </section>

            {/* 4. 개인정보의 제3자 제공 */}
            <section className="p-6">
              <h2 className="text-lg font-bold text-gray-900 mb-4">
                4. 개인정보의 제3자 제공
              </h2>
              <p className="text-sm text-gray-600 mb-4">
                CodeMate는 원칙적으로 이용자의 동의 없이 개인정보를 제3자에게 제공하지 않습니다.
                다만, 서비스 제공을 위해 아래와 같이 외부 서비스를 이용합니다:
              </p>
              <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
                <div className="space-y-3">
                  <div>
                    <p className="text-sm font-medium text-gray-900 mb-1">Google (OAuth 인증)</p>
                    <p className="text-xs text-gray-600 mb-1">• 제공 항목: 이메일</p>
                    <p className="text-xs text-gray-600 mb-1">• 제공 목적: 회원 가입 및 로그인 인증</p>
                    <p className="text-xs text-gray-600">• 보유 기간: 회원 탈퇴 시까지</p>
                  </div>
                </div>
              </div>
              <p className="text-sm text-gray-600 mt-4">
                이 외에 개인정보보호법 제17조, 18조에 해당하는 경우(법령에 의한 경우 등)에만 예외적으로 제공됩니다.
              </p>
            </section>

            {/* 5. 정보주체의 권리 */}
            <section className="p-6">
              <h2 className="text-lg font-bold text-gray-900 mb-4">
                5. 정보주체의 권리
              </h2>
              <p className="text-sm text-gray-600 mb-4">
                이용자는 언제든지 다음 권리를 행사할 수 있습니다:
              </p>
              <div className="space-y-3">
                <div className="flex items-start gap-3">
                  <div className="h-2 w-2 rounded-full bg-blue-600 mt-2 flex-shrink-0"></div>
                  <div>
                    <p className="text-sm font-medium text-gray-900">개인정보 열람 및 정정</p>
                    <p className="text-sm text-gray-600">마이페이지에서 직접 확인 및 수정 가능</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="h-2 w-2 rounded-full bg-blue-600 mt-2 flex-shrink-0"></div>
                  <div>
                    <p className="text-sm font-medium text-gray-900">회원 탈퇴 (동의 철회)</p>
                    <p className="text-sm text-gray-600">마이페이지에서 탈퇴 가능</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="h-2 w-2 rounded-full bg-blue-600 mt-2 flex-shrink-0"></div>
                  <div>
                    <p className="text-sm font-medium text-gray-900">개인정보 삭제 요청</p>
                    <p className="text-sm text-gray-600">
                      <a href="mailto:codemate.study.official@gmail.com" className="text-blue-600 hover:text-blue-700">
                        codemate.study.official@gmail.com
                      </a>
                      {' '}로 요청
                    </p>
                  </div>
                </div>
              </div>
            </section>

            {/* 6. 안전성 확보 조치 */}
            <section className="p-6">
              <h2 className="text-lg font-bold text-gray-900 mb-4">
                6. 안전성 확보 조치
              </h2>
              <p className="text-sm text-gray-600 mb-4">
                CodeMate는 개인정보 보호를 위해 다음과 같은 조치를 취하고 있습니다:
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="p-3 bg-gray-50 border border-gray-200 rounded-lg">
                  <p className="text-sm font-medium text-gray-900 mb-1">개인정보 암호화</p>
                  <p className="text-xs text-gray-600">비밀번호 등 중요 정보 암호화 저장</p>
                </div>
                <div className="p-3 bg-gray-50 border border-gray-200 rounded-lg">
                  <p className="text-sm font-medium text-gray-900 mb-1">해킹 대비</p>
                  <p className="text-xs text-gray-600">기술적 보안 대책 적용</p>
                </div>
                <div className="p-3 bg-gray-50 border border-gray-200 rounded-lg">
                  <p className="text-sm font-medium text-gray-900 mb-1">접근 제한</p>
                  <p className="text-xs text-gray-600">권한 관리 및 접근 통제</p>
                </div>
                <div className="p-3 bg-gray-50 border border-gray-200 rounded-lg">
                  <p className="text-sm font-medium text-gray-900 mb-1">직원 교육</p>
                  <p className="text-xs text-gray-600">취급 직원 최소화 및 정기 교육</p>
                </div>
              </div>
            </section>

            {/* 7. 개인정보 보호책임자 */}
            <section className="p-6 bg-gray-50">
              <h2 className="text-lg font-bold text-gray-900 mb-4">
                7. 개인정보 보호책임자
              </h2>
              <div className="bg-white border border-gray-200 rounded-lg p-4">
                <p className="text-sm text-gray-600 mb-3">
                  개인정보 처리에 관한 업무를 총괄하고, 불만처리 및 피해구제를 위해
                  개인정보보호 책임자를 지정하고 있습니다.
                </p>
                <div className="space-y-2">
                  <p className="text-sm">
                    <strong className="text-gray-900">담당자:</strong>
                    <span className="text-gray-600 ml-2">CodeMate 운영팀</span>
                  </p>
                  <p className="text-sm">
                    <strong className="text-gray-900">이메일:</strong>
                    <a href="mailto:codemate.study.official@gmail.com" className="text-blue-600 hover:text-blue-700 ml-2">
                      codemate.study.official@gmail.com
                    </a>
                  </p>
                </div>
              </div>
            </section>
          </div>
        </div>

        {/* 푸터 정보 */}
        <div className="mt-6 text-center text-sm text-gray-500">
          <p>본 개인정보처리방침은 2025년 1월 23일에 최종 변경되었습니다.</p>
        </div>
      </div>
    </div>
  );
}
