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
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Busca o perfil (e o papel real) na tabela "profiles" do Supabase.
async function fetchProfile(userId: string): Promise<UserProfile | null> {
  if (!supabase) return null;
  const { data, error } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', userId)
    .single();

  if (error || !data) return null;

  return {
    id: data.id,
    email: data.email,
    name: data.name || data.email.split('@')[0],
    role: (data.role as UserRole) || 'customer',
    avatar: data.avatar,
  };
}

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<UserProfile | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!isSupabaseConfigured || !supabase) {
      setIsLoading(false);
      return;
    }

    const client = supabase;

    client.auth.getSession().then(async ({ data: { session } }) => {
      if (session?.user) {
        setUser(await fetchProfile(session.user.id));
      }
      setIsLoading(false);
    });

    const { data: { subscription } } = client.auth.onAuthStateChange((_event, session) => {
      if (!session?.user) {
        setUser(null);
        return;
      }
      // setTimeout evita chamar o Supabase dentro do próprio callback de auth
      setTimeout(async () => {
        setUser(await fetchProfile(session.user.id));
      }, 0);
    });

    return () => subscription.unsubscribe();
  }, []);

  const signInAdmin = async (
    email: string,
    pass: string
  ): Promise<{ success: boolean; error?: string }> => {
    if (!isSupabaseConfigured || !supabase) {
      return { success: false, error: 'Supabase não está configurado.' };
    }

    setIsLoading(true);
    try {
      const { data, error } = await supabase.auth.signInWithPassword({ email, password: pass });
      if (error || !data.user) {
        return { success: false, error: 'Credenciais inválidas.' };
      }

      const profile = await fetchProfile(data.user.id);
      if (!profile || (profile.role !== 'admin' && profile.role !== 'editor')) {
        await supabase.auth.signOut();
        return { success: false, error: 'Esta conta não tem permissão de administrador.' };
      }

      setUser(profile);
      return { success: true };
    } catch {
      return { success: false, error: 'Erro ao entrar. Tente novamente.' };
    } finally {
      setIsLoading(false);
    }
  };

  const signOut = async () => {
    if (isSupabaseConfigured && supabase) {
      await supabase.auth.signOut();
    }
    setUser(null);
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