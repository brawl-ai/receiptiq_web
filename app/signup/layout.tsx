import { createTheme, MantineProvider } from "@mantine/core";
import { Metadata } from "next"
import { Suspense } from "react"


export const metadata: Metadata = {
    title: "Signup"
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
            {children}
        </MantineProvider>
    </Suspense>
}