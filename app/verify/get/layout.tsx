import { Metadata } from "next"


export const metadata: Metadata = {
    title: "Get OTP"
}

export default function GetVerifyLayout({
    children,
}: {
    children: React.ReactNode
}) {
    return <>{children}</>
}