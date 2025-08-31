"use client";

import {
  AppShell,
  Avatar,
  Box,
  Button,
  Divider,
  Group,
  Menu,
  rem,
  Stack,
  Text,
  ThemeIcon,
  UnstyledButton,
} from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import {
  IconChartBar,
  IconChevronDown,
  IconLogout,
  IconProgressCheck,
  IconReceipt,
  IconSchema,
  IconSettings,
  IconSettingsFilled,
  IconTableExport,
  IconUser,
} from "@tabler/icons-react";
import { useState } from "react";
import { useAuth } from "../../lib/contexts/auth";
import { useRouter, useSearchParams } from "next/navigation";
import { useFields } from "../../lib/contexts/fields";
import { FieldsManager } from "./components/FieldsManager";
import DocumentsManager from "./components/DocumentsManager";
import { useReceipts } from "../../lib/contexts/receipts";
import ProcessingManager from "./components/ProcessingManager";
import DataTab from "./components/data/DataTab";
import DataExport from "./components/export/DataExport";

export default function ProjectDashboardPage() {
  const searchParams = useSearchParams()
  const tab = searchParams.get('tab')
  const [opened] = useDisclosure();
  const [activeTab, setActiveTab] = useState(tab ? tab : "fields");
  const { user, logout } = useAuth();
  const { project, fields, addField, addChildField, updateField, deleteField } = useFields();
  const { loading, error, receipts, createReceipt, deleteReceipt, processReceipt, updateDataValue, exportData } = useReceipts();


  const router = useRouter();

  const navItems = [
    { icon: IconSchema, label: "Fields", value: "fields" },
    { icon: IconReceipt, label: "Documents", value: "documents" },
    { icon: IconProgressCheck, label: "Process", value: "process" },
    { icon: IconChartBar, label: "Data", value: "data" },
    { icon: IconTableExport, label: "Export", value: "export" },

  ];

  const handleTabChange = (tabValue: string) => {
    setActiveTab(tabValue);
    const currentUrl = new URL(window.location.href);
    currentUrl.searchParams.set('tab', tabValue);
    router.push(currentUrl.pathname + currentUrl.search, { scroll: false });
  };

  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((part) => part[0])
      .join("")
      .toUpperCase();
  };

  const handleLogout = async () => {
    try {
      await logout();
      router.push("/login");
    } catch (error) {
      console.error("Error logging out:", error);
    }
  };

  return (
    <AppShell
      header={{ height: 60 }}
      navbar={{ width: 300, breakpoint: "sm", collapsed: { mobile: !opened } }}
      padding="md"
    >
      <AppShell.Header>
        <Group h="100%" px="md" justify="space-between">
          <Group>
            <ThemeIcon size={40} radius="md" variant="filled" color="blue">
              <IconReceipt size={24} />
            </ThemeIcon>
            <Text size="xl" fw={700} component="a" href="">
              ReceiptIQ
            </Text>
            <Divider orientation="vertical" ml={"lg"} mr={"lg"} variant="dotted" />
            <Text size="xl" fw={700}>
              {project.name}
            </Text>
            {project.description && (
              <Text c="dimmed" size="sm">
                {project.description}
              </Text>
            )}
          </Group>

          <Group>
            {(receipts.length > 0 && activeTab !== "process") && (
              <Button
                data-umami-event={`process_header_button@projects_${project.id}`}
                variant="gradient"
                onClick={() => handleTabChange("process")}
                leftSection={<IconSettingsFilled />}
              >
                Process
              </Button>
            )}
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
        {activeTab === "fields" && (
          <FieldsManager
            fields={fields}
            onAddField={addField}
            onAddChildField={addChildField}
            onUpdateField={updateField}
            onDeleteField={deleteField}
          />
        )}

        {activeTab === "documents" && (
          <DocumentsManager
            receipts={receipts}
            loading={loading}
            error={error}
            onCreateReceipt={createReceipt}
            onDeleteReceipt={deleteReceipt}
          />
        )}

        {activeTab === "process" && (
          <ProcessingManager
            receipts={receipts}
            fields={project.fields}
            error={error}
            onProcessReceipt={processReceipt}
            onUpdateDataValue={updateDataValue}
          />
        )}
        {activeTab === "data" && (
          <DataTab
            receipts={receipts}
            fields={project.fields}
          />
        )}
        {activeTab === "export" &&
          <DataExport
            receipts={receipts}
            fields={project.fields}
            onExport={exportData}
          />
        }

      </AppShell.Main>
    </AppShell>
  );
}
