"use client"

import { createStore } from "zustand/vanilla"
import {
  LoginRequest,
  LoginResponse,
  User,
  SignupRequest,
  SignupResponse,
  GetOTPRequest,
  GetOTPResponse,
  CheckOTPRequest,
  CheckOTPResponse,
  ForgotPasswordRequest,
  ForgotPasswordResponse,
  ResetPasswordRequest,
  ResetPasswordReponse,
  LogoutResponse,
  UpdateUserRequest,
  UpdateUserResponse,
  ChangePasswordRequest,
  ChangePasswordResponse,
} from "../types";
import axios from "axios";
import { createContext, useContext, useRef } from "react";
import { useStore } from "zustand";

interface AuthStoreProps {
  user: User | null;
}

interface AuthStateType extends AuthStoreProps {
  signup: (data: SignupRequest) => Promise<SignupResponse>;
  getOTP: (data: GetOTPRequest) => Promise<GetOTPResponse>;
  checkOTP: (data: CheckOTPRequest) => Promise<CheckOTPResponse>;
  login: (data: LoginRequest) => Promise<LoginResponse>;
  forgotPassword: (data: ForgotPasswordRequest) => Promise<ForgotPasswordResponse>;
  resetPassword: (data: ResetPasswordRequest) => Promise<ResetPasswordReponse>;
  logout: () => Promise<LogoutResponse>;
  updateUser: (data: UpdateUserRequest) => Promise<UpdateUserResponse>;
  changePassword: (data: ChangePasswordRequest) => Promise<ChangePasswordResponse>;
}

type AuthStoreType = ReturnType<typeof createAuthStore>;

const createAuthStore = (initProps?: Partial<AuthStoreProps>) => {
  const DEFAULT_PROPS: AuthStoreProps = {
    user: null,
  };
  return createStore<AuthStateType>()((set) => ({
    ...DEFAULT_PROPS,
    ...initProps,
    signup: async (data) => {
      try {
        const response = await axios.post<SignupResponse>("/api/signup", data);
        set((state) => ({ ...state, user: response.data.user }));
        return response.data;
      } catch (err) {
        throw err;
      }
    },
    getOTP: async (data) => {
      try {
        const response = await axios.post<GetOTPResponse>("/api/otp/get", data);
        return response.data;
      } catch (err) {
        throw err;
      }
    },
    checkOTP: async (data) => {
      try {
        const response = await axios.post<CheckOTPResponse>("/api/otp/check", data);
        return response.data;
      } catch (err) {
        throw err;
      }
    },
    login: async (data) => {
      try {
        const response = await axios.post<LoginResponse>("/api/login", data);
        // LoginResponse does not contain user, so do not set user here
        return response.data;
      } catch (err) {
        throw err;
      }
    },
    forgotPassword: async (data) => {
      try {
        const response = await axios.post<ForgotPasswordResponse>("/api/password/forgot", data);
        return response.data;
      } catch (err) {
        throw err;
      }
    },
    resetPassword: async (data) => {
      try {
        const response = await axios.post<ResetPasswordReponse>("/api/password/reset", data);
        return response.data;
      } catch (err) {
        throw err;
      }
    },
    logout: async () => {
      try {
        const response = await axios.post<LogoutResponse>("/api/v1/auth/logout");
        set((state) => ({ ...state, user: null }));
        return response.data;
      } catch (err) {
        throw err;
      }
    },
    updateUser: async (data) => {
      try {
        const response = await axios.patch<UpdateUserResponse>("/api/profile/change", data);
        set((state) => ({ ...state, user: response.data.user }));
        return response.data;
      } catch (err) {
        throw err;
      }
    },
    changePassword: async (data) => {
      try {
        const response = await axios.post<ChangePasswordResponse>("/api/password/change", data);
        return response.data;
      } catch (err) {
        throw err;
      }
    },
  }));
};

type AuthProviderProps = React.PropsWithChildren<AuthStoreProps>

const AuthContext = createContext<AuthStoreType | null>(null)

export function AuthProvider({ children, user }: AuthProviderProps) {
  const storeRef = useRef<AuthStoreType>(null)
  if (!storeRef.current) {
    storeRef.current = createAuthStore({ user })
  }
  return (
    <AuthContext.Provider value={storeRef.current} >
      {children}
    </AuthContext.Provider>
  )
}

export function useAuthContext<T>(selector: (state: AuthStateType) => T): T {
  const store = useContext(AuthContext)
  if (!store) throw new Error('Missing BearContext.Provider in the tree')
  return useStore(store, selector)
}