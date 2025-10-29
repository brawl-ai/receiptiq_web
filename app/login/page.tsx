"use client";

import { useState } from "react";
import Link from "next/link";
import { useTheme } from "next-themes";
import { IconSun, IconMoon } from '@tabler/icons-react';
import { useSearchParams } from "next/navigation";
import { useAuthContext } from "../stores/auth_store";
import { LoginForm } from "./login_form";
import { LoginRequest } from "../types";

export default function LoginPage() {
    const searchParams = useSearchParams()
    const [loading, setLoading] = useState(false);
    const [errors, setErrors] = useState([]);
    const login = useAuthContext((s) => s.login);
    const google_login = useAuthContext((s) => s.google_login);
    const redirect = searchParams.get("redirect");
    const { theme, setTheme } = useTheme();

    const handleSubmit = async (values: LoginRequest) => {
        setLoading(true);
        try {
            await login(values);
            window.location.href = redirect ? redirect : `/home/projects`;
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
                <div className="flex items-center gap-2">
                    {theme === 'dark' ?
                        <IconSun size={22} className="cursor-pointer" onClick={() => setTheme('light')} />
                        :
                        <IconMoon size={22} className="cursor-pointer" onClick={() => setTheme('dark')} />
                    }
                </div>
            </header>
            {/* Main login form */}
            <div className=" relative flex flex-1 items-center justify-center p-6 md:p-10">
                <div className="w-full max-w-sm md:max-w-3xl">
                    <LoginForm errors={errors} loading={loading} handleSubmit={handleSubmit} handleGoogleLogin={handleGoogleLogin} />
                </div>
            </div>
        </div>
    );
}
