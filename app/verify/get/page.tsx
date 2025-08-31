"use client";

import { useState } from "react";
import { useForm } from "@mantine/form";
import { notifications } from "@mantine/notifications";
import { useAuth } from "../../lib/contexts/auth";
import { Button, Container, Group, Paper, Text, TextInput, Title } from "@mantine/core";
import { useRouter } from "next/navigation";


export default function GetOTPPage() {

    const [loading, setLoading] = useState(false);
    const [errors, setErrors] = useState([]);

    const { getOTP } = useAuth()
    const router = useRouter()


    const form = useForm({
        initialValues: {
            email: ''
        },
        validate: {
            email: (value) => (/^\S+@\S+$/.test(value) ? null : 'Invalid email')
        }
    })

    const handleSubmit = async (values: typeof form.values) => {
        setLoading(true);
        try {
            const response = await getOTP(values);
            console.log(response)
            notifications.show({
                position: "top-right",
                title: "Verification Request Response",
                message: response.message,
                color: "green",
            });
            router.push(`/verify/check?email=${encodeURIComponent(values.email)}`);
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
                Request an OTP
            </Title>
            <Text c="dimmed" fz="sm" ta="center">
                Enter your email to get an OTP
            </Text>

            <Paper withBorder shadow="md" p={30} radius="md" mt="xl">
                {errors.map(e => <Text c={"red"} key={e}>{e}</Text>)}
                <form onSubmit={form.onSubmit(handleSubmit)}>
                    <TextInput label="Your email" placeholder="me@company.com" required {...form.getInputProps("email")} />
                    <Group justify="space-between" mt="lg">
                        <Button
                            data-umami-event="get_otp_button@verify.get"
                            type="submit"
                            loading={loading}
                        >Get OTP</Button>
                    </Group>
                </form>
            </Paper>
        </Container>
    );
}