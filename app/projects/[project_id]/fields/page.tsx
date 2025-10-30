"use client"

import { useFieldsContext } from "@/app/stores/fields_store";
import { useState } from "react";
import { Separator } from "@/components/ui/separator";
import Field from "./Field";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { Button } from "@/components/ui/button";
import FieldForm from "./FieldForm";

export default function FieldsPage() {
    const [opened, setOpened] = useState(false);
    const fields = useFieldsContext((s) => s.fields);
    const addField = useFieldsContext((s) => s.addField);
    const addChildField = useFieldsContext((s) => s.addChildField);
    const updateField = useFieldsContext((s) => s.updateField);
    const deleteField = useFieldsContext((s) => s.deleteField);

    const top_level_fields = fields.filter((f) => f.parent == null);

    return (<div className="p-5 border-1 border-dashed rounded-md m-5">
        <h1 className="text-xl m-2 text-foreground">Fields</h1>
        <Separator />
        <div className="flex flex-col mt-2">
            {top_level_fields.map((field) => (
                <Field
                    key={field.id}
                    field={field}
                    onAddChildField={addChildField}
                    onUpdateField={updateField}
                    onDeleteField={deleteField}
                />
            ))}
            {fields.length === 0 && (
                <div className="text-muted-foreground text-center m-5">
                    No fields added yet
                </div>
            )}
            <Collapsible open={opened} onOpenChange={setOpened}>
                <CollapsibleTrigger asChild>
                    <div className="flex flex-row justify-end">
                        <Button
                            onClick={() => setOpened((prev) => !prev)}
                            data-umami-event="add_field@projects_fields"
                            aria-expanded={opened}
                            className="cursor-pointer"
                        >
                            + Field
                        </Button>
                    </div>
                </CollapsibleTrigger>
                <CollapsibleContent>
                    <FieldForm
                        field={null}
                        onSave={addField}
                        onDismiss={() => setOpened(false)}
                    />
                </CollapsibleContent>
            </Collapsible>
        </div>
    </div>
    );
}