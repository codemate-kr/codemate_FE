import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Toaster } from 'react-hot-toast';
import { validateEnv } from './config/env';
import Layout from './components/common/Layout';
import AuthHandler from './components/auth/AuthHandler';
import AuthInitializer from './components/auth/AuthInitializer';
import ChannelIOInitializer from './components/auth/ChannelIOInitializer';
import ProtectedRoute from './components/auth/ProtectedRoute';
import { LoginModalProvider } from './contexts/LoginModalContext';
import LoginModal from './components/auth/LoginModal';
import HomePage from './pages/home/HomePage';
import LoginPage from './pages/auth/LoginPage';
import DashboardPage from './pages/dashboard/DashboardPage';
import TeamsPage from './pages/teams/TeamsPage';
import TeamDetailPage from './pages/teams/teamDetail/TeamDetailPage';
import ProblemsPage from './pages/problems/ProblemsPage';
import VerifyHandlePage from './pages/auth/VerifyHandlePage';
import TeamListPage from './pages/teams/teamlist/TeamListPage';
import MyProfilePage from './pages/profile/MyProfilePage';
import VerifyEmailPage from './pages/auth/VerifyEmailPage';
import PrivacyPolicyPage from './pages/legal/PrivacyPolicyPage';
import TermsOfServicePage from './pages/legal/TermsOfServicePage';
import NotificationsPage from './pages/notifications/NotificationsPage';
import AboutPage from './pages/about/AboutPage';
import GuidePage from './pages/guide/GuidePage';
import ContactPage from './pages/contact/ContactPage';
import LabsPage from './pages/labs/LabsPage';

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
        <ChannelIOInitializer />
        <Router>
          <LoginModalProvider>
            <AuthHandler />
            <LoginModal />
            <Routes>
              <Route path="/" element={<HomePage />} />
              <Route path="/about" element={<AboutPage />} />
              <Route path="/guide" element={<GuidePage />} />
              <Route path="/contact" element={<ContactPage />} />
              <Route path="/verify-email" element={<VerifyEmailPage />} />
              <Route path="/privacy-policy" element={<PrivacyPolicyPage />} />
              <Route path="/terms-of-service" element={<TermsOfServicePage />} />
              <Route path="/verify-handle" element={<VerifyHandlePage />} />
              <Route
                path="/*"
                element={
                  <Layout>
                    <Routes>
                      <Route path="/login" element={<LoginPage />} />
                      <Route path="/dashboard" element={<DashboardPage />} />
                      <Route path="/teams" element={<TeamListPage />} />
                      <Route path="/teams/my" element={<TeamsPage />} />
                      <Route path="/teams/:teamId" element={<TeamDetailPage />} />
                      <Route path="/problems" element={<ProblemsPage />} />
                      <Route path="/labs" element={<LabsPage />} />
                      <Route path="/mypage" element={<ProtectedRoute><MyProfilePage /></ProtectedRoute>} />
                      <Route path="/notifications" element={<ProtectedRoute><NotificationsPage /></ProtectedRoute>} />
                      {/* 없는 경로는 홈으로 리다이렉트 */}
                      <Route path="*" element={<Navigate to="/" replace />} />
                    </Routes>
                  </Layout>
                }
              />
            </Routes>
          </LoginModalProvider>
        </Router>
        <Toaster position="top-right" />
      </AuthInitializer>
    </QueryClientProvider>
  );
}

export default App;
