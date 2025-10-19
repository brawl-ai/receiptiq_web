"use client";
import { useReceiptsContext } from "@/app/stores/receipts_store";
import { useState } from "react";
import { IconEye, IconPhoto, IconTrash, IconUpload, IconX } from "@tabler/icons-react";
import ReceiptViewerDrawer from "./ReceiptViewerDrawer";
import { Separator } from "@/components/ui/separator";
import { DataTable } from "@/components/ui/data-table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ReceiptIQFileDropzone } from "./ReceiptIQFileDropzone";
import { toast } from "sonner";


export default function DocumentsPage() {
    const receipts = useReceiptsContext((s) => s.receipts);
    const createReceipt = useReceiptsContext((s) => s.createReceipt);
    const deleteReceipt = useReceiptsContext((s) => s.deleteReceipt);
    const loading = useReceiptsContext((s) => s.loading);
    const error = useReceiptsContext((s) => s.error);

    const [isUploading, setIsUploading] = useState(false);
    const [acceptedFiles, setAcceptedFiles] = useState<File[]>([]);
    const [rejectedFiles, setRejectedFiles] = useState<File[]>([]);
    const [selectedReceipt, setSelectedReceipt] = useState(null);
    const [opened, setOpened] = useState(false);

    const handleFileUpload = async (files: File[]) => {
        if (!files?.length) return;
        setIsUploading(true);
        try {
            for (const file of files) {
                await createReceipt(file);
            }
            toast.success("Files uploaded successfully");
            setAcceptedFiles([]);
        } catch (err) {
            console.log(err);
        } finally {
            setIsUploading(false);
        }
    };

    const columns = [
        {
            accessorKey: "file_name",
            header: () => <div className="font-bold text-foreground">Filename</div>,
            cell: ({ row }) => <span>{row.original.file_name}</span>,
        },
        {
            accessorKey: "status",
            header: () => <div className="font-bold text-foreground">Status</div>,
            cell: ({ row }) => (
                <Badge
                    variant={
                        row.original.status === "completed"
                            ? "secondary"
                            : row.original.status === "failed"
                                ? "destructive"
                                : row.original.status === "processing"
                                    ? "outline"
                                    : "default"
                    }
                    className="capitalize"
                >
                    {row.original.status}
                </Badge>
            ),
        },
        {
            accessorKey: "created_at",
            header: () => <div className="font-bold text-foreground">Uploaded At</div>,
            cell: ({ row }) => (
                <span className="text-muted-foreground">
                    {new Date(row.original.created_at).toLocaleString()}
                </span>
            ),
        },
        {
            id: "actions",
            header: () => <div className="font-bold text-foreground">Actions</div>,
            cell: ({ row }) => (
                <div className="flex gap-2">
                    <Button
                        data-umami-event="view_receipt@projects_documentstab"
                        variant="ghost"
                        size="icon"
                        onClick={() => {
                            setSelectedReceipt(row.original)
                            setOpened(true)
                        }}
                        className="mr-2 cursor-pointer"
                    >
                        <IconEye />
                    </Button>
                    <Button
                        data-umami-event="delete_receipt@projects_documentstab"
                        variant="ghost"
                        size="icon"
                        onClick={() => deleteReceipt(row.original.id)}
                        disabled={loading}
                    >
                        <IconTrash className="text-red-600 cursor-pointer" />
                    </Button>
                </div>
            ),
        },
    ];

    return (
        <div className="border rounded-md p-4 bg-background">
            <h2 className="text-xl font-bold bg-gradient-to-r from-blue-500 to-green-500 bg-clip-text text-transparent">DOCUMENTS</h2>
            <Separator className="my-4" />
            <div className="flex flex-col items-center p-4">
                {acceptedFiles.length > 0 && (
                    <div className="flex items-center">
                        <div className="w-[300px]">
                            <span className="text-xs text-green-600 line-clamp-3">
                                {acceptedFiles.map(f => f.name)}
                            </span>
                        </div>
                        <Button
                            data-umami-event={`upload@projects`}
                            disabled={isUploading}
                            className="ml-4"
                            onClick={() => handleFileUpload(acceptedFiles)}
                        >
                            <IconUpload size={14} className="mr-2" />Upload
                        </Button>
                    </div>
                )}
                {rejectedFiles.length > 0 && (
                    <div className="flex items-center">
                        <div className="w-[300px]">
                            <span className="text-xs text-red-600 line-clamp-3">
                                {rejectedFiles.map(f => f.name)}
                            </span>
                        </div>
                        <span className="text-xs text-red-600">
                            ({rejectedFiles.length})
                        </span>
                        <Button
                            data-umami-event="remove@projects"
                            variant="destructive"
                            className="ml-4"
                            onClick={() => setRejectedFiles([])}
                        >
                            <IconX size={14} className="mr-2" />Remove
                        </Button>
                    </div>
                )}
            </div>
            {(acceptedFiles.length > 0 || rejectedFiles.length > 0) && (
                <div className="flex flex-col items-center">
                    {error && (<span className="text-xs text-red-600 text-center">{error}</span>)}
                    <Button
                        data-umami-event="clear@projects"
                        disabled={isUploading}
                        variant="secondary"
                        className="mt-2"
                        onClick={() => {
                            setAcceptedFiles([])
                            setRejectedFiles([])
                        }}
                    >
                        <IconX size={14} className="mr-2" />Clear
                    </Button>
                </div>
            )}
            {acceptedFiles.length === 0 && rejectedFiles.length === 0 && (
                <div className="flex justify-center items-center min-h-[220px] gap-8">
                    <ReceiptIQFileDropzone
                        onDrop={(files) => {
                            setAcceptedFiles(files)
                        }}
                        onReject={(files) => {
                            setRejectedFiles(files.map(f => f.file))
                        }}
                        accept={["image/jpeg", "image/png", "application/pdf"]}
                        maxSize={5 * 1024 ** 2}
                        multiple
                    >
                        <ReceiptIQFileDropzone.Accept>
                            <IconUpload size={52} color="#2563eb" stroke={1.5} />
                        </ReceiptIQFileDropzone.Accept>
                        <ReceiptIQFileDropzone.Reject>
                            <IconX size={52} color="#dc2626" stroke={1.5} />
                        </ReceiptIQFileDropzone.Reject>
                        <ReceiptIQFileDropzone.Idle>
                            <IconPhoto size={52} color="#64748b" stroke={1.5} />
                        </ReceiptIQFileDropzone.Idle>
                        <div>
                            <span className="text-xl font-semibold">Drag images here or click to select files</span>
                            <span className="block text-sm text-muted-foreground mt-2">Attach as many files as you like, each file should not exceed 5mb</span>
                        </div>
                    </ReceiptIQFileDropzone>
                </div>
            )}
            <Separator className="my-4" />
            {receipts.length > 0 ? (
                <div className="overflow-x-auto mt-4 border rounded-md">
                    <DataTable columns={columns} data={receipts} />
                </div>
            ) : (
                <div className="p-8 text-center border rounded-md mt-4">
                    <span className="text-muted-foreground">No receipts uploaded yet. Upload some receipts to get started.</span>
                </div>
            )}
            <ReceiptViewerDrawer opened={opened} onClose={() => setOpened(false)} receipt={selectedReceipt} />
        </div>
    );
}