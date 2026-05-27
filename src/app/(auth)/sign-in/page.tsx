"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { signInSchema } from "@/schemas/signInSchema";
import { FormInput } from "@/components/ui/form-elements";
import { toast } from "sonner";
import axios, { AxiosError } from "axios";
import { signIn } from "next-auth/react";
import { Loader2, RefreshCw } from "lucide-react";
import { GoogleIcon } from "@/components/icons";

export default function SignInPage() {
  const searchParams = useSearchParams();
  const identifier = searchParams.get("identifier");

  const router = useRouter();

  const form = useForm<z.infer<typeof signInSchema>>({
    resolver: zodResolver(signInSchema),
    defaultValues: {
      identifier: identifier || "",
      password: "",
    },
  });

  const onSubmit = async (data: z.infer<typeof signInSchema>) => {
    try {
      const result = await signIn("credentials", {
        identifier: data.identifier,
        password: data.password,
        redirect: false,
      });
      if (result?.error) {
        toast.error(result.error);
      } else {
        toast.success("Signed in successfully");
        router.push("/dashboard");
      }
    } catch (error: any) {
      toast.error(error.message);
    }
  };

  return (
    <>
      <div className="text-center mb-8">
        <h1 className="text-3xl font-heading font-bold mb-2">Sign in</h1>
        <p className="text-muted-foreground">Welcome back to AnoniMessage.</p>
      </div>

      <div className="space-y-4">
        <Button
          variant="outline"
          className="w-full h-12 text-foreground text-base font-medium"
          onClick={async () => {
            await signIn("google", {
              callbackUrl: "/dashboard",
            });
          }}
        >
          <GoogleIcon className="size-6" />
          Sign in with Google
        </Button>

        <div className="relative">
          <div className="absolute inset-0 flex items-center">
            <span className="w-full border-t border-white/10" />
          </div>
          <div className="relative flex justify-center text-xs uppercase">
            <span className="bg-background px-2 text-muted-foreground">
              Or continue with
            </span>
          </div>
        </div>

        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <FormInput
            name="identifier"
            control={form.control}
            label="Email/Username"
            id="identifier"
          />
          <FormInput
            name="password"
            control={form.control}
            label="Password"
            type="password"
            id="password"
          />
          <Button
            className="w-full h-12 text-base cursor-pointer"
            type="submit"
            data-loading={!!form.formState.isSubmitting}
          >
            {form.formState.isSubmitting ? (
              <>
                <RefreshCw className="w-4 h-4 animate-spin" />
                Please wait
              </>
            ) : (
              "Sign In"
            )}
          </Button>
        </form>

        <p className="text-center text-sm text-muted-foreground mt-6">
          New here?{" "}
          <Link
            href="/sign-up"
            className="text-primary hover:underline font-medium"
          >
            Create an account
          </Link>
        </p>
      </div>
    </>
  );
}
