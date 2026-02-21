import { 
  TrendingUp, 
  TrendingDown, 
  Users, 
  AlertTriangle, 
  CheckCircle2, 
  Search, 
  Filter, 
  ArrowUpRight,
  MoreVertical,
  Activity,
  ShieldAlert,
  Calendar,
  DollarSign,
  MapPin,
  Clock,
  Navigation
} from "lucide-react";
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer, 
  LineChart, 
  Line, 
  AreaChart, 
  Area,
  PieChart,
  Pie,
  Cell
} from "recharts";
import { Link } from "react-router";
import { motion as Motion } from "motion/react";
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

const DASHBOARD_STATS = [
  { label: "Active Policies", value: "12,482", icon: Users, color: "blue" },
  { label: "Pending Reviews", value: "248", icon: Clock, color: "amber" },
  { label: "Avg. Risk Score", value: "74.8", icon: Activity, color: "green" },
  { label: "High Risk Flags", value: "15", icon: AlertTriangle, color: "red" },
];

const RECENT_ASSESSMENTS = [
  { id: "1", name: "Mwangi Kamau", score: 88, risk: "Low", date: "10 mins ago" },
  { id: "2", name: "Aisha Mohammed", score: 94, risk: "Minimal", date: "1h ago" },
  { id: "3", name: "Peter Onyango", score: 45, risk: "High", date: "2h ago" },
  { id: "4", name: "Brian Kipchirchir", score: 29, risk: "Critical", date: "4h ago" },
];

export default function DashboardPage() {
  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
      <header className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-4xl font-black text-slate-900 tracking-tight">Dashboard Overview</h1>
          <p className="text-slate-500 font-medium mt-1">Real-time summary of active policies, risk assessments, and pending actions.</p>
        </div>
        <div className="flex gap-3">
           <button className="bg-white border border-slate-200 px-4 py-2.5 rounded-xl font-bold text-slate-700 flex items-center gap-2 hover:bg-slate-50 transition-colors shadow-sm">
             <Calendar size={18} />
             <span>Feb 21, 2026</span>
           </button>
        </div>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        {DASHBOARD_STATS.map((stat, i) => (
          <div key={i} className="bg-white p-6 rounded-3xl shadow-sm border border-slate-100 relative overflow-hidden group">
            <div className={`absolute top-0 right-0 w-24 h-24 bg-${stat.color}-50 rounded-full -mr-12 -mt-12 group-hover:scale-110 transition-transform duration-500 opacity-50`} />
            <div className="relative z-10">
              <div className={`w-12 h-12 rounded-2xl bg-${stat.color}-50 text-${stat.color}-600 flex items-center justify-center mb-4`}>
                <stat.icon size={24} />
              </div>
              <p className="text-xs font-bold text-slate-400 uppercase tracking-widest leading-none mb-1">{stat.label}</p>
              <h3 className="text-3xl font-black text-slate-900">{stat.value}</h3>
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-8">
           <div className="bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-sm">
              <div className="flex items-center justify-between mb-8">
                 <h3 className="text-2xl font-black text-slate-900 tracking-tight">Recent Risk Assessments</h3>
                 <Link to="/risk-assessment" className="text-sm font-bold text-blue-600 hover:underline">View All Assessments</Link>
              </div>
              <div className="space-y-4">
                 {RECENT_ASSESSMENTS.map((ra) => (
                   <div key={ra.id} className="flex items-center justify-between p-4 bg-slate-50 rounded-2xl hover:bg-slate-100 transition-colors">
                      <div className="flex items-center gap-4">
                         <div className={cn(
                           "w-10 h-10 rounded-xl flex items-center justify-center font-black text-sm",
                           ra.score > 80 ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"
                         )}>
                            {ra.score}
                         </div>
                         <div>
                            <p className="font-bold text-slate-900">{ra.name}</p>
                            <p className="text-xs font-bold text-slate-400">{ra.date}</p>
                         </div>
                      </div>
                      <div className="flex items-center gap-6">
                         <span className={cn(
                           "px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest",
                           ra.score > 80 ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"
                         )}>
                           {ra.risk}
                         </span>
                         <Link to={`/borrower/${ra.id}`} className="p-2 text-slate-400 hover:text-blue-600 transition-colors">
                            <ArrowUpRight size={18} />
                         </Link>
                      </div>
                   </div>
                 ))}
              </div>
           </div>

           <div className="bg-slate-900 rounded-[2.5rem] p-10 text-white relative overflow-hidden group">
              <div className="absolute top-0 right-0 p-12 bg-blue-600/20 rounded-full blur-3xl -mr-20 -mt-20 group-hover:scale-125 transition-transform duration-1000" />
              <div className="relative z-10 flex flex-col md:flex-row items-center gap-8">
                 <div className="flex-1">
                    <h3 className="text-3xl font-black mb-4">ML Fleet Monitoring</h3>
                    <p className="text-slate-400 font-medium leading-relaxed mb-6">
                      Our real-time driving behavior model is currently processing data from 12,482 connected devices across Kenya.
                    </p>
                    <div className="flex gap-4">
                       <div className="px-4 py-2 bg-white/10 rounded-xl border border-white/10">
                          <p className="text-[10px] font-black text-blue-400 uppercase tracking-widest mb-1">Model Precision</p>
                          <p className="text-xl font-black">94.2%</p>
                       </div>
                       <div className="px-4 py-2 bg-white/10 rounded-xl border border-white/10">
                          <p className="text-[10px] font-black text-green-400 uppercase tracking-widest mb-1">Active Streams</p>
                          <p className="text-xl font-black">3,840/s</p>
                       </div>
                    </div>
                 </div>
                 <div className="w-full md:w-auto">
                    <button className="w-full md:w-auto bg-blue-600 text-white px-8 py-4 rounded-2xl font-black text-sm uppercase tracking-widest hover:bg-blue-700 transition-all shadow-lg shadow-blue-900/40">
                       Open Live Map
                    </button>
                 </div>
              </div>
           </div>
        </div>

        <div className="space-y-8">
           <div className="bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-sm">
              <h3 className="text-xl font-black text-slate-900 mb-6">Pending Reviews</h3>
              <div className="space-y-4">
                 {[
                   { type: "Critical Speeding", count: 8, severity: "high" },
                   { type: "Fraud Probability Alert", count: 3, severity: "high" },
                   { type: "Manual Rating Override", count: 12, severity: "medium" },
                   { type: "Hardware Tamper Detect", count: 2, severity: "high" },
                 ].map((pending, i) => (
                   <div key={i} className="flex items-center justify-between p-4 border border-slate-50 rounded-2xl hover:border-slate-200 transition-all cursor-pointer">
                      <div>
                         <p className="text-sm font-bold text-slate-800">{pending.type}</p>
                         <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">
                            {pending.count} items pending
                         </p>
                      </div>
                      <div className={cn(
                        "w-2 h-2 rounded-full",
                        pending.severity === 'high' ? "bg-red-500 animate-pulse" : "bg-amber-500"
                      )} />
                   </div>
                 ))}
              </div>
              <button className="w-full mt-6 bg-slate-900 text-white py-4 rounded-2xl font-black text-sm uppercase tracking-widest hover:bg-blue-600 transition-all">
                 Review Queue
              </button>
           </div>

           <div className="bg-blue-50 border border-blue-100 p-8 rounded-[2.5rem] relative overflow-hidden group">
              <Navigation className="absolute -bottom-4 -right-4 text-blue-100 w-32 h-32 rotate-12 group-hover:scale-110 transition-transform duration-700" />
              <div className="relative z-10">
                 <h3 className="text-xl font-black text-blue-900 mb-2">Fleet Velocity</h3>
                 <p className="text-blue-700 font-medium text-sm mb-4 leading-relaxed">Average trip distance is up 12% this week across Nairobi Industrial Area.</p>
                 <Link to="/trip-history" className="inline-flex items-center gap-2 text-xs font-black text-blue-600 uppercase tracking-widest group-hover:translate-x-1 transition-transform">
                    View Trip Logs <ArrowUpRight size={14} />
                 </Link>
              </div>
           </div>
        </div>
      </div>
    </div>
  );
}
