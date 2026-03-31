import { useEffect, useState } from 'react';
import { supabase } from '../../utils/supabase';
import { Users, UserPlus, Trash2, ShieldAlert } from 'lucide-react';
import { Link } from 'react-router';

interface Driver {
  driver_id: number;
  name: string;
  id_number: number;
  license_reg: string;
  phone_no: number;
  DOB: string;
  created_at: string;
}

export default function DriverManagement() {
  const [drivers, setDrivers] = useState<Driver[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  
  // Form state
  const [formData, setFormData] = useState({
    name: '',
    id_number: '',
    license_reg: '',
    phone_no: '',
    DOB: ''
  });

  // Fetch Drivers from Supabase
  async function fetchDrivers() {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('Drivers')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      if (data) setDrivers(data as Driver[]);
    } catch (err: any) {
      console.error("Error fetching:", err.message);
      setError("Failed to load drivers database.");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchDrivers();
  }, []);

  // Handle Input Changes
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // Add Driver to Supabase
  const handleAddDriver = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      const { error } = await supabase
        .from('Drivers')
        .insert([{
          name: formData.name,
          id_number: parseInt(formData.id_number),
          license_reg: formData.license_reg,
          phone_no: parseInt(formData.phone_no),
          DOB: formData.DOB
        }]);

      if (error) throw error;

      // Clear form and refresh list
      setFormData({ name: '', id_number: '', license_reg: '', phone_no: '', DOB: '' });
      fetchDrivers(); 
      alert("Driver added successfully!");
    } catch (err: any) {
      console.error("Error adding driver:", err.message);
      alert("Failed to add driver. Please check your data.");
    } finally {
      setIsSubmitting(false);
    }
  };

  // Delete Driver from Supabase
  const handleDeleteDriver = async (driver_id: number) => {
    if (!window.confirm("Are you sure you want to remove this driver from the system?")) return;

    try {
      const { error } = await supabase
        .from('Drivers')
        .delete()
        .eq('driver_id', driver_id);

      if (error) throw error;
      
      // Update UI immediately
      setDrivers(drivers.filter(d => d.driver_id !== driver_id));
    } catch (err: any) {
      console.error("Error deleting:", err.message);
      alert("Failed to delete driver.");
    }
  };

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-left-4 duration-700">
      
      <div className="flex items-center gap-4">
        <div className="w-12 h-12 bg-blue-100 text-blue-600 rounded-2xl flex items-center justify-center">
            <Users size={24} />
        </div>
        <div>
            <h1 className="text-3xl font-black text-slate-900 tracking-tight">Driver Management</h1>
            <p className="text-slate-500 font-medium">Add, view, and remove policyholders from the system</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* ADD DRIVER FORM - 1 Column */}
        <div className="lg:col-span-1">
          <div className="bg-white rounded-[2.5rem] p-8 shadow-sm border border-slate-100">
            <h3 className="text-xl font-black text-slate-900 mb-6 flex items-center gap-2">
              <UserPlus size={20} className="text-blue-500"/>
              Register New Driver
            </h3>
            
            <form onSubmit={handleAddDriver} className="space-y-4">
              <div>
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1 block">Full Name</label>
                <input required type="text" name="name" value={formData.name} onChange={handleInputChange} 
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100 transition-all text-slate-700 font-medium" />
              </div>
              
              <div>
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1 block">National ID</label>
                <input required type="number" name="id_number" value={formData.id_number} onChange={handleInputChange} 
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100 transition-all text-slate-700 font-medium" />
              </div>

              <div>
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1 block">License Registration</label>
                <input required type="text" name="license_reg" placeholder="e.g. KCB 123X" value={formData.license_reg} onChange={handleInputChange} 
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100 transition-all text-slate-700 font-medium" />
              </div>

              <div>
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1 block">Phone Number</label>
                <input required type="number" name="phone_no" placeholder="254..." value={formData.phone_no} onChange={handleInputChange} 
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100 transition-all text-slate-700 font-medium" />
              </div>

              <div>
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1 block">Date of Birth</label>
                <input required type="date" name="DOB" value={formData.DOB} onChange={handleInputChange} 
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100 transition-all text-slate-700 font-medium" />
              </div>
              
              <button disabled={isSubmitting} type="submit" 
                className="w-full mt-4 bg-blue-600 text-white px-6 py-3 rounded-xl font-bold hover:bg-blue-700 transition-all shadow-lg shadow-blue-200 disabled:bg-slate-300 disabled:shadow-none">
                {isSubmitting ? 'Registering...' : 'Add to Database'}
              </button>
            </form>
          </div>
        </div>

        {/* DRIVERS LIST - 2 Columns */}
        <div className="lg:col-span-2">
          <div className="bg-white rounded-[2.5rem] p-8 shadow-sm border border-slate-100 h-full">
            <h3 className="text-xl font-black text-slate-900 mb-6">Database Records</h3>
            
            {error && (
              <div className="bg-red-50 text-red-600 p-4 rounded-xl flex items-center gap-3 mb-6 font-medium">
                <ShieldAlert size={20} />
                {error}
              </div>
            )}

            {loading ? (
              <div className="text-center py-10 text-slate-400 font-medium animate-pulse">
                Fetching records from Supabase...
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="border-b border-slate-100">
                      <th className="pb-4 text-[10px] font-black text-slate-400 uppercase tracking-widest">Driver</th>
                      <th className="pb-4 text-[10px] font-black text-slate-400 uppercase tracking-widest">ID Number</th>
                      <th className="pb-4 text-[10px] font-black text-slate-400 uppercase tracking-widest">License</th>
                      <th className="pb-4 text-[10px] font-black text-slate-400 uppercase tracking-widest">Phone</th>
                      <th className="pb-4 text-[10px] font-black text-slate-400 uppercase tracking-widest text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-50">
                    {drivers.map((driver) => (
                      <tr key={driver.driver_id} className="hover:bg-slate-50/50 transition-colors group">
                        <td className="py-4">
                          <div className="font-bold text-slate-900">{driver.name}</div>
                          <div className="text-xs text-slate-400 font-medium">DOB: {new Date(driver.DOB).toLocaleDateString()}</div>
                        </td>
                        <td className="py-4 font-medium text-slate-600">{driver.id_number}</td>
                        <td className="py-4">
                          <span className="bg-slate-100 text-slate-600 px-3 py-1 rounded-lg text-xs font-bold">
                            {driver.license_reg}
                          </span>
                        </td>
                        <td className="py-4 font-medium text-slate-600">{driver.phone_no}</td>
                        
                        {/* THE NEW BUTTON IS HERE */}
                        <td className="py-4 text-right flex justify-end items-center gap-2">
                          <Link 
                            to={`/borrower/${driver.driver_id}`}
                            className="px-4 py-1.5 bg-blue-50 text-blue-600 hover:bg-blue-100 rounded-lg text-xs font-bold transition-colors inline-flex items-center"
                          >
                            View Profile
                          </Link>
                          <button 
                            onClick={() => handleDeleteDriver(driver.driver_id)}
                            className="p-2 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors inline-flex"
                            title="Delete Driver"
                          >
                            <Trash2 size={18} />
                          </button>
                        </td>

                      </tr>
                    ))}
                    {drivers.length === 0 && (
                      <tr>
                        <td colSpan={5} className="py-10 text-center text-slate-400 font-medium">
                          No drivers found in the database.
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
