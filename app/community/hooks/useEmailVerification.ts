"use client";

import { useState, useEffect } from "react";
import { supabase } from "../lib/supabase";
import type { RegistrationStep } from "../types/community";

export function useEmailVerification() {
  const [registrationStep, setRegistrationStep] =
    useState<RegistrationStep>("form");
  const [verificationEmail, setVerificationEmail] = useState("");
  const [waitingForConfirmation, setWaitingForConfirmation] = useState(false);

  // Monitor email confirmation
  useEffect(() => {
    if (!waitingForConfirmation) return;

    const checkEmailConfirmed = async () => {
      try {
        const {
          data: { session },
        } = await supabase.auth.getSession();

        if (session?.user?.email_confirmed_at) {
          setRegistrationStep("success");
          setWaitingForConfirmation(false);
        }
      } catch (err) {
        console.error("Email check error:", err);
      }
    };

    // Check every 2 seconds
    const interval = setInterval(checkEmailConfirmed, 2000);

    return () => clearInterval(interval);
  }, [waitingForConfirmation]);

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