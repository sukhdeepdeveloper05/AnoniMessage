"use client";

import { FormInput } from "@/components/ui/form-elements";
import { Button } from "@/components/ui/button";
import { zodResolver } from "@hookform/resolvers/zod";
import { Controller, useFieldArray, useForm } from "react-hook-form";
import { z } from "zod";
import { useParams } from "next/navigation";
import { toast } from "sonner";
import axios from "axios";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { ArrowRight, Ghost, Mail, RefreshCw } from "lucide-react";
import { useState } from "react";
import { Field, FieldContent } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSeparator,
  InputOTPSlot,
} from "@/components/ui/input-otp";
import { REGEXP_ONLY_DIGITS } from "input-otp";
import { signIn } from "next-auth/react";

const verifySchema = z.object({
  code: z
    .string()
    .length(6, "Verification code must be 6 digits long")
    .regex(/^[0-9]+$/, "Verification code must be numeric"),
});

export default function VerifyPage() {
  const router = useRouter();
  const params = useParams<{ username: string }>();
  const username = params.username;

  const form = useForm<z.infer<typeof verifySchema>>({
    resolver: zodResolver(verifySchema),
    defaultValues: {
      code: "",
    },
  });

  const onSubmit = async (data: z.infer<typeof verifySchema>) => {
    try {
      const res = await axios.post("/api/verify-code", {
        username,
        code: data.code,
      });

      if (!res.data.success) {
        toast.error(res.data.message);
        throw new Error(res.data.message);
      }

      await autoSignIn();
    } catch (error: any) {
      console.error("Error during verification:", error);
      let errorMessage =
        (error?.message || error.response?.data.message) ??
        "Verification failed";
      toast.error(errorMessage);
    }
  };

  async function autoSignIn() {
    const provider = sessionStorage.getItem("provider");

    if (provider === "google") {
      signIn("google", { callbackUrl: "/dashboard" });
      sessionStorage.removeItem("provider");
      return;
    } else {
      sessionStorage.removeItem("provider");
      router.replace(`/sign-in?identifier=${username}`);
    }
  }

  return (
    <div className="min-h-screen bg-background flex flex-col font-sans">
      {/* Background glow */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,var(--tw-gradient-stops))] from-primary/10 via-background to-background pointer-events-none" />

      {/* Nav */}
      <header className="relative z-10 flex items-center justify-between px-6 py-5 max-w-6xl mx-auto w-full">
        <Link
          href="/"
          className="flex items-center gap-2 font-heading font-bold text-foreground"
        >
          <Ghost className="w-5 h-5 text-primary" />
          AnoniMessage
        </Link>
        <Link
          href="/sign-in"
          className="text-sm text-muted-foreground hover:text-foreground transition-colors"
        >
          Back to sign in
        </Link>
      </header>

      <main className="flex-1 flex items-center justify-center px-4 py-12 relative z-10">
        <div className="w-full max-w-md">
          <div className="bg-card/60 backdrop-blur-xl border border-white/8 rounded-2xl p-8 shadow-[0_0_40px_rgba(124,58,237,0.08)]">
            {/* Icon */}
            <div className="flex justify-center mb-6">
              <div className="relative">
                <div className="w-16 h-16 rounded-2xl bg-primary/15 border border-primary/30 flex items-center justify-center shadow-[0_0_20px_rgba(124,58,237,0.2)]">
                  <Mail className="w-7 h-7 text-primary" />
                </div>
                <div className="absolute -top-1 -right-1 w-5 h-5 bg-secondary rounded-full flex items-center justify-center text-[10px] font-bold text-background">
                  6
                </div>
              </div>
            </div>

            <h1 className="font-heading text-2xl font-bold text-foreground text-center mb-1">
              Check your email
            </h1>
            <p className="text-muted-foreground text-sm text-center mb-8">
              We sent a 6-digit code to the address linked to{" "}
              <span className="text-secondary font-medium">@{username}</span>.
              Enter it below to verify your account.
            </p>

            {/* OTP inputs */}
            <div className="flex gap-2 justify-center mb-4">
              <form
                onSubmit={form.handleSubmit(onSubmit)}
                className="space-y-6"
              >
                <Controller
                  control={form.control}
                  name="code"
                  render={({ field }) => (
                    <InputOTP
                      maxLength={6}
                      pattern={REGEXP_ONLY_DIGITS}
                      {...field}
                    >
                      <InputOTPGroup>
                        <InputOTPSlot index={0} />
                        <InputOTPSlot index={1} />
                        <InputOTPSlot index={2} />
                        <InputOTPSlot index={3} />
                        <InputOTPSlot index={4} />
                        <InputOTPSlot index={5} />
                      </InputOTPGroup>
                    </InputOTP>
                  )}
                />
                <Button
                  type="submit"
                  className="w-full h-12 text-base"
                  disabled={form.formState.isSubmitting}
                >
                  {form.formState.isSubmitting ? (
                    <span className="flex items-center gap-2">
                      <RefreshCw className="w-4 h-4 animate-spin" /> Verifying…
                    </span>
                  ) : (
                    <span className="flex items-center gap-2">
                      Verify account <ArrowRight className="w-4 h-4" />
                    </span>
                  )}
                </Button>
              </form>
            </div>

            {/* Resend */}
            <div className="mt-5 text-center">
              <span className="text-xs text-muted-foreground">
                Didn't get it?{" "}
              </span>
              <button
                // onClick={handleResend}
                // disabled={resendCooldown > 0}
                className="text-xs text-secondary hover:text-primary transition-colors disabled:opacity-40 disabled:cursor-not-allowed font-medium"
              >
                {/* {resendCooldown > 0
                  ? `Resend in ${resendCooldown}s`
                  : "Resend code"} */}
                Resend Code
              </button>
            </div>
          </div>
        </div>
      </main>

      <footer className="relative z-10 py-6 border-t border-white/5 bg-background/80 backdrop-blur-sm">
        <p className="text-center text-xs text-muted-foreground">
          © {new Date().getFullYear()} AnoniMessage · All rights reserved
        </p>
      </footer>
    </div>
  );
}
