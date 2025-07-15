"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import {
    TextInput,
    Paper,
    Title,
    Container,
    Button,
    Text,
    Anchor,
    Stack,
    Box,
    Image,
    Group,
    PasswordInput,
} from "@mantine/core";
import { useForm } from "@mantine/form";
import { notifications } from "@mantine/notifications";
import { useAuth } from "../lib/auth";

export default function LoginPage() {
    const [loading, setLoading] = useState(false);
    const [errors, setErrors] = useState([]);
    const { login } = useAuth();
    const router = useRouter();

    const form = useForm({
        initialValues: {
            email: "",
            password: "",
        },
        validate: {
            email: (value) => (/^\S+@\S+$/.test(value) ? null : "invalid email"),
            password: (value) => value.length < 1 ? "password is required" : null
        },
    });

    const handleSubmit = async (values: typeof form.values) => {
        setLoading(true);
        try {
            await login(values);
            router.push(`/projects`);
        } catch (error) {
            console.log(error)
            let errors = []
            if (error.response?.data?.detail?.errors) {
                errors = error.response?.data?.detail?.errors.map(e => e)
            } else {
                errors.push(error.response?.data?.detail)
            }
            setErrors(errors)
            notifications.show({
                position: "top-right",
                title: "Signup Error",
                message: String(errors) || "Failed to sign up",
                color: "red",
            });
        } finally {
            setLoading(false);
        }
    };

    return (
        <Group h="100vh" w="100%" gap={0}>
            <Box w="50%" h="100%" visibleFrom="md">
                <Image
                    src="/assets/images/bg.jpg"
                    alt="Authentication background"
                    h="100%"
                    style={{ objectFit: "cover" }}
                />
            </Box>
            <Box
                w={{ base: "100%", md: "50%" }}
                h="100%"
                style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                }}
            >
                <Container size={420} w="100%">
                    <Title ta="center" fw={900}>
                        Login
                    </Title>
                    <Text c="dimmed" size="sm" ta="center" mt={5}>
                        {"Don't have an account yet? "}
                        <Anchor component={Link} href="/signup" size="sm">
                            Create account
                        </Anchor>
                    </Text>

                    <Paper withBorder shadow="md" p={30} mt={30} radius="md">
                        {errors.map((e, id) => <Text c={"red"} key={id}>{e}</Text>)}
                        <form onSubmit={form.onSubmit(handleSubmit)}>
                            <Stack>
                                <TextInput
                                    label="Email"
                                    placeholder="you@example.com"
                                    required
                                    size="md"
                                    {...form.getInputProps("email")}
                                />
                                <PasswordInput
                                    label="Password"
                                    placeholder="********"
                                    required
                                    size="md"
                                    {...form.getInputProps("password")}
                                />
                            </Stack>

                            <Button
                                fullWidth
                                mt="xl"
                                size="md"
                                type="submit"
                                loading={loading}
                            >
                                Login
                            </Button>
                        </form>
                    </Paper>
                </Container>
            </Box>
        </Group>
    );
}
