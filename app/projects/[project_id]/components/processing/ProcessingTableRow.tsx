import { ActionIcon, Badge, Button, Flex, Table } from "@mantine/core"
import { IconBraces, IconBrackets, IconEye, IconLoader3, IconSettingsFilled } from "@tabler/icons-react"
import { FieldResponse, ReceiptResponse } from "../../../../lib/types"
import { useState } from "react"

interface ProcessingTableRowProps {
    topLevelFields: FieldResponse[],
    receipt: ReceiptResponse
    getReceiptDataValue: (receipt: ReceiptResponse, field: FieldResponse) => string
    handleProcessReceipt: (receipt_id: string) => Promise<void>
    setSelectedReceipt: (receipt: ReceiptResponse) => void
    openReceipt: () => void
}


export default function ProcessingTableRow(
    { topLevelFields, receipt, getReceiptDataValue, handleProcessReceipt, setSelectedReceipt, openReceipt }: ProcessingTableRowProps
) {
    const [isProcessing, setIsProcessing] = useState(false)

    const handleStartProcessing = async () => {
        try {
            setIsProcessing(true)
            await handleProcessReceipt(receipt.id)
        } catch (error) {
            console.log(error)
        } finally {
            setIsProcessing(false)
        }
    }

    console.log(isProcessing)

    return (
        <Table.Tr key={receipt.id} pos={"relative"}>
            <Table.Td>{receipt.file_name}</Table.Td>
            {
                topLevelFields.map(field => {
                    if (field.type === "array") {
                        return <Table.Td key={field.id}><IconBrackets /></Table.Td>
                    }
                    if (field.type === "object") {
                        return <Table.Td key={field.id}><IconBraces /></Table.Td>
                    }
                    const value = getReceiptDataValue(receipt, field)
                    if (value) {
                        return <Table.Td key={field.id}>{value}</Table.Td>
                    } else {
                        return <Table.Td key={field.id}><IconLoader3 /></Table.Td>
                    }

                })
            }
            <Table.Td>
                <Badge
                    color={
                        isProcessing
                            ? "blue" :
                            receipt.status === "completed"
                                ? "green"
                                : receipt.status === "failed"
                                    ? "red"
                                    : receipt.status === "processing"
                                        ? "blue"
                                        : "gray"
                    }
                >
                    {isProcessing ? "processing" : receipt.status}
                </Badge>
            </Table.Td>
            <Table.Td>
                <Flex gap={"md"}>
                    <Button
                        loading={isProcessing}
                        size="compact-sm"
                        onClick={handleStartProcessing}
                        loaderProps={{ type: "dots" }}
                        leftSection={<IconSettingsFilled size={15} />}
                    >
                        Process
                    </Button>
                    <ActionIcon size="md" variant="subtle" onClick={() => {
                        setSelectedReceipt(receipt)
                        openReceipt()
                    }}>
                        <IconEye />
                    </ActionIcon>
                </Flex>
            </Table.Td>
        </Table.Tr >
    )
}