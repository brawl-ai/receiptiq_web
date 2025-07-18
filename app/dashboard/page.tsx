"use client"
import { AppShell, Avatar, Box, Burger, Button, Chip, Divider, Flex, Group, Menu, rem, Stack, Text, Tooltip, UnstyledButton, useMantineColorScheme } from "@mantine/core"
import { useAuth } from "../lib/auth"
import { useDisclosure } from "@mantine/hooks";
import { useRouter } from "next/navigation";
import { IconChevronDown, IconHome, IconLogout, IconReceiptFilled, IconSettings, IconUser, IconUserCircle } from "@tabler/icons-react";
import { useSubscriptions } from "../lib/subscription";
import { useEffect, useState } from "react";
import Image from "next/image";
import BillingAndSubscription from "./components/BillingAndSubscription";
import Profile from "./components/Profile";
import Projects from "./components/Projects";

export default function ProjectsPage() {
    const { colorScheme } = useMantineColorScheme();
    const [activeTab, setActiveTab] = useState("home");
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
        { icon: IconReceiptFilled, label: "Subscription and Billing", value: "billing" },
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
                        <Image
                            src={
                                colorScheme === "dark"
                                    ? "/assets/images/logo_dark_mode.png"
                                    : "/assets/images/logo.png"
                            }
                            alt="Logo"
                            width={120}
                            height={40}
                        />

                    </Group>
                    <Flex>
                        {
                            isSubscribed ?
                                <Tooltip label="You Have an Active Subscription" refProp="rootRef">
                                    <Chip defaultChecked>You are subscribed</Chip>
                                </Tooltip>
                                :
                                <Button onClick={() => setActiveTab("billing")}>
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
                    <Stack gap="xs">
                        {navItems.map((item) => (
                            <UnstyledButton
                                key={item.value}
                                onClick={() => setActiveTab(item.value)}
                                style={(theme) => ({
                                    display: "block",
                                    width: "100%",
                                    padding: theme.spacing.xs,
                                    borderRadius: theme.radius.sm,
                                    backgroundColor:
                                        activeTab == item.value
                                            ? theme.primaryColor
                                            : "transparent",
                                })}
                            >
                                <Group>
                                    <item.icon style={{ width: rem(16), height: rem(16) }} />
                                    <Text size="sm">{item.label}</Text>
                                </Group>
                            </UnstyledButton>
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