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

export interface AdminUserSummary {
    userId: string;
    name: string;
    email: string;
    createdAt: string;
    approvalStatus?: string;
}

export interface AdminUserBusinessSummary {
    businessId: string;
    businessName: string;
    gstNumber: string;
    approvalStatus: string;
    isActive?: boolean;
    createdAt: string;
    updatedAt: string;
}

export interface AdminUserSubscriptionSummary {
    subscriptionId: string;
    packageId: string;
    packageName: string;
    invoiceLimit: number;
    quotationLimit: number;
    invoicesUsed: number;
    quotationsUsed: number;
    remainingInvoices: number;
    remainingQuotations: number;
    startDate: string;
    endDate: string;
    isActive: boolean;
}

export interface AdminUserSubscriptionByBusiness {
    subscriptionId: string;
    packageId: string;
    packageName: string;
    businessId: string | null;
    gstNumber: string | null;
    invoiceLimit: number;
    quotationLimit: number;
    invoicesUsed: number;
    quotationsUsed: number;
    startDate: string;
}

export interface AdminUserWithSubscription {
    user: AdminUserSummary;
    businesses: AdminUserBusinessSummary[];
    subscription: AdminUserSubscriptionSummary | null;
}

export interface AdminUser {
    userId: string;
    name: string;
    email: string;
    role: string;
    approvalStatus: string;
    subscriptionActive: boolean;
    trialStartDate: string;
    trialEndDate: string;
    createdAt: string;
    businesses: {
        userId: string;
        businessId: string;
        firmName: string;
        gstNumber: string;
        approvalStatus: string;
        isActive: boolean;
    }[];
    subscription: {
        subscriptionId: string;
        packageId: string;
        packageName: string;
        invoiceLimit: number;
        quotationLimit: number;
        invoicesUsed: number;
        quotationsUsed: number;
        startDate: string;
    } | null;
    subscriptionsByBusiness?: AdminUserSubscriptionByBusiness[];
    hasPurchasedPackage: boolean;
    remainingInvoices: number;
    remainingQuotations: number;
}

export interface Payment {
    PK?: string;
    SK?: string;
    orderId: string;
    merchantOrderId?: string;
    userId: string;
    packageId: string;
    amount?: number;
    amountPaise?: number;
    currency?: string;
    status: string;
    transactionId?: string;
    phonePeOrderId?: string;
    gatewayRef?: string;
    failureReason?: string | null;
    packageSnapshot?: {
        packageId?: string;
        name?: string;
        price?: number;
        invoiceLimit?: number;
        quotationLimit?: number;
        validityDays?: number | null;
    };
    createdAt: string;
    updatedAt: string;
}

interface AdminState {
    pendingApprovals: PendingItem[];
    trialDays: number | null;
    packages: Package[];
    expiredTrialUsers: ExpiredTrialUser[];
    expiredTrialNextToken: string | null;
    usersWithSubscriptions: AdminUserWithSubscription[];
    usersWithSubscriptionsNextToken: string | null;
    users: AdminUser[];
    usersNextToken: string | null;
    payments: Payment[];
    paymentsNextToken: string | null;
    loading: boolean;
    settingsLoading: boolean;
    packagesLoading: boolean;
    expiredLoading: boolean;
    usersWithSubscriptionsLoading: boolean;
    usersLoading: boolean;
    paymentsLoading: boolean;
    error: string | null;
}

const initialState: AdminState = {
    pendingApprovals: [],
    trialDays: null,
    packages: [],
    expiredTrialUsers: [],
    expiredTrialNextToken: null,
    usersWithSubscriptions: [],
    usersWithSubscriptionsNextToken: null,
    users: [],
    usersNextToken: null,
    payments: [],
    paymentsNextToken: null,
    loading: false,
    settingsLoading: false,
    packagesLoading: false,
    expiredLoading: false,
    usersWithSubscriptionsLoading: false,
    usersLoading: false,
    paymentsLoading: false,
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

export const deletePackage = createAsyncThunk(
    "admin/deletePackage",
    async (packageId: string, { rejectWithValue, dispatch }) => {
        try {
            await api.delete(`/admin/packages/${packageId}`);
            await dispatch(fetchPackages());
            return packageId;
        } catch (error: any) {
            return rejectWithValue(error.response?.data?.error ?? error.response?.data?.message ?? "Failed to delete package");
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

export const fetchUsersWithSubscriptions = createAsyncThunk(
    "admin/fetchUsersWithSubscriptions",
    async (
        { limit = 50, nextToken }: { limit?: number; nextToken?: string | null } = {},
        { rejectWithValue }
    ) => {
        try {
            const params = new URLSearchParams();
            if (limit) params.set("limit", String(limit));
            if (nextToken) params.set("nextToken", nextToken);
            const response = await api.get(`/admin/users/subscriptions?${params.toString()}`);
            return {
                items: (response.data.items ?? []) as AdminUserWithSubscription[],
                nextToken: response.data.nextToken ?? null,
                append: !!nextToken,
            };
        } catch (error: any) {
            return rejectWithValue(
                error.response?.data?.error ??
                    error.response?.data?.message ??
                    "Failed to fetch users with subscriptions"
            );
        }
    }
);

export const fetchUsers = createAsyncThunk(
    "admin/fetchUsers",
    async (
        { limit = 50, nextToken }: { limit?: number; nextToken?: string | null } = {},
        { rejectWithValue }
    ) => {
        try {
            const params = new URLSearchParams();
            if (limit) params.set("limit", String(limit));
            if (nextToken) params.set("nextToken", nextToken);
            const response = await api.get(`/admin/users?${params.toString()}`);
            return {
                users: (response.data.users ?? []) as AdminUser[],
                nextToken: response.data.nextToken ?? null,
                append: !!nextToken,
            };
        } catch (error: any) {
            return rejectWithValue(
                error.response?.data?.error ??
                    error.response?.data?.message ??
                    "Failed to fetch users"
            );
        }
    }
);

export const fetchPayments = createAsyncThunk(
    "admin/fetchPayments",
    async (
        { limit = 50, nextToken }: { limit?: number; nextToken?: string | null } = {},
        { rejectWithValue }
    ) => {
        try {
            const params = new URLSearchParams();
            if (limit) params.set("limit", String(limit));
            if (nextToken) params.set("nextToken", nextToken);
            const response = await api.get(`/admin/payments?${params.toString()}`);
            return {
                payments: (response.data.payments ?? []) as Payment[],
                nextToken: response.data.nextToken ?? null,
                append: !!nextToken,
            };
        } catch (error: any) {
            return rejectWithValue(error.response?.data?.error ?? error.response?.data?.message ?? "Failed to fetch payments");
        }
    }
);

export const approveUser = createAsyncThunk(
    "admin/approveUser",
    async (
        { userId, trialDays }: { userId: string; trialDays?: number },
        { rejectWithValue, dispatch }
    ) => {
        try {
            const body: { userId: string; trialDays?: number } = { userId };
            if (trialDays != null) body.trialDays = trialDays;
            const response = await api.post("/admin/approve", body);
            dispatch(fetchPendingApprovals());
            return response.data;
        } catch (error: any) {
            return rejectWithValue(error.response?.data?.error ?? error.response?.data?.message ?? "Failed to approve user");
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
        clearUsersWithSubscriptions: (state) => {
            state.usersWithSubscriptions = [];
            state.usersWithSubscriptionsNextToken = null;
        },
        clearUsers: (state) => {
            state.users = [];
            state.usersNextToken = null;
        },
        clearPaymentsList: (state) => {
            state.payments = [];
            state.paymentsNextToken = null;
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
            .addCase(fetchUsersWithSubscriptions.pending, (state) => {
                state.usersWithSubscriptionsLoading = true;
                state.error = null;
            })
            .addCase(fetchUsersWithSubscriptions.fulfilled, (state, action) => {
                state.usersWithSubscriptionsLoading = false;
                state.usersWithSubscriptions = action.payload.append
                    ? [...state.usersWithSubscriptions, ...action.payload.items]
                    : action.payload.items;
                state.usersWithSubscriptionsNextToken = action.payload.nextToken;
            })
            .addCase(fetchUsersWithSubscriptions.rejected, (state, action) => {
                state.usersWithSubscriptionsLoading = false;
                state.error = action.payload as string;
            })
            .addCase(fetchUsers.pending, (state) => {
                state.usersLoading = true;
                state.error = null;
            })
            .addCase(fetchUsers.fulfilled, (state, action) => {
                state.usersLoading = false;
                state.users = action.payload.append
                    ? [...state.users, ...action.payload.users]
                    : action.payload.users;
                state.usersNextToken = action.payload.nextToken;
            })
            .addCase(fetchUsers.rejected, (state, action) => {
                state.usersLoading = false;
                state.error = action.payload as string;
            })
            .addCase(approveUser.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(approveUser.fulfilled, (state) => {
                state.loading = false;
            })
            .addCase(approveUser.rejected, (state, action) => {
                state.loading = false;
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
            })
            .addCase(fetchPayments.pending, (state) => {
                state.paymentsLoading = true;
                state.error = null;
            })
            .addCase(fetchPayments.fulfilled, (state, action) => {
                state.paymentsLoading = false;
                state.payments = action.payload.append
                    ? [...state.payments, ...action.payload.payments]
                    : action.payload.payments;
                state.paymentsNextToken = action.payload.nextToken;
            })
            .addCase(fetchPayments.rejected, (state, action) => {
                state.paymentsLoading = false;
                state.error = action.payload as string;
            });
    },
});

export const { clearExpiredTrialList, clearUsersWithSubscriptions, clearUsers, clearPaymentsList } =
    adminSlice.actions;
export default adminSlice.reducer;
