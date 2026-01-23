# React + TypeScript 코딩 스타일

## 컴포넌트 규칙
- 함수형 컴포넌트만 사용 (클래스 컴포넌트 금지)
- **Default Export 사용**: `export default function ComponentName()`
- Props 인터페이스 필수 정의
- 파일명: PascalCase (예: `TeamSettingsModal.tsx`)

## 폴더 구조
```
pages/[feature]/
├── [Feature]Page.tsx           # 페이지 컴포넌트
└── components/
    └── [ComponentName].tsx     # 하위 컴포넌트
```
- 페이지 전용 컴포넌트는 `pages/[feature]/components/`에 배치
- 공통 컴포넌트만 `components/common/`에 배치

## 파일 크기 제한
- 컴포넌트 파일: 최대 300줄
- 초과 시 `components/` 폴더에 서브 컴포넌트로 분리

## 상태 관리 (Zustand)
- Selector 훅 사용 필수: `useTeams()` (O), `useTeamStore(state => state.teams)` (X)
- Store 내 비동기 작업: try-catch + finally로 로딩 상태 관리
- 순환 참조 방지: 동적 import 사용 (`import('./teamStore').then(...)`)

## 비인증/데모 모드 처리
- 비인증 상태 기본 처리 패턴 유지
- 데모 모드 조건부 렌더링: `isDemo ? demoData : realData`

## 금지 사항
- `any` 타입 사용 금지
- `console.log` 커밋 금지 (디버깅 후 삭제)
- 인라인 스타일 금지 (Tailwind 클래스 사용)
