"use client";

import { useState, useEffect } from "react";
import { supabase } from "../lib/supabase";
import type { User, RegistrationData, SignInData } from "../types/community";
export function useAuth() {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isCheckingAuth, setIsCheckingAuth] = useState(true);
  const [error, setError] = useState("");

  // Initialize auth state
  useEffect(() => {
    let mounted = true;

    const initAuth = async () => {
      const {
        data: { session },
      } = await supabase.auth.getSession();

      if (!mounted) return;

      if (session?.user) {
        const { data: profile } = await supabase
          .from("profiles")
          .select("*")
          .eq("id", session.user.id)
          .single();

        setUser({
          id: session.user.id,
          email: session.user.email || "",
          firstName: profile?.first_name || "",
          lastName: profile?.last_name || "",
        });
      } else {
        setUser(null);
      }

      setIsCheckingAuth(false);
    };

    initAuth();

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (_event, session) => {
      if (!mounted) return;

      if (session?.user) {
        const { data: profile } = await supabase
          .from("profiles")
          .select("*")
          .eq("id", session.user.id)
          .single();

        setUser({
          id: session.user.id,
          email: session.user.email || "",
          firstName: profile?.first_name || "",
          lastName: profile?.last_name || "",
        });
      } else {
        setUser(null);
      }
    });

    return () => {
      mounted = false;
      subscription.unsubscribe();
    };
  }, []);

  const signUp = async (data: RegistrationData) => {
    setIsLoading(true);
    setError("");

    try {
      // Step 1: Sign up user with Supabase Auth
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email: data.email,
        password: data.password,
      });

      if (authError) {
        throw new Error(authError.message);
      }

      if (!authData.user) {
        throw new Error("Registration failed. Please try again.");
      }

      // Step 2: Create profile in profiles table
      const profileData = {
        id: authData.user.id,
        email: data.email,
        first_name: data.firstName,
        last_name: data.lastName,
        user_type: data.userType,
        school: data.school || null,
      };

      const { error: profileError } = await supabase
        .from("profiles")
        .insert([profileData])
        .select();

      if (profileError) {
        throw new Error(`Failed to create profile: ${profileError.message}`);
      }

      setIsLoading(false);
      return { success: true, email: data.email };
    } catch (err: any) {
      setError(err.message || "An error occurred during registration");
      setIsLoading(false);
      return { success: false, error: err.message };
    }
  };

  const signIn = async (data: SignInData) => {
    setIsLoading(true);
    setError("");

    try {
      const { data: authData, error } = await supabase.auth.signInWithPassword({
        email: data.email,
        password: data.password,
      });

      if (error) {
        throw new Error(error.message);
      }

      if (!authData.user) {
        throw new Error("Sign in failed. Please try again.");
      }

      setIsLoading(false);
      return { success: true };
    } catch (err: any) {
      setError(err.message || "An error occurred during sign in");
      setIsLoading(false);
      return { success: false, error: err.message };
    }
  };

  const signOut = async () => {
    setIsLoading(true);
    setError("");

    try {
      // Clear user state immediately
      setUser(null);

      const { error } = await supabase.auth.signOut({ scope: "local" });

      if (error) {
        throw new Error(error.message);
      }

      // Clear any additional local storage items
      localStorage.removeItem("supabase.auth.token");

      setIsLoading(false);
      return { success: true };
    } catch (err: any) {
      setError(err.message || "Logout failed");
      setIsLoading(false);
      return { success: false, error: err.message };
    }
  };

  const resendVerificationEmail = async (email: string) => {
    setError("");

    try {
      const { error } = await supabase.auth.resend({
        type: "signup",
        email: email,
      });

      if (error) {
        throw new Error(`Failed to resend: ${error.message}`);
      }

      return { success: true };
    } catch (err: any) {
      setError(err.message || "Failed to resend email");
      return { success: false, error: err.message };
    }
  };

  return {
    user,
    isLoading,
    isCheckingAuth,
    error,
    setError,
    signUp,
    signIn,
    signOut,
    resendVerificationEmail,
  };
}