"use client";

import {
    createContext,
    useContext,
    useState,
    ReactNode,
} from "react";
import api from "../axios";
import {
    ProjectResponse,
    ReceiptResponse,
    ReceiptStatusUpdate
} from "../types";

interface ReceiptsContextType {
    project: ProjectResponse
    receipts: ReceiptResponse[]
    loading: boolean;
    error: string | null;
    createReceipt: (file: File) => Promise<ReceiptResponse>;
    updateReceiptStatus: (receiptId: string, data: ReceiptStatusUpdate) => Promise<ReceiptResponse>;
    deleteReceipt: (receiptId: string) => Promise<void>;
}

const ReceiptsContext = createContext<ReceiptsContextType | undefined>(undefined);

export function ReceiptsProvider({ children, project }: { children: ReactNode, project: ProjectResponse }) {

    const [receipts, setReceipts] = useState<ReceiptResponse[]>(project.receipts);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const createReceipt = async (file: File) => {
        try {
            setLoading(true);
            setError(null);
            const formData = new FormData();
            formData.append("file", file);
            const response = await api.post<ReceiptResponse>(`/api/v1/projects/${project.id}/receipts/`, formData, {
                headers: { "Content-Type": "multipart/form-data" },
            });
            setReceipts((prev) => [...prev, response.data])
            return response.data;
        } catch (err) {
            setError(err.response?.data?.detail || "Failed to create receipt");
            throw err;
        } finally {
            setLoading(false);
        }
    };

    const updateReceiptStatus = async (receiptId: string, data: ReceiptStatusUpdate) => {
        try {
            setLoading(true);
            setError(null);
            const response = await api.put<ReceiptResponse>(`/api/v1/projects/${project.id}/receipts/${receiptId}/`, data);
            setReceipts((prev) => [...prev, response.data])
            return response.data;
        } catch (err) {
            setError(err.response?.data?.detail || "Failed to update receipt status");
            throw err;
        } finally {
            setLoading(false);
        }
    };

    const deleteReceipt = async (receiptId: string) => {
        try {
            setLoading(true);
            setError(null);
            await api.delete<ReceiptResponse>(`/api/v1/projects/${project.id}/receipts/${receiptId}/`);
            setReceipts((prev) => prev.filter((r) => r.id !== receiptId));
        } catch (err) {
            setError(err.response?.data?.detail || "Failed to delete the receipt");
            throw err;
        } finally {
            setLoading(false);
        }
    };


    return (
        <ReceiptsContext.Provider
            value={{
                project,
                receipts,
                loading,
                error,
                createReceipt,
                updateReceiptStatus,
                deleteReceipt
            }}
        >
            {children}
        </ReceiptsContext.Provider>
    );
}

export function useReceipts() {
    const context = useContext(ReceiptsContext);
    if (context === undefined) {
        throw new Error("useReceipts must be used within a ReceiptsProvider");
    }
    return context;
}
