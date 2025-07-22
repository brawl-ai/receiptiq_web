import { Badge, Button, Divider, Flex, Paper, Table, Text } from "@mantine/core";
import { DataValueResponse, DataValueUpdate, FieldResponse, ReceiptResponse } from "../../../lib/types";
import { useState } from "react";
import { IconSettingsFilled } from "@tabler/icons-react";
import { useDisclosure } from "@mantine/hooks";
import { DonutChart, DonutChartCell } from "@mantine/charts";
import ImageViewerDataHighlighted from "./ImageViewerDataHighlighted";
import ProcessingTableRow from "./processing/ProcessingTableRow";

interface ProcessingManagerProps {
    receipts: ReceiptResponse[];
    fields: FieldResponse[];
    error: string | null | undefined;
    onProcessReceipt: (receiptId: string) => Promise<ReceiptResponse>;
    onUpdateDataValue: (receiptId: string, dataValueId: string, data: DataValueUpdate) => Promise<DataValueResponse>
}

export default function ProcessingManager({ receipts, fields, onProcessReceipt, onUpdateDataValue }: ProcessingManagerProps) {
    const [isProcessing, setIsProcessing] = useState(false);
    const [selectedReceipt, setSelectedReceipt] = useState<ReceiptResponse | null>(null);
    const [opened, { open, close }] = useDisclosure(false);

    const [processingReceipts, setProcessingReceipts] = useState<ReceiptResponse[]>([...receipts])

    const handleProcessReceipt = async (receiptId: string) => {
        setIsProcessing(true);
        try {
            await onProcessReceipt(receiptId);
        } catch (err) {
            console.log(err)
        } finally {
            setIsProcessing(false);
        }
    };

    const handleProcessingAll = async () => {
        setIsProcessing(true);
        try {
            for (const receipt of receipts) {
                setProcessingReceipts(prevReceipts =>
                    prevReceipts.map(rec =>
                        rec.id === receipt.id ? { ...rec, status: "processing" } : rec
                    )
                );
                await onProcessReceipt(receipt.id);
            }
        } catch (err) {
            console.log(err)
        } finally {
            setIsProcessing(false);
        }
    };


    const topLevelFields = fields.filter((f) => f.parent == null);

    const getReceiptDataValue = (receipt: ReceiptResponse, field: FieldResponse) => {
        const candidates = receipt.data_values.filter(dv => dv.field.id === field.id)
        if (candidates.length > 0) {
            return candidates[0].value
        } else {
            return null
        }
    }

    const statusMap = {
        completed: { name: "Success", color: "green" },
        failed: { name: "Failed", color: "red" },
        pending: { name: "Pending", color: "grey" },
        processing: { name: "Processing", color: "blue" },
    };

    const data: DonutChartCell[] = Object.values(
        processingReceipts.reduce((acc, { status }) => {
            if (!acc[status]) acc[status] = { ...statusMap[status], value: 0 };
            acc[status].value += 1;
            return acc;
        }, {})
    );



    return (
        <Paper withBorder p={"sm"}>
            <Text size={"xl"} variant="gradient" fs={"revert"}>Process Documents</Text>
            <Divider variant="dotted" mt={"md"} />
            <Flex m={"md"} direction={"row"} justify={"space-around"}>
                <DonutChart withTooltip labelsType="percent" withLabels data={data} chartLabel={"Processing Result"} />
                <Divider variant="dashed" orientation="vertical" />
                <Flex align={"center"} justify={"center"}>
                    <Button onClick={handleProcessingAll} loading={isProcessing} bg={"green"} leftSection={<IconSettingsFilled />} data-umami-event="process_all_button@projects">Process All</Button>
                </Flex>
            </Flex>
            <Divider variant="dotted" mt={"md"} />
            {processingReceipts.length > 0 ? (
                <Paper style={{ overflowX: "auto" }} mt={"md"} withBorder>
                    <Table striped highlightOnHover withColumnBorders>
                        <Table.Thead>
                            <Table.Tr>
                                <Table.Th>Filename</Table.Th>
                                {
                                    topLevelFields.map(field => {
                                        return <Table.Th key={field.id}>
                                            <Badge variant="light" color="blue">
                                                <code>{field.name}</code>
                                            </Badge>
                                        </Table.Th>
                                    })
                                }
                                <Table.Th>Status</Table.Th>
                                <Table.Th>Actions</Table.Th>
                            </Table.Tr>
                        </Table.Thead>
                        <Table.Tbody>
                            {processingReceipts.map((receipt) => (
                                <ProcessingTableRow
                                    key={receipt.id}
                                    topLevelFields={topLevelFields}
                                    receipt={receipt}
                                    getReceiptDataValue={getReceiptDataValue}
                                    handleProcessReceipt={handleProcessReceipt}
                                    setSelectedReceipt={setSelectedReceipt}
                                    openReceipt={open}
                                />
                            ))}
                        </Table.Tbody>
                    </Table>
                </Paper>
            ) : (
                <Paper p="xl" ta="center" withBorder mt={"md"}>
                    <Text c="dimmed">
                        No receipts uploaded yet. Upload some receipts to get started.
                    </Text>
                </Paper>
            )}
            <ImageViewerDataHighlighted
                onUpdate={onUpdateDataValue}
                fields={fields}
                opened={opened}
                onClose={close}
                receipt={selectedReceipt}
            />
        </Paper>
    )
}