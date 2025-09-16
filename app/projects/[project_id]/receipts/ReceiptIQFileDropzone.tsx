import React, { ReactElement, ReactNode, useRef } from "react";

export function ReceiptIQFileDropzone({
    onDrop,
    onReject,
    accept = ["image/jpeg", "image/png", "application/pdf"],
    maxSize = 5 * 1024 ** 2,
    multiple = true,
    children,
}: {
    onDrop: (files: File[]) => void;
    onReject: (files: { file: File; errors: string[] }[]) => void;
    accept?: string[];
    maxSize?: number;
    multiple?: boolean;
    children: React.ReactNode;
}) {
    const inputRef = useRef<HTMLInputElement>(null);
    const [dragActive, setDragActive] = React.useState(false);
    const [dragReject, setDragReject] = React.useState(false);

    const handleFiles = (fileList: FileList | null) => {
        if (!fileList) return;
        const files = Array.from(fileList);
        const accepted: File[] = [];
        const rejected: { file: File; errors: string[] }[] = [];
        files.forEach((file) => {
            const errors: string[] = [];
            if (!accept.includes(file.type)) errors.push("Invalid file type");
            if (file.size > maxSize) errors.push("File too large");
            if (errors.length > 0) {
                rejected.push({ file, errors });
            } else {
                accepted.push(file);
            }
        });
        if (accepted.length > 0) onDrop(accepted);
        if (rejected.length > 0) onReject(rejected);
    };

    const handleDragOver = (e: React.DragEvent) => {
        e.preventDefault();
        e.stopPropagation();
        setDragActive(true);
        // Check if any file would be rejected
        const items = e.dataTransfer.items;
        let anyReject = false;
        for (let i = 0; i < items.length; i++) {
            const item = items[i];
            if (item.kind === "file") {
                const type = item.type;
                if (!accept.includes(type)) anyReject = true;
            }
        }
        setDragReject(anyReject);
    };

    const handleDragLeave = (e: React.DragEvent) => {
        e.preventDefault();
        e.stopPropagation();
        setDragActive(false);
        setDragReject(false);
    };

    const handleDrop = (e: React.DragEvent) => {
        e.preventDefault();
        e.stopPropagation();
        setDragActive(false);
        setDragReject(false);
        handleFiles(e.dataTransfer.files);
    };

    const handleClick = () => {
        inputRef.current?.click();
    };

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        handleFiles(e.target.files);
        e.target.value = "";
    };

    // Render children with context for accept/reject/idle
    let state: "accept" | "reject" | "idle" = "idle";
    if (dragActive && dragReject) state = "reject";
    else if (dragActive) state = "accept";

    return (
        <div
            className={`w-full border-2 border-dashed rounded-md p-6 cursor-pointer transition-colors ${dragActive
                ? dragReject
                    ? "border-red-500 bg-red-50"
                    : "border-blue-500 bg-blue-50"
                : "border-gray-300 bg-background"
                }`}
            onClick={handleClick}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
            tabIndex={0}
            role="button"
            aria-label="File upload dropzone"
        >
            <input
                ref={inputRef}
                type="file"
                multiple={multiple}
                accept={accept.join(",")}
                className="hidden"
                onChange={handleInputChange}
            />
            {React.Children.map(children, (child) => {
                if (!React.isValidElement(child)) return child;
                if (child.type === ReceiptIQFileDropzone.Accept && state === "accept") return child;
                if (child.type === ReceiptIQFileDropzone.Reject && state === "reject") return child;
                if (child.type === ReceiptIQFileDropzone.Idle && state === "idle") return child;
                if ([ReceiptIQFileDropzone.Accept, ReceiptIQFileDropzone.Reject, ReceiptIQFileDropzone.Idle].includes(child.type as ({ children }: { children: ReactNode; }) => ReactElement)) return null;
                return child;
            })}
        </div>
    );
}

ReceiptIQFileDropzone.Accept = function Accept({ children }: { children: React.ReactNode }) {
    return <>{children}</>;
};

ReceiptIQFileDropzone.Reject = function Reject({ children }: { children: React.ReactNode }) {
    return <>{children}</>;
};

ReceiptIQFileDropzone.Idle = function Idle({ children }: { children: React.ReactNode }) {
    return <>{children}</>;
};
