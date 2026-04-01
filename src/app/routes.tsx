import { createBrowserRouter, Navigate, Outlet } from "react-router";
import DashboardPage from "./pages/DashboardPage";
import BorrowerProfilePage from "./pages/BorrowerProfilePage";
import DriverManagement from './pages/DriverManagement';
import RiskAssessmentPage from "./pages/RiskAssessmentPage";
import TripHistoryPage from "./pages/TripHistoryPage";
import AdminPanelPage from "./pages/AdminPanelPage";
import SettingsPage from "./pages/SettingsPage";
import LoginPage from "./pages/LoginPage";
import RootLayout from "./layouts/RootLayout";
import { useAuth } from "./AuthProvider";

// Inline Protected Route Component
function ProtectedWrapper() {
  const { session, isLoading } = useAuth();

  // Show a blank loading screen while checking auth state
  if (isLoading) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="w-12 h-12 bg-blue-600 rounded-2xl animate-bounce shadow-xl" />
          <p className="text-slate-400 font-bold uppercase tracking-widest text-xs animate-pulse">Authenticating...</p>
        </div>
      </div>
    );
  }

  // If no active session, boot them to the login page
  if (!session) {
    return <Navigate to="/login" replace />;
  }

  // If authenticated, render the layout (sidebar) and the pages inside it
  return (
    <RootLayout>
      <Outlet />
    </RootLayout>
  );
}

export const router = createBrowserRouter([
  {
    path: "/login",
    Component: LoginPage, // The public login page
  },
  {
    path: "/",
    Component: ProtectedWrapper, // The bouncer that protects everything inside
    children: [
      {
        index: true,
        Component: DashboardPage,
      },
      {
        path: "risk-assessment",
        Component: RiskAssessmentPage,
      },
      {
        path: "trip-history",
        Component: TripHistoryPage,
      },
      {
        path: "admin-panel",
        Component: AdminPanelPage,
      },
      {
        path: "settings",
        Component: SettingsPage,
      },
      {
        path: "borrower/:id",
        Component: BorrowerProfilePage,
      },
      {
        path: "driver-management",
        Component: DriverManagement,
      },
      {
        path: "*",
        Component: () => <Navigate to="/" replace />,
      },
    ],
  },
]);
