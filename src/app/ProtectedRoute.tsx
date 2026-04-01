import { Navigate, Outlet } from "react-router";
import { useAuth } from "./AuthProvider";

export default function ProtectedRoute() {
  const { session, isLoading } = useAuth();

  // Show a loading screen while Supabase checks the local storage for tokens
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <div className="animate-pulse flex flex-col items-center">
          <div className="w-12 h-12 bg-blue-600 rounded-xl mb-4" />
          <p className="text-slate-400 font-bold tracking-widest uppercase text-xs">Authenticating...</p>
        </div>
      </div>
    );
  }

  // If no session exists, kick them to the login page
  if (!session) {
    return <Navigate to="/login" replace />;
  }

  // Otherwise, let them see the child routes (the dashboard)
  return <Outlet />;
}
