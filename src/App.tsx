import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Toaster } from 'react-hot-toast';
import { validateEnv } from './config/env';
import Layout from './components/Layout';
import ProtectedRoute from './components/ProtectedRoute';
import AuthHandler from './components/AuthHandler';
import AuthInitializer from './components/AuthInitializer';
import HomePage from './pages/HomePage';
import LoginPage from './pages/LoginPage';
import DashboardPage from './pages/DashboardPage';
import TeamsPage from './pages/TeamsPage';
import TeamDetailPage from './pages/TeamDetailPage';
import ProblemsPage from './pages/ProblemsPage';

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
      <AuthInitializer />
      <Router>
        <AuthHandler />
        <Layout>
          <Routes>
            <Route path="/" element={<HomePage />} />
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
            {/* 기존 /groups 경로를 /teams로 리다이렉트 */}
            <Route path="/groups" element={<Navigate to="/teams" replace />} />
            <Route path="/groups/:groupId" element={<Navigate to="/teams" replace />} />
          </Routes>
        </Layout>
      </Router>
      <Toaster position="top-right" />
    </QueryClientProvider>
  );
}

export default App;
