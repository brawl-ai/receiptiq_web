"use client"

import { AppShell, Box, Burger, Button, Container, Divider, Flex, Group, List, Stack, Text, ThemeIcon, Title } from "@mantine/core";
import { useSubscriptions } from "../lib/subscription";
import { useDisclosure } from "@mantine/hooks";
import { IconArrowRight, IconArrowsHorizontal, IconCircleCheck, IconLogin, IconReceipt, IconRocket } from "@tabler/icons-react";
import { Badge, Card } from '@mantine/core';
import { useEffect, useState } from "react";
import { SubscriptionPlan } from "../lib/types";

export default function PricingPage() {
    const [plans, setPlans] = useState<SubscriptionPlan[]>([])
    const { getPlans } = useSubscriptions()
    const [opened, { toggle }] = useDisclosure(false)


    useEffect(() => {
        getPlans().then(resp => {
            setPlans(resp.data)
        })
    }, [getPlans])
    return <AppShell
        padding="md"
        header={{ height: 70 }}
        navbar={{
            width: 300,
            breakpoint: 'sm',
            collapsed: { mobile: !opened, desktop: true },
        }}
        styles={{
            main: {
            },
        }}
    >
        <AppShell.Header style={{ borderBottom: 'none' }}>
            <Container size="xl" h="100%">
                <Group justify="space-between" h="100%" px="md">
                    <Group>
                        <Burger
                            opened={opened}
                            onClick={toggle}
                            hiddenFrom="sm"
                            size="sm"
                            mr="md"
                        />
                        <ThemeIcon size={40} radius="md" variant="filled" color="blue">
                            <IconReceipt size={24} />
                        </ThemeIcon>
                        <Text size="xl" fw={700}>
                            ReceiptIQ
                        </Text>
                    </Group>

                    <Group visibleFrom="sm">
                        <Button data-umami-event="login_button@pricing" variant="outline" color="blue" component="a" href="/login">Log in</Button>
                        <Button data-umami-event="get_started_button@pricing" color="blue" component='a' href='/signup'>Get Started</Button>
                    </Group>
                </Group>
            </Container>
        </AppShell.Header>

        <AppShell.Navbar p="md">
            <Stack gap="xs">
                <Box mt="md" pt="md" style={{ borderTop: '1px solid #e9ecef' }}>
                    <Stack gap="xs">
                        <Button
                            variant="outline"
                            color="blue"
                            fullWidth
                            leftSection={<IconLogin size="1rem" />}
                            component='a' href='/login'
                            data-umami-event="login_button@pricing"
                        >
                            Log in
                        </Button>
                        <Button
                            component='a' href='/signup'
                            color="blue"
                            fullWidth
                            leftSection={<IconRocket size="1rem" />}
                            data-umami-event="get_started_button@pricing"
                        >
                            Get Started
                        </Button>
                    </Stack>
                </Box>
            </Stack>
        </AppShell.Navbar>
        <AppShell.Main>
            <Divider my="md" label={<Title>Subscription Benefits</Title>} labelPosition="center" variant="dotted" />

            <Stack align="center" m={"xl"}>
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
            </Stack>
            <Divider my="md" label={<Title>Pricing</Title>} labelPosition="center" variant="dotted" />
            <Flex gap={"md"} align={"center"} justify={"center"} wrap={"wrap"}>
                {plans.map(plan => {
                    return (
                        <Card withBorder padding="lg" radius="lg" key={plan.id} h={500} w={350}>
                            <Group justify="space-between">
                                <Badge>Limited Time Offer</Badge>
                            </Group>

                            <Text fz="lg" fw={500} mt="md">
                                {plan.name}
                            </Text>
                            <Text fz="sm" c="dimmed" mt={5}>
                                {plan.description}
                            </Text>

                            <Box>
                                {plan.billing_interval === "annually" && (
                                    <Text c="blue" fz="lg" mt="md">
                                        {plan.currency} {Number((plan.price / 12).toFixed(2))}/monthly
                                    </Text>
                                )}
                                {plan.billing_interval === "monthly" && (
                                    <Text c="blue" fz="lg" mt="md">
                                        {plan.currency} {plan.price}/{plan.billing_interval}
                                    </Text>
                                )}
                            </Box>
                            <Group justify="flex-start" mt="md">
                                <Button
                                    variant="light"
                                    rightSection={<IconArrowRight size={14} />}
                                    component="a"
                                    href="/login?redirect=/dashboard"
                                    data-umami-event={`get_started_with_plan_${plan.id}_@pricing`}
                                >Get Started</Button>
                            </Group>
                        </Card>
                    )
                })}
                <Card withBorder padding="lg" radius="lg" h={500} w={350}>
                    <Group justify="space-between">
                        <Badge bg={"grape"}>Enterprise</Badge>
                    </Group>

                    <Text fz="lg" fw={500} mt="md">
                        Scale (Custom)
                    </Text>
                    <Text fz="sm" c="dimmed" mt={5} w={300}>
                        Custom volume, dedicated support, and advanced features — contact us for pricing
                    </Text>

                    <Box>
                        <Text c="blue" fz="lg" mt="md">
                            *
                        </Text>
                    </Box>
                    <Group justify="flex-start" mt="md">
                        <Button
                            variant="outline"
                            rightSection={<IconArrowsHorizontal size={14} />}
                            component="a"
                            href="mailto:peter@receiptiq.co"
                            data-umami-event={`contact_sales@pricing`}
                        >Contact Sales</Button>
                    </Group>
                </Card>
            </Flex>

        </AppShell.Main>
    </AppShell>
}