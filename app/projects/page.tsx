"use client"
import { AppShell, Avatar, Burger, Button, Chip, Flex, Group, Menu, Text, Tooltip, UnstyledButton } from "@mantine/core"
import { useAuth } from "../lib/auth"
import { useDisclosure } from "@mantine/hooks";
import { useRouter } from "next/navigation";
import { IconChevronDown, IconLogout, IconSettings, IconUser } from "@tabler/icons-react";
import { useSubscriptions } from "../lib/subscription";
import { useEffect, useState } from "react";

export default function ProjectsPage() {
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
    })

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
                        {/*<Image
                            src={
                                colorScheme === "dark"
                                    ? "assets/images/logo_dark_mode.png"
                                    : "assets/images/logo.png"
                            }
                            alt="Logo"
                            width={120}
                            height={40}
                        />
                        */}
                    </Group>
                    <Flex>
                        {isSubscribed ?
                            <Tooltip label="Chip tooltip" refProp="rootRef">
                                <Chip defaultChecked>You are subscribed &check;</Chip>
                            </Tooltip>
                            :
                            <Button component="a" href="/projects/purchase_subscription">
                                Upgrade
                            </Button>}
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
            <AppShell.Main>
                <h1>Welcome back {user.first_name} {user.email}</h1>
                <h2>Projects Page</h2>
            </AppShell.Main>
        </AppShell>
    )
}