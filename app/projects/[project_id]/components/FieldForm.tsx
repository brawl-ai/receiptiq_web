import {
  Button,
  Group,
  Paper,
  Select,
  SelectProps,
  Stack,
  Textarea,
  TextInput,
} from "@mantine/core";
import { useForm } from "@mantine/form";
import {
  FieldCreate,
  FieldResponse,
  FieldType,
  FieldUpdate,
} from "../../../lib/types";
import { useEffect, useState } from "react";
import {
  IconAbc,
  IconBraces,
  IconBrackets,
  IconCalendar,
  IconCheck,
  IconNumbers,
  IconToggleLeft,
} from "@tabler/icons-react";

interface FieldFormProps {
  field: FieldResponse | null;
  onSave: (data: FieldCreate | FieldUpdate) => Promise<FieldResponse>;
  onDismiss: () => void;
}

export default function FieldForm({
  field,
  onSave,
  onDismiss,
}: FieldFormProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const form = useForm({
    initialValues: {
      name: "",
      type: "string" as FieldType,
      description: "",
    },
    validate: {
      name: (value) => (value.length < 1 ? "Name is required" : null),
      type: (value) => (value.length < 1 ? "Type is required" : null),
      description: (value) =>
        value.length < 1 ? "Description is required" : null,
    },
  });

  useEffect(() => {
    if (field) {
      form.setValues({
        name: field.name || "",
        type: field.type || ("string" as FieldType),
        description: field.description || "",
      });
    } else {
      form.reset();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [field]);

  const handleSubmit = async (data: typeof form.values) => {
    setIsSubmitting(true);
    try {
      await onSave(data);
      form.reset();
      onDismiss();
    } catch (error) {
      console.error("Error perfoming field operation:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const iconProps = {
    stroke: 1.5,
    color: "currentColor",
    opacity: 0.6,
    size: 18,
  };

  const icons: Record<string, React.ReactNode> = {
    string: <IconAbc {...iconProps} />,
    number: <IconNumbers {...iconProps} />,
    date: <IconCalendar {...iconProps} />,
    boolean: <IconToggleLeft {...iconProps} />,
    object: <IconBraces {...iconProps} />,
    array: <IconBrackets {...iconProps} />,
  };

  const renderSelectOption: SelectProps["renderOption"] = ({
    option,
    checked,
  }) => (
    <Group flex="1" gap="xs">
      {icons[option.value]}
      {option.label}
      {checked && (
        <IconCheck style={{ marginInlineStart: "auto" }} {...iconProps} />
      )}
    </Group>
  );

  return (
    <Paper withBorder p={"sm"} bd={"1px dashed blue"}>
      <form onSubmit={form.onSubmit(handleSubmit)}>
        <Stack>
          <TextInput
            size="xs"
            label="Field Name"
            placeholder="Enter field name"
            {...form.getInputProps("name")}
            required
          />
          <Select
            size="xs"
            label="Field Type"
            placeholder="Select field type"
            {...form.getInputProps("type")}
            data={[
              { value: "string", label: "String" },
              { value: "number", label: "Number" },
              { value: "boolean", label: "Boolean" },
              { value: "date", label: "Date" },
              { value: "object", label: "Object" },
              { value: "array", label: "Array" },
            ]}
            renderOption={renderSelectOption}
          />
          <Textarea
            size="xs"
            label="Field Description"
            placeholder="Enter field description"
            {...form.getInputProps("description")}
          />
        </Stack>

        <Group justify="flex-end" mt="xl">
          <Button variant="outline" size="compact-sm" onClick={onDismiss} data-umami-event="cancel@projects_field_form">
            Cancel
          </Button>
          <Button
            data-umami-event="save@projects_fieldform"
            type="submit"
            variant="gradient"
            size="compact-sm"
            disabled={isSubmitting}
            loading={isSubmitting}
          >
            Save
          </Button>
        </Group>
      </form>
    </Paper>
  );
}
