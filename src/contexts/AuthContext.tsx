import React, { createContext, useContext, useState, useEffect, useCallback, useRef } from "react";
import { supabase } from "@/integrations/supabase/client";
import { lovable } from "@/integrations/lovable";
import type { User } from "@supabase/supabase-js";

interface UserProfile {
  display_name: string | null;
  avatar_url: string | null;
  email: string | null;
}

interface AuthContextType {
  user: User | null;
  profile: UserProfile | null;
  isGuest: boolean;
  guestId: string;
  isLoading: boolean;
  justLoggedIn: boolean;
  clearJustLoggedIn: () => void;
  signInWithGoogle: () => Promise<void>;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const getOrCreateGuestId = (): string => {
  const stored = localStorage.getItem("shopxai_guest_id");
  if (stored) return stored;
  const id = `guest_${crypto.randomUUID()}`;
  localStorage.setItem("shopxai_guest_id", id);
  return id;
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [guestId] = useState(getOrCreateGuestId);
  const [justLoggedIn, setJustLoggedIn] = useState(false);
  const wasGuest = useRef(true);

  const fetchProfile = useCallback(async (userId: string) => {
    const { data } = await supabase
      .from("profiles")
      .select("display_name, avatar_url, email")
      .eq("user_id", userId)
      .maybeSingle();
    
    if (data) {
      setProfile(data);
    }
  }, []);

  useEffect(() => {
    // Set up auth state listener FIRST
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        const currentUser = session?.user ?? null;
        setUser(currentUser);
        
        if (currentUser) {
          if (wasGuest.current) {
            setJustLoggedIn(true);
          }
          wasGuest.current = false;
          setTimeout(() => fetchProfile(currentUser.id), 0);
        } else {
          setProfile(null);
          wasGuest.current = true;
        }
        setIsLoading(false);
      }
    );

    // THEN check existing session
    supabase.auth.getSession().then(({ data: { session } }) => {
      const currentUser = session?.user ?? null;
      setUser(currentUser);
      if (currentUser) {
        fetchProfile(currentUser.id);
      }
      setIsLoading(false);
    });

    return () => subscription.unsubscribe();
  }, [fetchProfile]);

  const signInWithGoogle = useCallback(async () => {
    const result = await lovable.auth.signInWithOAuth("google", {
      redirect_uri: window.location.origin,
    });
    if (result.error) {
      console.error("Google sign-in error:", result.error);
    }
  }, []);

  const clearJustLoggedIn = useCallback(() => setJustLoggedIn(false), []);

  const signOut = useCallback(async () => {
    await supabase.auth.signOut();
    setUser(null);
    setProfile(null);
  }, []);

  return (
    <AuthContext.Provider
      value={{
        user,
        profile,
        isGuest: !user,
        guestId,
        isLoading,
        justLoggedIn,
        clearJustLoggedIn,
        signInWithGoogle,
        signOut,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
