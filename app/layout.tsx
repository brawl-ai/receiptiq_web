import "@mantine/core/styles.css";
import '@mantine/notifications/styles.css';
import { ColorSchemeScript, createTheme, mantineHtmlProps, MantineProvider } from "@mantine/core";
import { AuthProvider } from "./lib/auth"
import { Notifications } from "@mantine/notifications";

export const metadata = {
    title: "ReceiptIQ - Smart Receipt Data Extraction",
    keywords:
        "receipt, data extraction, AI, OCR, expense tracking, smart receipts",
    authors: [{ name: "ReceiptIQ Team", url: "https://receiptiq.co" }],
    description: "ReceiptIQ - Your Smart Receipt Data Extaction powered by AI",
    icons: {
        icon: "/assets/images/icon.png",
        apple: "/assets/images/icon.png",
        shortcut: "/assets/images/icon.png",
    },
};

const theme = createTheme({
    fontFamily: "Open Sans, sans-serif",
    primaryColor: "cyan",
});

export default function RootLayout({
    children,
}: {
    children: React.ReactNode
}) {
    return (
        <html lang="en" {...mantineHtmlProps}>
            <head>
                <title>ReceiptIQ - AI Powered Receipt/Invoice Data Extraction</title>
                <ColorSchemeScript />
                <script defer src="https://cloud.umami.is/script.js" data-website-id="68959e46-a3c0-4d45-a381-ec80451622fe"></script>
            </head>
            <body>
                <MantineProvider theme={theme} defaultColorScheme="dark">
                    <Notifications />
                    <AuthProvider>
                        {children}
                    </AuthProvider>
                </MantineProvider>

            </body>
        </html>
    )
}