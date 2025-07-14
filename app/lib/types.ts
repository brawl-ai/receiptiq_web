export type User = {
    id: string
    first_name: string
    last_name: string
    email: string
    created_at: string
    updated_at?: string
}

export type SignupRequest = {
    first_name: string
    last_name: string
    email: string,
    password: string,
}

export type SignupResponse = {
    message: string
    user: User
}