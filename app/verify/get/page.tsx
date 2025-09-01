"use client";

import { useState } from "react";
import { useAuthContext } from "../../stores/auth_store";
import { useRouter } from "next/navigation";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { DotPattern } from "@/components/ui/dot-pattern";
import Link from "next/link";
import { IconMoon, IconSun } from "@tabler/icons-react";
import { useTheme } from "next-themes";
import { toast } from "sonner";

export default function GetOTPPage() {
    const { theme, setTheme } = useTheme();
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