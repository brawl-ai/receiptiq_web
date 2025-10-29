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
import { DotPattern } from "@/components/ui/dot-pattern";
import { IconMoon, IconSun } from "@tabler/icons-react";
import { useTheme } from "next-themes";
import { cn } from "@/lib/utils";

export default function SignupPage() {
  const signup = useAuthContext((s) => s.signup);
  const google_login = useAuthContext((s) => s.google_login);
  const router = useRouter();
  const { theme, setTheme } = useTheme();

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
      <DotPattern className="opacity-40" />
      {/* Header */}
      <header className="w-full flex items-center justify-around px-6 py-4 bg-transparent">
        <div className="flex items-center gap-3">
          <Link href="/" className="flex items-center">
            <svg xmlns="http://www.w3.org/2000/svg" width="160" height="44" viewBox="0 0 220 64" className="text-blue-500 dark:text-blue-500">
              <rect x="2" y="2" width="40" height="40" rx="5" stroke="currentColor" strokeWidth="2" fill="transparent" />
              <path d="M12 22 L16 18 L20 26 L24 18 L28 26 L32 18 L36 26" stroke="currentColor" strokeWidth="3" fill="none" />
              <text x="50" y="32" fontFamily="Arial, sans-serif" fill="currentColor" fontSize="20" fontWeight="bold">ReceiptIQ</text>
            </svg>
          </Link>
        </div>
        <div className="flex items-center gap-2">
          {theme === 'dark' ?
            <IconSun size={22} className="cursor-pointer text-gray-300" onClick={() => setTheme('light')} />
            :
            <IconMoon size={22} className="cursor-pointer" onClick={() => setTheme('dark')} />
          }
        </div>
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
                  <div className="flex flex-row items-center justify-center rounded-md border-1 p-2 cursor-pointer" onClick={handleGoogleLogin}>
                    <Image src="assets/images/google_logo.png" alt="Google logo" width={25} />
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
                    className="w-full"
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
