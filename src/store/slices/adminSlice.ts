import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import api from "@/lib/api";

export interface Business {
    businessId: string;
    businessName?: string;
    firmName?: string;
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

export interface PendingItem {
    user: {
        userId: string;
        name: string;
        email: string;
    };
    business: Business;
}

export interface Package {
    packageId: string;
    name: string;
    price: number;
    invoiceLimit: number;
    quotationLimit: number;
    validityDays: number | null;
    isActive: boolean;
    createdAt: string;
    updatedAt: string;
}

export interface ExpiredTrialUser {
    userId: string;
    name: string;
    email: string;
    trialStartDate: string;
    trialEndDate: string;
    createdAt: string;
}

interface AdminState {
    pendingApprovals: PendingItem[];
    trialDays: number | null;
    packages: Package[];
    expiredTrialUsers: ExpiredTrialUser[];
    expiredTrialNextToken: string | null;
    loading: boolean;
    settingsLoading: boolean;
    packagesLoading: boolean;
    expiredLoading: boolean;
    error: string | null;
}

const initialState: AdminState = {
    pendingApprovals: [],
    trialDays: null,
    packages: [],
    expiredTrialUsers: [],
    expiredTrialNextToken: null,
    loading: false,
    settingsLoading: false,
    packagesLoading: false,
    expiredLoading: false,
    error: null,
};

export const fetchPendingApprovals = createAsyncThunk(
    "admin/fetchPending",
    async (_, { rejectWithValue }) => {
        try {
            const response = await api.get("/admin/pending");
            return Array.isArray(response.data) ? response.data : response.data?.pendingApprovals ?? [];
        } catch (error: any) {
            return rejectWithValue(error.response?.data?.error ?? error.response?.data?.message ?? "Failed to fetch pending approvals");
        }
    }
);

export const fetchTrialDays = createAsyncThunk(
    "admin/fetchTrialDays",
    async (_, { rejectWithValue }) => {
        try {
            const response = await api.get("/admin/settings/trial-days");
            return response.data.trialDays as number;
        } catch (error: any) {
            return rejectWithValue(error.response?.data?.error ?? error.response?.data?.message ?? "Failed to fetch trial days");
        }
    }
);

export const setTrialDays = createAsyncThunk(
    "admin/setTrialDays",
    async (trialDays: number, { rejectWithValue }) => {
        try {
            const response = await api.put("/admin/settings/trial-days", { trialDays });
            return response.data.trialDays as number;
        } catch (error: any) {
            return rejectWithValue(error.response?.data?.error ?? error.response?.data?.message ?? "Failed to update trial days");
        }
    }
);

export const fetchPackages = createAsyncThunk(
    "admin/fetchPackages",
    async (_, { rejectWithValue }) => {
        try {
            const response = await api.get("/admin/packages");
            return (response.data.packages ?? response.data) as Package[];
        } catch (error: any) {
            return rejectWithValue(error.response?.data?.error ?? error.response?.data?.message ?? "Failed to fetch packages");
        }
    }
);

export const createPackage = createAsyncThunk(
    "admin/createPackage",
    async (
        body: {
            name: string;
            price: number;
            invoiceLimit: number;
            quotationLimit: number;
            validityDays?: number | null;
            isActive?: boolean;
        },
        { rejectWithValue, dispatch }
    ) => {
        try {
            const response = await api.post("/admin/packages", body);
            const pkg = response.data.package ?? response.data;
            await dispatch(fetchPackages());
            return pkg as Package;
        } catch (error: any) {
            return rejectWithValue(error.response?.data?.error ?? error.response?.data?.message ?? "Failed to create package");
        }
    }
);

export const updatePackage = createAsyncThunk(
    "admin/updatePackage",
    async (
        { packageId, ...body }: Partial<Package> & { packageId: string },
        { rejectWithValue, dispatch }
    ) => {
        try {
            const response = await api.put(`/admin/packages/${packageId}`, body);
            const pkg = response.data.package ?? response.data;
            await dispatch(fetchPackages());
            return pkg as Package;
        } catch (error: any) {
            return rejectWithValue(error.response?.data?.error ?? error.response?.data?.message ?? "Failed to update package");
        }
    }
);

export const fetchExpiredTrialUsers = createAsyncThunk(
    "admin/fetchExpiredTrial",
    async (
        { limit = 50, nextToken }: { limit?: number; nextToken?: string | null } = {},
        { rejectWithValue }
    ) => {
        try {
            const params = new URLSearchParams();
            if (limit) params.set("limit", String(limit));
            if (nextToken) params.set("nextToken", nextToken);
            const response = await api.get(`/admin/users/expired-trial?${params.toString()}`);
            return {
                users: (response.data.users ?? []) as ExpiredTrialUser[],
                nextToken: response.data.nextToken ?? null,
                append: !!nextToken,
            };
        } catch (error: any) {
            return rejectWithValue(error.response?.data?.error ?? error.response?.data?.message ?? "Failed to fetch expired trial users");
        }
    }
);

export const approveBusiness = createAsyncThunk(
    "admin/approveBusiness",
    async ({ 
        userId, 
        businessId
    }: { 
        userId: string; 
        businessId: string;
    }, { rejectWithValue, dispatch }) => {
        try {
            const response = await api.post("/admin/approve-business", { 
                userId,
                businessId
            });
            dispatch(fetchPendingApprovals()); // Refresh the list
            return response.data;
        } catch (error: any) {
            return rejectWithValue(error.response?.data?.error ?? error.response?.data?.message ?? "Failed to approve business");
        }
    }
);

const adminSlice = createSlice({
    name: "admin",
    initialState,
    reducers: {
        clearExpiredTrialList: (state) => {
            state.expiredTrialUsers = [];
            state.expiredTrialNextToken = null;
        },
    },
    extraReducers: (builder) => {
        builder
            .addCase(fetchPendingApprovals.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchPendingApprovals.fulfilled, (state, action) => {
                state.loading = false;
                state.pendingApprovals = Array.isArray(action.payload) ? action.payload : [];
            })
            .addCase(fetchPendingApprovals.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload as string;
            })
            .addCase(fetchTrialDays.pending, (state) => {
                state.settingsLoading = true;
                state.error = null;
            })
            .addCase(fetchTrialDays.fulfilled, (state, action) => {
                state.settingsLoading = false;
                state.trialDays = action.payload;
            })
            .addCase(fetchTrialDays.rejected, (state, action) => {
                state.settingsLoading = false;
                state.error = action.payload as string;
            })
            .addCase(setTrialDays.pending, (state) => {
                state.settingsLoading = true;
                state.error = null;
            })
            .addCase(setTrialDays.fulfilled, (state, action) => {
                state.settingsLoading = false;
                state.trialDays = action.payload;
            })
            .addCase(setTrialDays.rejected, (state, action) => {
                state.settingsLoading = false;
                state.error = action.payload as string;
            })
            .addCase(fetchPackages.pending, (state) => {
                state.packagesLoading = true;
                state.error = null;
            })
            .addCase(fetchPackages.fulfilled, (state, action) => {
                state.packagesLoading = false;
                state.packages = action.payload ?? [];
            })
            .addCase(fetchPackages.rejected, (state, action) => {
                state.packagesLoading = false;
                state.error = action.payload as string;
            })
            .addCase(createPackage.rejected, (state, action) => {
                state.error = action.payload as string;
            })
            .addCase(updatePackage.rejected, (state, action) => {
                state.error = action.payload as string;
            })
            .addCase(fetchExpiredTrialUsers.pending, (state) => {
                state.expiredLoading = true;
                state.error = null;
            })
            .addCase(fetchExpiredTrialUsers.fulfilled, (state, action) => {
                state.expiredLoading = false;
                state.expiredTrialUsers = action.payload.append
                    ? [...state.expiredTrialUsers, ...action.payload.users]
                    : action.payload.users;
                state.expiredTrialNextToken = action.payload.nextToken;
            })
            .addCase(fetchExpiredTrialUsers.rejected, (state, action) => {
                state.expiredLoading = false;
                state.error = action.payload as string;
            })
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

export const { clearExpiredTrialList } = adminSlice.actions;
export default adminSlice.reducer;
