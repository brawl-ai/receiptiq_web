"use client"

import { createContext, useContext, useState, useEffect } from "react"
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
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    fetchUser()
  }, [])

  const fetchUser = async () => {
    setLoading(true)
    try {
      const response = await api.get<User>("/api/v1/auth/me")
      setUser(response.data)
    } catch (err) {
      throw err
    } finally {
      setLoading(false)
    }
  }

  const signup = async (data: SignupRequest) => {
    try {
      setError(null)
      const response = await axios.post<SignupResponse>("/api/signup", data)
      return response.data
    } catch (err) {
      setError(err.response?.data?.detail || "Error when signing up")
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

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        error,
        signup,
        getOTP,
        checkOTP,
        login
      }}
    >
      {!loading ? children : null}
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
