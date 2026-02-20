"use client";

import { useState, useEffect } from "react";
import { supabase } from "../lib/supabase";
import type { User, RegistrationData, SignInData } from "../types/community";

export function useAuth() {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isCheckingAuth, setIsCheckingAuth] = useState(true);
  const [error, setError] = useState("");

  const buildUser = async (supabaseUser: any): Promise<User> => {
    const { data: profile } = await supabase
      .from("profiles")
      .select("*")
      .eq("id", supabaseUser.id)
      .single();

    return {
      id: supabaseUser.id,
      email: supabaseUser.email || "",
      firstName: profile?.first_name || "",
      lastName: profile?.last_name || "",
    };
  };

  useEffect(() => {
    let mounted = true;

    const initAuth = async () => {
      const {
        data: { session },
      } = await supabase.auth.getSession();

      if (!mounted) return;

      if (session?.user) {
        const builtUser = await buildUser(session.user);
        if (mounted) setUser(builtUser);
      } else {
        setUser(null);
      }

      setIsCheckingAuth(false);
    };

    initAuth();

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (event, session) => {
      if (!mounted) return;

      if (session?.user) {
        const builtUser = await buildUser(session.user);
        if (mounted) setUser(builtUser);
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
      const { data: existingUser, error: checkError } = await supabase
        .from("profiles")
        .select("email")
        .eq("email", data.email)
        .single(); 

      if (existingUser) {
        throw new Error("This email is already registered. Please sign in instead.");
      }

      const { data: authData, error: authError } = await supabase.auth.signUp({
        email: data.email,
        password: data.password,
      });

      if (authError) {
        if (authError.message.includes("already registered") || authError.message.includes("already been registered")) {
          throw new Error("This email is already registered. Please sign in instead.");
        }
        throw new Error(authError.message);
      }
      
      if (!authData.user) throw new Error("Registration failed. Please try again.");
      const { data: existingProfile } = await supabase
        .from("profiles")
        .select("id")
        .eq("id", authData.user.id)
        .single();

      if (!existingProfile) {
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
          if (profileError.code !== "23505") {
            throw new Error(`Failed to create profile: ${profileError.message}`);
          }
        }
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
      const { data: authData, error: signInError } =
        await supabase.auth.signInWithPassword({
          email: data.email,
          password: data.password,
        });

      if (signInError) throw new Error(signInError.message);
      if (!authData.user) throw new Error("Sign in failed. Please try again.");

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
      setUser(null);

      const { error: signOutError } = await supabase.auth.signOut({
        scope: "local",
      });

      if (signOutError) throw new Error(signOutError.message);

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
      const { error: resendError } = await supabase.auth.resend({
        type: "signup",
        email,
      });

      if (resendError) throw new Error(`Failed to resend: ${resendError.message}`);

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