import { 
  ShieldCheck, 
  Search, 
  Filter, 
  ArrowUpRight,
  MoreVertical,
  Activity,
  MapPin,
  Plus,
  TrendingDown,
  TrendingUp,
  AlertTriangle,
  CheckCircle2
} from "lucide-react";
import { Link } from "react-router";
import { motion as Motion } from "motion/react";
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

const DRIVER_DATA = [
  { id: "1", name: "Mwangi Kamau", location: "Nairobi", score: 88, status: "Safe", premium: "KES 4,500", fraud: 5, behavior: "Consistent", phone: "+254 712 345 678" },
  { id: "2", name: "Aisha Mohammed", location: "Mombasa", score: 94, status: "Excellent", premium: "KES 3,800", fraud: 2, behavior: "Smooth", phone: "+254 722 987 654" },
  { id: "3", name: "Peter Onyango", location: "Kisumu", score: 45, status: "High Risk", premium: "KES 12,000", fraud: 12, behavior: "Erratic", phone: "+254 733 111 222" },
  { id: "4", name: "Faith Wambui", location: "Nakuru", score: 72, status: "Good", premium: "KES 5,800", fraud: 8, behavior: "Average", phone: "+254 744 555 666" },
  { id: "5", name: "Brian Kipchirchir", location: "Eldoret", score: 29, status: "Dangerous", premium: "KES 18,500", fraud: 45, behavior: "Aggressive", phone: "+254 755 000 999" },
  { id: "6", name: "Zainab Ali", location: "Nairobi", score: 91, status: "Safe", premium: "KES 4,100", fraud: 3, behavior: "Smooth", phone: "+254 766 888 777" },
  { id: "7", name: "David Mutua", location: "Machakos", score: 65, status: "Moderate", premium: "KES 7,200", fraud: 15, behavior: "Inconsistent", phone: "+254 777 444 333" },
];

export default function RiskAssessmentPage() {
  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
      <header className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-4xl font-black text-slate-900 tracking-tight">Risk Assessment</h1>
          <p className="text-slate-500 font-medium mt-1">Reviewing scored drivers, fraud probability, and premium adjustments.</p>
        </div>
        <div className="flex gap-3">
           <button className="bg-white border border-slate-200 px-6 py-2.5 rounded-xl font-bold text-slate-700 flex items-center gap-2 hover:bg-slate-50 transition-colors shadow-sm">
             <TrendingUp size={18} />
             <span>Batch Scorer</span>
           </button>
        </div>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        {[
          { label: "Scored Drivers", value: "12,482", icon: ShieldCheck, color: "blue" },
          { label: "High Risk Detects", value: "248", icon: AlertTriangle, color: "red" },
          { label: "Avg. Risk Score", value: "74.8", icon: Activity, color: "green" },
          { label: "Fraud Cases", value: "12", icon: ShieldCheck, color: "amber" },
        ].map((stat, i) => (
          <div key={i} className="bg-white p-6 rounded-3xl shadow-sm border border-slate-100">
            <div className={`w-12 h-12 rounded-2xl bg-${stat.color}-50 text-${stat.color}-600 flex items-center justify-center mb-4`}>
              <stat.icon size={24} />
            </div>
            <p className="text-xs font-bold text-slate-400 uppercase tracking-widest leading-none mb-1">{stat.label}</p>
            <h3 className="text-2xl font-black text-slate-900">{stat.value}</h3>
          </div>
        ))}
      </div>

      <div className="bg-white rounded-[2.5rem] shadow-sm border border-slate-100 overflow-hidden">
        <div className="p-8 border-b border-slate-50 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex gap-4 w-full md:w-auto">
            <div className="relative flex-1 md:flex-none">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
              <input 
                type="text" 
                placeholder="Search by driver ID, name, or location..." 
                className="pl-11 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-medium focus:outline-none focus:ring-2 focus:ring-blue-500 w-full md:w-80"
              />
            </div>
            <button className="p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-600 hover:bg-slate-100 transition-colors">
              <Filter size={18} />
            </button>
          </div>
          <div className="flex gap-2">
            {['Risk: High', 'Fraud: High', 'Premium: Low-High'].map((filter) => (
              <button key={filter} className="px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-xs font-bold text-slate-500 hover:bg-slate-100 transition-colors">
                {filter}
              </button>
            ))}
          </div>
        </div>
        
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50/50">
                <th className="px-8 py-5 text-xs font-black text-slate-400 uppercase tracking-widest">Driver / Score</th>
                <th className="px-8 py-5 text-xs font-black text-slate-400 uppercase tracking-widest">Risk Level</th>
                <th className="px-8 py-5 text-xs font-black text-slate-400 uppercase tracking-widest">Fraud Prob.</th>
                <th className="px-8 py-5 text-xs font-black text-slate-400 uppercase tracking-widest">Premium (Monthly)</th>
                <th className="px-8 py-5 text-xs font-black text-slate-400 uppercase tracking-widest text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {DRIVER_DATA.map((driver) => (
                <tr key={driver.id} className="group hover:bg-slate-50/80 transition-colors">
                  <td className="px-8 py-5">
                    <div className="flex items-center gap-3">
                      <div className={cn(
                        "w-12 h-12 rounded-2xl flex flex-col items-center justify-center font-black",
                        driver.score > 80 ? "bg-green-100 text-green-700" : 
                        driver.score > 60 ? "bg-blue-100 text-blue-700" : 
                        driver.score > 40 ? "bg-amber-100 text-amber-700" : "bg-red-100 text-red-700"
                      )}>
                        <span className="text-lg">{driver.score}</span>
                        <span className="text-[8px] uppercase tracking-tighter opacity-70">Points</span>
                      </div>
                      <div>
                        <p className="font-bold text-slate-900">{driver.name}</p>
                        <p className="text-[10px] font-black text-slate-400 uppercase tracking-tight">{driver.location}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-8 py-5">
                    <div className={cn(
                      "inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest",
                      driver.score > 80 ? "bg-green-100 text-green-700" : 
                      driver.score > 60 ? "bg-blue-100 text-blue-700" : 
                      driver.score > 40 ? "bg-amber-100 text-amber-700" : "bg-red-100 text-red-700"
                    )}>
                      {driver.score > 40 ? <CheckCircle2 size={12} /> : <AlertTriangle size={12} />}
                      {driver.status}
                    </div>
                  </td>
                  <td className="px-8 py-5">
                    <div className="flex items-center gap-2">
                       <div className="flex-1 max-w-[80px] h-1.5 bg-slate-100 rounded-full overflow-hidden">
                          <div 
                            className={cn(
                              "h-full rounded-full",
                              driver.fraud > 20 ? "bg-red-500" : "bg-blue-500"
                            )} 
                            style={{ width: `${driver.fraud}%` }} 
                          />
                       </div>
                       <span className="text-xs font-black text-slate-900">{driver.fraud}%</span>
                    </div>
                  </td>
                  <td className="px-8 py-5 font-black text-slate-900">
                    {driver.premium}
                  </td>
                  <td className="px-8 py-5 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <Link 
                        to={`/borrower/${driver.id}`}
                        className="px-4 py-2 bg-white border border-slate-200 rounded-xl text-slate-600 hover:text-blue-600 hover:border-blue-200 transition-all font-bold text-xs"
                      >
                        Profile
                      </Link>
                      <button className="p-2 text-slate-400 hover:text-slate-900 transition-colors">
                        <MoreVertical size={18} />
                      </button>
                    </div>
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
