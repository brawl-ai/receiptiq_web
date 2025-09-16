"use client";

import { SidebarContent, SidebarGroup, SidebarGroupContent, SidebarMenu, SidebarMenuButton, SidebarMenuItem } from "@/components/ui/sidebar";
import Link from "next/link";
import { IconFolder, IconUserCircle, IconWallet } from "@tabler/icons-react";
import { usePathname } from "next/navigation";

export function SidebarNavigation() {
    const pathname = usePathname();

    const navItems = [
        { icon: <IconFolder size={30} />, label: "Projects", value: "projects" },
        { icon: <IconWallet size={30} />, label: "Billing", value: "billing" },
        { icon: <IconUserCircle size={30} />, label: "Account", value: "account" },
    ];

    const isActive = (value: string) => {
        return pathname.includes(`/${value}`);
    };

    return (
        <SidebarContent>
            <SidebarGroup>
                <SidebarGroupContent>
                    <SidebarMenu>
                        {navItems.map((item) => (
                            <SidebarMenuItem className="h-15" key={item.label}>
                                <SidebarMenuButton
                                    className={`h-full w-full ${isActive(item.value) ? 'bg-primary text-primary-foreground hover:bg-primary/90 hover:text-white dark:hover:text-black' : ''}`}
                                >
                                    <Link href={`${item.value}`} className="flex items-center w-full h-full px-3">
                                        {item.icon}
                                        <span className="text-lg">{item.label}</span>
                                    </Link>
                                </SidebarMenuButton>
                            </SidebarMenuItem>
                        ))}
                    </SidebarMenu>
                </SidebarGroupContent>
            </SidebarGroup>
        </SidebarContent>
    );
}
