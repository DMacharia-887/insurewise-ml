import { createContext, useContext, useEffect, useState } from "react";
import { supabase } from "../utils/supabase";
import { Session } from "@supabase/supabase-js";

const AuthContext = createContext<{ session: Session | null | undefined; isLoading: boolean }>({
  session: undefined,
  isLoading: true,
});

export const useAuth = () => useContext(AuthContext);

export default function AuthProvider({ children }: { children: React.ReactNode }) {
  const [session, setSession] = useState<Session | null | undefined>(undefined);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // 1. Get the current session on load
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setIsLoading(false);
    });

    // 2. Listen for login/logout events (like when our Sign Out button is clicked)
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
      setIsLoading(false);
    });

    return () => subscription.unsubscribe();
  }, []);

  return (
    <AuthContext.Provider value={{ session, isLoading }}>
      {children}
    </AuthContext.Provider>
  );
}
