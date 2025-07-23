import { Badge, Button, Divider, Flex, Input, Paper, Title } from "@mantine/core";
import { DataValueResponse, DataValueUpdate, FieldResponse, ReceiptResponse } from "../../../lib/types";
import { useState } from "react";


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

    return <Paper p={"xs"} shadow="xs" withBorder>
        {field.type !== "array" && field.type !== "object" && (
            <Flex align={"center"} direction={field.parent?.type === "array" ? "column" : "row"}>
                <Badge variant="light" m={"xs"}>{field.name}</Badge>
                <Input key={field.id} placeholder={field.description} size='xs' value={dataValue.value} onChange={(e) => handleUpdate(e.target.value)} />
            </Flex>
        )}
        {field.children.length > 0 && (
            <>
                <Badge variant="gradient" m={"xs"}>{field.name}</Badge>
                <Flex direction={field.type === "array" ? "row" : "column"}>
                    {field.children.map(f => {
                        return <DataFormField key={f.id} receipt={receipt} onValueChange={onValueChange} field={f} />
                    })}
                </Flex>
            </>
        )}

    </Paper>
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

    return <Paper h="100%" style={{ flex: 1 }} shadow='xl' p={"md"}>
        <Title order={3}>Extracted Data</Title>
        <Divider mb={"sm"} />
        <Flex direction={"column"} justify="flex-start" h={"100%"}>
            {topLevelFields.map(field => {
                return <DataFormField key={field.id} receipt={receiptObject} field={field} onValueChange={handleUpdateValue} />
            })}
            <Button data-umami-event={`save_button@projects_receipt_${receipt.id}`} onClick={handleSave} loading={isSaving} loaderProps={{ type: 'dots' }}>Save</Button>
        </Flex>
    </Paper>
}