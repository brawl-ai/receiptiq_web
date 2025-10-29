"use client";

import { useState } from "react";
import { useAuthContext } from "../../stores/auth_store";
import { useRouter } from "next/navigation";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import Link from "next/link";
import { toast } from "sonner";
import ThemeSwitcher from "@/components/ui/toggle-theme";

export default function GetOTPPage() {
    const [formState, setFormState] = useState({ email: "" });
    const [formError, setFormError] = useState("");
    const [errors, setErrors] = useState([]);
    const [loading, setLoading] = useState(false);
    const getOTP = useAuthContext((s) => s.getOTP);
    const router = useRouter();

    const validate = () => {
        if (!/^\S+@\S+$/.test(formState.email)) return "Invalid email";
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
            await getOTP({ email: formState.email });
            toast.success("If that email is registered, an OTP has been sent.");
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
            {/* Main OTP form */}
            <div className="relative flex flex-1 items-center justify-center p-6 md:p-10">
                <Card className="w-full max-w-sm mx-auto">
                    <CardContent>
                        <form className="flex flex-col gap-6" onSubmit={handleSubmit}>
                            <div className="flex flex-col items-center text-center gap-1">
                                <h1 className="text-2xl font-bold">Request an OTP</h1>
                                <p className="text-muted-foreground">Enter your email to get an OTP</p>
                            </div>
                            {formError && <div className="text-center text-red-500 font-medium">{formError}</div>}
                            {errors && errors.length > 0 && <div className="text-center text-red-500 font-medium">{errors.map((e, id) => <div key={id}>{e}</div>)}</div>}
                            <div className="grid gap-3">
                                <Label htmlFor="email">Email</Label>
                                <Input
                                    id="email"
                                    type="email"
                                    placeholder="me@company.com"
                                    required
                                    autoComplete="email"
                                    value={formState.email}
                                    onChange={e => setFormState({ email: e.target.value })}
                                    disabled={loading}
                                />
                            </div>
                            <Button
                                data-umami-event="get_otp_button@verify.get"
                                type="submit"
                                disabled={loading}
                            >{loading ? "Sending..." : "Get OTP"}</Button>
                        </form>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}