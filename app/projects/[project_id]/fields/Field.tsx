import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import {
  Collapsible,
  CollapsibleContent,
} from "@/components/ui/collapsible";
import { Button } from "@/components/ui/button";
import { FieldCreate, FieldResponse, FieldUpdate } from "../../../types";
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
  const [opened, setOpened] = useState(false);
  const [childrenOpened, setChildrenOpened] = useState(false);
  const [selectedField, setSelectedField] = useState<FieldResponse | null>(field);
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
    setOpened(true);
  };

  const handleAddChild = () => {
    setSelectedField(null);
    setIsAddingChild(true);
    setOpened(true);
  };

  const handleDelete = async (field_id: string) => {
    try {
      setIsDeleting(true);
      await onDeleteField(field_id);
    } catch (error) {
      console.log("Error deleting field", error);
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <div
      key={field.id}
      className="p-1 m-1 border rounded-md border-dotted border-gray-300 bg-gray-50 dark:bg-gray-950 shadow-sm"
    >
      <div className="flex justify-between items-center">
        <div className="flex items-center gap-2">
          {field.type === "string" && <IconAbc size={30} />}
          {field.type === "number" && <IconNumbers size={30} />}
          {field.type === "date" && <IconCalendar size={30} />}
          {field.type === "boolean" && <IconToggleLeft size={30} />}
          {field.type === "object" && <IconJson size={30} />}
          {field.type === "array" && <IconBrackets size={30} />}
          <Badge
            variant="secondary"
            className="bg-green-500 text-white dark:bg-green-600"
          >
            <code>{field.name}</code>
          </Badge>
          {field.description && (
            <span className="text-muted-foreground text-sm">{field.description}</span>
          )}
          {field.children.length > 0 && <Badge className="text-xs text-muted bg-primary">{field.children.length}</Badge>}
        </div>
        <div className="flex flex-row gap-2 items-center">
          {(field.type === "array" || field.type === "object") && (
            <Button
              variant="ghost"
              size="icon"
              aria-label="Toggle Children"
              onClick={() => setChildrenOpened((v) => !v)}
              data-umami-event={childrenOpened ? "hide_children_fields@projects_fields" : "show_children_fields@projects_fields"}
            >
              {childrenOpened ? <IconChevronUp size={18} /> : <IconChevronDown size={18} />}
            </Button>
          )}
          <Button
            variant="ghost"
            size="icon"
            aria-label="Edit"
            onClick={handleEditField}
            data-umami-event="edit_field@projects_fields"
          >
            <IconPencil size={16} />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            aria-label="Delete"
            onClick={() => handleDelete(field.id)}
            data-umami-event="delete_field@projects_fields"
            disabled={isDeleting}
          >
            <IconTrash size={16} />
          </Button>
        </div>
      </div>
      {(field.type === "array" || field.type === "object") && childrenOpened && (
        <Separator className="my-4" />
      )}
      <Collapsible open={childrenOpened} onOpenChange={setChildrenOpened}>
        <CollapsibleContent>
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
            <div className="flex flex-row justify-end">
              <Button
                variant="outline"
                size="icon"
                aria-label="Add Child"
                className="m-2"
                onClick={handleAddChild}
                data-umami-event="add_child_field@projects_fields"
              >
                <IconPlus size={16} />
              </Button>
            </div>
          )}
        </CollapsibleContent>
      </Collapsible>
      <Collapsible open={opened} onOpenChange={setOpened}>
        <CollapsibleContent>
          <FieldForm
            field={selectedField}
            onSave={handleSave}
            onDismiss={() => setOpened(false)}
          />
        </CollapsibleContent>
      </Collapsible>
    </div>
  );
}
