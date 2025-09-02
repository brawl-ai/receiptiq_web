"use client";
import { useAuthContext } from "@/app/stores/auth_store";
import { SiteHeader } from "../Header";
import SubscriptionStepper from "./SubscriptionStepper";
import PreviousSubscriptions from "./PreviousSubscriptions";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";


export default function BillingPage() {
    const user = useAuthContext((s) => s.user);
    return (
        <div className="">
            <SiteHeader title={"Billing"} isSubscribed={user?.is_subscribed} />
            <div className="mt-8 p-10">
                <Tabs defaultValue="current" className="w-full">
                    <TabsList className="h-11 bg-background border px-1.5 rounded-full">
                        <TabsTrigger
                            value="current"
                            className="px-4 py-1.5 rounded-full data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"
                        >
                            Current Plan
                        </TabsTrigger>
                        <TabsTrigger
                            value="subscriptions"
                            className="px-4 py-1.5 rounded-full data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"
                        >
                            Previous Subscriptions
                        </TabsTrigger>
                    </TabsList>
                    <Separator className="mb-4" />
                    <TabsContent value="current">
                        <SubscriptionStepper />
                    </TabsContent>
                    <TabsContent value="subscriptions">
                        <PreviousSubscriptions />
                    </TabsContent>
                </Tabs>
            </div>
        </div>
    )
}