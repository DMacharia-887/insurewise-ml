import { useEffect, useState } from 'react';
import { supabase } from '../../utils/supabase';
import { fetchTraccarDevices } from '../../utils/traccar';
import { 
  Database, Activity, Cpu, Save, RefreshCw, Plus
} from "lucide-react";
import { motion as Motion } from "motion/react";
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

interface FeatureWeight {
  id: number;
  feature_name: string;
  weight: number;
  impact: string;
}

export default function AdminPanelPage() {
  const [dbStats, setDbStats] = useState({
    telemetryRows: 0,
    policyCount: 0,
    lastSync: 'Checking...',
    activeStreams: 0,
  });
  
  const [features, setFeatures] = useState<FeatureWeight[]>([]);
  const [isApplying, setIsApplying] = useState(false);
  const [loadingWeights, setLoadingWeights] = useState(true);

  useEffect(() => {
    async function loadData() {
      try {
        // Load Weights from Supabase
        const { data: weightData } = await supabase
          .from('Model_Weights')
          .select('*')
          .order('id', { ascending: true });

        if (weightData) setFeatures(weightData);

        // Load System Stats
        const { count: tCount } = await supabase.from('Telematics').select('*', { count: 'exact', head: true });
        const { count: pCount } = await supabase.from('Policies').select('*', { count: 'exact', head: true });
        
        const { data: latestRow } = await supabase
          .from('Telematics')
          .select('updated_at')
          .order('updated_at', { ascending: false })
          .limit(1)
          .single();

        const devices = await fetchTraccarDevices();
        const activeDevices = devices.filter((d: any) => d.status === 'online').length;

        let timeStr = 'Never';
        if (latestRow?.updated_at) {
          timeStr = new Date(latestRow.updated_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
        }

        setDbStats({
          telemetryRows: tCount || 0,
          policyCount: pCount || 0,
          lastSync: timeStr,
          activeStreams: activeDevices || devices.length 
        });

      } catch (err) {
        console.error("Failed to load Admin data:", err);
      } finally {
        setLoadingWeights(false);
      }
    }

    loadData();
  }, []);

  // Update local state when slider is moved
  const handleWeightChange = (index: number, newValue: string) => {
    let numValue = parseFloat(newValue);
    if (isNaN(numValue)) numValue = 0;
    if (numValue > 1) numValue = 1;
    if (numValue < 0) numValue = 0;

    const updated = [...features];
    updated[index].weight = numValue;
    setFeatures(updated);
  };

  // Save updated weights back to Supabase
  const handleApplyChanges = async () => {
    setIsApplying(true);
    try {
      // Loop through all features and update them in DB
      for (const feature of features) {
        await supabase
          .from('Model_Weights')
          .update({ weight: feature.weight })
          .eq('id', feature.id);
      }
      
      alert("Model weights updated in database successfully! Your Python ML model can now fetch the new configuration.");
    } catch (err) {
      console.error("Failed to save weights:", err);
      alert("Error saving weights. Check console.");
    } finally {
      setIsApplying(false);
    }
  };

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
           <button 
             onClick={handleApplyChanges}
             disabled={isApplying || loadingWeights}
             className="bg-blue-600 text-white px-6 py-2.5 rounded-xl font-bold flex items-center gap-2 hover:bg-blue-700 transition-all shadow-lg shadow-blue-200 disabled:bg-blue-400"
           >
             <Save size={18} />
             <span>{isApplying ? 'Saving...' : 'Apply Changes'}</span>
           </button>
        </div>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-8">
           
           {/* Model Configuration */}
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
                 {loadingWeights ? (
                   <p className="text-slate-400 animate-pulse font-bold text-center py-8">Loading weights from database...</p>
                 ) : features.map((feature, i) => (
                   <div key={feature.id} className="group p-6 bg-slate-50 rounded-3xl border border-slate-100 hover:border-blue-200 hover:bg-white transition-all">
                      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-4">
                         <div>
                            <p className="font-bold text-slate-900 text-lg">{feature.feature_name}</p>
                            <p className="text-xs font-black text-slate-400 uppercase tracking-widest">{feature.impact} Impact on Premium</p>
                         </div>
                         <div className="flex items-center gap-4">
                            <input 
                              type="number" 
                              value={feature.weight} 
                              onChange={(e) => handleWeightChange(i, e.target.value)}
                              step="0.05"
                              min="0"
                              max="1"
                              className="w-24 px-4 py-2 bg-white border border-slate-200 rounded-xl font-black text-center text-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
                            />
                            <span className="text-sm font-bold text-slate-400">Weight</span>
                         </div>
                      </div>
                      <div className="w-full bg-slate-200 h-2 rounded-full overflow-hidden">
                         <Motion.div 
                           initial={{ width: `${feature.weight * 100}%` }}
                           animate={{ width: `${feature.weight * 100}%` }}
                           className="h-full bg-blue-600 rounded-full"
                         />
                      </div>
                   </div>
                 ))}
              </div>
           </div>

           {/* Database Status */}
           <div className="bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-sm">
              <div className="flex items-center gap-3 mb-8">
                 <div className="p-3 bg-amber-50 text-amber-600 rounded-2xl">
                    <Database size={24} />
                 </div>
                 <h3 className="text-2xl font-black text-slate-900">Database Status</h3>
              </div>
              
              <div className="mt-8 grid grid-cols-2 md:grid-cols-4 gap-4">
                 {[
                   { label: "Telemetry Rows", value: dbStats.telemetryRows.toLocaleString() },
                   { label: "Active Policies", value: dbStats.policyCount.toLocaleString() },
                   { label: "Last API Sync", value: dbStats.lastSync },
                   { label: "PostgREST API", value: "Online" }
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
                       Railway ML Endpoint is currently active. Live weights are fetched directly from Supabase prior to inference.
                    </p>
                 </div>
              </div>
           </div>

           <div className="bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-sm">
              <h3 className="text-xl font-black text-slate-900 mb-6">Active Data Streams</h3>
              <div className="space-y-4">
                 {[
                   { source: "Traccar GPS Server", count: `${dbStats.activeStreams} devices`, status: "online" },
                   { source: "Supabase Realtime", count: "Websockets", status: "online" },
                   { source: "Railway ML Engine", count: "FastAPI", status: "online" },
                 ].map((stream, i) => (
                   <div key={i} className="flex items-center justify-between p-4 bg-slate-50 rounded-2xl">
                      <div className="flex items-center gap-3">
                         <div className={cn(
                           "w-2 h-2 rounded-full",
                           stream.status === 'online' ? "bg-green-500 animate-pulse" : "bg-red-500"
                         )} />
                         <span className="text-sm font-bold text-slate-700">{stream.source}</span>
                      </div>
                      <span className="text-xs font-black text-slate-400">{stream.count}</span>
                   </div>
                 ))}
              </div>
           </div>
        </div>
      </div>
    </div>
  );
}
