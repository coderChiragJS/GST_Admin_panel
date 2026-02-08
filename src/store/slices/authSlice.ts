import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import api from "@/lib/api";

interface User {
    id: string;
    email: string;
    name: string;
}

interface AuthState {
    user: User | null;
    token: string | null;
    isAuthenticated: boolean;
    loading: boolean;
    error: string | null;
}

const initialState: AuthState = {
    user: null,
    token: typeof window !== "undefined" ? localStorage.getItem("token") : null,
    isAuthenticated: false,
    loading: false,
    error: null,
};

export const login = createAsyncThunk(
    "auth/login",
    async (credentials: any, { rejectWithValue }) => {
        try {
            const response = await api.post("/admin/auth/login", credentials);
            if (response.data.token) {
                localStorage.setItem("token", response.data.token);
            }
            return response.data;
        } catch (error: any) {
            const msg = error.response?.data?.error ?? error.response?.data?.message ?? "Login failed";
            return rejectWithValue(msg);
        }
    }
);

export const register = createAsyncThunk(
    "auth/register",
    async (userData: { name: string; email: string; password: string }, { rejectWithValue }) => {
        try {
            const response = await api.post("/admin/auth/register", userData);
            return response.data as { message: string; userId: string };
        } catch (error: any) {
            const msg = error.response?.data?.error ?? error.response?.data?.message ?? "Registration failed";
            return rejectWithValue(msg);
        }
    }
);

const authSlice = createSlice({
    name: "auth",
    initialState,
    reducers: {
        logout: (state) => {
            state.user = null;
            state.token = null;
            state.isAuthenticated = false;
            localStorage.removeItem("token");
        },
        clearError: (state) => {
            state.error = null;
        },
    },
    extraReducers: (builder) => {
        builder
            // Login
            .addCase(login.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(login.fulfilled, (state, action) => {
                state.loading = false;
                state.isAuthenticated = true;
                state.user = action.payload.user;
                state.token = action.payload.token;
            })
            .addCase(login.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload as string;
            })
            // Register
            .addCase(register.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(register.fulfilled, (state) => {
                state.loading = false;
                // Register returns 201 with message + userId only; no token. User must log in.
            })
            .addCase(register.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload as string;
            });
    },
});

export const { logout, clearError } = authSlice.actions;
export default authSlice.reducer;
