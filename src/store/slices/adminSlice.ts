import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import api from "@/lib/api";

interface Business {
    businessId: string;
    firmName: string;
    mobile: string;
    gstNumber: string;
    pan: string;
    email: string;
    address: {
        street: string;
        city: string;
        state: string;
        pincode: string;
    };
    approvalStatus: "PENDING" | "APPROVED" | "REJECTED";
    isActive: boolean;
    createdAt: string;
    updatedAt: string;
    companyLogoUrl?: string;
    userId: string;
    customFields?: Record<string, any>;
    dispatchAddress?: {
        street: string;
        city: string;
        state: string;
    };
}

interface PendingItem {
    user: {
        userId: string;
        name: string;
        email: string;
    };
    business: Business;
}

interface AdminState {
    pendingApprovals: PendingItem[];
    loading: boolean;
    error: string | null;
}

const initialState: AdminState = {
    pendingApprovals: [],
    loading: false,
    error: null,
};

export const fetchPendingApprovals = createAsyncThunk(
    "admin/fetchPending",
    async (_, { rejectWithValue }) => {
        try {
            const response = await api.get("/admin/pending");
            return response.data;
        } catch (error: any) {
            return rejectWithValue(error.response?.data?.message || "Failed to fetch pending approvals");
        }
    }
);

export const approveBusiness = createAsyncThunk(
    "admin/approveBusiness",
    async ({ userId, businessId }: { userId: string; businessId: string }, { rejectWithValue, dispatch }) => {
        try {
            const response = await api.post("/admin/approve-business", { userId, businessId });
            dispatch(fetchPendingApprovals()); // Refresh the list
            return response.data;
        } catch (error: any) {
            return rejectWithValue(error.response?.data?.message || "Failed to approve business");
        }
    }
);

const adminSlice = createSlice({
    name: "admin",
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(fetchPendingApprovals.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchPendingApprovals.fulfilled, (state, action) => {
                state.loading = false;
                state.pendingApprovals = action.payload;
            })
            .addCase(fetchPendingApprovals.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload as string;
            })
            // Approve Business
            .addCase(approveBusiness.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(approveBusiness.fulfilled, (state) => {
                state.loading = false;
            })
            .addCase(approveBusiness.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload as string;
            });
    },
});

export default adminSlice.reducer;
