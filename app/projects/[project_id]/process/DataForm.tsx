import { DataValueResponse, DataValueUpdate, FieldResponse, ReceiptResponse } from "../../../types";
import { useState } from "react";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

export function DataFormField({ field, dataValue, onValueChange }:
    {
        field: FieldResponse,
        dataValue: DataValueResponse,
        onValueChange: (data_value: DataValueResponse) => void
    }) {

    const handleUpdate = (updatedValue: string) => {
        onValueChange({ ...dataValue, value: updatedValue })
    }

    return <div className="border m-1 rounded flex items-center w-full">
        <Badge className="m-xs mx-2 bg-secondary text-secondary-foreground">
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
        console.log("updating")
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

    const getReceiptDataValue = (receipt: ReceiptResponse, field: FieldResponse) => {
        const candidates = receipt.data_values.filter(dv => dv.field.id === field.id)
        if (candidates.length > 0) {
            return candidates[0]
        } else {
            return null
        }
    }

    const getDataList = (receipt: ReceiptResponse, field: FieldResponse) => {
        const dvs = receipt.data_values.filter(dv => dv.field.parent && dv.field.parent.id === field.id)
        const rows = Object.groupBy(dvs, ({ row }) => row)
        return Object.entries(rows).map(([row, values]) => ({
            row_id: Number(row),
            values,
        }));
    }

    const topLevelFields = fields.filter((f) => f.parent == null);

    return <div className="flex-1 flex-col h-full w-full p-5">
        <h3 className="text-2xl text-center m-2 font-semibold text-foreground">Extracted Data</h3>
        <Separator className="m-2" orientation="horizontal" />
        <div className="flex flex-col justify-start items-end h-full">
            {topLevelFields.map((field) => {
                if (field.type === "array") {
                    const dataList = getDataList(receiptObject, field)
                    return <div key={field.id} className="p-xs shadow-xs border m-1 rounded w-full">
                        <Badge className="m-xs mx-2">{field.name}</Badge>
                        <div className="flex flex-col m-5">
                            {dataList.map((row, index) => <div key={index} className="flex flex-row items-center">
                                <span className="text-xs">{row.row_id}</span>
                                {row.values.map(data => {
                                    return <DataFormField key={data.id} field={data.field} dataValue={data} onValueChange={handleUpdateValue} />
                                })}
                            </div>)}
                        </div>
                    </div>
                } else if (field.type === "object") {
                    return <div key={field.id} className="p-xs shadow-xs border m-1 rounded w-full">
                        <Badge className="m-xs mx-2">{field.name}</Badge>
                        <div className="flex flex-col m-5">
                            {field.children.map(f => {
                                const dataValue = getReceiptDataValue(receiptObject, f)
                                return <DataFormField key={dataValue.id} field={f} dataValue={dataValue} onValueChange={handleUpdateValue} />
                            })}
                        </div>
                    </div>
                } else {
                    const dataValue = getReceiptDataValue(receiptObject, field)
                    return <DataFormField key={dataValue.id} field={field} dataValue={dataValue} onValueChange={handleUpdateValue} />
                }
            })}
            <Separator className="m-2" orientation="horizontal" />
            <Button className="w-md m-2 cursor-pointer" data-umami-event={`save_button@projects_receipt_${receipt.id}`} onClick={handleSave}>
                {isSaving ? "Saving..." : "Save Changes"}
            </Button>
        </div>
    </div>
}