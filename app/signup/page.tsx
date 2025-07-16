"use client";

import { useState } from "react";
import { useAuth } from "../lib/auth";
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
  Checkbox,
  Flex,
} from "@mantine/core";
import { useForm } from "@mantine/form";
import { IconExternalLink } from "@tabler/icons-react";

export default function SignupPage() {
  const [loading, setLoading] = useState(false);
  const { signup } = useAuth();
  const router = useRouter();
  const [errors, setErrors] = useState([]);

  const form = useForm({
    initialValues: {
      first_name: "",
      last_name: "",
      email: "",
      password: "",
      confirm_password: "",
      accepted_terms: false
    },
    validate: {
      first_name: (value) =>
        value.length < 2 ? "First name must be at least 2 characters" : null,
      last_name: (value) =>
        value.length < 2 ? "Last name must be at least 2 characters" : null,
      email: (value) => (/^\S+@\S+$/.test(value) ? null : "Invalid email"),
      password: (value) => value.length < 8 ? "Password must be at least 8 characters" : value.length > 128 ? "Password must be less than 128 characters" : null,
      confirm_password: (value, values) => value != values.password ? "Passwords do not match" : null,
      accepted_terms: (value) => value ? null : "Please read and accept the terms"
    },
  });

  const handleSubmit = async (values: typeof form.values, e: { preventDefault: () => void; }) => {
    e.preventDefault()
    setLoading(true);
    try {
      await signup(values);
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
            Create an account
          </Title>
          <Text c="dimmed" size="sm" ta="center" mt={5}>
            Already have an account?{" "}
            <Anchor component={Link} href="/login" size="sm">
              Log in
            </Anchor>
          </Text>

          <Paper withBorder shadow="md" p={30} mt={30} radius="md">
            {errors.map(e => <Text c={"red"} key={e}>{e}</Text>)}
            <form onSubmit={form.onSubmit(handleSubmit)}>
              <Stack>
                <TextInput
                  label="First Name"
                  placeholder="John"
                  required
                  size="md"
                  {...form.getInputProps("first_name")}
                />
                <TextInput
                  label="Last Name"
                  placeholder="Doe"
                  required
                  size="md"
                  {...form.getInputProps("last_name")}
                />
                <TextInput
                  label="Email"
                  placeholder="you@example.com"
                  required
                  size="md"
                  {...form.getInputProps("email")}
                />
                <PasswordInput
                  label="Password"
                  placeholder="***********"
                  required
                  size="md"
                  {...form.getInputProps("password")}
                />
                <PasswordInput
                  label="Confirm Password"
                  placeholder="***********"
                  required
                  size="md"
                  {...form.getInputProps("confirm_password")}
                />
              </Stack>
              <Checkbox
                m={"sm"}
                label={
                  <Flex>
                    <Text>{"I accept"}</Text>
                    <Anchor component="a" href="/docs/ReceiptIQ Terms and Conditions.pdf" target="_blank">
                      <Flex align={"center"}>
                        <Text ml={3} mr={3}>terms and conditions</Text>
                        <IconExternalLink size={15} />
                      </Flex>
                    </Anchor>
                  </Flex>
                }
                {...form.getInputProps("accepted_terms")}
              />
              <Button
                fullWidth
                mt="xl"
                size="md"
                type="submit"
                loading={loading}
              >
                Signup
              </Button>
            </form>
          </Paper>
        </Container>
      </Box>
    </Group>
  );
}
