"use client";

import { useState, useEffect, useRef } from "react";
import { supabase } from "../lib/supabase";
import type { RegistrationStep } from "../types/community";

export function useEmailVerification() {
  const [registrationStep, setRegistrationStep] =
    useState<RegistrationStep>("form");
  const [verificationEmail, setVerificationEmail] = useState("");
  const [waitingForConfirmation, setWaitingForConfirmation] = useState(false);

  const waitingRef = useRef(false);

  useEffect(() => {
    waitingRef.current = waitingForConfirmation;
  }, [waitingForConfirmation]);

  // Method 1: onAuthStateChange — fires if confirmation happens in same tab
  useEffect(() => {
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((event, session) => {
      if (
        (event === "SIGNED_IN" || event === "USER_UPDATED") &&
        session?.user?.email_confirmed_at &&
        waitingRef.current
      ) {
        setRegistrationStep("success");
        setWaitingForConfirmation(false);
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  // Method 2: Check session when user returns to this tab after confirming
  // in a different tab (the most common flow)
  useEffect(() => {
    const handleVisibilityChange = async () => {
      if (document.visibilityState === "visible" && waitingRef.current) {
        const {
          data: { session },
        } = await supabase.auth.getSession();

        if (session?.user?.email_confirmed_at) {
          setRegistrationStep("success");
          setWaitingForConfirmation(false);
        }
      }
    };

    document.addEventListener("visibilitychange", handleVisibilityChange);
    return () =>
      document.removeEventListener("visibilitychange", handleVisibilityChange);
  }, []);

  // Method 3: Fallback polling every 3 seconds while waiting
  // Catches edge cases where neither of the above fire
  useEffect(() => {
    if (!waitingForConfirmation) return;

    const interval = setInterval(async () => {
      const {
        data: { session },
      } = await supabase.auth.getSession();

      if (session?.user?.email_confirmed_at) {
        setRegistrationStep("success");
        setWaitingForConfirmation(false);
      }
    }, 3000);

    return () => clearInterval(interval);
  }, [waitingForConfirmation]);

  // Method 4: Handle hash-based token flow (implicit flow)
  // Supabase redirects to /#access_token=... when no callback route is used.
  // This detects those tokens on mount, lets Supabase consume them,
  // then shows the success screen — no button click needed.
  useEffect(() => {
    const hash = window.location.hash;
    if (!hash) return;

    const params = new URLSearchParams(hash.slice(1)); // strip leading #
    const type = params.get("type");
    const accessToken = params.get("access_token");

    if (type === "signup" && accessToken) {
      // Supabase JS v2 automatically picks up the hash tokens and fires
      // onAuthStateChange with SIGNED_IN. We just need to set up the
      // "waiting" state so the success screen can render when it fires.
      // We also clear the ugly hash from the URL immediately.
      window.history.replaceState(null, "", window.location.pathname);

      // Force a session check — Supabase may have already processed the hash
      supabase.auth.getSession().then(({ data: { session } }) => {
        if (session?.user?.email_confirmed_at) {
          setRegistrationStep("success");
          // Also make sure the modal is visible by setting showRegisterModal
          // via the flag that page.tsx checks
          setWaitingForConfirmation(false);
        } else {
          // Not yet processed — wait for onAuthStateChange to fire
          setWaitingForConfirmation(true);
          setRegistrationStep("waiting");
        }
      });
    }
  }, []);

  const startWaitingForVerification = (email: string) => {
    setVerificationEmail(email);
    setRegistrationStep("waiting");
    setWaitingForConfirmation(true);
  };

  const resetVerification = () => {
    setRegistrationStep("form");
    setVerificationEmail("");
    setWaitingForConfirmation(false);
  };

  return {
    registrationStep,
    verificationEmail,
    setRegistrationStep,
    startWaitingForVerification,
    resetVerification,
  };
}