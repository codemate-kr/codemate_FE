# Git 워크플로우

## 커밋 메시지
- 한글 사용
- 접두사 필수: `feat:`, `fix:`, `refactor:`, `style:`, `docs:`, `test:`
- 예시: `feat: 팀 설정 모달 추가`

## 금지 사항
- `main` 브랜치에 직접 force push 금지
- `--no-verify` 옵션 사용 금지
- `git commit --amend` 사용 시 사용자 명시적 요청 필요
- **Co-Authored-By 라인 추가 금지** (커밋 메시지에 Claude 흔적 남기지 않음)

## PR 규칙
- PR 본문에 변경 사항 요약 포함
- 테스트 계획 명시
