import { Metadata } from "next"
import { Suspense } from "react"


export const metadata: Metadata = {
    title: "Verify OTP"
}

export default function GetVerifyLayout({
    children,
}: {
    children: React.ReactNode
}) {
    return <Suspense>{children}</Suspense>
}