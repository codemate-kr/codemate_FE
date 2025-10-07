import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Toaster } from 'react-hot-toast';
import { validateEnv } from './config/env';
import Layout from './components/common/Layout';
import ProtectedRoute from './components/auth/ProtectedRoute';
import AuthHandler from './components/auth/AuthHandler';
import AuthInitializer from './components/auth/AuthInitializer';
import HomePage from './pages/home/HomePage';
import LoginPage from './pages/auth/LoginPage';
import DashboardPage from './pages/dashboard/DashboardPage';
import TeamsPage from './pages/teams/TeamsPage';
import TeamDetailPage from './pages/teams/TeamDetailPage';
import ProblemsPage from './pages/problems/ProblemsPage';
import VerifyHandlePage from './pages/auth/VerifyHandlePage';
import OpenStudyPage from './pages/open-study/OpenStudyPage';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1,
      refetchOnWindowFocus: false,
    },
  },
});

// 환경변수 검증
validateEnv();

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthInitializer>
        <Router>
          <AuthHandler />
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route
              path="/verify-handle"
              element={
                <ProtectedRoute>
                  <VerifyHandlePage />
                </ProtectedRoute>
              }
            />
            <Route
              path="/*"
              element={
                <Layout>
                  <Routes>
                    <Route path="/login" element={<LoginPage />} />
                    <Route
                      path="/dashboard"
                      element={
                        <ProtectedRoute>
                          <DashboardPage />
                        </ProtectedRoute>
                      }
                    />
                    <Route
                      path="/teams"
                      element={
                        <ProtectedRoute>
                          <TeamsPage />
                        </ProtectedRoute>
                      }
                    />
                    <Route
                      path="/teams/:teamId"
                      element={
                        <ProtectedRoute>
                          <TeamDetailPage />
                        </ProtectedRoute>
                      }
                    />
                    <Route
                      path="/problems"
                      element={
                        <ProtectedRoute>
                          <ProblemsPage />
                        </ProtectedRoute>
                      }
                    />
                    <Route
                      path="/open-study"
                      element={
                        <ProtectedRoute>
                          <OpenStudyPage />
                        </ProtectedRoute>
                      }
                    />
                    {/* 기존 /groups 경로를 /teams로 리다이렉트
                    <Route path="/groups" element={<Navigate to="/teams" replace />} />
                    <Route path="/groups/:groupId" element={<Navigate to="/teams" replace />} /> */}
                    {/* 없는 경로는 홈으로 리다이렉트 */}
                    <Route path="*" element={<Navigate to="/" replace />} />
                  </Routes>
                </Layout>
              }
            />
          </Routes>
        </Router>
        <Toaster position="top-right" />
      </AuthInitializer>
    </QueryClientProvider>
  );
}

export default App;
