# /add-api [도메인] [메서드명]

API 모듈에 새로운 메서드를 추가합니다.

## 대상 파일

```
src/api/[도메인].ts
```

- teams → `src/api/teams.ts`
- member → `src/api/member.ts`
- recommendation → `src/api/recommendation.ts`

## 메서드 템플릿

```typescript
// GET 요청
getById: async (id: number): Promise<ResponseType> => {
  const response = await apiClient.get<ApiResponse<ResponseType>>(
    `/endpoint/${id}`
  );
  return response.data.data;
},

// POST 요청
create: async (data: RequestType): Promise<ResponseType> => {
  const response = await apiClient.post<ApiResponse<ResponseType>>(
    '/endpoint',
    data
  );
  return response.data.data;
},

// PUT 요청
update: async (id: number, data: RequestType): Promise<ResponseType> => {
  const response = await apiClient.put<ApiResponse<ResponseType>>(
    `/endpoint/${id}`,
    data
  );
  return response.data.data;
},

// DELETE 요청
delete: async (id: number): Promise<void> => {
  await apiClient.delete(`/endpoint/${id}`);
},
```

## 규칙
- `apiClient` 사용 필수 (raw axios 금지)
- Generic으로 `ApiResponse<T>` 타입 지정
- `response.data.data`로 실제 데이터 반환
- 타입은 `src/types/` 또는 같은 파일에 정의

## 사용법
```
/add-api teams getMembers
/add-api member updateProfile
```
