import { useEffect, useState } from "react";
import { supabase } from "../../utils/supabase";
import { 
  fetchTraccarDevices, 
  fetchTraccarDailyTrips 
} from "../../utils/traccar";
import { 
  Navigation, Search, Filter, MapPin, 
  Clock, ArrowUpRight, AlertTriangle, 
  CheckCircle2, Layers, Activity
} from "lucide-react";
import { Link } from "react-router";
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

// Helper to format duration from ms to "1h 15m"
function formatDuration(ms: number) {
  if (!ms) return "0m";
  const hours = Math.floor(ms / (1000 * 60 * 60));
  const minutes = Math.floor((ms % (1000 * 60 * 60)) / (1000 * 60));
  if (hours > 0) return `${hours}h ${minutes}m`;
  return `${minutes}m`;
}

interface TripDisplayData {
  id: string;
  driverId: string;
  driver: string;
  distance: string;
  time: string;
  date: string;
  rawMs: number;
}

export default function TripHistoryPage() {
  const [trips, setTrips] = useState<TripDisplayData[]>([]);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    totalTrips: 0,
    totalDistance: 0
  });

  useEffect(() => {
    async function loadTrips() {
      try {
        setLoading(true);

        // 1. Fetch Supabase drivers to get their names
        const { data: driversData } = await supabase
          .from('Drivers')
          .select('driver_id, name, traccar_id');

        // 2. Fetch Traccar devices to get their IDs
        const devices = await fetchTraccarDevices();
        const deviceIds = devices.map((d: any) => d.id);

        if (!deviceIds.length) {
          setLoading(false);
          return;
        }

        // 3. Fetch all trips for today from Traccar
        const dailyTrips = await fetchTraccarDailyTrips(deviceIds);

        // 4. Calculate Stats
        let totalDist = 0;
        
        // 5. Map Traccar trips to UI format
        const mappedTrips = dailyTrips.map((trip: any, index: number) => {
          // Traccar distance is in meters
          const distKm = trip.distance ? trip.distance / 1000 : 0;
          totalDist += distKm;

          // Find the driver name using the deviceId
          const driverRecord = driversData?.find(d => Number(d.traccar_id) === Number(trip.deviceId));
          const driverName = driverRecord ? driverRecord.name : `Device #${trip.deviceId}`;
          const sysDriverId = driverRecord ? driverRecord.driver_id : "";

          // Format Date
          const dateObj = new Date(trip.startTime);
          const dateStr = dateObj.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric', hour: '2-digit', minute: '2-digit' });

          return {
            id: `T-${trip.deviceId}-${index}`,
            driverId: sysDriverId,
            driver: driverName,
            distance: `${distKm.toFixed(1)} km`,
            time: formatDuration(trip.duration),
            date: dateStr,
            rawMs: trip.startTime // Keep raw time for sorting
          };
        });

        // Sort newest trips first
        mappedTrips.sort((a: any, b: any) => new Date(b.rawMs).getTime() - new Date(a.rawMs).getTime());

        setStats({
          totalTrips: dailyTrips.length,
          totalDistance: Math.round(totalDist)
        });
        
        setTrips(mappedTrips);

      } catch (err) {
        console.error("Error loading trips:", err);
      } finally {
        setLoading(false);
      }
    }

    loadTrips();
  }, []);

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
      <header className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-4xl font-black text-slate-900 tracking-tight">Trip History</h1>
          <p className="text-slate-500 font-medium mt-1">Real-time log of all tracked driving sessions across the network today.</p>
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
          { label: "Trips Today", value: loading ? "..." : stats.totalTrips.toLocaleString(), icon: Navigation, color: "blue" },
          { label: "Fleet Distance Today", value: loading ? "..." : `${stats.totalDistance.toLocaleString()} km`, icon: Activity, color: "green" },
          { label: "Active Sessions", value: "Live", icon: Clock, color: "amber" },
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
                placeholder="Search by driver..." 
                className="pl-11 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-medium focus:outline-none focus:ring-2 focus:ring-blue-500 w-full md:w-64"
              />
            </div>
          </div>
          <div className="flex gap-2">
            {['Today\'s Trips'].map((tab) => (
              <button key={tab} className="px-4 py-2 rounded-lg text-sm font-bold transition-colors bg-slate-900 text-white">
                {tab}
              </button>
            ))}
          </div>
        </div>
        
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50/50">
                <th className="px-8 py-5 text-xs font-black text-slate-400 uppercase tracking-widest">Driver & Time</th>
                <th className="px-8 py-5 text-xs font-black text-slate-400 uppercase tracking-widest">Distance</th>
                <th className="px-8 py-5 text-xs font-black text-slate-400 uppercase tracking-widest">Duration</th>
                <th className="px-8 py-5 text-xs font-black text-slate-400 uppercase tracking-widest text-right">View Driver</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {loading ? (
                <tr>
                  <td colSpan={4} className="py-12 text-center text-slate-400 font-bold animate-pulse">
                    Fetching today's trips from Traccar...
                  </td>
                </tr>
              ) : trips.length === 0 ? (
                <tr>
                  <td colSpan={4} className="py-12 text-center text-slate-400 font-bold">
                    No trips recorded today.
                  </td>
                </tr>
              ) : (
                trips.map((trip) => (
                  <tr key={trip.id} className="group hover:bg-slate-50/80 transition-colors">
                    <td className="px-8 py-5">
                      <p className="font-bold text-slate-900">{trip.driver}</p>
                      <p className="text-[10px] font-black text-slate-400 uppercase tracking-tight">{trip.date}</p>
                    </td>
                    <td className="px-8 py-5">
                      <div className="flex items-center gap-2">
                         <Activity size={14} className="text-blue-500" />
                         <span className="text-sm font-semibold text-slate-700">{trip.distance}</span>
                      </div>
                    </td>
                    <td className="px-8 py-5">
                      <div className="flex items-center gap-2">
                         <Clock size={14} className="text-amber-500" />
                         <span className="text-sm font-semibold text-slate-700">{trip.time}</span>
                      </div>
                    </td>
                    <td className="px-8 py-5 text-right">
                      {trip.driverId ? (
                        <Link to={`/borrower/${trip.driverId}`} className="p-2 inline-flex bg-white border border-slate-200 rounded-xl text-slate-400 hover:text-blue-600 hover:border-blue-200 transition-all">
                           <ArrowUpRight size={18} />
                        </Link>
                      ) : (
                        <span className="text-xs font-bold text-slate-300">Unregistered</span>
                      )}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
