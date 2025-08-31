"use client"
import { Box, Button, Container, Divider, Flex, List, Loader, Paper, Stepper, Text, ThemeIcon, Title } from "@mantine/core";
import { useState, useEffect, useRef } from "react";
import { SubscriptionPlan } from "../../lib/types";
import { useSubscriptions } from "../../lib/contexts/subscription";
import { useAuth } from "../../lib/contexts/auth";
import { IconCircleCheck, IconCircleCheckFilled, IconReceipt } from "@tabler/icons-react";

export default function BillingAndSubscription() {
    const [plans, setPlans] = useState<SubscriptionPlan[]>([])
    const [selectedPlan, setSelectedPlan] = useState<SubscriptionPlan | null>(null)
    const { getPlans, initiatePurchase, subscriptionStatusChecker, paymentStatusChecker } = useSubscriptions()
    const { user } = useAuth()
    const stages = ["select_plan", "pay", "await_sub", "welcome"]
    const [stage, setStage] = useState(user.is_subscribed ? "welcome" : "select_plan");
    const paymentStatusCheckInterval = useRef(null);
    const subscriptionStatusCheckInterval = useRef(null);

    useEffect(() => {
        console.log("running useEffect to get subscription plans")
        getPlans().then(resp => {
            console.log(resp)
            setPlans(resp.data)
            if (user.is_subscribed) {
                const _sub = user.subscriptions.filter((sub) => sub.is_active)[0]
                const _plan = resp.data.filter((p) => p.id == _sub.subscription_plan_id)[0]
                setSelectedPlan(_plan)
            }
        }
        ).catch(err => {
            console.log("getPlans error", err)
        })
        return () => {
            if (paymentStatusCheckInterval.current) {
                clearInterval(paymentStatusCheckInterval.current);
            }
            if (subscriptionStatusCheckInterval.current) {
                clearInterval(subscriptionStatusCheckInterval.current);
            }
        };
    }, [getPlans, user])

    const handleSelectPlan = (plan: SubscriptionPlan) => {
        setSelectedPlan(plan)
        setStage("pay")
    }

    const checkPaymentStatus = (reference: string, onSuccess: () => void) => {
        paymentStatusChecker(reference).then((response) => {
            switch (response.data.status) {
                case "success":
                    console.log("transaction success", response.data)
                    onSuccess()
                    break;
                case "pending":
                    console.log("transaction pending", response.data)
                    break;
                default:
                    console.log(`transaction ${response.data.status}`, response.data)
                    break;
            }
        })
    }

    const checkSubscriptionStatus = () => {
        subscriptionStatusChecker().then((response) => {
            if (response.is_subscribed) {
                console.log("Subscription Received")
                setStage("welcome")
                stopListening(subscriptionStatusCheckInterval)
            } else {
                console.log("Subscription Not Yet Added, Waiting...")
            }
        })
    }

    const stopListening = (intervalRef: { current: string | number | NodeJS.Timeout; }) => {
        clearInterval(intervalRef.current)
        intervalRef.current = null
    }

    const handleStartPurchase = async (plan: SubscriptionPlan) => {
        initiatePurchase({ plan_id: plan.id, email: user.email }).then(resp => {
            import('@paystack/inline-js').then(({ default: Paystack }) => {
                const paystack = new Paystack()
                paystack.resumeTransaction(resp.data.access_code,
                    {
                        onSuccess: (transaction) => {
                            //This is called when the customer successfully completes a transaction. It returns an instance of a transaction object
                            console.log(transaction);
                            //Move to next step and start listening for subscription state change
                            setStage("await_sub")
                            subscriptionStatusCheckInterval.current = setInterval(checkSubscriptionStatus, 5000)
                            stopListening(paymentStatusCheckInterval)
                        },
                        onLoad: (response) => {
                            //This is called when the transaction is successfully loaded and the customer can see the Popup. It returns an object with the following parameters:
                            console.log("onLoad: ", response);
                            //Start listening to payment status change and once successful, move to next step
                            paymentStatusCheckInterval.current = setInterval(() => checkPaymentStatus(resp.data.reference, () => setStage("await_sub")), 5000)
                        },
                        onCancel: () => {
                            //This is called when the transaction is cancelled. It returns no response.
                            console.log("onCancel");
                            //Stop listening for payment status
                            stopListening(paymentStatusCheckInterval)
                        },
                        onError: (error) => {
                            //This is called when there is an issue loading the transaction.
                            console.log("Error: ", error.message);
                            //Stop listening for payment status
                            stopListening(paymentStatusCheckInterval)
                        }
                    })
            })

        }).catch((err) => {
            console.log("Initiate Purchase Error ", err)
        })
    }

    return (
        <Container p={"md"}>
            <Stepper active={stages.indexOf(stage)}>
                <Stepper.Step label="Subscription Plan" description="Select a plan" orientation="horizontal">
                    <Flex
                        mih={50}
                        gap="md"
                        justify="space-around"
                        align="flex-start"
                        direction="row"
                        wrap="wrap"
                    >
                        {plans.map(plan =>
                            <Paper key={plan.id} shadow="lg" radius="lg" p="xl" withBorder>
                                <Flex direction={"column"} align={"center"}>
                                    <Title order={6}>{plan.name}</Title>
                                    <Divider mt={"xl"} variant="dotted" />
                                    <Box>
                                        {plan.billing_interval === "annually" && (
                                            <Title mt={"xl"} order={1} c="blue" fz="lg">
                                                {plan.currency} {Number((plan.price / 12).toFixed(2))}/monthly
                                            </Title>
                                        )}
                                        {plan.billing_interval === "monthly" && (
                                            <Title mt={"xl"} order={1} c="blue" fz="lg">
                                                {plan.currency} {plan.price}/{plan.billing_interval}
                                            </Title>
                                        )}
                                    </Box>
                                    <Title mt={"xl"} order={1}>{plan.currency + " " + plan.price}/{plan.billing_interval}</Title>
                                    <Divider mt={"xl"} variant="dotted" />
                                    <Text mt={"xl"} >{plan.description}</Text>
                                    <Divider mt={"xl"} />
                                    <Button mt={"xl"} fullWidth onClick={() => handleSelectPlan(plan)} data-umami-event="get_started@dashboard_billing">Get Started</Button>
                                </Flex>
                            </Paper>)
                        }
                    </Flex>
                </Stepper.Step>
                <Stepper.Step label="Pay" description="Payment">
                    {selectedPlan ? <>
                        <Paper shadow="lg" p={"lg"} radius={"lg"} bg={"#eee"} >
                            <Flex direction={"row"} align={"center"} justify={"space-around"} h={"100%"}>
                                <Title order={5}>{selectedPlan.name}</Title>
                                <Divider variant="dotted" orientation="vertical" />
                                <Title order={5}>{selectedPlan.currency + " " + selectedPlan.price}/{selectedPlan.billing_interval}</Title>
                                <Divider variant="dotted" orientation="vertical" />
                                <Title order={5}>{selectedPlan.description}</Title>
                                <Divider variant="dotted" orientation="vertical" />
                                <Button data-umami-event="pay_now@dashboard_billing_payments" onClick={() => handleStartPurchase(selectedPlan)}>Pay Now</Button>
                            </Flex>
                        </Paper>
                        <Button data-umami-event="back_button@dashboard_billing_payments" m={"lg"} size="sm" variant="subtle" onClick={() => setStage("select_plan")}>Back</Button>
                    </> : <Text onClick={() => setStage("select_plan")} >select a plan</Text>}

                </Stepper.Step>
                <Stepper.Step label="Subscription" description="Subscription">
                    <Paper shadow="lg" p={"lg"} radius={"lg"} bg={"#fefefe"} withBorder>
                        <Flex direction={"column"} justify={"space-evenly"} align={"center"} gap={"xl"}>
                            <Loader size={100} />
                            <Title order={4}>Configuring Your Subscription...</Title>
                            <Text>Just wrapping up a few things...</Text>
                        </Flex>
                    </Paper>
                </Stepper.Step>
                <Stepper.Step>
                    <Paper shadow="lg" p={"lg"} radius={"lg"} withBorder>
                        <Flex direction={"column"} justify={"space-evenly"} align={"center"} gap={"xl"}>
                            <IconCircleCheckFilled color={"#32d1af"} size={100} />
                            {selectedPlan ? <Paper shadow="xl" p={"lg"} radius={"lg"} w={600}>
                                <Flex direction={"row"} align={"center"} justify={"space-around"}>
                                    <IconReceipt size={40} />
                                    <Text size="sm">{user.first_name + " " + user.last_name}</Text>
                                    <Divider variant="dotted" orientation="vertical" />
                                    <Text size="md"><code>{selectedPlan.currency + " " + selectedPlan.price}/{selectedPlan.billing_interval}</code></Text>
                                    <Divider variant="dotted" orientation="vertical" />
                                    <Text size="sm">{selectedPlan.description}</Text>
                                </Flex>
                            </Paper> : <Text onClick={() => setStage("select_plan")} >select a plan</Text>}
                            <Title>Subscription Benefits</Title>
                            <List
                                spacing="xs"
                                size="sm"
                                center
                                icon={
                                    <ThemeIcon color="teal" size={24} radius="xl">
                                        <IconCircleCheck size={16} />
                                    </ThemeIcon>
                                }
                            >
                                <List.Item>Add New Projects</List.Item>
                                <List.Item>Manage your schema by adding, updating and deleting fields</List.Item>
                                <List.Item>Process receipts in the project</List.Item>
                                <List.Item>Upload Receipts</List.Item>
                                <List.Item>Export Extracted Transaction Data</List.Item>
                            </List>
                            <Button data-umami-event="get_started@dashboard_billing_endsection" component="a" href="/dashboard">Get Started</Button>
                        </Flex>
                    </Paper>
                </Stepper.Step>
            </Stepper>
        </Container>
    )
}