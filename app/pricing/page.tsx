"use client"

import { useSubscriptionsContext } from "../stores/subscription_store";
import { IconMoon, IconSun } from "@tabler/icons-react";
import { useEffect, useState } from "react";
import { SubscriptionPlan } from "../types";
import { DotPattern } from "@/components/ui/dot-pattern";
import Link from "next/link";
import { useTheme } from "next-themes";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { cn } from "@/lib/utils";
import { Separator } from "@/components/ui/separator";
import { ArrowUpRight, CircleCheck, CircleHelp } from "lucide-react";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import Footer01 from "@/components/ui/footer";

export default function PricingPage() {
    const [plans, setPlans] = useState<SubscriptionPlan[]>([])
    const getPlans = useSubscriptionsContext((s) => s.getPlans);
    const [selectedBillingPeriod, setSelectedBillingPeriod] = useState("yearly");
    const { theme, setTheme } = useTheme();

    useEffect(() => {
        getPlans().then(resp => {
            setPlans(resp.data)
        })
    }, [getPlans])
    let displayedPlans = []
    let YEARLY_DISCOUNT = 0
    if (plans.length > 0) {
        const monthlyPrice = plans.find(p => p.billing_interval === "monthly").price
        const yearlyPlan = plans.find(p => p.billing_interval === "annually").price / 12
        YEARLY_DISCOUNT = ((monthlyPrice - yearlyPlan) / monthlyPrice) * 100
        displayedPlans = plans.filter(p => p.billing_interval === "monthly").map(p => {
            return {
                name: p.name,
                price: p.price,
                description: p.description,
                currency: p.currency,
                billing_interval: selectedBillingPeriod,
                id: p.id,
                isRecommended: p.billing_interval === "annually",
                benefits: [
                    { title: "Add New Projects", available: true },
                    { title: "Manage your schema by adding, updating and deleting fields", available: true },
                    { title: "Process receipts in the project", available: true },
                    { title: "Upload Receipts", available: true },
                    { title: "Export Extracted Transaction Data", available: true },
                    { title: "Email Support", available: true }
                ]
            }
        })
    }



    return (
        <div className="relative bg-muted min-h-svh flex flex-col">
            <DotPattern className="opacity-40" />
            {/* Header */}
            <header className="w-full flex items-center justify-around px-6 py-4 bg-transparent">
                <div className="flex items-center gap-3">
                    <Link href="/" className="flex items-center">
                        <svg xmlns="http://www.w3.org/2000/svg" width="160" height="44" viewBox="0 0 220 64" className="text-blue-500 dark:text-blue-500">
                            <rect x="2" y="2" width="40" height="40" rx="5" stroke="currentColor" strokeWidth="2" fill="transparent" />
                            <path d="M12 22 L16 18 L20 26 L24 18 L28 26 L32 18 L36 26" stroke="currentColor" strokeWidth="3" fill="none" />
                            <text x="50" y="32" fontFamily="Arial, sans-serif" fill="currentColor" fontSize="20" fontWeight="bold">ReceiptIQ</text>
                        </svg>
                    </Link>
                </div>
                <div className="flex items-center gap-2">
                    {theme === 'dark' ?
                        <IconSun size={22} className="cursor-pointer text-gray-300" onClick={() => setTheme('light')} />
                        :
                        <IconMoon size={22} className="cursor-pointer" onClick={() => setTheme('dark')} />
                    }
                </div>
            </header>
            {/* Main pricing section */}
            <div className="flex flex-1 items-center justify-center p-6 md:p-6">
                <div className="max-w-sm md:max-w-3xl">
                    <div className="min-h-screen/2 bg-accent flex flex-col items-center justify-start px-6">
                        <h1 className="text-5xl font-bold text-center tracking-tight text-muted-foreground dark:text-white">Pricing</h1>
                        <Tabs
                            value={selectedBillingPeriod}
                            onValueChange={setSelectedBillingPeriod}
                            className="mt-8"
                        >
                            <TabsList className="h-11 bg-background border px-1.5 rounded-full">
                                <TabsTrigger
                                    value="monthly"
                                    className="px-4 py-1.5 rounded-full data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"
                                >
                                    Monthly
                                </TabsTrigger>
                                <TabsTrigger
                                    value="yearly"
                                    className="px-4 py-1.5 rounded-full data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"
                                >
                                    Yearly (Save {Math.ceil(YEARLY_DISCOUNT)}%)
                                </TabsTrigger>
                            </TabsList>
                        </Tabs>
                        <div className="mt-12 max-w-screen-lg flex lg:grid-cols-3 items-center lg:gap-4 sm:gap-6 gap-10 flex-col md:flex-row md:justify-center">
                            {displayedPlans && displayedPlans.map((plan) => (
                                <Card
                                    key={plan.name}
                                    className={cn("relative flex-1 p-6 bg-background border px-10 ", {
                                        "shadow-[0px_2px_10px_0px_rgba(0,0,0,0.1)] py-10 z-[1] px-10 lg:-mx-2 overflow-hidden":
                                            selectedBillingPeriod === "yearly",
                                    })}
                                >
                                    {selectedBillingPeriod === "yearly" && (
                                        <Badge className="absolute top-10 right-10 rotate-[45deg] rounded-none px-10 uppercase translate-x-1/2 -translate-y-1/2">
                                            Most Popular
                                        </Badge>
                                    )}
                                    <h3 className="text-lg font-medium">{plan.name}( billed {selectedBillingPeriod})</h3>
                                    <p className="mt-2 text-4xl font-bold">
                                        $
                                        {selectedBillingPeriod === "monthly"
                                            ? Number(plan.price)
                                            : Number(plan.price) * ((100 - YEARLY_DISCOUNT) / 100)}
                                        <span className="ml-1.5 text-sm text-muted-foreground font-normal">
                                            /month
                                        </span>
                                    </p>
                                    <p className="mt-4 font-medium text-muted-foreground">
                                        {plan.description}
                                    </p>

                                    <Button
                                        variant={selectedBillingPeriod === "yearly" ? "default" : "outline"}
                                        size="lg"
                                        className="w-full mt-6 rounded-full text-base"
                                    >
                                        <Link href="/login?redirect=/home/projects" className="flex items-center justify-center w-full" data-umami-event={`get_started_${plan.name.toLowerCase()}@pricing`}>
                                            Get Started <ArrowUpRight className="w-4 h-4" />
                                        </Link>
                                    </Button>
                                    <Separator className="my-8" />
                                    <ul className="space-y-3">
                                        {plan.benefits.map((feature) => (
                                            <li key={feature.title} className="flex items-start gap-1.5">
                                                <CircleCheck className="h-4 w-4 mt-1 text-green-600" />
                                                {feature.title}
                                                {feature.tooltip && (
                                                    <Tooltip>
                                                        <TooltipTrigger className="cursor-help">
                                                            <CircleHelp className="h-4 w-4 mt-1 text-gray-500" />
                                                        </TooltipTrigger>
                                                        <TooltipContent>{feature.tooltip}</TooltipContent>
                                                    </Tooltip>
                                                )}
                                            </li>
                                        ))}
                                    </ul>
                                </Card>
                            ))}
                            <Card className="relative p-6 flex-1 bg-background border px-8">
                                <h3 className="text-lg font-medium">Enterprise</h3>
                                <p className="mt-2 text-4xl font-bold">Scale (Custom)</p>
                                <p className="mt-4 font-medium text-muted-foreground">
                                    Custom volume, dedicated support, and advanced features — contact us for pricing
                                </p>
                                <Button
                                    variant={selectedBillingPeriod === "yearly" ? "default" : "outline"}
                                    size="lg"
                                    className="w-full mt-6 rounded-full text-base bg-purple-500 hover:bg-purple-600 text-white"
                                    data-umami-event={`contact_sales@pricing`}
                                >
                                    <Link href="mailto:peter@receiptiq.co" className="flex items-center justify-center w-full">
                                        Contact Sales <ArrowUpRight className="w-4 h-4" />
                                    </Link>
                                </Button>
                                <Separator className="my-8" />
                                <ul className="space-y-3">
                                    <li className="flex items-start gap-1.5">
                                        <CircleCheck className="h-4 w-4 mt-1 text-green-600" />
                                        Everything in Pro
                                    </li>
                                    <li className="flex items-start gap-1.5">
                                        <CircleCheck className="h-4 w-4 mt-1 text-green-600" />
                                        Dedicated support
                                    </li>
                                    <li className="flex items-start gap-1.5">
                                        <CircleCheck className="h-4 w-4 mt-1 text-green-600" />
                                        Custom SLA
                                    </li>
                                    <li className="flex items-start gap-1.5">
                                        <CircleCheck className="h-4 w-4 mt-1 text-green-600" />
                                        Onboarding and training
                                    </li>
                                    <li className="flex items-start gap-1.5">
                                        <CircleCheck className="h-4 w-4 mt-1 text-green-600" />
                                        Custom integrations
                                    </li>
                                    <li className="flex items-start gap-1.5">
                                        <CircleCheck className="h-4 w-4 mt-1 text-green-600" />
                                        Advanced security and compliance
                                    </li>
                                </ul>
                            </Card>
                        </div>
                    </div>
                </div>
            </div>
            <div className="relative mt-10 flex-1">
                <Footer01 />
            </div>
        </div>);
}