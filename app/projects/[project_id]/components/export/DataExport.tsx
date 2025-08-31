import { Badge, Button, Center, Collapse, Divider, Flex, Group, Paper, ScrollArea, Table, Text, TextInput, Title, UnstyledButton } from "@mantine/core";
import { ExportResponse, FieldResponse, ReceiptResponse } from "../../../../types";
import { IconBracketsContain, IconChevronDown, IconChevronUp, IconDownload, IconFileExport, IconSearch, IconSelector } from "@tabler/icons-react";
import { useState } from "react";
import classes from './DataExport.module.css';
import { useDisclosure } from "@mantine/hooks";




interface ThProps {
    children: React.ReactNode;
    reversed: boolean;
    sorted: boolean;
    onSort: () => void;
}

function Th({ children, reversed, sorted, onSort }: ThProps) {
    const Icon = sorted ? (reversed ? IconChevronUp : IconChevronDown) : IconSelector;
    return (
        <Table.Th className={classes.th}>
            <UnstyledButton onClick={onSort} className={classes.control}>
                <Group justify="space-between">
                    <Badge fw={700} fz="sm" variant="gradient">
                        {children}
                    </Badge>
                    <Center className={classes.icon}>
                        <Icon size={16} stroke={1.5} />
                    </Center>
                </Group>
            </UnstyledButton>
        </Table.Th>
    );
}

interface TrProps {
    receipt: ReceiptResponse,
    fields: FieldResponse[]
}


function Tr({ receipt, fields }: TrProps) {
    const [opened, { toggle }] = useDisclosure(false);

    const getReceiptDataValue = (receipt: ReceiptResponse, field: FieldResponse) => {
        const candidates = receipt.data_values.filter(dv => dv.field.id === field.id)
        if (candidates.length > 0) {
            return candidates[0]
        } else {
            return null
        }
    }
    return <Table.Tr onClick={toggle} style={{ cursor: "pointer" }}>
        <Table.Td>{receipt.file_name}</Table.Td>
        {fields.map((field) => {
            const val = getReceiptDataValue(receipt, field)
            if (field.children.length > 0) {
                return <Table.Td key={field.id} p={"md"}>
                    {!opened && <IconBracketsContain color="#008080" />}
                    <Collapse in={opened}>
                        {field.children.map(childField => {
                            const val = getReceiptDataValue(receipt, childField)
                            return <Flex key={childField.id} gap={"sm"}>
                                <Badge variant="light">{childField.name}</Badge>
                                <Text>{val ? val.value : ""}</Text>
                            </Flex>
                        })}
                    </Collapse>
                </Table.Td>

            } else {
                return <Table.Td key={field.id}>{val ? val.value : ""}</Table.Td>
            }
        })}
    </Table.Tr>
}

interface DataExportProps {
    receipts: ReceiptResponse[];
    fields: FieldResponse[];
    onExport: () => Promise<ExportResponse>
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

export default function DataExport({ receipts, fields, onExport }: DataExportProps) {
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
        <Flex direction={"column"} wrap={"wrap"}>
            <Title m={"md"} c={"gray"}>Export Extracted Data</Title>
            <Divider mb={"md"} variant="dashed" />

            <Flex align={"center"} justify={"space-around"} m={"lg"}>
                <Button loading={isExporting} onClick={handleExport} leftSection={<IconFileExport />} data-umami-event="export@projects">Export</Button>
                {export_url && <>
                    <Divider orientation="vertical" variant="dotted" />
                    <Button component="a" bg={"green"} href={export_url} leftSection={<IconDownload />} data-umami-event="download@projects_pdfviewer">Download</Button>
                </>}
            </Flex>
            <Divider mb={"md"} variant="dashed" />

            <Paper withBorder p={"md"} radius={"md"}>
                <ScrollArea>
                    <TextInput
                        placeholder="Search by any field"
                        mb="md"
                        leftSection={<IconSearch size={16} stroke={1.5} />}
                        value={search}
                        onChange={handleSearchChange}
                    />
                    <Table
                        tabularNums
                        horizontalSpacing="md"
                        verticalSpacing="xs"
                        miw={700}
                        mah={500}
                        layout="fixed"
                        withColumnBorders
                        withTableBorder
                        highlightOnHover
                    >
                        <Table.Tbody>
                            <Table.Tr bg={"gray"}>
                                <Table.Th>
                                    <Badge fw={700} fz="sm" variant="gradient">
                                        Receipt
                                    </Badge>
                                </Table.Th>
                                {topLevelFields.map(field =>
                                    <Th
                                        reversed={reverseSortDirection}
                                        onSort={() => setSorting(field.name)}
                                        sorted={sortBy === field.name}
                                        key={field.id}
                                    >
                                        {field.name.replace("_", " ")}
                                    </Th>)}
                            </Table.Tr>
                        </Table.Tbody>
                        <Table.Tbody>
                            {rows.length > 0 ? (
                                rows
                            ) : (
                                <Table.Tr>
                                    <Table.Td colSpan={Object.keys(receipts[0]).length}>
                                        <Text fw={500} ta="center">
                                            Nothing found
                                        </Text>
                                    </Table.Td>
                                </Table.Tr>
                            )}
                        </Table.Tbody>

                    </Table>
                </ScrollArea>
            </Paper>
        </Flex>
    )
}