"use client";

import { createContext, useContext, useState, useEffect } from "react";
import api from "./axios";
import {
  User,
  SignupRequest,
  SignupResponse,
} from "./types"

interface AuthContextType {
  user: User | null;
  loading: boolean;
  error: string | null;
  signup: (data: SignupRequest) => Promise<SignupResponse>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      fetchUser();
    } else {
      setLoading(false);
    }
  }, []);

  const fetchUser = async () => {
    try {
      const response = await api.get<User>("/api/v1/auth/me");
      setUser(response.data);
    } catch (err) {
      console.error("Error fetching user:", err);
      localStorage.removeItem("token");
    } finally {
      setLoading(false);
    }
  };

  const signup = async (data: SignupRequest) => {
    try {
      setError(null);
      const response = await api.post<SignupResponse>("/api/v1/auth/register", data);
      return response.data;
    } catch (err: any) {
      setError(err.response?.data?.detail || "Failed to sign up");
      throw err;
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        error,
        signup
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
