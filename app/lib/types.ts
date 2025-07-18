export type UserSubscription = {
    id: string
    is_active: boolean
    subscription_plan_id: string
    start_at: string
    end_at: string
}

export type User = {
    id: string
    first_name: string
    last_name: string
    email: string
    created_at: string
    updated_at?: string,
    is_subscribed: boolean
    subscriptions: UserSubscription[]
    accepted_terms: boolean
}

export type SignupRequest = {
    first_name: string
    last_name: string
    email: string,
    password: string
    accepted_terms: boolean
}

export type SignupResponse = {
    message: string
    user: User
}

export type ValError = {
    loc: string[]
    message: string
    type: string
}

export type ValidationError = {
    detail: ValError[]
}

export type GetOTPRequest = {
    email: string
}

export type GetOTPResponse = {
    message: string
}

export type CheckOTPRequest = {
    email: string
    code: string
}

export type CheckOTPResponse = {
    message: string
    user: User
}

export type LoginRequest = {
    email: string
    password: string
    remember_me: boolean
}

export type LoginResponse = {
    success: boolean
}

export type ForgotPasswordRequest = {
    email: string
}

export type ForgotPasswordResponse = {
    message: string
}

export type ResetPasswordRequest = {
    email: string
    token: string
    new_password: string
}

export type ResetPasswordReponse = {
    message: string
}

export type LogoutResponse = {
    message: string
}

export type SubscriptionPlan = {
    name: string
    description: string
    price: number
    currency: string
    billing_interval: string
    trial_period_days: number
    status: string
    id: string
    created_at: string
    updated_at: string | null
}

export type InitiatePurchaseRequest = {
    plan_id: string
    email: string
}

export type PaymentAuthorizationData = {
    authorization_url: string,
    access_code: string,
    reference: string
}

export type InitiatePurchaseResponse = {
    status: boolean
    message: string,
    data: PaymentAuthorizationData
}

interface PaymentLogHistoryItem {
    type: "action" | "success";
    message: string;
    time: number;
}

interface PaymentLog {
    start_time: number;
    time_spent: number;
    attempts: number;
    errors: number;
    success: boolean;
    mobile: boolean;
    history: PaymentLogHistoryItem[];
}

interface Authorization {
    authorization_code: string;
    bin: string;
    last4: string;
    exp_month: string;
    exp_year: string;
    channel: string;
    card_type: string;
    bank: string;
    country_code: string;
    brand: string;
    reusable: boolean;
    signature: string;
    account_name: string | null;
}

interface Customer {
    id: number;
    first_name: string | null;
    last_name: string | null;
    email: string;
    customer_code: string;
    phone: string | null;
    risk_action: string;
    international_format_phone: string | null;
}

interface PaymentData {
    id: number;
    domain: string;
    status: string;
    reference: string;
    receipt_number: string | null;
    amount: number;
    message: string | null;
    gateway_response: string;
    paid_at: string;
    created_at: string;
    channel: string;
    currency: string;
    ip_address: string;
    metadata: string;
    log: PaymentLog;
    fees: number;
    authorization: Authorization;
    customer: Customer;
    order_id: string | null;
    paidAt: string;
    createdAt: string;
    requested_amount: number;
    transaction_date: string;
}

export interface PaymentResponse {
    status: boolean;
    message: string;
    data: PaymentData;
}

export type ProjectCreate = {
    name: string
    description?: string
}

export type ProjectUpdate = {
    name?: string
    description?: string
}

export type FieldType = 'string' | 'number' | 'date' | 'boolean' | 'object' | 'array'

export type FieldCreate = {
    name: string
    type: FieldType
    description?: string
}

export type FieldUpdate = {
    name?: string
    type?: FieldType
    description?: string
    parent_id?: string
}

export type FieldParent = {
    id: string
    name: string
    type: FieldType
}

export type FieldProject = {
    id: string
    name: string
}

export type FieldResponse = {
    id: string
    name: string
    type: FieldType
    description?: string
    parent: FieldParent
    project: FieldProject
    children: FieldResponse[]
    created_at: string
    updated_at?: string
}

export type ProjectResponse = {
    name: string
    description?: string
    id: string
    owner: User
    fields: FieldResponse[]
    created_at: string
    updated_at?: string
}