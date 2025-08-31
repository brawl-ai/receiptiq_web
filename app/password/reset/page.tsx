"use client";

import { useEffect, useState } from "react";
import { notFound, useRouter, useSearchParams } from "next/navigation";

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
    Flex
} from "@mantine/core";
import { useForm } from "@mantine/form";
import { notifications } from "@mantine/notifications";
import { useAuthContext } from "../../stores/auth_store";

export default function ResetPasswordPage() {
    const [loading, setLoading] = useState(false);
    const [errors, setErrors] = useState([]);
    const resetPassword = useAuthContext((s) => s.resetPassword);
    const searchParams = useSearchParams();
    const router = useRouter();

    useEffect(() => {
        if (!searchParams.get("token") || !searchParams.get("email")) {
            notFound()
        }
    }, [searchParams])

    const form = useForm({
        initialValues: {
            email: searchParams.get("email"),
            token: searchParams.get("token"),
            new_password: ""
        },
        validate: {
            email: (value) => (/^\S+@\S+$/.test(value) ? null : "invalid email"),
            new_password: (value) => value.length < 8 ? "Password must be at least 8 characters" : value.length > 128 ? "Password must be less than 128 characters" : null,
            token: (value) => value.length < 1 ? "Missing token, check url" : null
        },
    });

    const handleSubmit = async (values: typeof form.values) => {
        setLoading(true);
        try {
            const response = await resetPassword(values);
            notifications.show({
                position: "top-right",
                title: "Reset Password Success",
                message: response.message,
                color: "green",
            });
            router.push("/login")
        } catch (error) {
            let errors = []
            if (error.response?.data?.detail?.errors) {
                errors = error.response?.data?.detail?.errors.map(e => e)
            } else {
                errors.push(error.response?.data?.detail)
            }
            setErrors(errors)
            notifications.show({
                position: "top-right",
                title: "Reset Password Error",
                message: String(errors) || "Failed to reset password",
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
                    src="/assets/images/bg2.jpg"
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
                <Container size={500} w="100%">
                    <Title ta="center" fw={900}>
                        Forgot your password?
                    </Title>
                    <Text c="dimmed" size="sm" ta="center" mt={5}>
                        {"Enter your email to get a reset link "}
                    </Text>

                    <Paper withBorder shadow="md" p={30} mt={30} radius="md">
                        {errors.map((e, id) => <Text c={"red"} key={id}>{e}</Text>)}
                        <form onSubmit={form.onSubmit(handleSubmit)}>
                            <Stack>
                                <TextInput
                                    label="Your Email"
                                    placeholder="you@example.com"
                                    required
                                    disabled
                                    size="md"
                                    {...form.getInputProps("email")}
                                />
                                <PasswordInput
                                    label="Password"
                                    placeholder="***********"
                                    required
                                    size="md"
                                    {...form.getInputProps("new_password")}
                                />
                            </Stack>
                            <Flex justify={"space-between"} mt={"lg"} align={"center"}>
                                <Anchor
                                    data-umami-event="back_to_forgot_password_link@password.reset"
                                    c="dimmed" size="sm" component="a" href="/password/forgot">
                                    <Text>Back to forgot password</Text>
                                </Anchor>
                                <Button
                                    data-umami-event="reset_password_button@password.reset"
                                    size="md"
                                    type="submit"
                                    loading={loading}
                                >
                                    Reset Password
                                </Button>
                            </Flex>
                        </form>
                    </Paper>
                </Container>
            </Box>
        </Group>
    );
}
