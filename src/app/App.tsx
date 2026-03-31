import { RouterProvider } from 'react-router';
import { router } from './routes.tsx';
import { useState, useEffect } from 'react';
import { supabase } from '../utils/supabase'; // Make sure this path is correct

export default function App() {
  const [dbStatus, setDbStatus] = useState("Checking connection...");

  useEffect(() => {
    async function checkConnection() {
      try {
        // Let's test the connection by just checking if we can ping the database
        // We will do a generic limit(1) query on an arbitrary table just to test the connection.
        // Even if the table doesn't exist, getting an explicit Postgres error proves we are talking to Supabase!
        const { error } = await supabase.from('Drivers').select('*').limit(1);
        
        if (error && error.code !== '42P01') { 
          // 42P01 is Postgres code for "relation does not exist"
          setDbStatus(`Connection Error: ${error.message}`);
        } else {
          setDbStatus("✅ Supabase is successfully connected!");
        }
      } catch (err) {
        setDbStatus("❌ Failed to connect to Supabase.");
      }
    }

    checkConnection();
  }, []);

  return (
    <>
      {/* A tiny banner at the top of your app just to prove it works */}
      <div style={{ background: '#333', color: '#fff', padding: '10px', textAlign: 'center' }}>
        {dbStatus}
      </div>
      
      {/* Your actual InsureWise Application */}
      <RouterProvider router={router} />
    </>
  );
}
