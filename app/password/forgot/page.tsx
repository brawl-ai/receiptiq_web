"use client";

import { useState } from "react";
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
    Flex,
} from "@mantine/core";
import { useForm } from "@mantine/form";
import { notifications } from "@mantine/notifications";
import { useAuth } from "../../lib/contexts/auth";

export default function ForgotPasswordPage() {
    const [loading, setLoading] = useState(false);
    const [errors, setErrors] = useState([]);
    const { forgotPassword } = useAuth();

    const form = useForm({
        initialValues: {
            email: "",
        },
        validate: {
            email: (value) => (/^\S+@\S+$/.test(value) ? null : "invalid email")
        },
    });

    const handleSubmit = async (values: typeof form.values) => {
        setLoading(true);
        try {
            const response = await forgotPassword(values);
            notifications.show({
                position: "top-right",
                title: "Forgot Password Success",
                message: response.message,
                color: "green",
            });
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
                title: "Forgot Password Error",
                message: String(errors) || "Failed to request password link",
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
                                    size="md"
                                    {...form.getInputProps("email")}
                                />
                            </Stack>
                            <Flex justify={"space-between"} mt={"lg"} align={"center"}>
                                <Anchor
                                    data-umami-event="back_to_login_page_link@password.forgot"
                                    c="dimmed"
                                    size="sm"
                                    component="a"
                                    href="/login">
                                    <Text>Back to the login page</Text>
                                </Anchor>
                                <Button
                                    data-umami-event="reset_password_button@password.forgot"
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
