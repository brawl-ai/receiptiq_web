"use client";

import { useState } from "react";
import { useAuthContext } from "../stores/auth_store";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import Image from "next/image";
import { cn } from "@/lib/utils";
import ThemeSwitcher from "@/components/ui/toggle-theme";

export default function SignupPage() {
  const signup = useAuthContext((s) => s.signup);
  const google_login = useAuthContext((s) => s.google_login);
  const router = useRouter();

  const [formState, setFormState] = useState({
    first_name: "",
    last_name: "",
    email: "",
    password: "",
    confirm_password: "",
    accepted_terms: false
  });
  const [formError, setFormError] = useState("");
  const [errors, setErrors] = useState([]);
  const [loading, setLoading] = useState(false);

  const validate = () => {
    if (formState.first_name.length < 2) return "First name must be at least 2 characters";
    if (formState.last_name.length < 2) return "Last name must be at least 2 characters";
    if (!/^\S+@\S+$/.test(formState.email)) return "Invalid email";
    if (formState.password.length < 8 || formState.password.length > 128) return "Password must be between 8 and 128 characters";
    if (formState.confirm_password !== formState.password) return "Passwords do not match";
    if (!formState.accepted_terms) return "Please read and accept the terms";
    return null;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setFormError("");
    setErrors([]);
    const errorMsg = validate();
    if (errorMsg) {
      setFormError(errorMsg);
      setLoading(false);
      return;
    }
    try {
      await signup(formState);
      router.push(`/verify/check?email=${encodeURIComponent(formState.email)}`);
    } catch (error) {
      let errors = [];
      if (error.response?.data?.detail?.errors) {
        errors = error.response?.data?.detail?.errors.map(e => e)
      } else {
        errors.push(error.response?.data?.detail)
      }
      setErrors(errors);
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleLogin = async () => {
    setLoading(true);
    try {
      const response = await google_login();
      window.location.href = response.redirect_to
    } catch (error) {
      console.log(error)
      let errors = []
      if (error.response?.data?.detail instanceof Array) {
        errors = error.response?.data?.detail.map(e => e.loc[1] + " " + e.msg)
      } else if (error.response?.data?.detail?.errors) {
        errors = error.response?.data?.detail?.errors.map(e => e)
      }
      else {
        errors.push(error.response?.data?.detail)
      }
      setErrors(errors)
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative bg-muted min-h-svh flex flex-col">
      {/* Header */}
      <header className="w-full flex justify-between px-6 py-4 bg-transparent">
        <div className="flex gap-3">
          <Link href="/" className="flex items-center">
            <svg xmlns="http://www.w3.org/2000/svg" width="200" height="45" viewBox="0 0 220 64" className="mt-2">
              {/* Rounded square on the left */}
              <rect x="2" y="2" width="60" height="60" rx="5" stroke="currentColor" strokeWidth="2" fill="white" />
              {/* Squiggly line in the center */}
              <path d="M12 32 L16 28 L20 36 L24 28 L28 36 L32 28 L36 36 L40 28 L44 36 L48 28 L52 36 L55 32" stroke="black" strokeWidth="3" fill="none" />
              {/* Text next to it */}
              <text x="75" y="40" fontFamily="Roboto, sans-serif" fill="currentColor" fontSize="30">
                ReceiptIQ
              </text>
            </svg>
          </Link>
        </div>
        <ThemeSwitcher />
      </header>
      {/* Main signup form */}
      <div className=" relative flex flex-1 items-center justify-center p-6 md:p-10">
        <div className="w-full max-w-sm md:max-w-4xl">
          <div className={cn("flex flex-col gap-6")}>
            <Card className="overflow-hidden p-0">
              <CardContent className="grid p-0 md:grid-cols-2">
                <form className="p-6 md:p-8 flex flex-col gap-6" onSubmit={handleSubmit}>
                  <div className="flex flex-col items-center text-center gap-1">
                    <h1 className="text-2xl font-bold">Create an account</h1>
                    <p className="text-muted-foreground">Already have an account?{' '}
                      <Link href="/login" className="underline underline-offset-4">Log in</Link>
                    </p>
                  </div>
                  <div className="flex flex-row items-center justify-center rounded-md border-1 p-2 cursor-pointer shadow-sm" onClick={handleGoogleLogin}>
                    <Image src="assets/images/google_logo.png" alt="Google logo" width={25} height={25} />
                    <span className="px-2">Sign in with Google</span>
                  </div>
                  {formError && <div className="text-center text-red-500 font-medium">{formError}</div>}
                  {errors && errors.length > 0 && <div className="text-center text-red-500 font-medium">{errors.map((e, id) => <div key={id}>{e}</div>)}</div>}
                  <div className="grid gap-3">
                    <Label htmlFor="first_name">First Name</Label>
                    <Input
                      id="first_name"
                      type="text"
                      placeholder="John"
                      required
                      value={formState.first_name}
                      onChange={e => setFormState({ ...formState, first_name: e.target.value })}
                      disabled={loading}
                    />
                  </div>
                  <div className="grid gap-3">
                    <Label htmlFor="last_name">Last Name</Label>
                    <Input
                      id="last_name"
                      type="text"
                      placeholder="Doe"
                      required
                      value={formState.last_name}
                      onChange={e => setFormState({ ...formState, last_name: e.target.value })}
                      disabled={loading}
                    />
                  </div>
                  <div className="grid gap-3">
                    <Label htmlFor="email">Email</Label>
                    <Input
                      id="email"
                      type="email"
                      placeholder="you@example.com"
                      required
                      autoComplete="email"
                      value={formState.email}
                      onChange={e => setFormState({ ...formState, email: e.target.value })}
                      disabled={loading}
                    />
                  </div>
                  <div className="grid gap-3">
                    <Label htmlFor="password">Password</Label>
                    <Input
                      id="password"
                      type="password"
                      placeholder="***********"
                      required
                      value={formState.password}
                      onChange={e => setFormState({ ...formState, password: e.target.value })}
                      disabled={loading}
                    />
                  </div>
                  <div className="grid gap-3">
                    <Label htmlFor="confirm_password">Confirm Password</Label>
                    <Input
                      id="confirm_password"
                      type="password"
                      placeholder="***********"
                      required
                      value={formState.confirm_password}
                      onChange={e => setFormState({ ...formState, confirm_password: e.target.value })}
                      disabled={loading}
                    />
                  </div>
                  <div className="flex items-center gap-2">
                    <Checkbox
                      id="accepted_terms"
                      checked={formState.accepted_terms}
                      onCheckedChange={checked => setFormState({ ...formState, accepted_terms: Boolean(checked) })}
                      disabled={loading}
                    />
                    <Label htmlFor="accepted_terms">
                      I accept <a href="/docs/ReceiptIQ Terms and Conditions.pdf" target="_blank" className="underline underline-offset-4">terms and conditions</a>
                    </Label>
                  </div>
                  <Button
                    type="submit"
                    className="w-full shadow-md"
                    disabled={loading}
                    data-umami-event="signup_button@signup"
                  >
                    {loading ? "Signing up..." : "Signup"}
                  </Button>
                </form>
                <div className="relative grid md:block">
                  <Image
                    width={600}
                    height={400}
                    src="/assets/images/bg2.jpg"
                    alt="Authentication background"
                    className="absolute inset-0 h-full w-full object-cover dark:brightness-[0.9] dark:contrast-more"
                  />
                </div>
              </CardContent>
            </Card>
            <div className="text-muted-foreground text-center text-xs mt-4">
              By clicking signup, you agree to our <a href="/docs/ReceiptIQ Terms and Conditions.pdf" className="underline underline-offset-4">Terms of Service</a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
