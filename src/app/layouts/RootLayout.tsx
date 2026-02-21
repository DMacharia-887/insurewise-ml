import { Outlet } from "react-router";
import { Sidebar } from "../components/Sidebar";
import { Toaster } from "sonner";

export default function RootLayout() {
  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 font-sans selection:bg-blue-100 selection:text-blue-900">
      <div className="flex">
        <Sidebar />
        <main className="flex-1 p-4 md:p-8 max-h-screen overflow-y-auto">
          <Outlet />
        </main>
      </div>
      <Toaster position="top-right" richColors />
    </div>
  );
}
