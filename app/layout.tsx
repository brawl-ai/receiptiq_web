import "@mantine/core/styles.css";
import '@mantine/notifications/styles.css';
import { ColorSchemeScript, createTheme, mantineHtmlProps, MantineProvider } from "@mantine/core";
import { Notifications } from "@mantine/notifications";
import { User } from "./types";
import { getCurrentUser } from "./helpers";
import { AuthProvider } from "./stores/auth_store";
import './globals.css'
import { ThemeProvider } from "@/components/theme-provider";

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
        icon: "/assets/images/icon.png",
        apple: "/assets/images/icon.png",
        shortcut: "/assets/images/icon.png",
    },
};

const theme = createTheme({
    fontFamily: "Open Sans, sans-serif",
});

export default async function RootLayout({
    children,
}: {
    children: React.ReactNode
}) {

    const user: User | null = await getCurrentUser()

    return (
        <html lang="en" {...mantineHtmlProps}>
            <head>
                <ColorSchemeScript />
                <script defer src="https://cloud.umami.is/script.js" data-website-id="68959e46-a3c0-4d45-a381-ec80451622fe"></script>
            </head>
            <body>
                <ThemeProvider
                attribute="class"
                defaultTheme="light"
                enableSystem
                disableTransitionOnChange
            >
                <MantineProvider theme={theme} defaultColorScheme="auto">
                    <Notifications />
                    <AuthProvider user={user}>
                        {children}
                    </AuthProvider>
                </MantineProvider>
                </ThemeProvider>

            </body>
        </html>
    )
}