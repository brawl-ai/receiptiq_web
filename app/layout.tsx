export default function RootLayout({
    children,
}: {
    children: React.ReactNode
}) {
    return (
        <html lang="en">
            <head>
                <title>ReceiptIQ - AI Powered Receipt/Invoice Data Extraction</title>
            </head>
            <body style={{
                margin: 0,
                fontFamily: 'sans-serif',
                background: `   
                                linear-gradient(to bottom, #f5f7fa, #e9edf0) fixed,
                                radial-gradient(circle at top right, rgba(27,113,250,0.05), transparent 50%) no-repeat
                            `,
                backgroundBlendMode: 'normal',
                color: '#2F3A47',
            }}>{children}</body>
        </html>
    )
}