import { createTheme, MantineProvider } from "@mantine/core"
import { Notifications } from "@mantine/notifications"
import { Metadata } from "next"
import { Suspense } from "react"


export const metadata: Metadata = {
    title: "Login"
}

const theme = createTheme({
    fontFamily: "Open Sans, sans-serif",
});

export default function LoginLayout({
    children,
}: {
    children: React.ReactNode
}) {
    return <Suspense>
        <MantineProvider theme={theme} defaultColorScheme="auto">
            <Notifications />
            {children}
        </MantineProvider>
    </Suspense>
}