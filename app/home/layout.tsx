import { Suspense } from "react"
import { SubscriptionsProvider } from "../stores/subscription_store"
import { Sidebar, SidebarContent, SidebarFooter, SidebarGroup, SidebarGroupContent, SidebarHeader, SidebarInset, SidebarMenu, SidebarMenuButton, SidebarMenuItem, SidebarProvider } from "@/components/ui/sidebar"
import { NavUser } from "@/components/nav-user"
import Link from "next/link"
import { IconFolder, IconUserCircle, IconWallet } from "@tabler/icons-react"
import { redirect } from "next/navigation"
import { getCurrentUser } from "../helpers"
import { headers } from "next/headers"

export default async function HomeLayout({
    children
}: {
    children: React.ReactNode
}) {
    const user = await getCurrentUser()

    const h = await headers()
    const host = h.get("host")
    const protocol = h.get("x-forwarded-proto") || "http"
    const url = `${protocol}://${host}` + h.get("x-invoke-path") // depends on deployment

    // In practice, safer:
    const fullPath = h.get("referer") || "" // not 100% reliable
    const parts = fullPath.split("/")
    const last = parts[parts.length - 1]

    console.log("Home layout URL:", url, "Last part:", last)

    if (!user) {
        redirect("/login")
    }

    const getInitials = (name: string) => {
        return name
            .split(" ")
            .map((part) => part[0])
            .join("")
            .toUpperCase();
    }

    const navItems = [
        { icon: <IconFolder size={30} />, label: "Projects", value: "projects" },
        { icon: <IconWallet size={30} />, label: "Billing", value: "billing" },
        { icon: <IconUserCircle size={30} />, label: "Account", value: "account" },
    ];


    return (

        <Suspense>
            <SubscriptionsProvider>
                <SidebarProvider style={
                    {
                        "--sidebar-width": "calc(var(--spacing) * 72)",
                        "--header-height": "calc(var(--spacing) * 12)",
                    } as React.CSSProperties
                }>

                    <Sidebar variant="inset">
                        <SidebarHeader>
                            <SidebarMenuButton className="h-full">
                                <Link href="" className="flex items-center w-full h-full px-3">
                                    <svg xmlns="http://www.w3.org/2000/svg" width="160" height="44" viewBox="0 0 160 44" className="text-black-500 dark:text-white-500">
                                        <rect x="2" y="2" width="40" height="40" rx="5" stroke="currentColor" strokeWidth="2" fill="transparent" />
                                        <path d="M12 22 L16 18 L20 26 L24 18 L28 26 L32 18 L36 26" stroke="currentColor" strokeWidth="3" fill="none" />
                                        <text x="50" y="32" fontFamily="Arial, sans-serif" fill="currentColor" fontSize="20" fontWeight="bold">ReceiptIQ</text>
                                    </svg>
                                </Link>
                            </SidebarMenuButton>
                        </SidebarHeader>
                        <SidebarContent>
                            <SidebarGroup>
                                <SidebarGroupContent>
                                    <SidebarMenu>
                                        {navItems.map((item) => (
                                            <SidebarMenuItem className="h-15" key={item.label}>
                                                <SidebarMenuButton className={`h-full w-full `}>
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
                        <SidebarFooter>
                            <NavUser user={{
                                name: user.first_name + " " + user.last_name,
                                email: user.email,
                                initials: getInitials(user.first_name + " " + user.last_name),
                            }} />
                        </SidebarFooter>
                    </Sidebar>
                    <SidebarInset>
                        {children}
                    </SidebarInset>
                </SidebarProvider>
            </SubscriptionsProvider>
        </Suspense>
    )
}