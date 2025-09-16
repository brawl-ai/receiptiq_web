"use client";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { FieldResponse, ReceiptResponse } from "../../../types";
import { IconBracketsContain, IconChevronDown, IconChevronUp, IconDownload, IconFileExport, IconSearch, IconSelector } from "@tabler/icons-react";
import { useState } from "react";
import { useReceiptsContext } from "@/app/stores/receipts_store";
import { useFieldsContext } from "@/app/stores/fields_store";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";




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
            <Button onClick={onSort} variant="ghost" className="w-full hover:bg-muted/50">
                <div className="flex justify-between items-center w-full">
                    <Badge variant="outline" className="text-sm font-bold">
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
                        <CollapsibleContent>
                            {field.children.map(childField => {
                                const val = getReceiptDataValue(receipt, childField)
                                return <div key={childField.id} className="flex gap-2 items-center">
                                    <Badge variant="secondary">{childField.name}</Badge>
                                    <span className="text-foreground">{val ? val.value : ""}</span>
                                </div>
                            })}
                        </CollapsibleContent>
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

export default function DataExport() {
    const receipts = useReceiptsContext((s) => s.receipts);
    const fields = useFieldsContext((s) => s.fields);
    const onExport = useReceiptsContext((s) => s.exportData);

    const [sortedData, setSortedData] = useState(receipts);
    const [sortBy, setSortBy] = useState<keyof ReceiptResponse | string | null>(null);
    const [reverseSortDirection, setReverseSortDirection] = useState(false);
    const [search, setSearch] = useState('');
    const [export_url, setExportURL] = useState(null);
    const [isExporting, setIsExporting] = useState(false);




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

    const handleExport = () => {
        setExportURL(null)
        setIsExporting(true)
        onExport().then(resp =>
            setExportURL(resp.url)
        ).finally(() => {
            setIsExporting(false)
        })
    }

    return (
        <div className="flex flex-col">
            <h1 className="text-2xl font-bold text-muted-foreground m-4">Export Extracted Data</h1>
            <Separator className="mb-4" />

            <div className="flex items-center justify-around m-6">
                <Button
                    disabled={isExporting}
                    onClick={handleExport}
                    className="flex items-center gap-2"
                    data-umami-event="export@projects"
                >
                    <IconFileExport size={16} />
                    {isExporting ? 'Exporting...' : 'Export'}
                </Button>
                {export_url && (
                    <>
                        <Separator orientation="vertical" className="h-6" />
                        <Button
                            asChild
                            className="bg-green-600 hover:bg-green-700 flex items-center gap-2"
                            data-umami-event="download@projects_pdfviewer"
                        >
                            <a href={export_url}>
                                <IconDownload size={16} />
                                Download
                            </a>
                        </Button>
                    </>
                )}
            </div>
            <Separator className="mb-4" />

            <div className="border rounded-md p-4">
                <div className="overflow-x-auto">
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
                                    <Badge variant="outline" className="text-sm font-bold">
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
        </div>
    )
}