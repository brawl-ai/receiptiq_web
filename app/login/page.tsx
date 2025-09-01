"use client";

import { useState } from "react";
import Link from "next/link";
import { useTheme } from "next-themes";
import { IconSun, IconMoon } from '@tabler/icons-react';
import { useSearchParams } from "next/navigation";
import { useAuthContext } from "../stores/auth_store";
import { LoginForm } from "./login_form";
import { LoginRequest } from "../types";
import { DotPattern } from "@/components/ui/dot-pattern";

export default function LoginPage() {
    const searchParams = useSearchParams()
    const [loading, setLoading] = useState(false);
    const [errors, setErrors] = useState([]);
    const login = useAuthContext((s)=>s.login);
    const redirect = searchParams.get("redirect");
    const { theme, setTheme } = useTheme();

    const handleSubmit = async (values: LoginRequest) => {
        setLoading(true);
        try {
            console.log(values)
            await login(values);
            window.location.href = redirect ? redirect : `/dashboard`;
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
            {/* Main login form */}
            <div className=" relative flex flex-1 items-center justify-center p-6 md:p-10">
                <div className="w-full max-w-sm md:max-w-3xl">
                    <LoginForm errors={errors} loading={loading} handleSubmit={handleSubmit}/>
                </div>
            </div>
        </div>
    );
}
