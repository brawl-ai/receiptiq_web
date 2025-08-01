import {
  ActionIcon,
  Badge,
  Collapse,
  Divider,
  Flex,
  Group,
  Paper,
  Text,
} from "@mantine/core";
import { FieldCreate, FieldResponse, FieldUpdate } from "../../../lib/types";
import {
  IconAbc,
  IconBrackets,
  IconCalendar,
  IconChevronDown,
  IconChevronUp,
  IconJson,
  IconNumbers,
  IconPencil,
  IconPlus,
  IconToggleLeft,
  IconTrash,
} from "@tabler/icons-react";
import { useDisclosure } from "@mantine/hooks";
import FieldForm from "./FieldForm";
import { useState } from "react";

interface FieldProps {
  field: FieldResponse;
  onUpdateField: (fieldId: string, data: FieldUpdate) => Promise<FieldResponse>;
  onAddChildField: (
    parentFieldId: string,
    data: FieldCreate
  ) => Promise<FieldResponse>;
  onDeleteField: (fieldId: string) => Promise<void>;
}

export default function Field({
  field,
  onUpdateField,
  onAddChildField,
  onDeleteField,
}: FieldProps) {
  const [opened, { toggle: toggleForm }] = useDisclosure(false);
  const [childrenOpened, { toggle: toggleChildren }] = useDisclosure(false);
  const [selectedField, setSelectedField] = useState<FieldResponse | null>(
    field
  );
  const [isAddingChild, setIsAddingChild] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  const handleSave = async (data: FieldUpdate | FieldCreate) => {
    try {
      if (isAddingChild) {
        const addChildResponse = await onAddChildField(
          field.id,
          data as FieldCreate
        );
        return addChildResponse;
      } else {
        const updateResponse = await onUpdateField(
          field.id,
          data as FieldUpdate
        );
        return updateResponse;
      }
    } catch (error) {
      console.log(
        isAddingChild ? "Add Child Field Failed" : "Update Field Failed",
        error
      );
    }
  };

  const handleEditField = () => {
    setSelectedField(field);
    setIsAddingChild(false);
    toggleForm();
  };

  const handleAddChild = () => {
    setSelectedField(null);
    setIsAddingChild(true);
    toggleForm();
  };

  const handleDelete = async (field_id: string) => {
    try {
      setIsDeleting(true)
      await onDeleteField(field_id)
    } catch (error) {
      console.log("Error deleting field", error)
    } finally {
      setIsDeleting(false)
    }
  }

  return (
    <Paper key={field.id} p="xs" mt={3} withBorder bd={"0.5px dotted #cccccc"}>
      <Flex justify={"space-between"}>
        <Group gap="xs">
          <Badge variant="light" color="blue">
            <code>{field.name}</code>
          </Badge>
          {field.type === "string" && <IconAbc />}
          {field.type === "number" && <IconNumbers />}
          {field.type === "date" && <IconCalendar />}
          {field.type === "boolean" && <IconToggleLeft />}
          {field.type === "object" && <IconJson />}
          {field.type === "array" && <IconBrackets />}
          <Divider orientation="vertical" />
          {field.description && (
            <Text c="dimmed" size="sm">
              {field.description}
            </Text>
          )}
        </Group>
        <Flex direction={"row"} justify={"space-between"}>
          <Flex gap={"xs"} align={"center"}>
            {(field.type === "array" || field.type === "object") && (
              <ActionIcon variant="subtle" aria-label="Delete" size={"sm"}>
                {childrenOpened ? (
                  <IconChevronUp data-umami-event="hide_children_fields@projects_fields" onClick={toggleChildren} size={15} />
                ) : (
                  <IconChevronDown data-umami-event="show_children_fields@projects_fields" onClick={toggleChildren} size={15} />
                )}
              </ActionIcon>
            )}
            <ActionIcon data-umami-event="edit_field@projects_fields" variant="light" aria-label="Edit" size={"sm"}>
              <IconPencil onClick={handleEditField} size={15} />
            </ActionIcon>
            <ActionIcon data-umami-event="delete_field@projects_fields" variant="light" aria-label="Delete" size={"sm"} loading={isDeleting}>
              <IconTrash onClick={() => handleDelete(field.id)} size={15} />
            </ActionIcon>
          </Flex>
        </Flex>
      </Flex>
      {(field.type === "array" || field.type === "object") && childrenOpened && (
        <Divider mt={"lg"} mb={"lg"} />
      )}
      <Collapse in={childrenOpened} mt={"md"}>
        {field.children.map((child) => (
          <Field
            key={child.id}
            field={child}
            onAddChildField={onAddChildField}
            onUpdateField={onUpdateField}
            onDeleteField={onDeleteField}
          />
        ))}
        {(field.type === "array" || field.type === "object") && !opened && (
          <Flex direction={"row"} justify={"flex-end"}>
            <ActionIcon
              data-umami-event="add_child_field@projects_fields"
              variant="gradient"
              aria-label="Add Child"
              size={"sm"}
              m={"md"}
            >
              <IconPlus onClick={handleAddChild} size={15} />
            </ActionIcon>
          </Flex>
        )}
      </Collapse>
      <Collapse in={opened} mt={"md"}>
        <FieldForm
          field={selectedField}
          onSave={handleSave}
          onDismiss={toggleForm}
        />
      </Collapse>
    </Paper>
  );
}
