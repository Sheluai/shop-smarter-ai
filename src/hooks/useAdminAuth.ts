import { useState, useEffect } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";

export function useAdminAuth() {
  const { user, isLoading: authLoading } = useAuth();
  const [isAdmin, setIsAdmin] = useState(false);
  const [isChecking, setIsChecking] = useState(true);

  useEffect(() => {
    if (authLoading) return;
    if (!user) {
      setIsAdmin(false);
      setIsChecking(false);
      return;
    }

    const checkRole = async () => {
      try {
        const { data } = await supabase.rpc("has_role", {
          _user_id: user.id,
          _role: "admin",
        });
        setIsAdmin(!!data);
      } catch {
        setIsAdmin(false);
      } finally {
        setIsChecking(false);
      }
    };
    checkRole();
  }, [user, authLoading]);

  return { isAdmin, isChecking: authLoading || isChecking, user };
}
