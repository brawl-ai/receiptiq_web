"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { notFound, useRouter, useSearchParams } from "next/navigation";

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { useAuthContext } from "../../stores/auth_store";
import { toast } from "sonner";
import ThemeSwitcher from "@/components/ui/toggle-theme";

export default function ResetPasswordPage() {
    const [loading, setLoading] = useState(false);
    const [errors, setErrors] = useState([]);
    const resetPassword = useAuthContext((s) => s.resetPassword);
    const searchParams = useSearchParams();
    const router = useRouter();

    useEffect(() => {
        if (!searchParams.get("token") || !searchParams.get("email")) {
            notFound()
        }
    }, [searchParams])

    const [formState, setFormState] = useState({
        email: searchParams.get("email") || "",
        token: searchParams.get("token") || "",
        new_password: ""
    });
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
        if (formState.new_password.length < 8 || formState.new_password.length > 128) {
            setFormError("Password must be between 8 and 128 characters");
            setLoading(false);
            return;
        }
        if (!formState.token) {
            setFormError("Missing token, check url");
            setLoading(false);
            return;
        }
        try {
            await resetPassword(formState);
            toast.success("Password has been reset successfully. You can now log in.");
            router.push("/login");
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

    return (
        <div className="bg-muted min-h-svh flex flex-col">
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
            {/* Main reset password form */}
            <div className="flex flex-1 items-center justify-center p-6 md:p-10">
                <Card className="w-full max-w-sm md:max-w-md mx-auto">
                    <CardContent>
                        <form className="flex flex-col gap-6" onSubmit={handleSubmit}>
                            <div className="flex flex-col items-center text-center gap-1">
                                <h1 className="text-2xl font-bold">Reset your password</h1>
                                <p className="text-muted-foreground">Enter your new password below</p>
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
                                    disabled
                                />
                            </div>
                            <div className="grid gap-3">
                                <Label htmlFor="new_password">Password</Label>
                                <Input
                                    id="new_password"
                                    type="password"
                                    placeholder="***********"
                                    required
                                    value={formState.new_password}
                                    onChange={e => setFormState({ ...formState, new_password: e.target.value })}
                                    disabled={loading}
                                />
                            </div>
                            <div className="flex justify-between items-center mt-2">
                                <Link href="/password/forgot" className="text-sm underline-offset-2 hover:underline text-muted-foreground">Back to forgot password</Link>
                                <Button type="submit" className="" disabled={loading} data-umami-event="reset_password_button@password.reset">
                                    {loading ? "Resetting..." : "Reset Password"}
                                </Button>
                            </div>
                        </form>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}
