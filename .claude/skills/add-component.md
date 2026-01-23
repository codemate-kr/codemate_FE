# /add-component [페이지명] [컴포넌트명]

페이지 하위에 새로운 React 컴포넌트를 생성합니다.

## 생성 위치

```
src/pages/[페이지명]/components/[ComponentName].tsx
```

예시:
- `/add-component dashboard StatsCard` → `src/pages/dashboard/components/StatsCard.tsx`
- `/add-component teams MemberList` → `src/pages/teams/components/MemberList.tsx`

## 컴포넌트 템플릿

```tsx
interface [ComponentName]Props {
  // props 정의
}

export default function [ComponentName]({}: [ComponentName]Props) {
  return (
    <div>
      {/* 구현 */}
    </div>
  );
}
```

## 규칙
- **default export 사용** (`export default function`)
- Props 인터페이스 필수 정의
- 비인증 상태 처리 필요 시 `isAuthenticated`, `onLoginClick` props 추가

## 공통 컴포넌트인 경우

여러 페이지에서 사용하는 공통 컴포넌트는:
```
src/components/common/[ComponentName].tsx
```

## 사용법
```
/add-component dashboard StatsCard
/add-component teams TeamCard
/add-component common Badge      # 공통 컴포넌트
```
