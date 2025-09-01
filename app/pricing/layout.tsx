import { Metadata } from "next";
import { Suspense } from "react";
import { SubscriptionsProvider } from "../stores/subscription_store";
import { createTheme, MantineProvider } from "@mantine/core";

export const metadata: Metadata = {
    title: "Pricing",
};

const theme = createTheme({
    fontFamily: "Open Sans, sans-serif",
});

export default async function PricingLayout({
    children
}: {
    children: React.ReactNode
}) {

    return (
        <Suspense>
            <MantineProvider theme={theme} defaultColorScheme="auto">
                <SubscriptionsProvider>
                    {children}
                </SubscriptionsProvider>
            </MantineProvider>
        </Suspense>
    );
}
