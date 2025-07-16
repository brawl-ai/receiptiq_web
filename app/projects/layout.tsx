import { Metadata } from "next"
import { Suspense } from "react"
import { getCurrentUser } from "../lib/helpers"
import { redirect } from "next/navigation"


export const metadata: Metadata = {
    title: "Dashboard"
}

export default async function LoginLayout({
    children,
}: {
    children: React.ReactNode
}) {
    const user = await getCurrentUser()
    if (!user) {
        redirect("/login")
    }
    return <Suspense>{children}</Suspense>
}