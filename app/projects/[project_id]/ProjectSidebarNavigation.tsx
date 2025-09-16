"use client";

import { SidebarContent, SidebarGroup, SidebarGroupContent, SidebarMenu, SidebarMenuButton, SidebarMenuItem } from "@/components/ui/sidebar";
import Link from "next/link";
import {
    IconChartBar,
    IconProgressCheck,
    IconReceipt,
    IconSchema,
    IconTableExport,
} from "@tabler/icons-react";
import { usePathname } from "next/navigation";

interface ProjectSidebarNavigationProps {
    projectId: string;
}

export function ProjectSidebarNavigation({ projectId }: ProjectSidebarNavigationProps) {
    const pathname = usePathname();

    const navItems = [
        { icon: <IconSchema size={25} />, label: "Fields", value: "fields" },
        { icon: <IconReceipt size={25} />, label: "Receipts", value: "receipts" },
        { icon: <IconProgressCheck size={25} />, label: "Process", value: "process" },
        { icon: <IconChartBar size={25} />, label: "Data", value: "data" },
        { icon: <IconTableExport size={25} />, label: "Export", value: "export" },
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
                            <SidebarMenuItem key={item.label} className="h-15">
                                <SidebarMenuButton
                                    className={`h-full w-full ${isActive(item.value) ? 'bg-primary text-primary-foreground hover:bg-primary/90 hover:text-white dark:hover:text-black' : ''}`}
                                >
                                    <Link href={`/projects/${projectId}/${item.value}`} className="flex items-center w-full h-full gap-2">
                                        {item.icon}
                                        <span className="text-xl">{item.label}</span>
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
