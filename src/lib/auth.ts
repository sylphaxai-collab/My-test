import { createClient } from '@supabase/supabase-js';
import { useEffect, useState } from 'react';
import { supabase } from './supabaseClient';

// Define types for user session and role
export type UserRole = 'customer' | 'admin';
export type AuthState = {
  user: any;
  role: UserRole | null;
  isLoading: boolean;
};

// Initialize Supabase client
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;
const client = createClient(supabaseUrl, supabaseAnonKey);

// Auth service utilities
export const auth = {
  // Register a new user
  async register(email: string, password: string, fullName: string) {
    const { data, error } = await client.auth.signUp({
      email,
      password,
      options: {
        data: {
          full_name: fullName,
        },
      },
    });

    if (error) throw error;

    // Insert profile with role='customer' if user created
    if (data?.user) {
      const { error: profileError } = await client
        .from('profiles')
        .insert([
          {
            id: data.user.id,
            email: data.user.email,
            full_name: fullName,
            role: 'customer',
          },
        ]);

      if (profileError) throw profileError;
    }

    return data;
  },

  // Login user
  async login(email: string, password: string) {
    const { data, error } = await client.auth.signInWithPassword({
      email,
      password,
    });

    if (error) throw error;
    return data;
  },

  // Logout user
  async logout() {
    const { error } = await client.auth.signOut();
    if (error) throw error;
  },

  // Get current session
  async getSession() {
    const { data, error } = await client.auth.getSession();
    if (error) throw error;
    return data.session;
  },

  // Get profile role
  async getRole(userId: string): Promise<UserRole> {
    const { data, error } = await client
      .from('profiles')
      .select('role')
      .eq('id', userId)
      .single();

    if (error) throw error;
    return (data.role as UserRole) || 'customer';
  },
};

// Custom hook to access authentication state
export function useAuth() {
  const [authState, setAuthState] = useState<AuthState>({
    user: null,
    role: null,
    isLoading: true,
  });

  useEffect(() => {
    // Get initial session
    const initializeAuth = async () => {
      try {
        const session = await auth.getSession();
        if (session?.user) {
          const userRole = await auth.getRole(session.user.id);
          setAuthState({
            user: session.user,
            role: userRole,
            isLoading: false,
          });
        } else {
          setAuthState({
            user: null,
            role: null,
            isLoading: false,
          });
        }
      } catch (error) {
        setAuthState({
          user: null,
          role: null,
          isLoading: false,
        });
      }
    };

    initializeAuth();

    // Listen for auth changes
    const { data: listener } = client.auth.onAuthStateChange(
      async (event, session) => {
        if (session?.user) {
          const userRole = await auth.getRole(session.user.id);
          setAuthState({
            user: session.user,
            role: userRole,
            isLoading: false,
          });
        } else {
          setAuthState({
            user: null,
            role: null,
            isLoading: false,
          });
        }
      }
    );

    return () => {
      listener.subscription.unsubscribe();
    };
  }, []);

  return authState;
}
