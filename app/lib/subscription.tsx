"use client"
import { createContext, useContext } from "react";
import { InitiatePurchaseRequest, InitiatePurchaseResponse, PaymentResponse, SubscriptionPlan, User } from "./types";
import axios from "axios";

type PaginatedSubscriptionPlans = {
    total: number
    page: number
    size: number
    data: SubscriptionPlan[]
}

interface SubscriptionContext {
    getPlans: () => Promise<PaginatedSubscriptionPlans>
    initiatePurchase: (data: InitiatePurchaseRequest) => Promise<InitiatePurchaseResponse>
    paymentStatusChecker: (reference: string) => Promise<PaymentResponse>
    subscriptionStatusChecker: () => Promise<User>
}


const SubscriptionsContext = createContext<SubscriptionContext | undefined>(undefined)

const API_BASE = process.env.NEXT_PUBLIC_API_BASE

export function SubscriptionsProvider({ children }: { children: React.ReactNode }) {

    const getPlans = async () => {
        console.log("cookies", document.cookie)
        try {
            const response = await axios.get<PaginatedSubscriptionPlans>(`${API_BASE}/api/v1/subscriptions/plans`, { withCredentials: true }).then(response => response.data)
            return response
        } catch (getPlansError) {
            console.log(getPlansError)
            throw getPlansError
        }
    }

    const initiatePurchase = async (data: InitiatePurchaseRequest) => {
        try {
            console.log("cookies", document.cookie)
            const response = await axios.post<InitiatePurchaseResponse>(`${API_BASE}/api/v1/subscriptions/payments/start`, data, { withCredentials: true }).then(response => {
                return response.data
            })
            return response
        } catch (initiatePurchaseError) {
            console.log(initiatePurchaseError)
            throw initiatePurchaseError
        }
    }

    const paymentStatusChecker = async (reference: string) => {
        try {
            console.log("cookies", document.cookie)
            const response = await axios.get<PaymentResponse>(`${API_BASE}/api/v1/subscriptions/payments/check/${reference}`, { withCredentials: true }).then(response => response.data)
            return response
        } catch (paymentStatusCheckerError) {
            console.log(paymentStatusCheckerError)
            throw paymentStatusCheckerError
        }
    }

    const subscriptionStatusChecker = async () => {
        try {
            console.log("cookies", document.cookie)
            const response = await axios.get<User>(`${API_BASE}/api/v1/auth/me`, { withCredentials: true }).then(response => response.data)
            return response
        } catch (subscriptionStatusCheckerError) {
            console.log(subscriptionStatusCheckerError)
            throw subscriptionStatusCheckerError
        }
    }

    return <SubscriptionsContext.Provider
        value={{
            getPlans,
            initiatePurchase,
            paymentStatusChecker,
            subscriptionStatusChecker
        }}
    >
        {children}
    </SubscriptionsContext.Provider>
}


export function useSubscriptions() {
    const context = useContext(SubscriptionsContext)
    if (context === undefined) {
        throw new Error("useAuth must be used within an AuthProvider")
    }
    return context
}