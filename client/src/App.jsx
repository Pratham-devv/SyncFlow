import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from './context/AuthContext';
import AppShell from './components/layout/AppShell';
import AuthPage from './pages/AuthPage';
import DashboardPage from './pages/DashboardPage';
import ProjectsPage from './pages/ProjectsPage';
import ProjectDetailsPage from './pages/ProjectDetailsPage';
import TasksPage from './pages/TasksPage';

// Protected route wrapper
const ProtectedRoute = ({ children }) => {
  const { user, loading } = useAuth();
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <div className="text-slate-400 text-sm">Loading…</div>
      </div>
    );
  }
  return user ? children : <Navigate to="/auth" replace />;
};

// Guest-only route
const GuestRoute = ({ children }) => {
  const { user, loading } = useAuth();
  if (loading) return null;
  return user ? <Navigate to="/" replace /> : children;
};

// Placeholder page
const PlaceholderPage = ({ name }) => (
  <div className="flex-1 flex items-center justify-center text-center p-8">
    <div>
      <div className="w-16 h-16 rounded-2xl bg-slate-100 flex items-center justify-center mx-auto mb-4">
        <span className="text-2xl">🚧</span>
      </div>
      <h3
        className="font-bold text-slate-700 text-lg mb-2"
        style={{ fontFamily: 'var(--font-heading)' }}
      >
        {name}
      </h3>
      <p className="text-slate-400 text-sm">This section is coming soon.</p>
    </div>
  </div>
);

const AppRoutes = () => (
  <Routes>
    <Route
      path="/auth"
      element={
        <GuestRoute>
          <AuthPage />
        </GuestRoute>
      }
    />
    <Route
      path="/*"
      element={
        <ProtectedRoute>
          <AppShell>
            <Routes>
              <Route path="/" element={<DashboardPage />} />
              <Route path="/projects" element={<ProjectsPage />} />
              <Route path="/projects/:id" element={<ProjectDetailsPage />} />
              <Route path="/tasks" element={<TasksPage />} />
              <Route path="/settings" element={<PlaceholderPage name="Settings" />} />
              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
          </AppShell>
        </ProtectedRoute>
      }
    />
  </Routes>
);

const App = () => (
  <BrowserRouter>
    <AppRoutes />
  </BrowserRouter>
);

export default App;
