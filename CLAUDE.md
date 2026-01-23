# CLAUDE.md

## Project Overview

**CodeMate** - 알고리즘 스터디 관리 플랫폼 (React + TypeScript)
- 백준 온라인 저지(BOJ) 문제 자동 추천
- 팀 기반 학습 관리

## Essential Commands

```bash
npm run dev          # 개발 서버 (Vite)
npm run build        # 빌드 (tsc + vite)
npm run lint         # ESLint
```

## Environment Setup

```bash
cp .env.example .env
```

필수 변수:
- `VITE_API_BASE_URL` - 백엔드 API URL
- `VITE_GOOGLE_CLIENT_ID` - Google OAuth
- `VITE_OAUTH_BASE_URL` - OAuth URL

## Tech Stack

- React 19 + TypeScript 5.8
- Vite 7, Tailwind CSS 3.4
- Zustand 5 (상태 관리)
- React Router 7

## Backend API

**Swagger**: `http://localhost:8080/v3/api-docs`

API 변경 시 Swagger에서 최신 스펙 확인

## External Integrations

- **Google OAuth**: 백엔드 경유 인증
- **solved.ac API**: 티어 시스템 (1-30), `getTierName()`, `getTierColor()`

---

> 📁 상세 규칙은 `.claude/rules/` 참조
> - `architecture.md` - 상태 관리, 인증 흐름
> - `api-reference.md` - API 엔드포인트
> - `coding-style.md` - 코딩 스타일
> - `git-workflow.md` - 커밋 규칙
> - `security.md` - 보안 규칙
