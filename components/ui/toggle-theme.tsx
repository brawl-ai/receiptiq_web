"use client";

import { IconMoon, IconSun } from "@tabler/icons-react";
import { useTheme } from "next-themes";
import { useEffect, useState } from "react";

export default function ThemeSwitcher() {
    const { theme, setTheme } = useTheme();
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
    }, []);

    return (
        <div className="flex items-center gap-2">
            {mounted && (
                theme === 'dark' ?
                    <IconSun size={22} className="cursor-pointer" onClick={() => setTheme('light')} />
                    :
                    <IconMoon size={22} className="cursor-pointer" onClick={() => setTheme('dark')} />
            )}
        </div>
    )


}