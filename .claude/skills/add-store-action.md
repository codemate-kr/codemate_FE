# /add-store-action [스토어] [액션명]

Zustand 스토어에 새로운 액션을 추가합니다.

## 대상 파일

```
src/store/[스토어]Store.ts
```

- team → `src/store/teamStore.ts`
- auth → `src/store/authStore.ts`

## 액션 템플릿

### 비동기 액션 (API 호출)
```typescript
fetchSomething: async (id: number) => {
  try {
    set({ loading: true, error: null });
    const data = await someApi.get(id);
    set({ data, lastFetched: Date.now() });
  } catch (error: any) {
    console.error('로딩 실패:', error);
    const errorMessage = error?.response?.data?.message || '데이터를 불러오는데 실패했습니다.';
    set({ error: errorMessage });
  } finally {
    set({ loading: false });
  }
},
```

### 동기 액션 (상태 업데이트)
```typescript
updateSomething: (value: ValueType) => {
  set((state) => ({
    data: state.data ? { ...state.data, value } : null,
  }));
},
```

## Selector 훅 추가

스토어 하단에 selector 훅도 함께 추가:
```typescript
export const useSomething = () => useStore((state) => state.something);
export const useSomethingLoading = () => useStore((state) => state.loading);
```

## 규칙
- try-catch-finally 패턴 사용
- 에러 메시지는 한글로
- loading, error 상태 관리
- Selector 훅 export

## 사용법
```
/add-store-action team fetchTeamStats
/add-store-action auth updateProfile
```
