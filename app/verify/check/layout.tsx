import { Metadata } from "next"
import { Suspense } from "react"


export const metadata: Metadata = {
    title: "Verify OTP"
}

export default function CheckOTPLayout({
    children,
}: {
    children: React.ReactNode
}) {
    return <Suspense>{children}</Suspense>
}