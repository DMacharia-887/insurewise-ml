import { 
  Settings as SettingsIcon, 
  Sliders, 
  Upload, 
  Database, 
  Activity, 
  ShieldCheck, 
  Cpu, 
  Save, 
  RefreshCw,
  Plus
} from "lucide-react";
import { motion as Motion } from "motion/react";
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export default function AdminPanelPage() {
  const modelFeatures = [
    { name: "Excessive Speeding", weight: 0.35, trend: "up", impact: "High" },
    { name: "Hard Braking Patterns", weight: 0.25, trend: "stable", impact: "High" },
    { name: "Late Night Driving", weight: 0.15, trend: "down", impact: "Medium" },
    { name: "Location Risk Score", weight: 0.15, trend: "up", impact: "Medium" },
    { name: "Trip Continuity", weight: 0.10, trend: "stable", impact: "Low" },
  ];

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700 pb-12">
      <header className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-4xl font-black text-slate-900 tracking-tight">Admin Panel</h1>
          <p className="text-slate-500 font-medium mt-1">Configure ML models, adjust scoring weights, and manage data ingestion.</p>
        </div>
        <div className="flex gap-3">
           <button className="bg-white border border-slate-200 px-6 py-2.5 rounded-xl font-bold text-slate-700 hover:bg-slate-50 transition-colors shadow-sm flex items-center gap-2">
             <RefreshCw size={18} />
             <span>Retrain Model</span>
           </button>
           <button className="bg-blue-600 text-white px-6 py-2.5 rounded-xl font-bold flex items-center gap-2 hover:bg-blue-700 transition-all shadow-lg shadow-blue-200">
             <Save size={18} />
             <span>Apply Changes</span>
           </button>
        </div>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Model Configuration */}
        <div className="lg:col-span-2 space-y-8">
           <div className="bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-sm">
              <div className="flex items-center justify-between mb-8">
                 <div className="flex items-center gap-3">
                    <div className="p-3 bg-blue-50 text-blue-600 rounded-2xl">
                       <Cpu size={24} />
                    </div>
                    <h3 className="text-2xl font-black text-slate-900">Feature Weight Configuration</h3>
                 </div>
                 <button className="p-2 text-slate-400 hover:text-blue-600 transition-colors">
                    <Plus size={20} />
                 </button>
              </div>
              
              <div className="space-y-6">
                 {modelFeatures.map((feature, i) => (
                   <div key={i} className="group p-6 bg-slate-50 rounded-3xl border border-slate-100 hover:border-blue-200 hover:bg-white transition-all">
                      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-4">
                         <div>
                            <p className="font-bold text-slate-900 text-lg">{feature.name}</p>
                            <p className="text-xs font-black text-slate-400 uppercase tracking-widest">{feature.impact} Impact on Premium</p>
                         </div>
                         <div className="flex items-center gap-4">
                            <input 
                              type="number" 
                              defaultValue={feature.weight} 
                              step="0.01"
                              className="w-24 px-4 py-2 bg-white border border-slate-200 rounded-xl font-black text-center text-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
                            />
                            <span className="text-sm font-bold text-slate-400">Weight</span>
                         </div>
                      </div>
                      <div className="w-full bg-slate-200 h-2 rounded-full overflow-hidden">
                         <Motion.div 
                           initial={{ width: 0 }}
                           animate={{ width: `${feature.weight * 100}%` }}
                           className="h-full bg-blue-600 rounded-full"
                         />
                      </div>
                   </div>
                 ))}
              </div>
           </div>

           {/* Batch Upload */}
           <div className="bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-sm">
              <div className="flex items-center gap-3 mb-8">
                 <div className="p-3 bg-amber-50 text-amber-600 rounded-2xl">
                    <Upload size={24} />
                 </div>
                 <h3 className="text-2xl font-black text-slate-900">Batch Data Ingestion</h3>
              </div>
              <div className="border-2 border-dashed border-slate-200 rounded-[2rem] p-12 text-center hover:border-blue-300 hover:bg-blue-50 transition-all cursor-pointer">
                 <div className="w-16 h-16 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Database size={32} />
                 </div>
                 <h4 className="text-xl font-bold text-slate-900 mb-2">Drop Telematics Data Here</h4>
                 <p className="text-slate-500 max-w-xs mx-auto">Supports .CSV, .JSON, and Apache Parquet formats. Maximum file size 500MB.</p>
              </div>
              <div className="mt-8 grid grid-cols-2 md:grid-cols-4 gap-4">
                 {[
                   { label: "Total Uploaded", value: "1.2 GB" },
                   { label: "Last Sync", value: "2h ago" },
                   { label: "Processing", value: "Idle" },
                   { label: "Errors", value: "0" }
                 ].map((stat, i) => (
                   <div key={i} className="p-4 bg-slate-50 rounded-2xl border border-slate-100">
                      <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">{stat.label}</p>
                      <p className="font-bold text-slate-900">{stat.value}</p>
                   </div>
                 ))}
              </div>
           </div>
        </div>

        {/* System Monitoring */}
        <div className="space-y-8">
           <div className="bg-slate-900 rounded-[2.5rem] p-8 text-white">
              <div className="flex items-center gap-3 mb-6">
                 <Activity className="text-green-400" size={24} />
                 <h3 className="text-xl font-bold">Model Performance</h3>
              </div>
              <div className="space-y-6">
                 <div>
                    <div className="flex justify-between text-sm mb-2">
                       <span className="text-slate-400">Precision (Risk Detect)</span>
                       <span className="font-bold text-green-400">94.2%</span>
                    </div>
                    <div className="w-full bg-white/10 h-1.5 rounded-full overflow-hidden">
                       <div className="h-full bg-green-500 w-[94.2%]" />
                    </div>
                 </div>
                 <div>
                    <div className="flex justify-between text-sm mb-2">
                       <span className="text-slate-400">Recall (Fraud Detect)</span>
                       <span className="font-bold text-blue-400">89.5%</span>
                    </div>
                    <div className="w-full bg-white/10 h-1.5 rounded-full overflow-hidden">
                       <div className="h-full bg-blue-500 w-[89.5%]" />
                    </div>
                 </div>
                 <div className="pt-4 border-t border-white/10">
                    <p className="text-xs text-slate-500 font-medium leading-relaxed">
                       ML Model v4.2.1 is currently active. Last retrained Feb 15, 2026. Next scheduled retraining in 4 days.
                    </p>
                 </div>
              </div>
           </div>

           <div className="bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-sm">
              <h3 className="text-xl font-black text-slate-900 mb-6">Active Data Streams</h3>
              <div className="space-y-4">
                 {[
                   { source: "AWS Kinesis (Nairobi)", latency: "42ms", status: "online" },
                   { source: "Google Cloud IoT", latency: "110ms", status: "online" },
                   { source: "On-Prem Gateway", latency: "-", status: "offline" },
                 ].map((stream, i) => (
                   <div key={i} className="flex items-center justify-between p-4 bg-slate-50 rounded-2xl">
                      <div className="flex items-center gap-3">
                         <div className={cn(
                           "w-2 h-2 rounded-full",
                           stream.status === 'online' ? "bg-green-500 animate-pulse" : "bg-red-500"
                         )} />
                         <span className="text-sm font-bold text-slate-700">{stream.source}</span>
                      </div>
                      <span className="text-xs font-black text-slate-400">{stream.latency}</span>
                   </div>
                 ))}
              </div>
           </div>
        </div>
      </div>
    </div>
  );
}
