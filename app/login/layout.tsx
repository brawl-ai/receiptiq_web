import { Metadata } from "next"
import { Suspense } from "react"


export const metadata: Metadata = {
    title: "Login"
}

export default function LoginLayout({
    children,
}: {
    children: React.ReactNode
}) {
    return <Suspense>{children}</Suspense>
}