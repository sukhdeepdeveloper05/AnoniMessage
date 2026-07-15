"use client";

import { useEffect, useState } from "react";
import { ApiResponse } from "@/types/ApiResponse";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { useDebounce } from "@/hooks/useDebounce";
import { signUpSchema } from "@/schemas/signUpSchema";
import axios, { AxiosError } from "axios";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import z from "zod";

import { Button } from "@/components/ui/button";
import { Ghost, Loader2, MessageSquare } from "lucide-react";
import { FormInput } from "@/components/ui/form-elements";
import { FieldDescription, FieldGroup } from "@/components/ui/field";
import { AppleIcon, GoogleIcon } from "@/components/icons";
import { signIn } from "next-auth/react";

export default function SignUpPage() {
  const params = useSearchParams();
  const email = params.get("email") || "";
  const fromGoogle = params.get("fromGoogle") === "true";
  const image = params.get("imageUrl") || "";

  return (
    <>
      <div className="text-center mb-8">
        <h1 className="text-3xl font-heading font-bold mb-2">
          Create an account
        </h1>
        <p className="text-muted-foreground">
          Get your own anonymous message board.
        </p>
      </div>

      <div className="space-y-4">
        <div className="grid grid-cols-1 gap-4">
          <Button
            variant="outline"
            className="w-full h-12 text-foreground text-base font-medium"
            onClick={async () => {
              const res = await signIn("google", {
                callbackUrl: "/dashboard",
                redirect: false,
              });

              console.log(res);
            }}
          >
            <GoogleIcon className="size-6" />
            Sign in with Google
          </Button>
          {/* <Button
            variant="outline"
            className="w-full h-12 text-foreground font-medium"
          >
            <AppleIcon className="size-6" />
            Apple
          </Button> */}
        </div>

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

        <SignUpForm email={email} fromGoogle={fromGoogle} imageUrl={image} />

        <p className="text-center text-sm text-muted-foreground mt-6">
          Already have an account?{" "}
          <Link
            href="/sign-in"
            className="text-primary hover:underline font-medium"
          >
            Sign in
          </Link>
        </p>
      </div>
    </>
  );
}

function SignUpForm({
  email,
  fromGoogle,
  imageUrl,
}: {
  email: string;
  fromGoogle: boolean;
  imageUrl: string;
}) {
  const [username, setUsername] = useState("");
  const [usernameMessage, setUsernameMessage] = useState("");
  const [isCheckingUsername, setIsCheckingUsername] = useState(false);

  const debounceUsername = useDebounce(username, 300);

  const router = useRouter();

  const form = useForm<z.infer<typeof signUpSchema>>({
    resolver: zodResolver(signUpSchema),
    defaultValues: {
      username: "",
      email: email || "",
      password: "",
    },
  });

  useEffect(() => {
    if (debounceUsername && debounceUsername.length >= 2) {
      setIsCheckingUsername(true);
      const checkUsernameUnique = async () => {
        try {
          const res = await axios.get<ApiResponse>(
            `/api/verify-username-unique`,
            {
              params: {
                username: debounceUsername,
              },
            }
          );

          setUsernameMessage(res.data.message);
        } catch (error) {
          const axiosError = error as AxiosError<ApiResponse>;
          let errorMessage = axiosError.response?.data.message;
          setUsernameMessage(errorMessage ?? "Error checking username");
        } finally {
          setIsCheckingUsername(false);
        }
      };
      checkUsernameUnique();
    } else {
      setUsernameMessage("");
    }
  }, [debounceUsername]);

  const onSubmit = async (data: z.infer<typeof signUpSchema>) => {
    try {
      const res = await axios.post<ApiResponse>("/api/sign-up", {
        ...data,
        isVerified: fromGoogle,
        imageUrl: imageUrl || undefined,
      });

      if (!res.data.success) {
        toast.error(res.data.message);
        return;
      }
      toast.success(res.data.message);

      if (fromGoogle) {
        // Automatically sign in via Google to proceed directly to the dashboard
        await signIn("google", { callbackUrl: "/dashboard" });
      } else {
        sessionStorage.setItem("provider", "credentials");
        router.replace(`/verify/${debounceUsername}`);
      }
    } catch (error) {
      const axiosError = error as AxiosError<ApiResponse>;
      let errorMessage = axiosError.response?.data.message;

      toast.error(
        errorMessage ??
          "There was a problem with your sign-up. Please try again."
      );
    }
  };

  return (
    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
      <FieldGroup>
        <FormInput
          name="username"
          id="username"
          control={form.control}
          label="Username"
          autoComplete="off"
          onChange={(e) => {
            setUsername(e.target.value);
            form.setValue("username", e.target.value, {
              shouldValidate: true,
            });
          }}
          value={username}
          showErrors={usernameMessage.trim() === ""}
        >
          <FieldDescription
            className={cn(
              isCheckingUsername
                ? "text-primary-foreground"
                : usernameMessage === "Username is available"
                  ? "text-green-500"
                  : "text-destructive"
            )}
          >
            {isCheckingUsername ? (
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            ) : (
              usernameMessage
            )}
          </FieldDescription>
        </FormInput>
        <FormInput
          name="email"
          id="email"
          control={form.control}
          label="Email"
        />

        <FormInput
          name="password"
          control={form.control}
          label="Password"
          type="password"
          id="password"
        />
      </FieldGroup>
      <Button
        type="submit"
        className="w-full h-12 text-base cursor-pointer"
        disabled={form.formState.isSubmitting || isCheckingUsername}
      >
        {form.formState.isSubmitting ? (
          <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            Please wait
          </>
        ) : (
          "Create Account"
        )}
      </Button>
    </form>
  );
}
