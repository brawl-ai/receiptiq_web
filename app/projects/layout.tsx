import { Metadata } from "next"
import { Suspense } from "react"
import { getCurrentUser } from "../lib/helpers"
import { redirect } from "next/navigation"
import { SubscriptionsProvider } from "../lib/subscription"


export const metadata: Metadata = {
    title: "Dashboard"
}

export default async function ProjectsLayout({
    children,
}: {
    children: React.ReactNode
}) {
    const user = await getCurrentUser()
    if (!user) {
        redirect("/login")
    }
    return (
        <Suspense>
            <SubscriptionsProvider>
                {children}
            </SubscriptionsProvider>
        </Suspense>
    )
}