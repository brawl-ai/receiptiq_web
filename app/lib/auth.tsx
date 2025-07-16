"use client"

import { createContext, useContext, useState } from "react"
import api from "./axios"
import {
  User,
  SignupRequest,
  SignupResponse,
  GetOTPRequest,
  GetOTPResponse,
  CheckOTPRequest,
  CheckOTPResponse,
  LoginRequest,
  LoginResponse,
  ForgotPasswordRequest,
  ForgotPasswordResponse,
  ResetPasswordRequest,
  ResetPasswordReponse,
  LogoutResponse,
} from "./types"
import axios from "axios"

interface AuthContextType {
  user: User | null
  loading: boolean
  error: string | null
  signup: (data: SignupRequest) => Promise<SignupResponse>
  getOTP: (data: GetOTPRequest) => Promise<GetOTPResponse>
  checkOTP: (data: CheckOTPRequest) => Promise<CheckOTPResponse>
  login: (data: LoginRequest) => Promise<LoginResponse>
  forgotPassword: (data: ForgotPasswordRequest) => Promise<ForgotPasswordResponse>
  resetPassword: (data: ResetPasswordRequest) => Promise<ResetPasswordReponse>
  logout: () => Promise<LogoutResponse>
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children, initialUser }: { children: React.ReactNode, initialUser: User | null }) {
  const [user, setUser] = useState<User | null>(initialUser)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const signup = async (data: SignupRequest) => {
    try {
      setLoading(true)
      setError(null)
      const response = await axios.post<SignupResponse>("/api/signup", data)
      setUser(response.data.user)
      setLoading(false)
      return response.data
    } catch (err) {
      setError(err.response?.data?.detail || "Error when signing up")
      setLoading(false)
      throw err
    }
  }

  const getOTP = async (data: GetOTPRequest) => {
    try {
      setError(null)
      const response = await axios.post<GetOTPResponse>("/api/otp/get", data)
      console.log(response)
      return response.data
    } catch (err) {
      if (err.response) {
        setError(err.response?.data?.detail || "Error when getting OTP")
        throw err
      } else {
        console.log(err)
      }
    }
  }

  const login = async (data: LoginRequest) => {
    try {
      setError(null)
      console.log("sending to next", data)
      const response = await axios.post<LoginResponse>("/api/login", data)
      return response.data
    } catch (err) {
      if (err.response) {
        setError(err.response?.data?.detail || "Error when getting OTP")
        throw err
      } else {
        console.log(err)
      }
    }
  }

  const checkOTP = async (data: CheckOTPRequest) => {
    try {
      setError(null)
      const response = await axios.post<CheckOTPResponse>("/api/otp/check", data)
      return response.data
    } catch (err) {
      setError(err.response?.data?.detail || "Error when checking otp")
      throw err
    }
  }

  const forgotPassword = async (data: ForgotPasswordRequest) => {
    try {
      setError(null)
      const response = await axios.post<ForgotPasswordResponse>("/api/password/forgot", data)
      return response.data
    } catch (err) {
      setError(err.response?.data?.detail || "Error requesting reset password link")
      throw err
    }
  }

  const resetPassword = async (data: ResetPasswordRequest) => {
    try {
      setError(null)
      const response = await axios.post<ResetPasswordReponse>("/api/password/reset", data)
      return response.data
    } catch (err) {
      setError(err.response?.data?.detail || "Error requesting reset password link")
      throw err
    }
  }

  const logout = async () => {
    try {
      setError(null)
      const response = await api.post<LogoutResponse>("/api/v1/auth/logout")
      return response.data
    } catch (err) {
      setError(err.response?.data?.detail || "Error logging out")
      throw err
    }
  }

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        error,
        signup,
        getOTP,
        checkOTP,
        login,
        forgotPassword,
        resetPassword,
        logout
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider")
  }
  return context
}
