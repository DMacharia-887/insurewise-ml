import { useParams, Link } from "react-router";
import { 
  ArrowLeft, 
  MapPin, 
  Activity, 
  ShieldAlert, 
  CheckCircle2, 
  AlertTriangle, 
  MoreVertical, 
  Navigation2, 
  TrendingUp, 
  TrendingDown,
  Mail,
  Phone,
  Calendar,
  CreditCard,
  FileText,
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
  Area
} from "recharts";
import { motion as Motion } from "motion/react";
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

const DRIVER_DATA = [
  { id: "1", name: "Mwangi Kamau", location: "Nairobi", score: 88, status: "Safe", premium: "KES 4,500", fraud: 5, behavior: "Consistent", joinDate: "Jan 12, 2024", trips: 142, distance: "2,480 km", car: "Toyota Fielder 2018" },
  { id: "2", name: "Aisha Mohammed", location: "Mombasa", score: 94, status: "Excellent", premium: "KES 3,800", fraud: 2, behavior: "Smooth", joinDate: "Oct 05, 2023", trips: 312, distance: "5,120 km", car: "Volkswagen Polo 2020" },
  { id: "3", name: "Peter Onyango", location: "Kisumu", score: 45, status: "High Risk", premium: "KES 12,000", fraud: 12, behavior: "Erratic", joinDate: "Feb 01, 2024", trips: 28, distance: "450 km", car: "Subaru Forester 2016" },
];

const BEHAVIOR_HISTORY = [
  { day: 'Mon', speed: 12, braking: 2, cornering: 5 },
  { day: 'Tue', speed: 8, braking: 1, cornering: 3 },
  { day: 'Wed', speed: 15, braking: 4, cornering: 8 },
  { day: 'Thu', speed: 10, braking: 2, cornering: 4 },
  { day: 'Fri', speed: 22, braking: 7, cornering: 12 },
  { day: 'Sat', speed: 35, braking: 12, cornering: 15 },
  { day: 'Sun', speed: 18, braking: 5, cornering: 9 },
];

const SCORE_BREAKDOWN = [
  { name: 'Speeding', score: 92, weight: 0.35, color: '#22c55e' },
  { name: 'Braking', score: 85, weight: 0.25, color: '#3b82f6' },
  { name: 'Night Driving', score: 45, weight: 0.15, color: '#f59e0b' },
  { name: 'Location Risk', score: 72, weight: 0.25, color: '#6366f1' },
];

export default function BorrowerProfilePage() {
  const { id } = useParams();
  const driver = DRIVER_DATA.find(d => d.id === id) || DRIVER_DATA[0];

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-left-4 duration-700">
      <div className="flex items-center justify-between">
         <Link to="/risk-assessment" className="inline-flex items-center gap-2 font-bold text-slate-500 hover:text-blue-600 transition-colors group">
            <div className="p-2 bg-white border border-slate-200 rounded-xl shadow-sm group-hover:border-blue-200">
               <ArrowLeft size={18} />
            </div>
            <span>Back to Assessments</span>
         </Link>
         <div className="flex gap-3">
            <button className="bg-white border border-slate-200 px-6 py-2.5 rounded-xl font-bold text-slate-700 hover:bg-slate-50 transition-colors shadow-sm">
               Download CSV
            </button>
            <button className="bg-blue-600 text-white px-6 py-2.5 rounded-xl font-bold hover:bg-blue-700 transition-all shadow-lg shadow-blue-200">
               Update Policy
            </button>
         </div>
      </div>

      <div className="bg-white rounded-[3rem] p-10 shadow-sm border border-slate-100 flex flex-col md:flex-row items-center gap-10">
         <div className="relative">
            <div className={cn(
              "w-32 h-32 rounded-[2rem] flex items-center justify-center font-black text-3xl shadow-xl",
              driver.score > 80 ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"
            )}>
               {driver.name.split(' ').map(n => n[0]).join('')}
            </div>
            <div className="absolute -bottom-2 -right-2 p-2 bg-white rounded-2xl shadow-lg border border-slate-100">
               {driver.score > 80 ? <CheckCircle2 className="text-green-500" size={24} /> : <AlertTriangle className="text-red-500" size={24} />}
            </div>
         </div>
         <div className="flex-1 text-center md:text-left">
            <div className="flex flex-col md:flex-row md:items-center gap-4 mb-4">
               <h1 className="text-4xl font-black text-slate-900 tracking-tight">{driver.name}</h1>
               <div className={cn(
                 "px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest",
                 driver.score > 80 ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"
               )}>
                 {driver.status}
               </div>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
               <div className="space-y-1">
                  <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Aggregate Score</p>
                  <p className="text-2xl font-black text-slate-900">{driver.score}/100</p>
               </div>
               <div className="space-y-1">
                  <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Monthly Premium</p>
                  <p className="text-2xl font-black text-slate-900">{driver.premium}</p>
               </div>
               <div className="space-y-1">
                  <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Fraud Risk</p>
                  <p className="text-2xl font-black text-slate-900">{driver.fraud}%</p>
               </div>
               <div className="space-y-1">
                  <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Total Distance</p>
                  <p className="text-2xl font-black text-slate-900">{driver.distance}</p>
               </div>
            </div>
         </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
         <div className="lg:col-span-2 space-y-8">
            <div className="bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-sm">
               <h3 className="text-2xl font-black text-slate-900 tracking-tight mb-8">Score Breakdown</h3>
               <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {SCORE_BREAKDOWN.map((item, i) => (
                    <div key={i} className="p-6 bg-slate-50 rounded-[2rem] border border-slate-100">
                       <div className="flex items-center justify-between mb-4">
                          <p className="font-bold text-slate-700">{item.name}</p>
                          <p className="text-lg font-black text-slate-900">{item.score}/100</p>
                       </div>
                       <div className="w-full bg-white h-2 rounded-full overflow-hidden">
                          <div 
                            className="h-full rounded-full transition-all duration-1000" 
                            style={{ width: `${item.score}%`, backgroundColor: item.color }} 
                          />
                       </div>
                    </div>
                  ))}
               </div>
            </div>

            <div className="bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-sm">
               <div className="flex items-center justify-between mb-10">
                  <div>
                     <h3 className="text-2xl font-black text-slate-900 tracking-tight">Violation Analysis</h3>
                     <p className="text-sm font-medium text-slate-500 mt-1">Daily trend of detected driving anomalies</p>
                  </div>
                  <div className="flex gap-4 text-[10px] font-black text-slate-400 uppercase tracking-widest">
                     <span className="flex items-center gap-1.5"><div className="w-2.5 h-2.5 rounded-full bg-red-500" /> Speeding</span>
                     <span className="flex items-center gap-1.5"><div className="w-2.5 h-2.5 rounded-full bg-blue-500" /> Braking</span>
                     <span className="flex items-center gap-1.5"><div className="w-2.5 h-2.5 rounded-full bg-amber-500" /> Cornering</span>
                  </div>
               </div>
               <div className="h-[350px] w-full">
                  <ResponsiveContainer width="100%" height="100%">
                     <AreaChart data={BEHAVIOR_HISTORY}>
                        <defs>
                           <linearGradient id="colorSpeed" x1="0" y1="0" x2="0" y2="1">
                              <stop offset="5%" stopColor="#ef4444" stopOpacity={0.1}/>
                              <stop offset="95%" stopColor="#ef4444" stopOpacity={0}/>
                           </linearGradient>
                        </defs>
                        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                        <XAxis dataKey="day" axisLine={false} tickLine={false} tick={{fill: '#94a3b8', fontWeight: 600, fontSize: 12}} dy={10} />
                        <YAxis axisLine={false} tickLine={false} tick={{fill: '#94a3b8', fontWeight: 600, fontSize: 12}} />
                        <Tooltip contentStyle={{ borderRadius: '16px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' }} cursor={{fill: '#f8fafc'}} />
                        <Area type="monotone" dataKey="speed" stroke="#ef4444" fillOpacity={1} fill="url(#colorSpeed)" strokeWidth={3} />
                        <Area type="monotone" dataKey="braking" stroke="#3b82f6" fill="transparent" strokeWidth={3} />
                        <Area type="monotone" dataKey="cornering" stroke="#f59e0b" fill="transparent" strokeWidth={3} />
                     </AreaChart>
                  </ResponsiveContainer>
               </div>
            </div>
         </div>

         <div className="space-y-8">
            <div className="bg-slate-900 rounded-[2.5rem] p-8 text-white">
               <h3 className="text-xl font-bold mb-6 flex items-center gap-2">
                  <Navigation size={20} className="text-blue-400" />
                  Trip History Map
               </h3>
               <div className="aspect-square bg-white/5 rounded-[2rem] border border-white/10 relative overflow-hidden flex items-center justify-center text-center p-8 group">
                  <div className="absolute inset-0 opacity-20 pointer-events-none group-hover:scale-110 transition-transform duration-1000">
                     {/* Simulated map grid */}
                     <div className="grid grid-cols-10 grid-rows-10 h-full w-full border border-white/10">
                        {Array.from({ length: 100 }).map((_, i) => (
                           <div key={i} className="border border-white/5" />
                        ))}
                     </div>
                  </div>
                  <div>
                     <MapPin className="text-blue-500 mx-auto mb-4 animate-bounce" size={32} />
                     <p className="text-sm font-bold text-slate-300">Live Telematics Visualizer</p>
                     <p className="text-xs text-slate-500 mt-2">Interactive map module showing recent paths and heatmaps in {driver.location}.</p>
                  </div>
               </div>
               <div className="mt-6 space-y-4">
                  <div className="flex items-center justify-between text-sm">
                     <span className="text-slate-400">Total Trips (30d)</span>
                     <span className="font-bold text-blue-400">{driver.trips}</span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                     <span className="text-slate-400">Avg. Trip Time</span>
                     <span className="font-bold text-white">42 mins</span>
                  </div>
               </div>
            </div>

            <div className="bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-sm">
               <h3 className="text-xl font-black text-slate-900 mb-6">Policy Details</h3>
               <div className="space-y-4">
                  {[
                    { label: "Vehicle ID", value: "KCB 123X" },
                    { label: "Car Model", value: driver.car },
                    { label: "Install Date", value: driver.joinDate },
                    { label: "Payment Method", value: "M-PESA / Auto-pay" },
                  ].map((item, i) => (
                    <div key={i} className="flex flex-col p-4 bg-slate-50 rounded-2xl">
                       <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">{item.label}</p>
                       <p className="text-sm font-bold text-slate-900">{item.value}</p>
                    </div>
                  ))}
               </div>
            </div>
         </div>
      </div>
    </div>
  );
}
