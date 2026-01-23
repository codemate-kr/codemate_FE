# 보안 규칙

## 환경 변수
- API 키, 시크릿은 `.env` 파일에만 저장
- 코드에 하드코딩 절대 금지
- `VITE_` 접두사 필수 (Vite 환경변수 노출용)

## API 통신
- 모든 인증 필요 요청은 `apiClient` 사용 (토큰 자동 주입)
- `withCredentials: true` 필요 시 명시적 설정

## 민감 정보
- 사용자 토큰을 `console.log`로 출력 금지
- 에러 메시지에 스택 트레이스 노출 금지

## XSS 방지
- `dangerouslySetInnerHTML` 사용 시 반드시 sanitize
- 사용자 입력값 직접 렌더링 금지
