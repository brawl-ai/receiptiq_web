"use client"
import { AppShell, Avatar, Box, Burger, Button, Chip, Divider, Flex, Group, Menu, rem, Stack, Text, ThemeIcon, Tooltip, UnstyledButton } from "@mantine/core"
import { useAuth } from "../lib/contexts/auth"
import { useDisclosure } from "@mantine/hooks";
import { useRouter, useSearchParams } from "next/navigation";
import { IconChevronDown, IconHome, IconLogout, IconReceipt, IconReceiptFilled, IconSettings, IconUser, IconUserCircle } from "@tabler/icons-react";
import { useSubscriptions } from "../lib/contexts/subscription";
import { useEffect, useState } from "react";
import BillingAndSubscription from "./components/BillingAndSubscription";
import Profile from "./components/Profile";
import Projects from "./components/Projects";

export default function ProjectsPage() {
    const searchParams = useSearchParams()
    const tab = searchParams.get('tab')
    const [activeTab, setActiveTab] = useState(tab ? tab : "home");
    const [opened, { toggle }] = useDisclosure();
    const { user, logout } = useAuth();
    const { subscriptionStatusChecker } = useSubscriptions();
    const [isSubscribed, setIsSubscribed] = useState(false)
    const router = useRouter();

    useEffect(() => {
        console.log("running useEffect to check subscription status")
        subscriptionStatusChecker().then(resp => {
            console.log(resp)
            setIsSubscribed(resp.is_subscribed)
        }
        ).catch(err => {
            console.log(err)
        })
    }, [subscriptionStatusChecker])

    const handleTabChange = (tabValue: string) => {
        setActiveTab(tabValue);
        const currentUrl = new URL(window.location.href);
        currentUrl.searchParams.set('tab', tabValue);
        router.push(currentUrl.pathname + currentUrl.search, { scroll: false });
    };

    const handleLogout = async () => {
        try {
            logout();
            router.push("/login");
        } catch (error) {
            console.error("Error logging out:", error);
        }
    };

    const getInitials = (name: string) => {
        return name
            .split(" ")
            .map((part) => part[0])
            .join("")
            .toUpperCase();
    };

    const navItems = [
        { icon: IconHome, label: "Home", value: "home" },
        { icon: IconReceiptFilled, label: "Billing", value: "billing" },
        { icon: IconUserCircle, label: "Profile", value: "profile" },
    ];

    return (
        <AppShell
            header={{ height: 60 }}
            navbar={{ width: 300, breakpoint: "sm", collapsed: { mobile: !opened } }}
            aside={{
                width: 300,
                breakpoint: "md",
                collapsed: { desktop: false, mobile: true },
            }}
            padding="md"
        >
            <AppShell.Header>
                <Group h="100%" px="md" justify="space-between">
                    <Group>
                        <Burger
                            opened={opened}
                            onClick={toggle}
                            hiddenFrom="sm"
                            size="sm"
                        />
                        <ThemeIcon size={40} radius="md" variant="filled" color="blue">
                            <IconReceipt size={24} />
                        </ThemeIcon>
                        <Text size="xl" fw={700} component="a" href="/dashboard">
                            ReceiptIQ
                        </Text>

                    </Group>
                    <Flex>
                        {
                            isSubscribed ?
                                <Tooltip label="You Have an Active Subscription" refProp="rootRef">
                                    <Chip defaultChecked>You are subscribed</Chip>
                                </Tooltip>
                                :
                                <Button onClick={() => handleTabChange("billing")} data-umami-event="upgrade@dashboard">
                                    Upgrade
                                </Button>
                        }
                    </Flex>
                    <Menu shadow="md" width={200}>
                        <Menu.Target>
                            <UnstyledButton>
                                <Group gap={7}>
                                    <Avatar size={32} radius="xl" color="blue">
                                        {getInitials(user?.first_name + " " + user?.last_name)}
                                    </Avatar>
                                    <Text size="sm" fw={500}>
                                        {user?.first_name} {user?.last_name}
                                    </Text>
                                    <IconChevronDown size={12} stroke={1.5} />
                                </Group>
                            </UnstyledButton>
                        </Menu.Target>

                        <Menu.Dropdown>
                            <Menu.Item leftSection={<IconUser size={14} />}>
                                Profile
                            </Menu.Item>
                            <Menu.Item leftSection={<IconSettings size={14} />}>
                                Settings
                            </Menu.Item>
                            <Menu.Divider />
                            <Menu.Item
                                leftSection={<IconLogout size={14} />}
                                onClick={handleLogout}
                                color="red"
                            >
                                Logout
                            </Menu.Item>
                        </Menu.Dropdown>
                    </Menu>
                </Group>
            </AppShell.Header>
            <AppShell.Navbar p="md">
                <Stack justify="space-between" h="100%">
                    <Stack gap="md" align="flex-start">
                        {navItems.map((item) => (
                            <Button
                                key={item.value}
                                onClick={() => handleTabChange(item.value)}
                                variant={activeTab === item.value ? "gradient" : "subtle"}
                                style={{
                                    display: "flex",
                                    width: "100%"
                                }}
                            >
                                <Group justify="flex-start">
                                    <item.icon style={{ width: rem(20), height: rem(20) }} />
                                    <Text>{item.label}</Text>
                                </Group>
                            </Button>
                        ))}
                    </Stack>

                    <Box>
                        <Divider my="sm" />
                        <Menu shadow="md" width={200} position="right-end">
                            <Menu.Target>
                                <UnstyledButton
                                    style={(theme) => ({
                                        display: "block",
                                        width: "100%",
                                        padding: theme.spacing.xs,
                                        borderRadius: theme.radius.sm,
                                        "&:hover": {
                                            backgroundColor: theme.colors.gray[0],
                                        },
                                    })}
                                >
                                    <Group>
                                        <Avatar size={24} radius="xl" color="blue">
                                            {getInitials(user?.first_name + " " + user?.last_name)}
                                        </Avatar>
                                        <Text size="sm">
                                            {user?.first_name} {user?.last_name}
                                        </Text>
                                        <IconChevronDown
                                            size={12}
                                            stroke={1.5}
                                            style={{ marginLeft: "auto" }}
                                        />
                                    </Group>
                                </UnstyledButton>
                            </Menu.Target>

                            <Menu.Dropdown>
                                <Menu.Item leftSection={<IconUser size={14} />}>
                                    Profile
                                </Menu.Item>
                                <Menu.Item leftSection={<IconSettings size={14} />}>
                                    Settings
                                </Menu.Item>
                                <Menu.Divider />
                                <Menu.Item
                                    leftSection={<IconLogout size={14} />}
                                    onClick={handleLogout}
                                    color="red"
                                >
                                    Logout
                                </Menu.Item>
                            </Menu.Dropdown>
                        </Menu>
                    </Box>
                </Stack>
            </AppShell.Navbar>
            <AppShell.Main>
                {activeTab === "home" &&
                    <Box>
                        <h1>Welcome back {user.first_name}</h1>
                        <Projects />
                    </Box>
                }
                {activeTab === "billing" && (
                    <BillingAndSubscription />
                )}

                {activeTab === "profile" && <Profile />}

            </AppShell.Main>
        </AppShell>
    )
}