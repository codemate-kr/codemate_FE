# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

**CodeMate** is an algorithm study management platform built with React + TypeScript. It helps developers systematically learn algorithms and grow together with team members through automated problem recommendations from Baekjoon Online Judge (BOJ).

## Essential Commands

### Development
```bash
npm run dev          # Start development server (Vite)
npm run build        # Type check (tsc -b) + production build
npm run preview      # Preview production build locally
npm run lint         # Run ESLint
```

### Environment Setup
1. Copy environment template: `cp .env.example .env`
2. Configure required variables in `.env`:
   - `VITE_API_BASE_URL` - Backend API URL (required)
   - `VITE_GOOGLE_CLIENT_ID` - Google OAuth client ID
   - `VITE_OAUTH_BASE_URL` - OAuth base URL
   - `VITE_NODE_ENV` - Environment (development/production)

## Core Architecture

### State Management Pattern

**Zustand with Persist Middleware**
- All stores use `persist` middleware for localStorage caching
- **authStore**: User authentication state with automatic token injection
- **teamStore**: Team data with 5-minute timestamp-based caching

**Critical: Store Integration Pattern**
- `authStore.logout()` uses dynamic import to reset `teamStore` (prevents circular dependency)
- Always use selector hooks (`useTeams()`, `useTeamsLoading()`) to prevent unnecessary re-renders
- API methods are integrated directly into stores (e.g., `fetchTeams()`, `createTeam()`)

**Caching Strategy**
```typescript
// teamStore uses timestamp-based cache invalidation
const CACHE_DURATION = 5 * 60 * 1000; // 5 minutes
fetchTeams({ forceRefresh: true }); // Skip cache
```

### API Client Architecture

**Axios Instance with Automatic Token Refresh** (`src/api/client.ts`)

**Request Interceptor:**
- Automatically injects Bearer token from `authStore` to all requests

**Response Interceptor (401 Handling):**
1. On 401 error, attempts token refresh via `/auth/refresh` endpoint
2. Uses request queue pattern to prevent duplicate refresh requests
3. On refresh success: Updates token in store, retries original request
4. On refresh failure: Calls server logout, clears client state, redirects to `/login`

**Important: Always use `apiClient` for API calls, never raw axios**, as it provides:
- Automatic token injection
- Token refresh on expiry
- Centralized error handling

### Folder Structure

```
src/
├── api/                    # API client & endpoint modules
│   ├── client.ts          # Axios instance with interceptors
│   ├── auth.ts            # Authentication endpoints
│   ├── teams.ts           # Team management endpoints
│   ├── problems.ts        # Problem-related endpoints
│   └── member.ts          # Member management endpoints
│
├── store/                 # Zustand state management
│   ├── authStore.ts       # Auth state (with dynamic teamStore reset)
│   └── teamStore.ts       # Team state (with 5-min caching)
│
├── pages/                 # Page components (hierarchical by feature)
│   ├── home/             # Landing page
│   ├── auth/             # Login, BOJ handle verification
│   ├── dashboard/        # User dashboard
│   ├── teams/            # Team list, detail, settings modal
│   └── problems/         # Problem list, custom tier modal
│
├── components/
│   ├── auth/             # Auth-related: AuthHandler, ProtectedRoute, AuthInitializer
│   └── common/           # Shared: Layout, Footer
│
├── config/
│   └── env.ts            # Environment variable configuration
│
├── types/                # TypeScript type definitions
├── hooks/                # Custom React hooks
└── utils/                # Utility functions
```

### Authentication Flow

**Step 1: Google OAuth Login**
- User clicks "Google로 로그인" button → Redirects to backend OAuth endpoint
- Backend exchanges code with Google → Returns access token in URL query param
- URL format: `/?access_token=xyz`

**Step 2: Token Extraction** (`hooks/useAuthToken.ts`)
- `AuthHandler` component runs on app mount
- Extracts token from URL: `urlParams.get('access_token')`
- Fetches user profile via `memberApi.getMe()`
- Stores both token and user in `authStore.login()`
- Cleans URL to hide token from browser
- Redirects to `/dashboard` or `/verify-handle` based on BOJ handle status

**Step 3: BOJ Handle Verification**
- If `user.handle` is missing, `ProtectedRoute` redirects to `/verify-handle`
- User enters Baekjoon handle → Verified via `memberApi.verifySolvedAc(handle)`
- Updates store with handle → Redirects to `/dashboard`

**Step 4: Token Storage & Auto-Injection**
- Access token: Stored in localStorage via Zustand persist
- Refresh token: httpOnly cookie (set by backend, managed automatically)
- `apiClient` request interceptor adds `Authorization: Bearer {token}` to all requests

**Step 5: Auto Token Refresh**
- On 401 response, interceptor:
  - Checks if already refreshing (prevents duplicate calls)
  - Calls `/auth/refresh` with `withCredentials: true` (sends httpOnly cookie)
  - Uses **request queue pattern** to hold failed requests
  - On success: Updates token in store, retries all queued requests
  - On failure: Calls `/auth/logout`, clears state, redirects to `/login`
- **Important**: Uses raw axios for `/auth/refresh` to bypass interceptor

**Step 6: App Initialization** (`components/auth/AuthInitializer.tsx`)
- On app mount: Sets token in apiClient if found in store
- Fetches fresh user profile to sync with server
- Shows loading screen until complete

**Step 7: Logout**
- Calls server `/auth/logout` (clears httpOnly cookie)
- Calls `authStore.logout()` which:
  - Removes token from apiClient
  - Clears auth state
  - Dynamically imports and resets teamStore (avoids circular dependency)
  - Redirects to `/login`

### Key Component Patterns

**Protected Routes** (`components/auth/ProtectedRoute.tsx`)
- Wraps routes requiring authentication
- Checks both `isAuthenticated` AND `user.handle` (ensures BOJ handle registered)
- Redirects to `/login` if not authenticated
- Redirects to `/verify-handle` if handle missing

**Auth Initializer** (`components/auth/AuthInitializer.tsx`)
- Wrapper around Router that runs on app mount
- Sets token in apiClient before routing starts
- Validates stored token and fetches user profile
- Shows loading screen during initialization

**Team Settings Modal** (`pages/teams/components/TeamSettingsModal.tsx` - 386 lines)
- Recommendation day selection (weekly schedule)
- Difficulty preset selection: EASY/NORMAL/HARD/CUSTOM
- Custom tier range with solved.ac tier levels (1-20)
- Uses `CustomTierModal` sub-component for tier range UI
- Integrates with `teamsApi.updateRecommendationSettings()`
- Calls `onShowToast(message: string)` on save

**Member Invite Modal** (`pages/teams/components/MemberInviteModal.tsx` - 329 lines)
- Searchable member lookup via `memberApi.getByHandle()`
- Debounced search (300ms timeout)
- Multi-select with deduplication
- Batch invite using `Promise.allSettled()` for parallel invitations
- Shows success/failure counts
- Handles "already member" errors gracefully

**Today Problems Component** (`pages/teams/components/TodayProblems.tsx` - 215 lines)
- Displays recommended problems from `/recommendation/team/{teamId}/today-problem`
- Shows problem metadata: title, tier, solved status, acceptance rate
- Refresh button (only visible for team leaders)
- Uses solved.ac tier utilities for display

### Git Workflow

**Commit Messages**: Use Korean
- Example: `feat: 오늘의 문제 UI 개선 및 상태관리 통합`
- Always include Co-Authored-By line:
  ```
  🤖 Generated with [Claude Code](https://claude.com/claude-code)

  Co-Authored-By: Claude <noreply@anthropic.com>
  ```

**Main Branch**: Currently `main` (check gitStatus for updates)

## Code Organization Rules

### File Size & Splitting Guidelines

**Maximum File Length**: ~300 lines of code
- If a component exceeds 300 lines, split it into smaller components
- Extract complex logic into custom hooks (`src/hooks/`)
- Move shared utilities to `src/utils/`
- Create sub-components in a `components/` folder next to the parent

**Example: Splitting a Large Page Component**
```
❌ Bad: 500-line TeamDetailPage.tsx

✅ Good:
pages/teams/
├── TeamDetailPage.tsx           # 150 lines - orchestration only
├── components/
│   ├── TeamSettingsModal.tsx    # 200 lines - settings UI
│   ├── TodayProblems.tsx        # 100 lines - problems section
│   └── MemberList.tsx           # 80 lines - member display
└── hooks/
    └── useTeamData.ts           # 50 lines - data fetching logic
```

### Package Structure Principles

**Hierarchical Organization by Feature**
- Group related files by feature/domain, not by file type
- Keep page-specific components close to their page
- Common components go in `components/common/`

**Correct Structure:**
```
✅ Feature-based (current pattern - keep this)
pages/teams/
├── TeamsPage.tsx
├── TeamDetailPage.tsx
└── components/
    └── TeamSettingsModal.tsx    # Only used in teams pages

❌ Type-based (avoid)
components/
├── TeamSettingsModal.tsx        # Hard to find, unclear ownership
└── TodayProblems.tsx
```

### Component Design Patterns

**Extract Reusable UI Components**
When the same UI pattern appears 3+ times:
```typescript
// ✅ Good: Extract to components/common/
export function Badge({ color, children }: BadgeProps) {
  return <span className={`px-3 py-1 rounded-full ${color}`}>{children}</span>
}
```

**Separate Business Logic from UI**
```typescript
// ✅ Good: Custom hook for logic
function useTeamMembers(teamId: number) {
  const [members, setMembers] = useState<Member[]>([]);
  // ... fetch logic
  return { members, loading, error };
}

// Component only handles rendering
function MemberList() {
  const { members, loading } = useTeamMembers(teamId);
  return <div>{/* render */}</div>
}
```

### Import Organization

**Import Order** (use this order in all files):
```typescript
// 1. External libraries
import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';

// 2. Internal absolute imports
import { useTeamStore } from '@/store/teamStore';
import { teamsApi } from '@/api/teams';

// 3. Relative imports
import { TeamSettingsModal } from './components/TeamSettingsModal';

// 4. Types
import type { TeamMember } from '@/types';
```

### Naming Conventions

**Files & Folders**
- Components: PascalCase (`TeamSettingsModal.tsx`)
- Utilities/Hooks: camelCase (`useTeamData.ts`, `formatDate.ts`)
- API modules: camelCase (`teams.ts`, `auth.ts`)
- Pages folder: lowercase (`pages/teams/`, `pages/dashboard/`)

**Code**
- React components: PascalCase (`TeamDetailPage`)
- Hooks: `use` prefix (`useTeamMembers`)
- API functions: camelCase (`getTeamMembers`, `createTeam`)
- Constants: UPPER_SNAKE_CASE (`CACHE_DURATION`, `API_BASE_URL`)

## Important Patterns & Gotchas

### DO's
- **Always read files before editing** (Edit tool requires prior Read)
- **Use selector hooks** for Zustand (`useTeams()` instead of direct store subscription)
- **Use apiClient** for all API calls (never raw axios)
- **Check cache before API calls** (`fetchTeams()` auto-checks 5-min cache)
- **Handle BOJ handle verification** (users must verify handle after Google login)
- **Split files over 300 lines** into smaller, focused components
- **Organize by feature** not by file type (keep related code together)
- **Extract repeated UI** into reusable components (3+ occurrences)

### DON'Ts
- **Never bypass apiClient** for authenticated requests (loses token refresh logic)
- **Never create circular imports** between stores (use dynamic import like authStore → teamStore)
- **Don't forget forceRefresh** when immediate data update is needed
- **Don't duplicate state** - use centralized stores
- **Don't create 500+ line files** - split into logical sub-components
- **Don't mix concerns** - separate business logic (hooks) from UI (components)

### Special Patterns to Know

**Dynamic Import for Circular Dependencies**
```typescript
// In authStore.ts logout action:
logout: () => {
  removeAuthToken();
  set({ user: null, token: null, isAuthenticated: false });
  // Avoid circular ref: authStore → teamStore
  import('./teamStore').then(({ useTeamStore }) => {
    useTeamStore.getState().reset();
  });
}
```

**Request Queue Pattern for Token Refresh**
- Response interceptor queues failed 401 requests while refreshing token
- Uses `isRefreshing` flag and `failedQueue` array
- All queued requests retry after token refresh succeeds

**Selective Persist in Zustand**
```typescript
// teamStore only caches essential data
persist(
  (set, get) => ({ /* store definition */ }),
  {
    name: 'team-store',
    partialize: (state) => ({
      teams: state.teams,
      teamsLastFetched: state.teamsLastFetched,
      currentTeamId: state.currentTeamId,
      // teamDetails NOT persisted - always fetched fresh
    }),
  }
)
```

**Debounced Search Pattern**
```typescript
// In MemberInviteModal.tsx - 300ms debounce
useEffect(() => {
  const timer = setTimeout(() => {
    if (searchQuery.trim()) {
      fetchMembers(searchQuery);
    }
  }, 300);
  return () => clearTimeout(timer);
}, [searchQuery]);
```

## Tech Stack

- **Frontend**: React 19 + TypeScript 5.8
- **Build**: Vite 7 + TSC
- **Styling**: Tailwind CSS 3.4
- **State**: Zustand 5 (with persist middleware)
- **Data Fetching**: TanStack Query 5 + Axios 1.12
- **Icons**: Lucide React
- **Notifications**: React Hot Toast
- **Routing**: React Router 7

## External Integrations

### Google OAuth
- Environment: `VITE_OAUTH_BASE_URL` (backend OAuth server)
- Flow: Frontend redirects to backend → Backend exchanges code with Google → Redirects back with token in URL

### Baekjoon Online Judge (BOJ)
- Handle verification: `memberApi.verifySolvedAc(handle)` queries BOJ via backend
- Required for all authenticated users (enforced by `ProtectedRoute`)
- Used for: User identification, problem solving progress tracking

### solved.ac API
- Tier system: 1-20 (Bronze V → Platinum I)
- Utilities: `getTierName(level)`, `getTierColor(level)` in `utils/tierUtils.ts`
- Used in: Custom tier modal, team recommendations, member profiles

## Backend API Endpoints Reference

```
/auth
  POST /auth/google                      # OAuth callback
  POST /auth/verify-boj                  # BOJ handle verification
  POST /auth/refresh                     # Token refresh (uses httpOnly cookie)
  POST /auth/logout                      # Logout (clears cookie)

/teams
  POST /teams                            # Create team
  GET /teams/my                          # List user's teams
  GET /teams/{id}/members                # Get team members
  GET /teams/{id}/recommendation-settings
  PUT /teams/{id}/recommendation-settings
  DELETE /teams/{id}/recommendation-settings
  POST /teams/{id}/invite                # Invite member
  DELETE /teams/{id}/members/{userId}
  POST /teams/{id}/leave

/member
  GET /member/me                         # Get current user profile
  POST /member/me/verify-solvedac
  POST /member/me/send-email-verification
  POST /member/verify-email
  GET /member/search?handle=...          # Search members by handle
  POST /member/check-email

/recommendation
  GET /recommendation/team/{teamId}/today-problem
  POST /teams/{teamId}/today-problems/refresh
```

**API Response Format:**
```typescript
interface ApiResponse<T> {
  data: T;        // Actual response data
  message: string;
  status: string;
}
```
