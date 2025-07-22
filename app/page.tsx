"use client"

import React from 'react';
import {
  AppShell,
  Container,
  Group,
  Button,
  Text,
  Title,
  Stack,
  Card,
  SimpleGrid,
  Box,
  Badge,
  Center,
  ThemeIcon,
  Burger,
  NavLink
} from '@mantine/core';
import { useDisclosure } from '@mantine/hooks';
import {
  IconBrain,
  IconFileText,
  IconSettings,
  IconFolders,
  IconDownload,
  IconReceipt,
  IconChartBar,
  IconArrowRight,
  IconLogin,
  IconRocket
} from '@tabler/icons-react';

export default function ReceiptIQHomepage() {
  const [opened, { toggle }] = useDisclosure(false);

  return (
    <AppShell
      padding="md"
      header={{ height: 70 }}
      navbar={{
        width: 300,
        breakpoint: 'sm',
        collapsed: { mobile: !opened, desktop: true },
      }}
      styles={{
        main: {
          // backgroundColor: '#f8f9fa',
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
              <Text size="sm" component='a' href='/pricing' c="dimmed">Pricing</Text>
              <Button data-umami-event="lgoin@home" variant="outline" color="blue" component="a" href="/login">Log in</Button>
              <Button data-umami-event="get_started@home" color="blue" component='a' href='/signup'>Get Started</Button>
            </Group>
          </Group>
        </Container>
      </AppShell.Header>

      <AppShell.Navbar p="md">
        <Stack gap="xs">
          <NavLink
            href="/login"
            label="Pricing"
          />
          <Box mt="md" pt="md" style={{ borderTop: '1px solid #e9ecef' }}>
            <Stack gap="xs">
              <Button
                variant="outline"
                color="blue"
                fullWidth
                leftSection={<IconLogin size="1rem" />}
                component='a' href='/login'
                data-umami-event="login@home_sidebar"
              >
                Log in
              </Button>
              <Button
                component='a' href='/signup'
                color="blue"
                fullWidth
                leftSection={<IconRocket size="1rem" />}
                data-umami-event="get_started@homepage_sidebar"
              >
                Get Started
              </Button>
            </Stack>
          </Box>
        </Stack>
      </AppShell.Navbar>

      <AppShell.Main>
        {/* Hero Section */}
        <Box py={100}>
          <Container size="xl">
            <Stack align="center" gap={40}>
              {/* Floating Avatars */}
              <Box pos="relative" w="100%" mih={300}>
                <Center h={300}>
                  <Stack align="center" gap={30} maw={600}>
                    <Title
                      order={1}
                      size={56}
                      fw={700}
                      ta="center"
                      lh={1.1}
                    >
                      One tool to{' '}
                      <Text span c="blue.6" inherit>
                        extract data
                      </Text>
                      {' '}from receipts and manage your workflow
                    </Title>

                    <Text size="lg" c="dimmed" ta="center" maw={500} lh={1.6}>
                      ReceiptIQ helps teams process receipts faster, smarter and more efficiently,
                      delivering the visibility and data-driven insights to mitigate risk and ensure compliance.
                    </Text>

                    <Group gap="md">
                      <Button size="lg" color="blue" rightSection={<IconArrowRight size={18} />} component='a' href='/signup' data-umami-event="get_started@home_herosection">
                        Get Started
                      </Button>
                    </Group>
                  </Stack>
                </Center>
              </Box>
            </Stack>
          </Container>
        </Box>

        {/* Features Section */}
        <Box py={100}>
          <Container size="xl">
            <Stack align="center" gap={60}>
              <Stack align="center" gap="md">
                <Badge variant="light" color="blue" size="lg">FEATURES</Badge>
                <Title order={2} ta="center" size={42} fw={700}>
                  Latest advanced technologies to
                  <br />
                  ensure everything you need
                </Title>
                <Text size="lg" c="dimmed" ta="center" maw={600}>
                  Maximize your team productivity and accuracy with our affordable, user-friendly
                  receipt management system.
                </Text>
              </Stack>

              <SimpleGrid cols={{ base: 1, md: 3 }} spacing="xl">
                {/* AI-Powered Extraction */}
                <Card shadow="sm" padding="xl" radius="md" style={{ height: '100%' }}>
                  <Stack gap="lg">
                    <ThemeIcon size={50} radius="md" variant="light" color="blue">
                      <IconBrain size={28} />
                    </ThemeIcon>
                    <Title order={3} size="xl" fw={600}>
                      AI-Powered Data Extraction
                    </Title>
                    <Text c="dimmed" lh={1.6}>
                      Uses OpenAI GPT models to intelligently extract structured data from receipts
                      with high accuracy and minimal manual intervention.
                    </Text>
                  </Stack>
                </Card>

                {/* Multi-Format Support */}
                <Card shadow="sm" padding="xl" radius="md" style={{ height: '100%' }}>
                  <Stack gap="lg">
                    <ThemeIcon size={50} radius="md" variant="light" color="green">
                      <IconFileText size={28} />
                    </ThemeIcon>
                    <Title order={3} size="xl" fw={600}>
                      Multi-Format Support
                    </Title>
                    <Text c="dimmed" lh={1.6}>
                      Process any receipt format including images (JPEG and PNG) and PDF documents
                      seamlessly in one unified platform.
                    </Text>
                  </Stack>
                </Card>

                {/* Custom Schema */}
                <Card shadow="sm" padding="xl" radius="md" style={{ height: '100%' }}>
                  <Stack gap="lg">
                    <ThemeIcon size={50} radius="md" variant="light" color="orange">
                      <IconSettings size={28} />
                    </ThemeIcon>
                    <Title order={3} size="xl" fw={600}>
                      Custom Schema Definition
                    </Title>
                    <Text c="dimmed" lh={1.6}>
                      Define custom fields and data structures for extraction that match your specific
                      business requirements and workflows.
                    </Text>
                  </Stack>
                </Card>

                {/* Project Management */}
                <Card shadow="sm" padding="xl" radius="md" style={{ height: '100%' }}>
                  <Stack gap="lg">
                    <ThemeIcon size={50} radius="md" variant="light" color="purple">
                      <IconFolders size={28} />
                    </ThemeIcon>
                    <Title order={3} size="xl" fw={600}>
                      Project Management
                    </Title>
                    <Text c="dimmed" lh={1.6}>
                      Organize receipts into projects with custom field schemas, making it easy to
                      manage different clients or expense categories.
                    </Text>
                  </Stack>
                </Card>

                {/* Data Export */}
                <Card shadow="sm" padding="xl" radius="md" style={{ height: '100%' }}>
                  <Stack gap="lg">
                    <ThemeIcon size={50} radius="md" variant="light" color="red">
                      <IconDownload size={28} />
                    </ThemeIcon>
                    <Title order={3} size="xl" fw={600}>
                      Data Export
                    </Title>
                    <Text c="dimmed" lh={1.6}>
                      Export extracted data as CSV files for easy integration with accounting software,
                      spreadsheets, and other business tools.
                    </Text>
                  </Stack>
                </Card>

                {/* Dynamic Dashboard Preview */}
                <Card shadow="sm" padding="xl" radius="md" style={{ height: '100%' }}>
                  <Stack gap="lg">
                    <ThemeIcon size={50} radius="md" variant="light" color="blue">
                      <IconChartBar size={28} />
                    </ThemeIcon>
                    <Title order={3} size="xl" fw={600}>
                      Dynamic Dashboard
                    </Title>
                    <Text c="dimmed" lh={1.6}>
                      ReceiptIQ helps accounting teams work faster, smarter and more efficiently,
                      delivering the visibility and data-driven insights for compliance tracking.
                    </Text>
                  </Stack>
                </Card>
              </SimpleGrid>
            </Stack>
          </Container>
        </Box>
      </AppShell.Main>
    </AppShell>
  );
}