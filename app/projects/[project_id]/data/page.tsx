"use client";

import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { FieldResponse, FieldType, ReceiptResponse } from "../../../types";
import { IconBracketsContain, IconChevronDown, IconChevronUp, IconSelector } from "@tabler/icons-react";
import { useState } from "react";
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart";
import { Label, Pie, PieChart } from "recharts";
import { useReceiptsContext } from "@/app/stores/receipts_store";
import { useFieldsContext } from "@/app/stores/fields_store";
import { Separator } from "@/components/ui/separator";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Collapsible } from "@/components/ui/collapsible";


interface ThProps {
    children: React.ReactNode;
    reversed: boolean;
    sorted: boolean;
    onSort: () => void;
}


function Th({ children, reversed, sorted, onSort }: ThProps) {
    const Icon = sorted ? (reversed ? IconChevronUp : IconChevronDown) : IconSelector;
    return (
        <TableHead className="text-center">
            <Button onClick={onSort} className="bg-transparent hover:bg-muted/50 w-full">
                <div className="flex justify-between items-center w-full">
                    <Badge className="text-sm font-bold">
                        {children}
                    </Badge>
                    <div className="text-center text-foreground">
                        <Icon size={16} stroke={1.5} />
                    </div>
                </div>
            </Button>
        </TableHead>
    );
}


interface TrProps {
    receipt: ReceiptResponse,
    fields: FieldResponse[]
}


function Tr({ receipt, fields }: TrProps) {
    const [opened, setOpened] = useState(false);

    const getReceiptDataValue = (receipt: ReceiptResponse, field: FieldResponse) => {
        const candidates = receipt.data_values.filter(dv => dv.field.id === field.id)
        if (candidates.length > 0) {
            return candidates[0]
        } else {
            return null
        }
    }
    return <TableRow onClick={() => setOpened(!opened)} className="cursor-pointer">
        <TableCell>{receipt.file_name}</TableCell>
        {fields.map((field) => {
            const val = getReceiptDataValue(receipt, field)
            if (field.children.length > 0) {
                return <TableCell key={field.id} className="p-4">
                    {!opened && <IconBracketsContain color="#008080" />}
                    <Collapsible open={opened}>
                        {field.children.map(childField => {
                            const val = getReceiptDataValue(receipt, childField)
                            return <div className="flex gap-2" key={childField.id}>
                                <Badge>{childField.name}</Badge>
                                <div className="text-foreground">{val ? val.value : ""}</div>
                            </div>
                        })}
                    </Collapsible>
                </TableCell>

            } else {
                return <TableCell key={field.id}>{val ? val.value : ""}</TableCell>
            }
        })}
    </TableRow>
}

function filterData(data: ReceiptResponse[], search: string) {
    const query = search.toLowerCase().trim();
    return data.filter((item) =>
        item.file_name.includes(search)
        ||
        item.data_values.filter(dv => dv.value.includes(query)).length > 0
    );
}


function sortData(data: ReceiptResponse[], payload: {
    sortBy: keyof ReceiptResponse | string | null;
    reversed: boolean;
    search: string
}) {
    const { sortBy } = payload;

    if (!sortBy) {
        return filterData(data, payload.search);
    }

    return filterData(
        [...data].sort((a, b) => {
            let aValue: string;
            let bValue: string;

            if (typeof sortBy === 'string' && sortBy.startsWith('data_values.')) {
                const fieldName = sortBy.replace('data_values.', '');
                const aDataValue = a.data_values.find(dv => dv.field.name === fieldName);
                const bDataValue = b.data_values.find(dv => dv.field.name === fieldName);

                aValue = aDataValue?.value || '';
                bValue = bDataValue?.value || '';
            } else {
                aValue = String(a[sortBy as keyof ReceiptResponse] || '');
                bValue = String(b[sortBy as keyof ReceiptResponse] || '');
            }

            if (payload.reversed) {
                return bValue.localeCompare(aValue);
            }

            return aValue.localeCompare(bValue);
        }),
        payload.search
    );
}

export default function DataTab() {
    const receipts = useReceiptsContext((s) => s.receipts);
    const fields = useFieldsContext((s) => s.fields);
    const [sortedData, setSortedData] = useState(receipts);
    const [sortBy, setSortBy] = useState<keyof ReceiptResponse | string | null>(null);
    const [reverseSortDirection, setReverseSortDirection] = useState(false);
    const [search, setSearch] = useState('');


    const topLevelFields = fields.filter((f) => f.parent == null);

    const setSorting = (field: string) => {
        const reversed = field === sortBy ? !reverseSortDirection : false;
        setReverseSortDirection(reversed);
        setSortBy(field);
        setSortedData(sortData(receipts, { sortBy: field, reversed, search }));
    };

    const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const { value } = event.currentTarget;
        setSearch(value);
        setSortedData(sortData(receipts, { sortBy, reversed: reverseSortDirection, search: value }));
    };

    const rows = sortedData.filter(r => r.data_values.length > 0).map((row) => (
        <Tr key={row.id} receipt={row} fields={topLevelFields} />
    ));

    function getDataValueStats(receipts: ReceiptResponse[]) {
        const fieldStats: Record<string, Record<string, number>> = {};

        // Function to generate random pastel color
        const generatePastelColor = () => {
            const hue = Math.floor(Math.random() * 360);
            const saturation = Math.floor(Math.random() * 30) + 25; // 25-55%
            const lightness = Math.floor(Math.random() * 20) + 70;  // 70-90%
            return `hsl(${hue}, ${saturation}%, ${lightness}%)`;
        };

        receipts.forEach(receipt => {
            receipt.data_values.forEach(dataValue => {
                const fieldName = dataValue.field.name;
                const value = dataValue.value.trim();

                // Skip empty values
                if (value) {
                    if (!fieldStats[fieldName]) {
                        fieldStats[fieldName] = {};
                    }
                    fieldStats[fieldName][value] = (fieldStats[fieldName][value] || 0) + 1;
                }
            });
        });

        // Convert to array format suitable for pie charts, grouped by field name
        return Object.entries(fieldStats).map(([fieldName, valueCounts]) => {
            // Find the field type by looking up the first occurrence of this field name
            let fieldType: FieldType = 'string';
            outer: for (const receipt of receipts) {
                for (const dataValue of receipt.data_values) {
                    if (dataValue.field.name === fieldName) {
                        fieldType = dataValue.field.type;
                        break outer;
                    }
                }
            }

            return {
                fieldName,
                fieldType,
                data: Object.entries(valueCounts)
                    .map(([value, count]) => ({
                        name: value,
                        value: count,
                        color: generatePastelColor()
                    }))
                    .sort((a, b) => b.value - a.value) // Sort by count descending
            };
        });
    }

    const stats = getDataValueStats(receipts)

    return (
        <div className="flex flex-col flex-wrap p-5">
            <div className="text-foreground text-2xl m-5">Explore Extracted Data</div>
            <Separator className="m-2" orientation="horizontal" decorative />
            <div className="flex">
                {stats.slice(0, 5).filter(s => s.fieldType !== "number").map((stat, id) => {
                    const chartConfig = stat.data.reduce((config, item, index) => {
                        config[item.name] = {
                            label: item.name,
                            color: item.color,
                        };
                        return config;
                    }, {} as Record<string, { label: string; color: string }>);

                    return <div className="flex" key={id}>
                        <div className="flex items-center flex-col">
                            <div className="text-foreground mb-2">{stat.fieldName}</div>
                            <ChartContainer
                                config={chartConfig}
                                className="aspect-square min-h-[200px] min-w-[200px]"
                            >
                                <PieChart>
                                    <ChartTooltip
                                        cursor={false}
                                        content={<ChartTooltipContent />}
                                    />
                                    <Pie
                                        data={stat.data.filter(d => d.value > 0)}
                                        dataKey="value"
                                        nameKey="name"
                                        innerRadius={40}
                                        strokeWidth={2}
                                    >
                                        <Label
                                            content={({ viewBox }) => {
                                                if (viewBox && "cx" in viewBox && "cy" in viewBox) {
                                                    const total = stat.data.reduce((sum, item) => sum + item.value, 0);
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
                                                                className="fill-foreground text-xl font-bold"
                                                            >
                                                                {total.toLocaleString()}
                                                            </tspan>
                                                            <tspan
                                                                x={viewBox.cx}
                                                                y={(viewBox.cy || 0) + 20}
                                                                className="fill-muted-foreground text-sm"
                                                            >
                                                                Total
                                                            </tspan>
                                                        </text>
                                                    )
                                                }
                                            }}
                                        />
                                    </Pie>
                                </PieChart>
                            </ChartContainer>
                        </div>
                        <Separator orientation="vertical" decorative />
                    </div>
                })}
            </div>
            <Separator className="m-2" orientation="horizontal" decorative />

            <div className="p-5 border rounded-md text-foreground">
                <Input
                    placeholder="Search by any field"
                    className="mb-4 max-w-sm"
                    value={search}
                    onChange={handleSearchChange}
                />
                <Table className="border rounded-md">
                    <TableHeader>
                        <TableRow className="bg-gray-100 dark:bg-gray-800">
                            <TableHead>
                                <Badge className="text-sm font-bold">
                                    Receipt
                                </Badge>
                            </TableHead>
                            {topLevelFields.map(field =>
                                <Th
                                    reversed={reverseSortDirection}
                                    onSort={() => setSorting(field.name)}
                                    sorted={sortBy === field.name}
                                    key={field.id}
                                >
                                    {field.name.replace("_", " ")}
                                </Th>)}
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {rows.length > 0 ? (
                            rows
                        ) : (
                            <TableRow>
                                <TableCell colSpan={topLevelFields.length + 1}>
                                    <div className="text-foreground text-center font-bold p-5">
                                        Nothing found
                                    </div>
                                </TableCell>
                            </TableRow>
                        )}
                    </TableBody>
                </Table>
            </div>
        </div>
    )
}