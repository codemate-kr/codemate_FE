# 📚 StudyHelper

**함께 성장하는 알고리즘 스터디 플랫폼**

StudyHelper는 개발자들이 알고리즘 문제를 체계적으로 학습하고, 팀원들과 함께 성장할 수 있도록 돕는 스터디 관리 플랫폼입니다.

## ✨ 주요 기능

### 👥 **스터디 팀 관리**
- **팀 생성 및 참여**: 관심사가 비슷한 사람들과 스터디 팀을 만들어보세요
- **팀원 초대**: 이메일로 간편하게 팀원을 초대할 수 있어요
- **역할 관리**: 팀장과 팀원 역할을 통한 체계적인 팀 운영

### 📋 **문제 추천 시스템**
- **자동 문제 추천**: 팀 리더가 설정한 요일에 맞춰 알고리즘 문제를 자동으로 추천받으세요
- **난이도 맞춤**: 팀원들의 실력에 맞는 적절한 난이도의 문제를 제공해요
- **진행률 추적**: 팀원들의 문제 해결 현황을 한눈에 확인할 수 있어요

### 🔐 **간편한 인증**
- **Google 로그인**: 별도 회원가입 없이 Google 계정으로 빠르게 시작하세요
- **BOJ 연동**: 백준 온라인 저지 계정을 연결하여 문제 해결 이력을 동기화해요
- **자동 로그인**: 한 번 로그인하면 편리하게 서비스를 이용할 수 있어요

### 📊 **학습 현황 관리**
- **개인 대시보드**: 나의 학습 진도와 성과를 시각적으로 확인하세요
- **팀 현황**: 팀원들의 학습 현황을 공유하며 서로 동기부여를 받아요
- **주간 리포트**: 일주일 동안의 학습 성과를 정리해서 보여드려요

## 🎯 **이런 분들께 추천해요**

- 🧑‍💻 **알고리즘 공부를 시작하는 개발자**
- 👥 **함께 공부할 동료가 필요한 분**
- 📈 **체계적으로 실력을 향상시키고 싶은 분**
- 🏆 **코딩테스트를 준비하는 취준생/개발자**

## 🚀 **시작하기**

1. **Google 계정으로 로그인**
2. **BOJ 계정 연동**
3. **스터디 팀 생성 또는 참여**
4. **문제 추천 설정**
5. **함께 성장하기! 🎉**

---

## 🛠️ 개발자를 위한 설정 가이드

### Environment Setup

#### 1. Environment Variables

Copy the example environment file and configure your settings:

```bash
cp .env.example .env
```

Configure the following variables in your `.env` file:

```env
# API Configuration
VITE_API_BASE_URL=http://localhost:8080/api

# Google OAuth Configuration
VITE_GOOGLE_CLIENT_ID=your_google_client_id_here

# Environment Configuration
VITE_NODE_ENV=development

# App Configuration
VITE_APP_TITLE=StudyHelper
VITE_APP_DESCRIPTION=Algorithm Study Helper Platform

# Debugging
VITE_DEBUG_MODE=true
```

#### 2. Production Environment

For production deployment, create a `.env.production` file based on `.env.production.example`:

```bash
cp .env.production.example .env.production
```

Update the production values accordingly.

### Getting Started

#### Installation

```bash
npm install
```

#### Development

```bash
npm run dev
```

#### Build

```bash
npm run build
```

#### Preview Production Build

```bash
npm run preview
```

### 🔧 기술 스택

- **Frontend**: React 18 + TypeScript
- **Build Tool**: Vite
- **Styling**: Tailwind CSS
- **State Management**: Zustand
- **HTTP Client**: Axios
- **Icons**: Lucide React
- **Notifications**: React Hot Toast
- **Data Fetching**: TanStack Query

### 📁 프로젝트 구조

```
src/
├── api/           # API 호출 함수들
├── components/    # 재사용 가능한 컴포넌트들
├── config/        # 환경변수 및 설정
├── hooks/         # 커스텀 훅들
├── pages/         # 페이지 컴포넌트들
├── store/         # 전역 상태 관리
├── types/         # TypeScript 타입 정의
└── utils/         # 유틸리티 함수들
```

