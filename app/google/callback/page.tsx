"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useAuthContext } from "@/app/stores/auth_store";
import { Badge } from "@/components/ui/badge";
import { Spinner } from "@/components/ui/spinner";
import ThemeSwitcher from "@/components/ui/toggle-theme";

export default function GoogleAuthCallback() {
    const searchParams = useSearchParams()
    const [loading, setLoading] = useState(false);
    const [errors, setErrors] = useState([]);
    const google_callback = useAuthContext((s) => s.google_callback);
    const code = searchParams.get("code");
    const redirect = searchParams.get("redirect");
    const hasRun = useRef(false);


    const handleGoogleCallback = async () => {
        console.log("Finishing Google Login")
        setLoading(true);
        try {
            const response = await google_callback({ code });
            if (response.success) {
                window.location.href = redirect ? redirect : `/home/projects`;
            }
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

    useEffect(() => {
        if (hasRun.current) return;
        hasRun.current = true;
        handleGoogleCallback()
    })

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
            <div className="flex items-center justify-center p-6 md:p-10">
                <div>
                    {loading && (
                        <Badge className="bg-transparent text-primary border--1">
                            <Spinner className="size-6" />
                            Logging In...
                        </Badge>)}
                    {errors && <div className="text-center text-red-500 font-medium">
                        {errors.map((e, id) => <div className={"text-red-500"} key={id}>{e}</div>)}
                    </div>}

                </div>
            </div>
        </div>
    );
}