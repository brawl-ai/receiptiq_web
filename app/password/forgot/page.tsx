"use client";

import { useState } from "react";
import Link from "next/link";
import { useTheme } from "next-themes";
import { IconSun, IconMoon } from '@tabler/icons-react';
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { useAuthContext } from "../../stores/auth_store";

export default function ForgotPasswordPage() {
    const [loading, setLoading] = useState(false);
    const [errors, setErrors] = useState([]);
    const forgotPassword = useAuthContext((s) => s.forgotPassword);
    const [formState, setFormState] = useState({ email: "" });
    const [formError, setFormError] = useState("");

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setFormError("");
        setErrors([]);
        if (!/^\S+@\S+$/.test(formState.email)) {
            setFormError("Invalid email");
            setLoading(false);
            return;
        }
        try {
            const response = await forgotPassword({ email: formState.email });
            // You may want to use a toast here for success
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

    const { theme, setTheme } = useTheme();
    return (
        <div className="bg-muted min-h-svh flex flex-col">
            {/* Header */}
            <header className="w-full flex items-center justify-between px-6 py-4 bg-transparent">
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
            {/* Main forgot password form */}
            <div className="flex flex-1 items-center justify-center p-6 md:p-10">
                <Card className="w-full max-w-sm md:max-w-md mx-auto">
                    <CardContent>
                        <form className="flex flex-col gap-6" onSubmit={handleSubmit}>
                            <div className="flex flex-col items-center text-center gap-1">
                                <h1 className="text-2xl font-bold">Forgot your password?</h1>
                                <p className="text-muted-foreground">Enter your email to get a reset link</p>
                            </div>
                            {formError && <div className="text-center text-red-500 font-medium">{formError}</div>}
                            {errors && errors.length > 0 && <div className="text-center text-red-500 font-medium">{errors.map((e, id) => <div key={id}>{e}</div>)}</div>}
                            <div className="grid gap-3">
                                <Label htmlFor="email">Email</Label>
                                <Input
                                    id="email"
                                    type="email"
                                    placeholder="you@example.com"
                                    required
                                    autoComplete="email"
                                    value={formState.email}
                                    onChange={e => setFormState({ email: e.target.value })}
                                    disabled={loading}
                                />
                            </div>
                            <div className="flex justify-between items-center mt-2">
                                <Link href="/login" className="text-sm underline-offset-2 hover:underline text-muted-foreground">Back to the login page</Link>
                                <Button type="submit" className="" disabled={loading} data-umami-event="reset_password_button@password.forgot">
                                    {loading ? "Sending..." : "Reset Password"}
                                </Button>
                            </div>
                        </form>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}
