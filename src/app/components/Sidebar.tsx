import { Link, useLocation } from "react-router";
import { 
  LayoutDashboard, 
  Users, 
  ShieldCheck, 
  Settings, 
  LogOut, 
  ChevronRight,
  Menu,
  X,
  FileText,
  ShieldAlert,
  Navigation,
  Sliders
} from "lucide-react";
import { useState } from "react";
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function Sidebar() {
  const location = useLocation();
  const [isOpen, setIsOpen] = useState(false);
  const toggleSidebar = () => setIsOpen(!isOpen);

  const adminLinks = [
    { href: "/", icon: LayoutDashboard, label: "Dashboard" },
    { href: "/borrower/1", icon: Users, label: "Borrower Profile" },
    { href: "/risk-assessment", icon: ShieldCheck, label: "Risk Assessment" },
    { href: "/trip-history", icon: Navigation, label: "Trip History" },
    { href: "/admin-panel", icon: Sliders, label: "Admin Panel" },
    { href: "/settings", icon: Settings, label: "Settings" },
  ];

  return (
    <>
      {/* Mobile Toggle */}
      <button 
        onClick={toggleSidebar}
        className="fixed top-4 left-4 z-50 p-2 bg-white rounded-lg shadow-md md:hidden border border-slate-200"
      >
        {isOpen ? <X size={20} /> : <Menu size={20} />}
      </button>

      {/* Sidebar Overlay */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-slate-900/50 z-40 md:hidden backdrop-blur-sm"
          onClick={toggleSidebar}
        />
      )}

      {/* Sidebar Content */}
      <aside className={cn(
        "fixed md:sticky top-0 left-0 z-40 h-screen w-64 bg-white border-r border-slate-200 transition-transform duration-300 ease-in-out flex flex-col",
        isOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0"
      )}>
        <div className="p-8">
          <Link to="/" className="flex items-center gap-2 group">
            <div className="bg-blue-600 p-2.5 rounded-xl group-hover:rotate-6 transition-transform">
              <ShieldCheck className="text-white h-6 w-6" />
            </div>
            <span className="font-bold text-xl tracking-tight text-slate-900">InsureWise</span>
          </Link>
        </div>

        <nav className="flex-1 px-4 space-y-1 overflow-y-auto">
          <div className="mb-4">
            <p className="px-4 mb-2 text-xs font-black text-slate-400 uppercase tracking-widest">
              Underwriter Portal
            </p>
          </div>
          {adminLinks.map((link) => (
            <Link
              key={link.href}
              to={link.href}
              onClick={() => setIsOpen(false)}
              className={cn(
                "flex items-center gap-3 px-4 py-3.5 rounded-xl transition-all group duration-200",
                location.pathname === link.href 
                  ? "bg-blue-50 text-blue-600 shadow-sm" 
                  : "text-slate-500 hover:bg-slate-50 hover:text-slate-900"
              )}
            >
              <link.icon className={cn(
                "h-5 w-5",
                location.pathname === link.href ? "text-blue-600" : "text-slate-400 group-hover:text-slate-600"
              )} />
              <span className="font-bold text-[14px]">{link.label}</span>
              {location.pathname === link.href && (
                <ChevronRight className="ml-auto h-4 w-4" />
              )}
            </Link>
          ))}
        </nav>

        <div className="p-4 mt-auto border-t border-slate-50">
          <div className="bg-slate-50 p-4 rounded-2xl mb-4 border border-slate-100">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-xl bg-blue-100 flex items-center justify-center text-blue-700 font-black border border-blue-200">
                JD
              </div>
              <div className="overflow-hidden">
                <p className="text-sm font-black text-slate-900 truncate">John Doe</p>
                <p className="text-xs font-bold text-slate-500 truncate uppercase tracking-tight">Lead Underwriter</p>
              </div>
            </div>
          </div>
          <button 
            className="flex items-center gap-3 px-4 py-3 rounded-xl text-red-500 hover:bg-red-50 transition-colors w-full group"
          >
            <LogOut className="h-5 w-5 group-hover:-translate-x-1 transition-transform" />
            <span className="font-bold text-[14px]">Sign Out</span>
          </button>
        </div>
      </aside>
    </>
  );
}
