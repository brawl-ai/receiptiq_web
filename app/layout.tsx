import { User } from "./types";
import { getCurrentUser } from "./helpers";
import { AuthProvider } from "./stores/auth_store";
import './globals.css'
import { ThemeProvider } from "@/components/theme-provider";
import { Toaster } from "@/components/ui/sonner";
import Script from 'next/script';

export const metadata = {
    title: {
        template: '%s | ReceiptIQ - AI Powered Receipt/Invoice Data Extraction',
        default: 'ReceiptIQ - AI Powered Receipt/Invoice Data Extraction',
    },
    description: "Your Smart Receipt Data Extaction powered by AI",
    keywords:
        "receipt, data extraction, AI, OCR, expense tracking, smart receipts",
    authors: [{ name: "ReceiptIQ Team", url: "https://receiptiq.co" }],
    icons: {
        icon: "/assets/images/icon_dark.svg",
        apple: "/assets/images/icon_dark.svg",
        shortcut: "/assets/images/icon_dark.svg",
    },
};

export default async function RootLayout({
    children,
}: {
    children: React.ReactNode
}) {

    const user: User | null = await getCurrentUser()

    return (
        <html lang="en" suppressHydrationWarning>
            <body>
                <ThemeProvider
                    attribute="class"
                    defaultTheme="system"
                    enableSystem
                    disableTransitionOnChange
                >
                    <AuthProvider user={user}>
                        {children}
                    </AuthProvider>
                </ThemeProvider>
                <Toaster />

                <Script
                    src="https://cloud.umami.is/script.js"
                    data-website-id="68959e46-a3c0-4d45-a381-ec80451622fe"
                    strategy="afterInteractive"
                />

                <Script
                    id="sa-dynamic-optimization"
                    data-uuid="18b290c6-9c91-4147-8bad-9f023139d475"
                    src="data:text/javascript;base64,dmFyIHNjcmlwdCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoInNjcmlwdCIpO3NjcmlwdC5zZXRBdHRyaWJ1dGUoIm5vd3Byb2NrZXQiLCAiIik7c2NyaXB0LnNldEF0dHJpYnV0ZSgibml0cm8tZXhjbHVkZSIsICIiKTtzY3JpcHQuc3JjID0gImh0dHBzOi8vZGFzaGJvYXJkLnNlYXJjaGF0bGFzLmNvbS9zY3JpcHRzL2R5bmFtaWNfb3B0aW1pemF0aW9uLmpzIjtzY3JpcHQuZGF0YXNldC51dWlkID0gIjE4YjI5MGM2LTljOTEtNDE0Ny04YmFkLTlmMDIzMTM5ZDQ3NSI7c2NyaXB0LmlkID0gInNhLWR5bmFtaWMtb3B0aW1pemF0aW9uLWxvYWRlciI7ZG9jdW1lbnQuaGVhZC5hcHBlbmRDaGlsZChzY3JpcHQpOw=="
                    strategy="afterInteractive"
                    {...{ nowprocket: "" }}
                    {...{ "nitro-exclude": "" }}
                />
            </body>
        </html>
    )
}