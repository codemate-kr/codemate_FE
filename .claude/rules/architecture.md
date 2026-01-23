# 아키텍처 규칙

## 상태 관리 (Zustand)

**Store 구조**
- `authStore`: 인증 상태 + 토큰 관리
- `teamStore`: 팀 데이터 + 5분 캐싱

**필수 패턴**
- Selector 훅 사용: `useTeams()` (O), `useTeamStore(state => state.teams)` (X)
- 순환 참조 방지: `authStore.logout()`에서 teamStore는 동적 import
```typescript
import('./teamStore').then(({ useTeamStore }) => {
  useTeamStore.getState().reset();
});
```

**캐싱**
```typescript
const CACHE_DURATION = 5 * 60 * 1000; // 5분
fetchTeams({ forceRefresh: true }); // 캐시 무시
```

## 인증 흐름

1. Google OAuth → 백엔드 → `/?access_token=xyz`로 리다이렉트
2. `AuthHandler`가 토큰 추출 → `authStore.login()` 저장
3. BOJ 핸들 없으면 `/verify-handle`로 이동
4. 401 발생 시 → `/auth/refresh` 호출 → 실패 시 로그아웃

## 라우팅

**ProtectedRoute 체크 항목**
- `isAuthenticated` 여부
- `user.handle` 존재 여부 (BOJ 핸들 필수)

## 특수 패턴

**Selective Persist** (teamStore)
```typescript
partialize: (state) => ({
  teams: state.teams,
  teamsLastFetched: state.teamsLastFetched,
  // teamDetails는 캐시 안 함
}),
```

**Debounced Search** (300ms)
```typescript
useEffect(() => {
  const timer = setTimeout(() => {
    if (searchQuery.trim()) fetchMembers(searchQuery);
  }, 300);
  return () => clearTimeout(timer);
}, [searchQuery]);
```
