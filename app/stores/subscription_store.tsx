"use client";

import { createStore } from "zustand/vanilla";
import type {
  InitiatePurchaseRequest,
  InitiatePurchaseResponse,
  PaginatedResponse,
  PaymentResponse,
  SubscriptionPlan,
  User
} from "../types";
import axios from "axios";
import { createContext, useContext, useRef } from "react";
import { useStore } from "zustand";

interface SubscriptionStateType {
  getPlans: () => Promise<PaginatedResponse<SubscriptionPlan>>;
  initiatePurchase: (data: InitiatePurchaseRequest) => Promise<InitiatePurchaseResponse>;
  paymentStatusChecker: (reference: string) => Promise<PaymentResponse>;
  subscriptionStatusChecker: () => Promise<User>;
}

type SubscriptionStoreType = ReturnType<typeof createSubscriptionStore>;

const API_BASE = process.env.NEXT_PUBLIC_API_BASE;

const createSubscriptionStore = () => {
  return createStore<SubscriptionStateType>()(() => ({
    getPlans: async () => {
      const response = await axios.get<PaginatedResponse<SubscriptionPlan>>(`${API_BASE}/api/v1/subscriptions/plans`, { withCredentials: true });
      return response.data;
    },
    initiatePurchase: async (data) => {
      const response = await axios.post<InitiatePurchaseResponse>(`${API_BASE}/api/v1/subscriptions/payments/start`, data, { withCredentials: true });
      return response.data;
    },
    paymentStatusChecker: async (reference) => {
      const response = await axios.get<PaymentResponse>(`${API_BASE}/api/v1/subscriptions/payments/check/${reference}`, { withCredentials: true });
      return response.data;
    },
    subscriptionStatusChecker: async () => {
      const response = await axios.get<User>(`${API_BASE}/api/v1/auth/me`, { withCredentials: true });
      return response.data;
    },
  }));
};

const SubscriptionContext = createContext<SubscriptionStoreType | null>(null);

export function SubscriptionsProvider({ children }: { children: React.ReactNode }) {
  const storeRef = useRef<SubscriptionStoreType>(null);
  if (!storeRef.current) {
    storeRef.current = createSubscriptionStore();
  }
  return (
    <SubscriptionContext.Provider value={storeRef.current}>
      {children}
    </SubscriptionContext.Provider>
  );
}

export function useSubscriptionsContext<T>(selector: (state: SubscriptionStateType) => T): T {
  const store = useContext(SubscriptionContext);
  if (!store) throw new Error("Missing SubscriptionContext.Provider in the tree");
  return useStore(store, selector);
}
