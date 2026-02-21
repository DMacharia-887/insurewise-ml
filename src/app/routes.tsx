import { createBrowserRouter, Navigate } from "react-router";
import DashboardPage from "./pages/DashboardPage";
import BorrowerProfilePage from "./pages/BorrowerProfilePage";
import RiskAssessmentPage from "./pages/RiskAssessmentPage";
import TripHistoryPage from "./pages/TripHistoryPage";
import AdminPanelPage from "./pages/AdminPanelPage";
import SettingsPage from "./pages/SettingsPage";
import RootLayout from "./layouts/RootLayout";

export const router = createBrowserRouter([
  {
    path: "/",
    Component: RootLayout,
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
        path: "*",
        Component: () => <Navigate to="/" replace />,
      },
    ],
  },
]);
