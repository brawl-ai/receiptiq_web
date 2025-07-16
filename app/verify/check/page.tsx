
"use client";

import { useState } from "react";
import { useForm } from "@mantine/form";
import { useAuth } from "../../lib/auth";
import { Button, Container, Group, Paper, Text, TextInput, Title } from "@mantine/core";
import { useRouter, useSearchParams } from "next/navigation";
import { notifications } from "@mantine/notifications";


export default function CheckOTPPage() {
    const searchParams = useSearchParams();
    const [loading, setLoading] = useState(false);
    const [errors, setErrors] = useState([]);
    const emailParam = searchParams.get("email");

    const { checkOTP } = useAuth()
    const router = useRouter()

    const form = useForm({
        initialValues: {
            email: emailParam,
            code: ''
        },
        validate: {
            email: (value) => (/^\S+@\S+$/.test(value) ? null : 'Invalid email'),
            code: (value) => value.length < 1 ? "otp is required" : null
        }
    })

    const handleSubmit = async (values: typeof form.values) => {
        setLoading(true);
        try {
            const checkResponse = await checkOTP(values);
            notifications.show({
                position: "top-center",
                title: "Verification Response",
                message: checkResponse.message,
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
        } finally {
            setLoading(false)
        }
    }

    return (
        <Container size={460} my={30}>
            <Title ta="center">
                Verify OTP
            </Title>
            <Text c="dimmed" fz="sm" ta="center">
                Enter the OTP below to verify
            </Text>

            <Paper withBorder shadow="md" p={30} radius="md" mt="xl">
                {errors.map(e => <Text c={"red"} key={e}>{e}</Text>)}
                <form onSubmit={form.onSubmit(handleSubmit)}>
                    <TextInput label="Your email" placeholder="me@company.com" disabled={emailParam ? true : false} required {...form.getInputProps("email")} />
                    <TextInput label="OTP" placeholder="UR0KY" required {...form.getInputProps("code")} />

                    <Group justify="space-between" mt="lg">
                        <Button
                            data-umami-event="verify_button@verify.check"
                            type="submit"
                            loading={loading}
                        >Verify</Button>
                    </Group>
                </form>
            </Paper>
        </Container>
    );
}