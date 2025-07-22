"use client"

import { AppShell, Box, Burger, Button, Container, Divider, Flex, Group, Stack, Text, ThemeIcon, Title } from "@mantine/core";
import { useSubscriptions } from "../lib/subscription";
import { useDisclosure } from "@mantine/hooks";
import { IconArrowRight, IconLogin, IconReceipt, IconRocket } from "@tabler/icons-react";
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
            <Divider my="md" label={<Title>Pricing</Title>} labelPosition="center" variant="dotted" />
            <Flex gap={"md"} align={"center"} justify={"center"}>
                {plans.map(plan => {
                    return (
                        <Card withBorder padding="lg" radius="lg" key={plan.id}>
                            <Group justify="space-between">
                                <Badge>1k documents/month</Badge>
                            </Group>

                            <Text fz="lg" fw={500} mt="md">
                                {plan.name}
                            </Text>
                            <Text fz="sm" c="dimmed" mt={5}>
                                {plan.description}
                            </Text>

                            <Text c="blue" fz="lg" mt="md">
                                {plan.currency} {plan.price}/{plan.billing_interval}
                            </Text>
                            <Group justify="center" mt="md">
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
            </Flex>

        </AppShell.Main>
    </AppShell>
}