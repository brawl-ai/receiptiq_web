export type User = {
    id: string
    first_name: string
    last_name: string
    email: string
    created_at: string
    updated_at?: string,
    accepted_terms: boolean
}

export type SignupRequest = {
    first_name: string
    last_name: string
    email: string,
    password: string,
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