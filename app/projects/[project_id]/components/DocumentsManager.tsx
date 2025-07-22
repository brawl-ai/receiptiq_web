import { Badge, Box, Button, Divider, Flex, Group, Paper, Table, Text, ActionIcon } from "@mantine/core";
import { ReceiptResponse } from "../../../lib/types";
import { useState } from "react";
import { notifications } from "@mantine/notifications";
import { Dropzone, DropzoneProps } from "@mantine/dropzone";
import { IconEye, IconPhoto, IconTrash, IconUpload, IconX } from "@tabler/icons-react";
import { useDisclosure } from "@mantine/hooks";
import ImageViewerDrawer from "./ImageViewerDrawer";

interface ReceiptsManagerProps {
    receipts: ReceiptResponse[];
    loading: boolean;
    error: string | null | undefined;
    onCreateReceipt: (file: File) => Promise<ReceiptResponse>;
    onDeleteReceipt: (receiptId: string) => Promise<void>;
}

export default function DocumentsManager({ receipts, loading, error, onCreateReceipt, onDeleteReceipt }: ReceiptsManagerProps) {
    const [isUploading, setIsUploading] = useState(false);
    const [acceptedFiles, setAcceptedFiles] = useState<File[]>([]);
    const [rejectedFiles, setRejectedFiles] = useState<File[]>([]);
    const [selectedReceipt, setSelectedReceipt] = useState<ReceiptResponse | null>(null);
    const [opened, { open, close }] = useDisclosure(false);

    const handleFileUpload = async (files: File[]) => {
        if (!files?.length) return;
        setIsUploading(true);
        try {
            for (const file of files) {
                await onCreateReceipt(file);
            }
            notifications.show({
                position: "top-center",
                title: "Files uploaded",
                message: "Your files have been uploaded successfully",
                color: "green",
            });
            setAcceptedFiles([])
        } catch (err) {
            console.log(err)
        } finally {
            setIsUploading(false);
        }
    };

    const dropzoneProps: Partial<DropzoneProps> = {
        maxSize: 5 * 1024 ** 2,
        multiple: true
    }

    return (
        <Paper withBorder p={"sm"}>
            <Text size={"xl"} variant="gradient" fs={"revert"}>DOCUMENTS</Text>
            <Divider variant="dotted" mt={"md"} />
            <Flex direction={"column"} align={"center"} p={"md"}>
                {acceptedFiles.length > 0 && (
                    <Flex align={"center"}>
                        <Box w={300}>
                            <Text lineClamp={3} c={"green"} size={"xs"}>
                                {acceptedFiles.map(f => f.name)}
                            </Text>
                        </Box>
                        <Button
                            loading={isUploading}
                            bg={"green"}
                            size="compact-sm"
                            m={"md"}
                            variant="gradient"
                            onClick={() => handleFileUpload(acceptedFiles)}
                            leftSection={<IconUpload size={14} />}
                        >
                            Upload
                        </Button>
                    </Flex>
                )}
                {rejectedFiles.length > 0 && (
                    <Flex align={"center"}>
                        <Box w={300}>
                            <Text lineClamp={3} c={"red"} size={"xs"}>
                                {rejectedFiles.map(f => f.name)}
                            </Text>
                        </Box>
                        <Text c={"red"} size={"xs"}>
                            ({rejectedFiles.length})
                        </Text>
                        <Button
                            bg={"red"}
                            size="compact-sm"
                            m={"md"}
                            variant="gradient"
                            onClick={() => setRejectedFiles([])}
                            leftSection={<IconX size={14} />}
                        >
                            Remove
                        </Button>
                    </Flex>
                )}
            </Flex>
            {(acceptedFiles.length > 0 || rejectedFiles.length > 0) && (
                <Flex align={"center"} direction={"column"}>
                    {error && (<Text style={{ textAlign: "center" }} c={"red"} size="xs">{error}</Text>)}
                    <Button
                        loading={isUploading}
                        bg={"orange"}
                        size="compact-sm"
                        m={"md"}
                        variant="gradient"
                        onClick={() => {
                            setAcceptedFiles([])
                            setRejectedFiles([])
                        }}
                        leftSection={<IconX size={14} />}
                    >
                        Clear
                    </Button>
                </Flex>
            )}
            {acceptedFiles.length === 0 && rejectedFiles.length === 0 && (
                <Dropzone
                    onDrop={(files) => {
                        console.log('accepted files', files)
                        setAcceptedFiles(files)
                    }}
                    onReject={(files) => {
                        console.log('rejected files', files)
                        setRejectedFiles(files.map(f => f.file))
                    }}
                    accept={["image/jpeg", "image/png", "application/pdf"]}
                    {...dropzoneProps}
                >
                    <Group justify="center" gap="xl" mih={220} style={{ pointerEvents: 'none' }}>
                        <Dropzone.Accept>
                            <IconUpload size={52} color="var(--mantine-color-blue-6)" stroke={1.5} />
                        </Dropzone.Accept>
                        <Dropzone.Reject>
                            <IconX size={52} color="var(--mantine-color-red-6)" stroke={1.5} />
                        </Dropzone.Reject>
                        <Dropzone.Idle>
                            <IconPhoto size={52} color="var(--mantine-color-dimmed)" stroke={1.5} />
                        </Dropzone.Idle>

                        <div>
                            <Text size="xl" inline>
                                Drag images here or click to select files
                            </Text>
                            <Text size="sm" c="dimmed" inline mt={7}>
                                Attach as many files as you like, each file should not exceed 5mb
                            </Text>
                        </div>

                    </Group>
                </Dropzone>
            )}
            <Divider variant="dotted" mt={"md"} />
            {receipts.length > 0 ? (
                <Paper style={{ overflowX: "auto" }} mt={"md"} withBorder>
                    <Table striped highlightOnHover withColumnBorders>
                        <Table.Thead>
                            <Table.Tr>
                                <Table.Th>Filename</Table.Th>
                                <Table.Th>Status</Table.Th>
                                <Table.Th>Uploaded At</Table.Th>
                                <Table.Th>Actions</Table.Th>
                            </Table.Tr>
                        </Table.Thead>
                        <Table.Tbody>
                            {receipts.map((receipt) => (
                                <Table.Tr key={receipt.id}>
                                    <Table.Td>{receipt.file_name}</Table.Td>
                                    <Table.Td>
                                        <Badge
                                            color={
                                                receipt.status === "completed"
                                                    ? "green"
                                                    : receipt.status === "failed"
                                                        ? "red"
                                                        : receipt.status === "processing"
                                                            ? "blue"
                                                            : "gray"
                                            }
                                        >
                                            {receipt.status}
                                        </Badge>
                                    </Table.Td>
                                    <Table.Td>
                                        {new Date(receipt.created_at).toLocaleString()}
                                    </Table.Td>
                                    <Table.Td>
                                        <ActionIcon size="md" variant="subtle" onClick={() => {
                                            setSelectedReceipt(receipt)
                                            open()
                                        }}>
                                            <IconEye />
                                        </ActionIcon>
                                        <ActionIcon size="md" c={"red"} variant="subtle" onClick={() => onDeleteReceipt(receipt.id)} loading={loading}>
                                            <IconTrash />
                                        </ActionIcon>
                                    </Table.Td>
                                </Table.Tr>
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
            <ImageViewerDrawer opened={opened} onClose={close} receipt={selectedReceipt} />
        </Paper>
    )
}