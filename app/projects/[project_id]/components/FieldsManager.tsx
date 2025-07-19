import {
  Text,
  Stack,
  Paper,
  Flex,
  Button,
  Collapse,
  Title,
  Divider,
} from "@mantine/core";
import { FieldCreate, FieldResponse, FieldUpdate } from "../../../lib/types";
import { useDisclosure } from "@mantine/hooks";
import Field from "./Field";
import FieldForm from "./FieldForm";

interface FieldsManagerProps {
  fields: FieldResponse[];
  onAddField: (data: FieldCreate) => Promise<FieldResponse>;
  onUpdateField: (fieldId: string, data: FieldUpdate) => Promise<FieldResponse>;
  onAddChildField: (
    parentFieldId: string,
    data: FieldCreate
  ) => Promise<FieldResponse>;
  onDeleteField: (fieldId: string) => Promise<void>;
}

export function FieldsManager({
  fields,
  onAddField,
  onUpdateField,
  onAddChildField,
  onDeleteField,
}: FieldsManagerProps) {
  const [opened, { toggle: toggleForm }] = useDisclosure(false);

  const fields_for_tree = fields.filter((f) => f.parent == null);

  return (
    <Paper p="xl" withBorder>
      <Title order={3}>Document Fields</Title>
      <Divider mb={"md"} mt={"md"} variant="dotted" />
      <Stack gap="md">
        {fields_for_tree.map((field) => (
          <Field
            key={field.id}
            field={field}
            onAddChildField={onAddChildField}
            onUpdateField={onUpdateField}
            onDeleteField={onDeleteField}
          />
        ))}
        {fields.length === 0 && (
          <Text c="dimmed" ta="center" py="xl">
            No fields added yet
          </Text>
        )}
        <Collapse in={opened}>
          <FieldForm field={null} onSave={onAddField} onDismiss={toggleForm} />
        </Collapse>
        <Flex direction={"row"} justify={"flex-end"}>
          <Button variant="gradient" size="compact-sm" onClick={toggleForm}>
            + Field
          </Button>
        </Flex>
      </Stack>
    </Paper>
  );
}
