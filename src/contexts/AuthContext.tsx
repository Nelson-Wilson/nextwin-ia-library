import React, { createContext, useContext, useState, useEffect } from 'react';
import { UserProfile, UserRole } from '../types';
import { supabase, isSupabaseConfigured } from '../lib/supabase';

interface AuthContextType {
  user: UserProfile | null;
  role: UserRole | null;
  isAdmin: boolean;
  isLoading: boolean;
  signInAdmin: (email: string, pass: string) => Promise<{ success: boolean; error?: string }>;
  signOut: () => Promise<void>;
  simulateAdminLogin: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const ADMIN_STORAGE_KEY = 'nextwin_auth_user';

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<UserProfile | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // 1. Check local session
    const stored = localStorage.getItem(ADMIN_STORAGE_KEY);
    if (stored) {
      try {
        const parsed = JSON.parse(stored);
        setUser(parsed);
      } catch {}
    }

    // 2. Check Supabase session if configured
    if (isSupabaseConfigured && supabase) {
      const client = supabase;
      client.auth.getSession().then(({ data: { session } }) => {
        if (session?.user) {
          // fetch role from profiles
          client
            .from('profiles')
            .select('*')
            .eq('id', session.user.id)
            .single()
            .then(({ data }) => {
              if (data) {
                const profile: UserProfile = {
                  id: data.id,
                  email: data.email,
                  name: data.name || data.email.split('@')[0],
                  role: data.role || 'admin',
                  avatar: data.avatar
                };
                setUser(profile);
                localStorage.setItem(ADMIN_STORAGE_KEY, JSON.stringify(profile));
              }
            });
        }
        setIsLoading(false);
      });

      const { data: { subscription } } = client.auth.onAuthStateChange(async (_event, session) => {
        if (session?.user) {
          const profile: UserProfile = {
            id: session.user.id,
            email: session.user.email || '',
            name: session.user.user_metadata?.name || 'Administrador',
            role: (session.user.user_metadata?.role as UserRole) || 'admin'
          };
          setUser(profile);
          localStorage.setItem(ADMIN_STORAGE_KEY, JSON.stringify(profile));
        } else {
          setUser(null);
          localStorage.removeItem(ADMIN_STORAGE_KEY);
        }
      });

      return () => {
        subscription.unsubscribe();
      };
    } else {
      setIsLoading(false);
    }
  }, []);

  const signInAdmin = async (email: string, pass: string): Promise<{ success: boolean; error?: string }> => {
    setIsLoading(true);

    if (isSupabaseConfigured && supabase) {
      try {
        const { data, error } = await supabase.auth.signInWithPassword({ email, password: pass });
        if (error) {
          setIsLoading(false);
          return { success: false, error: error.message };
        }
        if (data.user) {
          const profile: UserProfile = {
            id: data.user.id,
            email: data.user.email || email,
            name: data.user.user_metadata?.name || 'Administrador',
            role: 'admin'
          };
          setUser(profile);
          localStorage.setItem(ADMIN_STORAGE_KEY, JSON.stringify(profile));
          setIsLoading(false);
          return { success: true };
        }
      } catch (err: any) {
        console.warn('Supabase auth failed, testing fallback...', err);
      }
    }

    // Default admin fallback for frictionless demo/dev
    if (email === 'admin@nextwin.com' || email.includes('admin') || pass === 'admin123') {
      const demoAdmin: UserProfile = {
        id: 'usr-admin-demo',
        email: email || 'admin@nextwin.com',
        name: 'Administrador NextWin',
        role: 'admin'
      };
      setUser(demoAdmin);
      localStorage.setItem(ADMIN_STORAGE_KEY, JSON.stringify(demoAdmin));
      setIsLoading(false);
      return { success: true };
    }

    setIsLoading(false);
    return { success: false, error: 'Credenciais inválidas. Para testar use admin@nextwin.com e senha admin123' };
  };

  const simulateAdminLogin = () => {
    const demoAdmin: UserProfile = {
      id: 'usr-admin-demo',
      email: 'admin@nextwin.com',
      name: 'Nelson Dzimba (Admin)',
      role: 'admin'
    };
    setUser(demoAdmin);
    localStorage.setItem(ADMIN_STORAGE_KEY, JSON.stringify(demoAdmin));
  };

  const signOut = async () => {
    if (isSupabaseConfigured && supabase) {
      await supabase.auth.signOut();
    }
    setUser(null);
    localStorage.removeItem(ADMIN_STORAGE_KEY);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        role: user?.role || null,
        isAdmin: user?.role === 'admin' || user?.role === 'editor',
        isLoading,
        signInAdmin,
        signOut,
        simulateAdminLogin
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
