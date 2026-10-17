import { createBrowserRouter } from 'react-router-dom';

// Layouts
import { AppLayout } from '../layouts/AppLayout';
import { AuthLayout } from '../layouts/AuthLayout';

// Pages
import LandingPage from '../pages/LandingPage';
import LoginPage from '../pages/LoginPage';
import RegisterPage from '../pages/RegisterPage';
import DashboardPage from '../pages/DashboardPage';
import UploadPDFPage from '../pages/UploadPDFPage';
import ChatPage from '../pages/ChatPage';
import SummaryPage from '../pages/SummaryPage';
import QuizPage from '../pages/QuizPage';
import FlashcardsPage from '../pages/FlashcardsPage';
import PlannerPage from '../pages/PlannerPage';
import AnalyticsPage from '../pages/AnalyticsPage';
import ProfilePage from '../pages/ProfilePage';
import SettingsPage from '../pages/SettingsPage';
import NotFoundPage from '../pages/NotFoundPage';

export const router = createBrowserRouter([
  // ── Landing ──
  { path: '/', element: <LandingPage /> },

  // ── Auth (split screen layout) ──
  {
    element: <AuthLayout />,
    children: [
      { path: '/login', element: <LoginPage /> },
      { path: '/register', element: <RegisterPage /> },
    ],
  },

  // ── App (sidebar + navbar layout) ──
  {
    element: <AppLayout />,
    children: [
      { path: '/dashboard', element: <DashboardPage /> },
      { path: '/upload', element: <UploadPDFPage /> },
      { path: '/chat', element: <ChatPage /> },
      { path: '/summary', element: <SummaryPage /> },
      { path: '/quiz', element: <QuizPage /> },
      { path: '/flashcards', element: <FlashcardsPage /> },
      { path: '/planner', element: <PlannerPage /> },
      { path: '/analytics', element: <AnalyticsPage /> },
      { path: '/profile', element: <ProfilePage /> },
      { path: '/settings', element: <SettingsPage /> },
    ],
  },

  // ── 404 ──
  { path: '*', element: <NotFoundPage /> },
]);
