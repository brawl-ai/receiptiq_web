import { useEffect, useState } from "react";
import { FieldCreate, FieldResponse, FieldType, FieldUpdate } from "../../../types";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
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

type FormState = {
  name: string;
  type: FieldType;
  description: string;
};

type FormErrors = {
  name?: string;
  type?: string;
  description?: string;
};

export default function FieldForm({ field, onSave, onDismiss }: FieldFormProps) {
  const [form, setForm] = useState<FormState>({
    name: "",
    type: "string",
    description: "",
  });
  const [errors, setErrors] = useState<FormErrors>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (field) {
      setForm({
        name: field.name || "",
        type: field.type || "string",
        description: field.description || "",
      });
    } else {
      setForm({ name: "", type: "string", description: "" });
    }
  }, [field]);

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

  const validate = (values: FormState): FormErrors => {
    const errs: FormErrors = {};
    if (!values.name) errs.name = "Name is required";
    if (!values.type) errs.type = "Type is required";
    if (!values.description) errs.description = "Description is required";
    return errs;
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSelectChange = (value: string) => {
    setForm({ ...form, type: value as FieldType });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const validation = validate(form);
    setErrors(validation);
    if (Object.keys(validation).length > 0) return;
    setIsSubmitting(true);
    try {
      await onSave(form);
      setForm({ name: "", type: "string", description: "" });
      onDismiss();
    } catch (error) {
      console.error("Error perfoming field operation:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const selectOptions = [
    { value: "string", label: "String" },
    { value: "number", label: "Number" },
    { value: "boolean", label: "Boolean" },
    { value: "date", label: "Date" },
    { value: "object", label: "Object" },
    { value: "array", label: "Array" },
  ];

  return (
    <div className="border border-blue-300 rounded-md p-4 bg-background">
      <form onSubmit={handleSubmit}>
        <div className="flex flex-col gap-4">
          <div>
            <Label htmlFor="field-name">Field Name</Label>
            <Input
              id="field-name"
              name="name"
              value={form.name}
              onChange={handleChange}
              placeholder="Enter field name"
              required
              className="mt-1"
            />
            {errors.name && <span className="text-xs text-red-500">{errors.name}</span>}
          </div>
          <div>
            <Label htmlFor="field-type">Field Type</Label>
            <Select
              value={form.type}
              onValueChange={handleSelectChange}
              required
            >
              <SelectTrigger>
                <SelectValue placeholder="Select field type" />
              </SelectTrigger>
              <SelectContent>
                {selectOptions.map((option) => (
                  <SelectItem key={option.value} value={option.value}>
                    <div className="flex items-center gap-2">
                      {icons[option.value]}
                      {option.label}
                      {form.type === option.value && (
                        <IconCheck className="ml-auto" {...iconProps} />
                      )}
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {errors.type && <span className="text-xs text-red-500">{errors.type}</span>}
          </div>
          <div>
            <Label htmlFor="field-description">Field Description</Label>
            <Textarea
              id="field-description"
              name="description"
              value={form.description}
              onChange={handleChange}
              placeholder="Enter field description"
              required
              className="mt-1"
            />
            {errors.description && <span className="text-xs text-red-500">{errors.description}</span>}
          </div>
        </div>
        <div className="flex flex-row justify-end gap-2 mt-6">
          <Button
            type="button"
            variant="outline"
            onClick={onDismiss}
            data-umami-event="cancel@projects_field_form"
            disabled={isSubmitting}
          >
            Cancel
          </Button>
          <Button
            data-umami-event="save@projects_fieldform"
            type="submit"
            variant="default"
            disabled={isSubmitting}
          >
            {isSubmitting ? "Saving..." : "Save"}
          </Button>
        </div>
      </form>
    </div>
  );
}
