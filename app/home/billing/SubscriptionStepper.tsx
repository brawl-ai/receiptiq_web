"use client"
import { useState, useEffect, useRef, RefObject } from "react";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { useSubscriptionsContext } from "../../stores/subscription_store";
import { useAuthContext } from "../../stores/auth_store";
import { SubscriptionPlan } from "../../types";
import { Skeleton } from "@/components/ui/skeleton";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ArrowUpRight, CircleCheck } from "lucide-react";
import Link from "next/link";

export default function SubscriptionStepper() {
    const [plans, setPlans] = useState<SubscriptionPlan[]>([]);
    const [selectedPlan, setSelectedPlan] = useState<SubscriptionPlan | null>(null);
    const [selectedBillingPeriod, setSelectedBillingPeriod] = useState("yearly");
    const getPlans = useSubscriptionsContext((s) => s.getPlans);
    const initiatePurchase = useSubscriptionsContext((s) => s.initiatePurchase);
    const startFreeTrial = useSubscriptionsContext((s) => s.startFreeTrial);
    const subscriptionStatusChecker = useSubscriptionsContext((s) => s.subscriptionStatusChecker);
    const paymentStatusChecker = useSubscriptionsContext((s) => s.paymentStatusChecker);
    const user = useAuthContext((s) => s.user);
    const [stage, setStage] = useState(user.is_subscribed ? "welcome" : "select_plan");
    const paymentStatusCheckInterval = useRef(null);
    const subscriptionStatusCheckInterval = useRef(null);

    useEffect(() => {
        getPlans().then(resp => {
            setPlans(resp.data);
            if (user.is_subscribed) {
                const _sub = user.subscriptions.filter((sub) => sub.is_active)[0];
                const _plan = resp.data.filter((p) => p.id == _sub.subscription_plan_id)[0];
                setSelectedPlan(_plan);
            }
        });
        return () => {
            if (paymentStatusCheckInterval.current) clearInterval(paymentStatusCheckInterval.current);
            if (subscriptionStatusCheckInterval.current) clearInterval(subscriptionStatusCheckInterval.current);
        };
    }, [getPlans, user]);

    const handleSelectPlan = (plan: SubscriptionPlan) => {
        setSelectedPlan(plan);
        setStage("pay");
    };

    const checkPaymentStatus = (reference: string, onSuccess: () => void) => {
        paymentStatusChecker(reference).then((response) => {
            if (response.data.status === "success") onSuccess();
        });
    };

    const checkSubscriptionStatus = () => {
        subscriptionStatusChecker().then((response) => {
            if (response.is_subscribed) {
                setStage("welcome");
                stopListening(subscriptionStatusCheckInterval);
            }
        });
    };

    const stopListening = (intervalRef: RefObject<number | null>) => {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
    };

    const handleStartPurchase = async (plan: SubscriptionPlan) => {
        initiatePurchase({ plan_id: plan.id, email: user.email }).then(resp => {
            import('@paystack/inline-js').then(({ default: Paystack }) => {
                const paystack = new Paystack();
                paystack.resumeTransaction(resp.data.access_code, {
                    onSuccess: () => {
                        setStage("await_sub");
                        subscriptionStatusCheckInterval.current = setInterval(checkSubscriptionStatus, 5000);
                        stopListening(paymentStatusCheckInterval);
                    },
                    onLoad: () => {
                        paymentStatusCheckInterval.current = setInterval(() => checkPaymentStatus(resp.data.reference, () => setStage("await_sub")), 5000);
                    },
                    onCancel: () => stopListening(paymentStatusCheckInterval),
                    onError: () => stopListening(paymentStatusCheckInterval)
                });
            });
        });
    };

    const handleStartFreeTrial = async (plan: SubscriptionPlan) => {
        startFreeTrial({ plan_id: plan.id, email: user.email }).then(resp => {
            if (resp.is_active) {
                window.location.reload()
            }
        });
    };

    // Calculate displayed plans and discount
    const free_plan = plans.find(p => p.name === "Free Trial")
    const monthly_plan = plans.find(p => p.name === "Pro Monthly")
    const annual_plan = plans.find(p => p.name === "Pro Annual")
    let YEARLY_DISCOUNT = 0;
    if (monthly_plan && annual_plan) {
        YEARLY_DISCOUNT = ((monthly_plan.price - annual_plan.price / 12) / monthly_plan.price) * 100
    }

    return (
        <div className="w-full">
            <Tabs value={stage} onValueChange={setStage} className="w-full">
                <TabsList className={`mb-6 grid w-full ${user.is_subscribed ? 'grid-cols-1' : 'grid-cols-4'} rounded-4xl`}>
                    {user.is_subscribed && <TabsTrigger value="welcome" className="rounded-full ">Your Plan</TabsTrigger>}
                    {!user.is_subscribed && <>
                        <TabsTrigger value="select_plan" className="rounded-full ">Select Plan</TabsTrigger>
                        <TabsTrigger value="pay" className="rounded-full">Pay</TabsTrigger>
                        <TabsTrigger value="await_sub" className="rounded-full ">Await Subscription</TabsTrigger>
                    </>}
                </TabsList>
                {/* Only show other stages if not subscribed */}
                {!user.is_subscribed && <TabsContent value="select_plan">
                    <div className="flex flex-col items-center">
                        <Tabs value={selectedBillingPeriod} onValueChange={setSelectedBillingPeriod} className="mb-2">
                            <TabsList className="h-11 bg-background border px-1.5 rounded-full">
                                <TabsTrigger
                                    value="yearly"
                                    className="px-4 py-1.5 rounded-full data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"
                                >
                                    Yearly{YEARLY_DISCOUNT > 0 ? ` (Save ${Math.ceil(YEARLY_DISCOUNT)}%)` : ""}
                                </TabsTrigger>
                                <TabsTrigger
                                    value="monthly"
                                    className="px-4 py-1.5 rounded-full data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"
                                >
                                    Monthly
                                </TabsTrigger>
                            </TabsList>
                        </Tabs>
                        <div className="mt-5 flex flex-wrap justify-center gap-5 md:justify-start">
                            {free_plan && (
                                <Card className="flex flex-col justify-between bg-background border px-6 py-5 min-w-[280px] sm:min-w-[320px] md:min-w-[300px] lg:min-w-[320px] flex-1 md:max-w-sm lg:max-w-md h-full">
                                    <h3 className="text-md font-medium">
                                        {free_plan.name} <br /> (No card required)
                                    </h3>
                                    <p className="mt-2 text-4xl font-bold">{free_plan.currency} {Number(free_plan.price).toLocaleString()} </p>
                                    <p className="mt-2 font-medium text-muted-foreground">{free_plan.description}</p>
                                    <Button
                                        size="lg"
                                        className="flex items-center justify-center w-full mt-4 rounded-full text-base cursor-pointer"
                                        data-umami-event={`get_started_${free_plan.name.toLowerCase()}@pricing`}
                                        onClick={() => handleStartFreeTrial(free_plan)}
                                    >
                                        Get Started <ArrowUpRight className="w-4 h-4" />
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
                                    <h3 className="text-md font-medium">{monthly_plan.name}</h3>
                                    <p className="mt-2 text-4xl font-bold">{monthly_plan.currency} {Number(monthly_plan.price).toLocaleString()} </p>
                                    <p className="mt-2 font-medium text-muted-foreground">{monthly_plan.description}</p>
                                    <Button
                                        size="lg"
                                        className="w-full mt-4 rounded-full text-base"
                                        onClick={() => handleSelectPlan(monthly_plan)}
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
                                    <h3 className="text-md font-medium">
                                        {annual_plan.name} <br /> (billed annually)
                                    </h3>
                                    <p className="mt-2 text-4xl font-bold">{annual_plan.currency} {Number(annual_plan.price / 12).toLocaleString()}</p>
                                    <p className="mt-2 font-medium text-muted-foreground">{annual_plan.description}</p>
                                    <Button
                                        size="lg"
                                        className="w-full mt-4 rounded-full text-base"
                                        onClick={() => handleSelectPlan(annual_plan)}
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
                                        {annual_plan.benefits.split("$").map((feature, index) => (
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
                </TabsContent>}
                {!user.is_subscribed && <TabsContent value="pay">
                    {selectedPlan && (
                        <div className="flex flex-col items-center gap-6">
                            <Card className="w-full max-w-xl border bg-background dark:bg-zinc-900 dark:border-zinc-700 shadow-lg p-8">
                                <div className="flex flex-col md:flex-row items-center justify-between gap-6">
                                    <div className="flex flex-col items-start gap-2 flex-1">
                                        <span className="text-xs uppercase font-semibold text-muted-foreground dark:text-zinc-400 tracking-wide">Selected Plan</span>
                                        <span className="text-2xl font-bold text-zinc-900 dark:text-white">{selectedPlan.name}</span>
                                        <span className="text-sm text-muted-foreground dark:text-zinc-300">{selectedPlan.description}</span>
                                    </div>
                                    <Separator orientation="vertical" className="hidden md:block mx-6 h-20" />
                                    <div className="flex flex-col items-end gap-2">
                                        <span className="text-xs uppercase font-semibold text-muted-foreground dark:text-zinc-400 tracking-wide">Price</span>
                                        <span className="text-2xl font-bold text-blue-600 dark:text-blue-400">{selectedPlan.currency} {selectedPlan.price}/{selectedPlan.billing_interval}</span>
                                    </div>
                                </div>
                                <Button className="w-full mt-8" onClick={() => handleStartPurchase(selectedPlan)} variant="default">Pay Now</Button>
                            </Card>
                            <Button
                                variant="ghost"
                                className="mt-2 border border-input dark:border-zinc-700 text-muted-foreground dark:text-zinc-300 hover:bg-muted dark:hover:bg-zinc-800"
                                onClick={() => setStage("select_plan")}
                            >
                                ← Back
                            </Button>
                        </div>
                    )}
                </TabsContent>}
                {!user.is_subscribed && <TabsContent value="await_sub">
                    <div className="flex flex-col items-center gap-6 py-10">
                        <Skeleton className="w-20 h-20 dark:bg-zinc-800 mb-4" />
                        <div className="font-bold text-2xl text-zinc-900 dark:text-white mb-2">Configuring Your Subscription...</div>
                        <div className="text-base text-muted-foreground dark:text-zinc-300 mb-4 text-center max-w-md">
                            We are finalizing your subscription. This usually takes a few seconds, but if it takes longer, please contact support and we will help you out!
                        </div>
                        <Button
                            asChild
                            variant="outline"
                            className="rounded-full px-6 py-2 text-base border-blue-600 dark:border-blue-400 text-blue-600 dark:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-900"
                        >
                            <a href="mailto:peter@receiptiq.co?subject=Subscription%20Issue" target="_blank" rel="noopener noreferrer">
                                Contact Support
                            </a>
                        </Button>
                    </div>
                </TabsContent>}
                <TabsContent value="welcome">
                    {selectedPlan && (
                        <div className="flex flex-col items-center gap-8 py-10">
                            <Card className="w-full max-w-xl border bg-background dark:bg-zinc-900 dark:border-zinc-700 shadow-lg p-8">
                                <div className="flex flex-col md:flex-row items-center justify-between gap-6">
                                    <div className="flex flex-col items-start gap-2 flex-1">
                                        <span className="text-xs uppercase font-semibold text-muted-foreground dark:text-zinc-400 tracking-wide">Current Plan</span>
                                        <span className="text-2xl font-bold text-zinc-900 dark:text-white">{selectedPlan.name}</span>
                                        <span className="text-sm text-muted-foreground dark:text-zinc-300">{selectedPlan.description}</span>
                                    </div>
                                    <Separator orientation="vertical" className="hidden md:block mx-6 h-20" />
                                    <div className="flex flex-col items-end gap-2">
                                        <span className="text-xs uppercase font-semibold text-muted-foreground dark:text-zinc-400 tracking-wide">Price</span>
                                        <span className="text-2xl font-bold text-blue-600 dark:text-blue-400">{selectedPlan.currency} {selectedPlan.price}/{selectedPlan.billing_interval}</span>
                                    </div>
                                </div>
                            </Card>
                            <div className="font-bold text-lg text-zinc-900 dark:text-zinc-100 mt-6">Subscription Benefits</div>
                            <ul className="list-disc pl-6 text-base text-zinc-700 dark:text-zinc-300 space-y-2">
                                <li>Add New Projects</li>
                                <li>Manage your schema by adding, updating and deleting fields</li>
                                <li>Process receipts in the project</li>
                                <li>Upload Receipts</li>
                                <li>Export Extracted Transaction Data</li>
                            </ul>
                            <Button asChild variant="default" className="mt-8 text-base px-6 py-2 rounded-full"><a href="/home/projects">Go to Projects</a></Button>
                        </div>
                    )}
                </TabsContent>
            </Tabs>
        </div>
    );
}
