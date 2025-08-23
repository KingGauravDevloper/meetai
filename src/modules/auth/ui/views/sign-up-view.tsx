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
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";

// Zod schema including name & confirm password with validation
const signUpSchema = z
  .object({
    name: z.string().min(1, { message: "Name is required" }),
    email: z.string().email(),
    password: z.string().min(1, { message: "Password is required" }),
    confirmpassword: z.string().min(1, { message: "Confirm Password is required" }),
  })
  .refine((data) => data.password === data.confirmpassword, {
    message: "Passwords do not match",
    path: ["confirmpassword"],
  });

export default function SignUpView() {
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);
  const [pending, setPending] = useState(false);

  const form = useForm<z.infer<typeof signUpSchema>>({
    resolver: zodResolver(signUpSchema),
    defaultValues: {
      name: "",
      email: "",
      password: "",
      confirmpassword: "",
    },
  });

  const onSubmit = (data: z.infer<typeof signUpSchema>) => {
    setError(null);
    setPending(true);

    // Adjust this call to your sign-up API or authClient method
    authClient.signUp.email(
      {
        name: data.name,
        email: data.email,
        password: data.password,
        callbackURL: "/"
      },
      {
        onSuccess: () => {
          setPending(false);
          router.push("/");
          
        },
        onError: ({ error }) => {
          setPending(false);
          const message = error?.error?.message || error?.message || "Something went wrong";
          setError(message);
        },
      }
    );
  };

  const onSocial = (provider: "github" | "google") => {
    setError(null);
    setPending(true);

    authClient.signIn.social(
      {
        provider: provider, 
        callbackURL: "/"
      },
      {
        onSuccess: () => {
          setPending(false);
        },
        onError: ({ error }) => {
          setPending(false);
          const message = error?.error?.message || error?.message || "Something went wrong";
          setError(message);
        },
      }
    );
  };

  return (
    <Card className="flex overflow-hidden rounded-2xl shadow-lg bg-white">
      <CardContent className="grid p-0 md:grid-cols-2 w-full">
        {/* Left side: form */}
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            noValidate
            className="p-8 w-full"
          >
            <div className="flex flex-col gap-6">
              <div className="flex flex-col items-center text-center">
                <h1 className="text-2xl font-bold">Let's get started</h1>
                <p className="text-muted-foreground text-balance mt-2">
                  Create Your Account
                </p>
              </div>
              <div className="grid gap-3">
                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Name</FormLabel>
                      <FormControl>
                        <Input
                          type="text"
                          placeholder="Your Name"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
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
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="confirmpassword"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Confirm Password</FormLabel>
                      <FormControl>
                        <Input
                          type="password"
                          placeholder="********"
                          {...field}
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
                Sign up
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
                onClick={() => onSocial("google") }
                >
                  Google
                </Button>
                <Button variant="outline" type="button" className="w-full" disabled={pending}
                onClick={() => onSocial("github") }>
                  Github
                </Button>
              </div>
              <div className="text-center text-sm">
                Already have an account?{" "}
                <Link href="/sign-in" className="underline underline-offset-4">
                  Sign in
                </Link>
              </div>
            </div>
          </form>
        </Form>
        {/* Right side: logo, green background */}
        <div className="bg-gradient-to-br from-green-700 to-green-900 flex flex-col items-center justify-center rounded-r-2xl p-12 w-full">
          <img src="/logo.svg" alt="Logo" className="h-[92px] w-[92px]" />
          <p className="text-2xl font-semibold text-white mt-6">Meet.AI</p>
        </div>
      </CardContent>
      <div className="text-muted-foreground *:[a]:hover:text-primary text-center text-xs text-balance *:[a]:underline *:[a]:underline-offset-4 mt-4 w-full">
        By clicking continue, you agree to our <a href="#">Terms of Service</a> and <a href="#">Privacy Policy</a>
      </div>
    </Card>
  );
}
