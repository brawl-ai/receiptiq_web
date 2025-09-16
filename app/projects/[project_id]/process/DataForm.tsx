import { DataValueResponse, DataValueUpdate, FieldResponse, ReceiptResponse } from "../../../types";
import { useState } from "react";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";


export function DataFormField({ receipt, field, onValueChange }:
    {
        receipt: ReceiptResponse,
        field: FieldResponse,
        onValueChange: (data_value: DataValueResponse) => void
    }) {

    const getReceiptDataValue = (receipt: ReceiptResponse, field: FieldResponse) => {
        const candidates = receipt.data_values.filter(dv => dv.field.id === field.id)
        if (candidates.length > 0) {
            return candidates[0]
        } else {
            return null
        }
    }

    const dataValue = getReceiptDataValue(receipt, field)

    const handleUpdate = (updatedValue: string) => {
        onValueChange({ ...dataValue, value: updatedValue })
    }

    return <div className="p-xs shadow-xs border m-2 rounded">
        {field.type !== "array" && field.type !== "object" && (
            <div className="flex items-center">
                <Badge
                    className="m-xs mx-2   bg-secondary text-secondary-foreground"
                >
                    {field.name}
                </Badge>
                <Input
                    className="text-foreground"
                    key={field.id}
                    placeholder={field.description}
                    value={dataValue.value}
                    onChange={(e) => handleUpdate(e.target.value)}
                />
            </div>
        )}
        {field.children.length > 0 && (
            <>
                <Badge className="m-xs mx-2">{field.name}</Badge>
                <div className={`flex ${field.type === "array" ? "flex-row" : "flex-col"}`}>
                    {field.children.map(f => {
                        return <DataFormField key={f.id} receipt={receipt} onValueChange={onValueChange} field={f} />
                    })}
                </div>
            </>
        )}

    </div>
}

interface DataFormProps {
    receipt: ReceiptResponse,
    fields: FieldResponse[],
    onUpdate: (receiptId: string, dataValueId: string, data: DataValueUpdate) => Promise<DataValueResponse>
}

export default function DataForm({ receipt, fields, onUpdate }: DataFormProps) {
    const [receiptObject, setReceiptObject] = useState<ReceiptResponse>({ ...receipt })
    const [isSaving, setIsSaving] = useState(false)

    const handleUpdateValue = (data_value: DataValueResponse) => {
        setReceiptObject({
            ...receiptObject, data_values: receiptObject.data_values.map(dv => {
                if (dv.id === data_value.id) {
                    return data_value
                } else {
                    return dv
                }
            })
        })
    }

    const handleSave = async () => {
        setIsSaving(true)
        try {
            for (const dv of receiptObject.data_values) {
                await onUpdate(receipt.id, dv.id, { value: dv.value })
            }
        } catch (error) {
            console.log(error)
        } finally {
            setIsSaving(false)
        }
    }

    const topLevelFields = fields.filter((f) => f.parent == null);

    return <div className="flex-1 flex-col h-full w-full p-5">
        <h3 className="text-2xl text-center m-2 font-semibold text-foreground">Extracted Data</h3>
        <Separator className="m-2" orientation="horizontal" />
        <div className="flex flex-col justify-start h-full">
            {topLevelFields.map(field => {
                return <DataFormField key={field.id} receipt={receiptObject} field={field} onValueChange={handleUpdateValue} />
            })}
            <Separator className="m-2" orientation="horizontal" />
            <Button className="w-md m-5" data-umami-event={`save_button@projects_receipt_${receipt.id}`} onClick={handleSave}>
                {isSaving ? "Saving..." : "Save Changes"}
            </Button>
        </div>
    </div>
}