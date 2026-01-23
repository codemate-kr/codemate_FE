# API 연동 규칙

## 최신 API 스펙 확인

**Swagger/OpenAPI로 최신 API 확인**:
- 개발: `http://localhost:8080/v3/api-docs`
- 운영: `https://api.codemate.kr/v3/api-docs` (있다면)

> 아래 엔드포인트 목록은 참고용. 정확한 스펙은 Swagger 확인

## 기본 원칙

**항상 `apiClient` 사용** (raw axios 금지)
- 자동 토큰 주입
- 401 시 자동 토큰 갱신
- Request Queue 패턴으로 중복 갱신 방지

**예외**: `/auth/refresh`만 raw axios 사용 (인터셉터 우회)

## API 모듈 패턴

객체 기반으로 구성:
```typescript
// src/api/teams.ts
export const teamsApi = {
  getMyTeams: async (): Promise<MyTeamResponse[]> => {
    const response = await apiClient.get<ApiResponse<MyTeamResponse[]>>('/teams/my');
    return response.data.data;
  },
};
```

**호출 방식**: `teamsApi.getMyTeams()`, `memberApi.getMe()`

## 응답 형식

```typescript
interface ApiResponse<T> {
  data: T;        // 실제 데이터
  message: string;
  status: string;
}
```

**데이터 접근**: `response.data.data` (이중 .data)

## 엔드포인트 목록

### Auth

| 메서드 | 경로 | 설명 |
|--------|------|------|
| POST | `/auth/refresh` | 토큰 갱신 (httpOnly 쿠키) |
| POST | `/auth/logout` | 로그아웃 |

### Teams

| 메서드 | 경로 | 설명 |
|--------|------|------|
| POST | `/teams` | 팀 생성 |
| GET | `/teams/my` | 내 팀 목록 |
| GET | `/teams/{id}/members` | 팀 멤버 조회 |
| GET | `/teams/{id}/recommendation-settings` | 추천 설정 조회 |
| PUT | `/teams/{id}/recommendation-settings` | 추천 설정 수정 |
| DELETE | `/teams/{id}/recommendation-settings` | 추천 비활성화 |
| POST | `/teams/{id}/invite` | 멤버 초대 |
| DELETE | `/teams/{id}/members/{userId}` | 멤버 제거 |
| POST | `/teams/{id}/leave` | 팀 탈퇴 |

### Member

| 메서드 | 경로 | 설명 |
|--------|------|------|
| GET | `/member/me` | 내 프로필 |
| POST | `/member/me/verify-solvedac` | BOJ 핸들 인증 |
| GET | `/member/search?handle=...` | 핸들로 검색 |

### Recommendation

| 메서드 | 경로 | 설명 |
|--------|------|------|
| GET | `/recommendation/team/{teamId}/today-problem` | 오늘의 문제 |
| POST | `/teams/{teamId}/today-problems/refresh` | 문제 새로고침 |
