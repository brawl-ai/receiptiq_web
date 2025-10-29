"use client";
import { useReceiptsContext } from "@/app/stores/receipts_store";
import { useFieldsContext } from "@/app/stores/fields_store";
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart";
import { ColumnDef } from "@tanstack/react-table";
import { FieldResponse, ReceiptResponse } from "@/app/types";
import { useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { IconEye, IconSettingsFilled } from "@tabler/icons-react";
import { DataTable } from "@/components/ui/data-table";
import ReceiptAndDataDrawer from "./ReceiptAndDataViewer";
import { Label, Pie, PieChart } from "recharts";
import { Separator } from "@/components/ui/separator";

export default function ProcessingPage() {
    const receipts = useReceiptsContext((s) => s.receipts);
    const fields = useFieldsContext((s) => s.fields);
    const [isProcessing, setIsProcessing] = useState(false);
    const [selectedReceipt, setSelectedReceipt] = useState<ReceiptResponse | null>(null);
    const [opened, setOpened] = useState(false);
    const [processingReceipts, setProcessingReceipts] = useState<ReceiptResponse[]>([...receipts])
    const updateDataValue = useReceiptsContext((s) => s.updateDataValue);
    const processReceipt = useReceiptsContext((s) => s.processReceipt);

    const handleProcessReceipt = async (receiptId: string) => {
        try {
            const receipt = receipts.filter(rec => rec.id === receiptId)[0]
            receipt.status = "processing"
            setProcessingReceipts(prevReceipts =>
                prevReceipts.map(rec =>
                    rec.id === receipt.id ? { ...rec, status: "processing" } : rec
                )
            );
            const processedReceipt = await processReceipt(receiptId);
            setProcessingReceipts(prevReceipts =>
                prevReceipts.map(rec =>
                    rec.id === receipt.id ? processedReceipt : rec
                )
            );
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
                await handleProcessReceipt(receipt.id)
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

    const chartConfig = {
        completed: { label: "Success", fill: "#008080", },
        failed: { label: "Failed", fill: "#ff0000" },
        pending: { label: "Pending", fill: "#888888" },
        processing: { label: "Processing", fill: "#0000ff" },
    };

    const chartData = Object.values(
        receipts.reduce((acc, { status }) => {
            if (!acc[status]) acc[status] = { ...chartConfig[status], value: 0 };
            acc[status].value += 1;
            return acc;
        }, {})
    );

    const columns: ColumnDef<ReceiptResponse>[] = [
        {
            accessorKey: "file_name",
            header: () => <div className="font-bold text-foreground">Filename</div>,
        },
        ...topLevelFields.map(field => ({
            accessorKey: `field_${field.id}`,
            header: () => <div className="font-bold text-foreground">{field.name}</div>,
            cell: ({ row }) => {
                const receipt = row.original;
                const value = getReceiptDataValue(receipt, field);
                if (field.type === "array") {
                    return <Badge className="bg-blue-100 text-blue-800"><code>array</code></Badge>;
                }
                if (field.type === "object") {
                    return <Badge className="bg-blue-100 text-blue-800"><code>object</code></Badge>;
                }
                if (value) {
                    return <div className="text-foreground">{value}</div>;
                } else {
                    return <Badge className="bg-gray-100 text-gray-800">-</Badge>;
                }
            }
        })),
        {
            accessorKey: "status",
            header: () => <div className="font-bold text-foreground">Status</div>,
            cell: ({ row }) => {
                const status = row.original.status;
                return <Badge className={`bg-${chartConfig[status].fill}-100 text-${chartConfig[status].fill}-800`}>{chartConfig[status].label}</Badge>;
            }
        },
        {
            accessorKey: "actions",
            header: () => <div className="font-bold text-foreground">Actions</div>,
            cell: ({ row }) => {
                const receipt = row.original;
                return (
                    <div className="flex gap-4">
                        <Button
                            data-umami-event={`process@projects_receipt_${receipt.id}`}
                            disabled={receipt.status === "processing"}
                            size="sm"
                            onClick={() => handleProcessReceipt(receipt.id)}
                            className="px-3 py-1 flex items-center gap-1 cursor-pointer"
                        >
                            {receipt.status !== "processing"
                                ?
                                <>
                                    <IconSettingsFilled size={15} className="mr-1" />
                                    Process
                                </>
                                :
                                <>
                                    <IconSettingsFilled size={15} className="mr-1 animate-spin" />
                                    Processing
                                </>
                            }
                        </Button>
                        <Button
                            type="button"
                            data-umami-event="view_data@projects_processing"
                            className="rounded-full p-2 cursor-pointer"
                            disabled={receipt.status === "processing"}
                            onClick={() => {
                                setSelectedReceipt(receipt)
                                setOpened(true)
                            }}
                            aria-label="View Data"
                        >
                            <IconEye />
                        </Button>
                    </div>
                )
            }
        },
    ]
    return (
        <div className="p-5 border-1 border-dashed rounded-md m-5">
            <h1 className="text-xl m-2 text-foreground">Process Receipts</h1>
            <Separator />
            <div className="flex flex-row justify-around my-4">
                <ChartContainer
                    config={chartConfig}
                    className="aspect-square min-h-[250px] min-w-[250px]"
                >
                    <PieChart>
                        <ChartTooltip
                            cursor={false}
                            content={<ChartTooltipContent hidden />}
                        />
                        <Pie
                            data={chartData}
                            dataKey="value"
                            nameKey="label"
                            valueKey={"value"}
                            innerRadius={60}
                            strokeWidth={5}
                        >
                            <Label
                                content={({ viewBox }) => {
                                    if (viewBox && "cx" in viewBox && "cy" in viewBox) {
                                        return (
                                            <text
                                                x={viewBox.cx}
                                                y={viewBox.cy}
                                                textAnchor="middle"
                                                dominantBaseline="middle"
                                            >
                                                <tspan
                                                    x={viewBox.cx}
                                                    y={viewBox.cy}
                                                    className="fill-foreground text-3xl font-bold"
                                                >
                                                    {receipts.length.toLocaleString()}
                                                </tspan>
                                                <tspan
                                                    x={viewBox.cx}
                                                    y={(viewBox.cy || 0) + 24}
                                                    className="fill-muted-foreground"
                                                >
                                                    Receipts
                                                </tspan>
                                            </text>
                                        )
                                    }
                                }}
                            />
                        </Pie>
                    </PieChart>
                </ChartContainer>
                <div className="border-l border-dashed mx-4 h-24 self-center" />
                <div className="flex items-center justify-center">
                    <Button
                        onClick={handleProcessingAll}
                        disabled={isProcessing}
                        className="bg-green-600 hover:bg-green-700 text-white cursor-pointer"
                        data-umami-event="process_all_button@projects">
                        <IconSettingsFilled className="mr-2" /> Process All
                    </Button>
                </div>
            </div>
            <div className="border-t border-dotted my-4" />
            {processingReceipts.length > 0 ? (
                <div className="overflow-x-auto mt-4 border rounded-md">
                    <DataTable columns={columns} data={processingReceipts} />
                </div>
            ) : (
                <div className="p-8 text-center border rounded-md mt-4">
                    <span className="text-gray-400">No receipts uploaded yet. Upload some receipts to get started.</span>
                </div>
            )}
            <ReceiptAndDataDrawer
                onUpdate={updateDataValue}
                fields={fields}
                opened={opened}
                onClose={() => setOpened(false)}
                receipt={selectedReceipt}
            />
        </div>
    )
}