"use client";

import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { OctagonAlertIcon } from "lucide-react";
import { useForm } from "react-hook-form";
import Link from "next/link";
import { authClient } from "@/lib/auth-client";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Alert, AlertTitle } from "@/components/ui/alert";
import { FaGithub, FaGoogle } from "react-icons/fa";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";

const formSchema = z.object({
  email: z.string().email(),
  password: z.string().min(1, { message: "Password is required" }),
});


export default function SignInView() {
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);
  const [pending, setPending] = useState(false);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const onSubmit = (data: z.infer<typeof formSchema>) => {
    setError(null);
    setPending(true);

    authClient.signIn.email(
      {
        email: data.email,
        password: data.password,
        callbackURL: "/"
      },
      {
        onSuccess: () => {
          setPending(false);
          router.push("/");
        },
        onError: (errorResponse: any) => {
          setPending(false);
          // Log actual error shape for debugging
          console.error("Sign-in error:", errorResponse);
          const message =
            errorResponse?.error?.message ||
            errorResponse?.message ||
            "Something went wrong";
          setError(message);
        },
      }
    );
  };

  const onSocial = (provider: "github" | "google") => {
    setError(null);
    setPending(true);

    authClient.signIn.social(
      { provider: provider,
        callbackURL: "/"
      },
      {
        onSuccess: () => {
          setPending(false);
          
        },
        onError: (errorResponse: any) => {
          setPending(false);
          console.error("Social sign-in error:", errorResponse);
          const message =
            errorResponse?.error?.message ||
            errorResponse?.message ||
            "Something went wrong";
          setError(message);
        },
      }
    );
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-muted py-12">
      <div className="w-full max-w-2xl">
        <Card className="rounded-2xl shadow-lg bg-white overflow-hidden border">
          <CardContent className="grid grid-cols-1 md:grid-cols-2 p-0">
            {/* Left: form */}
            <div className="flex items-center justify-center">
              <Form {...form}>
                <form
                  onSubmit={form.handleSubmit(onSubmit)}
                  noValidate
                  className="p-8 w-full max-w-[350px] mx-auto"
                >
                  <div className="flex flex-col gap-6">
                    <div className="flex flex-col items-center text-center">
                      <h1 className="text-2xl font-bold">Welcome Back</h1>
                      <p className="text-muted-foreground text-balance mt-2">
                        Login to your account
                      </p>
                    </div>
                    <div className="grid gap-3">
                      <FormField
                        control={form.control}
                        name="email"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Email</FormLabel>
                            <FormControl>
                              <Input
                                type="email"
                                placeholder="m@example.com"
                                {...field}
                                disabled={pending}
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={form.control}
                        name="password"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Password</FormLabel>
                            <FormControl>
                              <Input
                                type="password"
                                placeholder="********"
                                {...field}
                                disabled={pending}
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                    {!!error && (
                      <Alert className="bg-destructive/10 border-none">
                        <OctagonAlertIcon className="h-4 w-4 !text-destructive" />
                        <AlertTitle>{error}</AlertTitle>
                      </Alert>
                    )}
                    <Button type="submit" className="w-full" disabled={pending}>
                      Sign in
                    </Button>
                    <div className="relative flex items-center py-2">
                      <div className="flex-grow border-t border-border"></div>
                      <span className="mx-2 bg-card text-muted-foreground px-2">
                        Or continue with
                      </span>
                      <div className="flex-grow border-t border-border"></div>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <Button
                        variant="outline"
                        type="button"
                        className="w-full"
                        disabled={pending}
                        onClick={() => onSocial("google")}
                      >
                        <FaGoogle/>
                      </Button>
                      <Button
                        variant="outline"
                        type="button"
                        className="w-full"
                        disabled={pending}
                        onClick={() => onSocial("github")}
                      >
                        <FaGithub/>
                      </Button>
                    </div>
                    <div className="text-center text-sm">
                      Don't have an account?{" "}
                      <Link href="/sign-up" className="underline underline-offset-4">
                        Sign up
                      </Link>
                    </div>
                  </div>
                </form>
              </Form>
            </div>
            {/* Right: logo panel */}
            <div className="bg-radial from-sidebar-accent to-sidebar relative hidden md:flex flex-col gap-y-4 items-center justify-center">
              <img src="/logo.svg" alt="Logo" className="h-[92px] w-[92px]" />
              <p className="text-2xl font-semibold text-white mt-6">Meet.AI</p>
            </div>
          </CardContent>
        </Card>
        {/* Terms block - OUTSIDE the Card */}
        <div className="text-muted-foreground text-center text-xs mt-4 w-full">
          By clicking continue, you agree to our{" "}
          <a href="#" className="underline underline-offset-4 hover:text-primary">
            Terms of Service
          </a>{" "}
          and{" "}
          <a href="#" className="underline underline-offset-4 hover:text-primary">
            Privacy Policy
          </a>
        </div>
      </div>
    </div>
  );
}
