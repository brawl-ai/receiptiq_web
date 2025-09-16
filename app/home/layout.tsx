import { Suspense } from "react"
import { SubscriptionsProvider } from "../stores/subscription_store"
import { Sidebar, SidebarFooter, SidebarHeader, SidebarInset, SidebarProvider } from "@/components/ui/sidebar"
import { NavUser } from "@/components/nav-user"
import Link from "next/link"
import { redirect } from "next/navigation"
import { getCurrentUser } from "../helpers"
import { SidebarNavigation } from "./SidebarNavigation"
import { Separator } from "@/components/ui/separator"

export default async function HomeLayout({
    children
}: {
    children: React.ReactNode
}) {
    const user = await getCurrentUser()

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
                            <div className="h-full">
                                <Link href="" className="flex items-center w-full h-full px-3">
                                    <svg xmlns="http://www.w3.org/2000/svg" width="160" height="44" viewBox="0 0 160 44" className="text-black-500 dark:text-white-500">
                                        <rect x="2" y="2" width="40" height="40" rx="5" stroke="currentColor" strokeWidth="2" fill="transparent" />
                                        <path d="M12 22 L16 18 L20 26 L24 18 L28 26 L32 18 L36 26" stroke="currentColor" strokeWidth="3" fill="none" />
                                        <text x="50" y="32" fontFamily="Arial, sans-serif" fill="currentColor" fontSize="20" fontWeight="bold">ReceiptIQ</text>
                                    </svg>
                                </Link>
                            </div>
                        </SidebarHeader>
                        <Separator className="my-5" orientation="horizontal" />
                        <SidebarNavigation />
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