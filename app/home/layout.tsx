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
                            <div className="flex gap-3">
                                <Link href="" className="flex items-center">
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