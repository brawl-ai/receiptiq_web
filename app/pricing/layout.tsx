import { Metadata } from "next";
import { Suspense } from "react";
import { SubscriptionsProvider } from "../lib/subscription";

export const metadata: Metadata = {
    title: "Pricing",
};

export default async function PricingLayout({
    children
}: {
    children: React.ReactNode
}) {

    return (
        <Suspense>
            <SubscriptionsProvider>
                {children}
            </SubscriptionsProvider>
        </Suspense>
    );
}
