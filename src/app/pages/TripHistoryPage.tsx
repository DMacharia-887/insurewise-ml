import { 
  Navigation, 
  Search, 
  Filter, 
  MapPin, 
  Clock, 
  ArrowUpRight, 
  AlertTriangle, 
  CheckCircle2,
  Calendar,
  Layers,
  Activity
} from "lucide-react";
import { Link } from "react-router";
import { motion as Motion } from "motion/react";
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

const TRIPS_DATA = [
  { id: "T-8291", driver: "Mwangi Kamau", route: "Thika → CBD", distance: "42.5 km", time: "1h 15m", risk: "Low", behavior: "Smooth", date: "Feb 21, 2026 08:42" },
  { id: "T-8290", driver: "Aisha Mohammed", route: "Nyali → Bamburi", distance: "12.8 km", time: "25m", risk: "Minimal", behavior: "Excellent", date: "Feb 21, 2026 07:15" },
  { id: "T-8289", driver: "Peter Onyango", route: "Kisumu → Eldoret", distance: "158 km", time: "3h 10m", risk: "High", behavior: "Aggressive", date: "Feb 20, 2026 19:42" },
  { id: "T-8288", driver: "Brian Kipchirchir", route: "Industrial Area → Karen", distance: "28.4 km", time: "55m", risk: "Moderate", behavior: "Erratic", date: "Feb 20, 2026 16:30" },
  { id: "T-8287", driver: "Faith Wambui", route: "Nakuru → Naivasha", distance: "72.1 km", time: "1h 40m", risk: "Low", behavior: "Consistent", date: "Feb 20, 2026 14:12" },
  { id: "T-8286", driver: "Zainab Ali", route: "CBD → Westlands", distance: "6.2 km", time: "15m", risk: "Minimal", behavior: "Smooth", date: "Feb 20, 2026 11:05" },
  { id: "T-8285", driver: "David Mutua", route: "Machakos → Nairobi", distance: "64.8 km", time: "1h 20m", risk: "Medium", behavior: "Inconsistent", date: "Feb 20, 2026 09:30" },
];

export default function TripHistoryPage() {
  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
      <header className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-4xl font-black text-slate-900 tracking-tight">Trip History</h1>
          <p className="text-slate-500 font-medium mt-1">Real-time log of all tracked driving sessions across the network.</p>
        </div>
        <div className="flex gap-3">
           <button className="bg-white border border-slate-200 px-4 py-2.5 rounded-xl font-bold text-slate-700 flex items-center gap-2 hover:bg-slate-50 transition-colors shadow-sm">
             <Layers size={18} />
             <span>Map Overlay</span>
           </button>
           <button className="bg-blue-600 text-white px-6 py-2.5 rounded-xl font-bold flex items-center gap-2 hover:bg-blue-700 transition-all shadow-lg shadow-blue-200">
             <Navigation size={18} />
             <span>Live Fleet</span>
           </button>
        </div>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {[
          { label: "Trips Today", value: "1,842", icon: Navigation, color: "blue" },
          { label: "Fleet Distance", value: "24,820 km", icon: Activity, color: "green" },
          { label: "Active Sessions", value: "312", icon: Clock, color: "amber" },
        ].map((stat, i) => (
          <div key={i} className="bg-white p-6 rounded-3xl shadow-sm border border-slate-100 flex items-center gap-4">
            <div className={`p-3 rounded-2xl bg-${stat.color}-50 text-${stat.color}-600`}>
              <stat.icon size={24} />
            </div>
            <div>
              <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">{stat.label}</p>
              <h3 className="text-2xl font-black text-slate-900">{stat.value}</h3>
            </div>
          </div>
        ))}
      </div>

      <div className="bg-white rounded-[2.5rem] shadow-sm border border-slate-100 overflow-hidden">
        <div className="p-8 border-b border-slate-50 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex gap-4">
            <div className="relative">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
              <input 
                type="text" 
                placeholder="Search by driver or route..." 
                className="pl-11 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-medium focus:outline-none focus:ring-2 focus:ring-blue-500 w-full md:w-64"
              />
            </div>
            <button className="p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-600 hover:bg-slate-100 transition-colors">
              <Filter size={18} />
            </button>
          </div>
          <div className="flex gap-2">
            {['All', 'High Risk', 'Recent'].map((tab) => (
              <button key={tab} className={cn(
                "px-4 py-2 rounded-lg text-sm font-bold transition-colors",
                tab === 'All' ? "bg-slate-900 text-white" : "text-slate-500 hover:bg-slate-50"
              )}>
                {tab}
              </button>
            ))}
          </div>
        </div>
        
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50/50">
                <th className="px-8 py-5 text-xs font-black text-slate-400 uppercase tracking-widest">Driver</th>
                <th className="px-8 py-5 text-xs font-black text-slate-400 uppercase tracking-widest">Route</th>
                <th className="px-8 py-5 text-xs font-black text-slate-400 uppercase tracking-widest">Distance/Time</th>
                <th className="px-8 py-5 text-xs font-black text-slate-400 uppercase tracking-widest">Risk Level</th>
                <th className="px-8 py-5 text-xs font-black text-slate-400 uppercase tracking-widest text-right">Details</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {TRIPS_DATA.map((trip) => (
                <tr key={trip.id} className="group hover:bg-slate-50/80 transition-colors">
                  <td className="px-8 py-5">
                    <p className="font-bold text-slate-900">{trip.driver}</p>
                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-tight">{trip.date}</p>
                  </td>
                  <td className="px-8 py-5">
                    <div className="flex items-center gap-2">
                       <MapPin size={14} className="text-blue-500" />
                       <span className="text-sm font-semibold text-slate-700">{trip.route}</span>
                    </div>
                  </td>
                  <td className="px-8 py-5">
                    <p className="text-sm font-bold text-slate-900">{trip.distance}</p>
                    <p className="text-xs text-slate-400 font-medium">{trip.time} duration</p>
                  </td>
                  <td className="px-8 py-5">
                    <div className={cn(
                      "inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest",
                      trip.risk === 'Minimal' ? "bg-green-100 text-green-700" :
                      trip.risk === 'Low' ? "bg-blue-100 text-blue-700" :
                      trip.risk === 'Medium' ? "bg-amber-100 text-amber-700" : "bg-red-100 text-red-700"
                    )}>
                      {trip.risk === 'High' ? <AlertTriangle size={12} /> : <CheckCircle2 size={12} />}
                      {trip.risk}
                    </div>
                  </td>
                  <td className="px-8 py-5 text-right">
                    <button className="p-2 bg-white border border-slate-200 rounded-xl text-slate-400 hover:text-blue-600 hover:border-blue-200 transition-all">
                       <ArrowUpRight size={18} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
