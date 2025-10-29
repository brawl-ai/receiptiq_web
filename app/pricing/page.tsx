"use client"

import { useSubscriptionsContext } from "../stores/subscription_store";
import { useEffect, useState } from "react";
import { SubscriptionPlan } from "../types";
import Link from "next/link";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Separator } from "@/components/ui/separator";
import { ArrowUpRight, CircleCheck } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import Footer01 from "@/components/ui/footer";
import ThemeSwitcher from "@/components/ui/toggle-theme";

export default function PricingPage() {
    const [plans, setPlans] = useState<SubscriptionPlan[]>([])
    const getPlans = useSubscriptionsContext((s) => s.getPlans);
    const [selectedBillingPeriod, setSelectedBillingPeriod] = useState("yearly");

    useEffect(() => {
        getPlans().then(resp => {
            setPlans(resp.data)
        })
    }, [getPlans])

    const free_plan = plans.find(p => p.name === "Free Trial")
    const monthly_plan = plans.find(p => p.name === "Pro Monthly")
    const annual_plan = plans.find(p => p.name === "Pro Annual")
    let YEARLY_DISCOUNT = 0;
    if (monthly_plan && annual_plan) {
        YEARLY_DISCOUNT = ((monthly_plan.price - annual_plan.price / 12) / monthly_plan.price) * 100
    }
    return (
        <div className="relative bg-muted min-h-svh flex flex-col">
            {/* Header */}
            <header className="w-full flex justify-between px-6 py-4 bg-transparent">
                <div className="flex gap-3">
                    <Link href="/" className="flex items-center">
                        <svg xmlns="http://www.w3.org/2000/svg" width="200" height="45" viewBox="0 0 220 64" className="mt-2">
                            {/* Rounded square on the left */}
                            <rect x="2" y="2" width="60" height="60" rx="5" stroke="currentColor" strokeWidth="2" fill="white" />
                            {/* Squiggly line in the center */}
                            <path d="M12 32 L16 28 L20 36 L24 28 L28 36 L32 28 L36 36 L40 28 L44 36 L48 28 L52 36 L55 32" stroke="black" strokeWidth="3" fill="none" />
                            {/* Text next to it */}
                            <text x="75" y="40" fontFamily="Roboto, sans-serif" fill="currentColor" fontSize="30">
                                ReceiptIQ
                            </text>
                        </svg>
                    </Link>
                </div>
                <ThemeSwitcher />
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
                        <div className="mt-5 flex flex-wrap justify-center gap-5 md:justify-start">
                            {free_plan && (
                                <Card className="flex flex-col justify-between bg-background border px-6 py-5 min-w-[280px] sm:min-w-[320px] md:min-w-[300px] lg:min-w-[320px] flex-1 md:max-w-sm lg:max-w-md h-full">
                                    <h3 className="text-lg font-medium">
                                        {free_plan.name} <br /> (No card required)
                                    </h3>
                                    <p className="mt-2 text-4xl font-bold">$ {Number(free_plan.price)} </p>
                                    <p className="mt-2 font-medium text-muted-foreground">{free_plan.description}</p>
                                    <Button
                                        size="lg"
                                        className="w-full mt-4 rounded-full text-base"
                                    >
                                        <Link
                                            href="/login?redirect=/home/projects"
                                            className="flex items-center justify-center w-full"
                                            data-umami-event={`get_started_${free_plan.name.toLowerCase()}@pricing`}
                                        >
                                            Get Started <ArrowUpRight className="w-4 h-4" />
                                        </Link>
                                    </Button>
                                    <Separator className="my-4" />
                                    <ul className="space-y-3">
                                        {free_plan.benefits.split("$").map((feature, index) => (
                                            <li key={index} className="flex items-start gap-1.5">
                                                <CircleCheck className="h-4 w-4 mt-1 text-green-600" />
                                                {feature}
                                            </li>
                                        ))}
                                    </ul>
                                </Card>
                            )}

                            {selectedBillingPeriod === "monthly" && monthly_plan && (
                                <Card className="flex flex-col justify-between bg-background border px-6 py-5 min-w-[280px] sm:min-w-[320px] md:min-w-[300px] lg:min-w-[320px] flex-1 md:max-w-sm lg:max-w-md h-full">
                                    <h3 className="text-lg font-medium">{monthly_plan.name}</h3>
                                    <p className="mt-2 text-4xl font-bold">$ {Number(monthly_plan.price)} </p>
                                    <p className="mt-2 font-medium text-muted-foreground">{monthly_plan.description}</p>
                                    <Button
                                        size="lg"
                                        className="w-full mt-4 rounded-full text-base"
                                    >
                                        <Link
                                            href="/login?redirect=/home/projects"
                                            className="flex items-center justify-center w-full"
                                            data-umami-event={`get_started_${monthly_plan.name.toLowerCase()}@pricing`}
                                        >
                                            Get Started <ArrowUpRight className="w-4 h-4" />
                                        </Link>
                                    </Button>
                                    <Separator className="my-4" />
                                    <ul className="space-y-3">
                                        {monthly_plan.benefits.split("$").map((feature, index) => (
                                            <li key={index} className="flex items-start gap-1.5">
                                                <CircleCheck className="h-4 w-4 mt-1 text-green-600" />
                                                {feature}
                                            </li>
                                        ))}
                                    </ul>
                                </Card>
                            )}

                            {selectedBillingPeriod === "yearly" && annual_plan && (
                                <Card className="relative flex flex-col justify-between bg-background border px-6 py-5 min-w-[280px] sm:min-w-[320px] md:min-w-[300px] lg:min-w-[320px] flex-1 md:max-w-sm lg:max-w-md h-full overflow-hidden">
                                    <Badge className="absolute top-10 right-10 rotate-[45deg] rounded-none px-10 uppercase translate-x-1/2 -translate-y-1/2">
                                        Most Popular
                                    </Badge>
                                    <h3 className="text-lg font-medium">
                                        {annual_plan.name} <br /> (billed annually)
                                    </h3>
                                    <p className="mt-2 text-4xl font-bold">$ {annual_plan.price / 12} </p>
                                    <p className="mt-2 font-medium text-muted-foreground">{monthly_plan.description}</p>
                                    <Button
                                        size="lg"
                                        className="w-full mt-4 rounded-full text-base"
                                    >
                                        <Link
                                            href="/login?redirect=/home/projects"
                                            className="flex items-center justify-center w-full"
                                            data-umami-event={`get_started_${annual_plan.name.toLowerCase()}@pricing`}
                                        >
                                            Get Started <ArrowUpRight className="w-4 h-4" />
                                        </Link>
                                    </Button>
                                    <Separator className="my-4" />
                                    <ul className="space-y-3">
                                        {monthly_plan.benefits.split("$").map((feature, index) => (
                                            <li key={index} className="flex items-start gap-1.5">
                                                <CircleCheck className="h-4 w-4 mt-1 text-green-600" />
                                                {feature}
                                            </li>
                                        ))}
                                    </ul>
                                </Card>
                            )}

                            <Card className="flex flex-col justify-between bg-background border px-6 py-5 min-w-[280px] sm:min-w-[320px] md:min-w-[300px] lg:min-w-[320px] flex-1 md:max-w-sm lg:max-w-md h-full overflow-hidden">
                                <h3 className="text-lg font-medium">Enterprise</h3>
                                <p className="mt-2 text-4xl font-bold">Scale (Custom)</p>
                                <p className="mt-2 font-medium text-muted-foreground">
                                    Custom volume, dedicated support, and advanced features
                                </p>
                                <Button
                                    size="lg"
                                    className="w-full mt-4 rounded-full text-base bg-purple-500 hover:bg-purple-600 text-white"
                                    data-umami-event={`contact_sales@pricing`}
                                >
                                    <Link href="mailto:peter@receiptiq.co" className="flex items-center justify-center w-full">
                                        Contact Sales <ArrowUpRight className="w-4 h-4" />
                                    </Link>
                                </Button>
                                <Separator className="my-4" />
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