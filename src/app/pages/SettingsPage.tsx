import { 
  User, 
  Bell, 
  Shield, 
  Database, 
  Smartphone, 
  Globe, 
  Lock,
  ChevronRight,
  LogOut
} from "lucide-react";

export default function SettingsPage() {
  const sections = [
    {
      title: "Account Settings",
      icon: User,
      items: [
        { name: "Profile Information", desc: "Name, email, and professional credentials" },
        { name: "Two-Factor Authentication", desc: "Secure your account with SMS or App", action: "Active" },
        { name: "Login Activity", desc: "View and manage active sessions" },
      ]
    },
    {
      title: "Platform Preferences",
      icon: Smartphone,
      items: [
        { name: "Notification Triggers", desc: "Manage high-risk alert thresholds" },
        { name: "Regional Dashboarding", desc: "Set default focus region for Nairobi/Mombasa" },
        { name: "Data Refresh Frequency", desc: "Currently set to real-time (5s interval)" },
      ]
    },
    {
      title: "Security & Compliance",
      icon: Shield,
      items: [
        { name: "GDPR/Data Privacy", desc: "Manage driver data retention policies" },
        { name: "Audit Logs", desc: "Download system interaction history" },
      ]
    }
  ];

  return (
    <div className="max-w-4xl space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
      <header>
        <h1 className="text-4xl font-black text-slate-900 tracking-tight">Settings</h1>
        <p className="text-slate-500 font-medium mt-1">Manage your professional account and platform parameters.</p>
      </header>

      <div className="space-y-10">
        {sections.map((section, i) => (
          <div key={i} className="space-y-4">
            <div className="flex items-center gap-2 px-2">
               <section.icon size={20} className="text-blue-600" />
               <h3 className="text-lg font-black text-slate-900 uppercase tracking-widest text-[12px]">{section.title}</h3>
            </div>
            <div className="bg-white rounded-[2.5rem] border border-slate-100 shadow-sm overflow-hidden divide-y divide-slate-50">
              {section.items.map((item, j) => (
                <button key={j} className="w-full flex items-center justify-between p-6 hover:bg-slate-50 transition-colors group text-left">
                  <div>
                    <p className="font-bold text-slate-900 group-hover:text-blue-600 transition-colors">{item.name}</p>
                    <p className="text-sm text-slate-400 font-medium">{item.desc}</p>
                  </div>
                  <div className="flex items-center gap-4">
                    {item.action && (
                      <span className="px-3 py-1 bg-green-100 text-green-700 text-[10px] font-black uppercase tracking-widest rounded-full">
                        {item.action}
                      </span>
                    )}
                    <ChevronRight size={20} className="text-slate-300 group-hover:text-slate-900 transition-colors" />
                  </div>
                </button>
              ))}
            </div>
          </div>
        ))}

        <div className="pt-4 border-t border-slate-200">
           <button className="flex items-center gap-3 px-8 py-4 bg-red-50 text-red-600 rounded-2xl font-black text-sm uppercase tracking-widest hover:bg-red-100 transition-all">
              <LogOut size={18} />
              Sign Out from All Devices
           </button>
        </div>
      </div>
    </div>
  );
}
