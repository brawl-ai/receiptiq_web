"use client";

import { createStore } from "zustand/vanilla";
import type {
  ProjectResponse,
  ReceiptResponse,
  ReceiptStatusUpdate,
  DataValueUpdate,
  DataValueResponse,
  ExportResponse
} from "../types";
import { createContext, useContext, useRef } from "react";
import { useStore } from "zustand";
import api from "../axios";

interface ReceiptsStoreProps {
  project: ProjectResponse;
}

interface ReceiptsStateType extends ReceiptsStoreProps {
  receipts: ReceiptResponse[];
  loading: boolean;
  error: string | null;
  createReceipt: (file: File) => Promise<ReceiptResponse>;
  updateReceiptStatus: (receiptId: string, data: ReceiptStatusUpdate) => Promise<ReceiptResponse>;
  deleteReceipt: (receiptId: string) => Promise<void>;
  processReceipt: (receiptId: string) => Promise<ReceiptResponse>;
  updateDataValue: (receiptId: string, dataValueId: string, data: DataValueUpdate) => Promise<DataValueResponse>;
  exportData: () => Promise<ExportResponse>;
}

type ReceiptsStoreType = ReturnType<typeof createReceiptsStore>;

const createReceiptsStore = (initProps: ReceiptsStoreProps) => {
  return createStore<ReceiptsStateType>()((set, get) => ({
    ...initProps,
    receipts: initProps.project.receipts,
    loading: false,
    error: null,
    createReceipt: async (file) => {
      set((state) => ({ ...state, loading: true, error: null }));
      try {
        const formData = new FormData();
        formData.append("file", file);
        const response = await api.post<ReceiptResponse>(`/api/v1/projects/${get().project.id}/receipts/`, formData, {
          headers: { "Content-Type": "multipart/form-data" },
        });
        set((state) => ({ ...state, receipts: [...state.receipts, response.data], loading: false }));
        return response.data;
      } catch (err) {
        set((state) => ({ ...state, error: err.response?.data?.detail || "Failed to create receipt", loading: false }));
        throw err;
      }
    },
    updateReceiptStatus: async (receiptId, data) => {
      set((state) => ({ ...state, loading: true, error: null }));
      try {
        const response = await api.put<ReceiptResponse>(`/api/v1/projects/${get().project.id}/receipts/${receiptId}/`, data);
        set((state) => ({ ...state, receipts: [...state.receipts, response.data], loading: false }));
        return response.data;
      } catch (err) {
        set((state) => ({ ...state, error: err.response?.data?.detail || "Failed to update receipt status", loading: false }));
        throw err;
      }
    },
    deleteReceipt: async (receiptId) => {
      set((state) => ({ ...state, loading: true, error: null }));
      try {
        await api.delete<ReceiptResponse>(`/api/v1/projects/${get().project.id}/receipts/${receiptId}/`);
        set((state) => ({ ...state, receipts: get().receipts.filter((r) => r.id !== receiptId), loading: false }));
      } catch (err) {
        set((state) => ({ ...state, error: err.response?.data?.detail || "Failed to delete the receipt", loading: false }));
        throw err;
      }
    },
    processReceipt: async (receiptId) => {
      set((state) => ({ ...state, loading: true, error: null }));
      try {
        const response = await api.post<ReceiptResponse>(`/api/v1/projects/${get().project.id}/receipts/${receiptId}/process`);
        set((state) => ({
          ...state,
          receipts: state.receipts.map(r => r.id === response.data.id ? response.data : r),
          loading: false
        }));
        return response.data;
      } catch (err) {
        set((state) => ({ ...state, error: err.response?.data?.detail || "Failed to process receipts", loading: false }));
        throw err;
      }
    },
    updateDataValue: async (receiptId, dataValueId, data) => {
      set((state) => ({ ...state, loading: true, error: null }));
      try {
        const response = await api.put<DataValueResponse>(`/api/v1/projects/${get().project.id}/receipts/${receiptId}/data/${dataValueId}`, data);
        set((state) => ({
          ...state,
          receipts: state.receipts.map((r) => {
            if (r.id === receiptId) {
              return {
                ...r,
                data_values: r.data_values.map((v) => v.id === dataValueId ? response.data : v)
              };
            }
            return r;
          }),
          loading: false
        }));
        return response.data;
      } catch (err) {
        set((state) => ({ ...state, error: err.response?.data?.detail || "Failed to update receipt data", loading: false }));
        throw err;
      }
    },
    exportData: async () => {
      set((state) => ({ ...state, loading: true, error: null }));
      try {
        const response = await api.get<ExportResponse>(`/api/v1/projects/${get().project.id}/data/csv`);
        set((state) => ({ ...state, loading: false }));
        return response.data;
      } catch (err) {
        set((state) => ({ ...state, error: err.response?.data?.detail || "Failed to export the data", loading: false }));
        throw err;
      }
    },
  }));
};

type ReceiptsProviderProps = React.PropsWithChildren<ReceiptsStoreProps>;

const ReceiptsContext = createContext<ReceiptsStoreType | null>(null);

export function ReceiptsProvider({ children, project }: ReceiptsProviderProps) {
  const storeRef = useRef<ReceiptsStoreType>(null);
  if (!storeRef.current) {
    storeRef.current = createReceiptsStore({ project });
  }
  return (
    <ReceiptsContext.Provider value={storeRef.current}>
      {children}
    </ReceiptsContext.Provider>
  );
}

export function useReceiptsContext<T>(selector: (state: ReceiptsStateType) => T): T {
  const store = useContext(ReceiptsContext);
  if (!store) throw new Error("Missing ReceiptsContext.Provider in the tree");
  return useStore(store, selector);
}
