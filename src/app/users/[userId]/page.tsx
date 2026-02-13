"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { useDispatch, useSelector } from "react-redux";
import { fetchUsers, AdminUser } from "@/store/slices/adminSlice";
import { AppDispatch, RootState } from "@/store/store";
import {
    Loader2,
    AlertCircle,
    User,
    Building2,
    BadgeCheck,
    ArrowLeft,
    Calendar,
    Mail,
    ShieldCheck,
    Package,
    FileText,
    Quote,
    CreditCard,
} from "lucide-react";
import { cn } from "@/lib/utils";

export default function UserDetailPage() {
    const params = useParams();
    const router = useRouter();
    const dispatch = useDispatch<AppDispatch>();
    const { users, usersLoading } = useSelector((state: RootState) => state.admin);
    const [user, setUser] = useState<AdminUser | null>(null);
    const [loading, setLoading] = useState(true);

    const userId = params.userId as string;

    useEffect(() => {
        // First check if user is in the store
        const existingUser = users.find((u) => u.userId === userId);
        if (existingUser) {
            setUser(existingUser);
            setLoading(false);
        } else if (!usersLoading) {
            // If not in store and not loading, fetch users
            dispatch(fetchUsers({ limit: 100 })).then((result: any) => {
                if (result.payload?.users) {
                    const foundUser = result.payload.users.find((u: AdminUser) => u.userId === userId);
                    setUser(foundUser || null);
                }
                setLoading(false);
            });
        }
    }, [userId, users, usersLoading, dispatch]);

    if (loading || usersLoading) {
        return (
            <div className="flex h-screen items-center justify-center">
                <Loader2 className="h-10 w-10 animate-spin text-primary" />
            </div>
        );
    }

    if (!user) {
        return (
            <div className="space-y-8 animate-in fade-in duration-700">
                <button
                    onClick={() => router.push("/users")}
                    className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors"
                >
                    <ArrowLeft className="h-4 w-4" />
                    Back to users
                </button>
                <div className="flex flex-col items-center justify-center py-16 text-center">
                    <AlertCircle className="mb-4 h-12 w-12 text-destructive/40" />
                    <h3 className="text-lg font-semibold italic">User not found</h3>
                    <p className="text-muted-foreground italic">
                        The user you're looking for doesn't exist.
                    </p>
                </div>
            </div>
        );
    }

    const {
        name,
        email,

        approvalStatus,
        subscriptionActive,
        hasPurchasedPackage,
        businesses,
        subscription,
        remainingInvoices,
        remainingQuotations,
        subscriptionsByBusiness,
    } = user;

    return (
        <div className="space-y-8 animate-in fade-in duration-700">
            {/* Header */}
            <div>
                <button
                    onClick={() => router.push("/users")}
                    className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors mb-4"
                >
                    <ArrowLeft className="h-4 w-4" />
                    Back to users
                </button>
                <div className="flex items-start justify-between">
                    <div>
                        <h1 className="text-3xl font-bold tracking-tight italic">{name || "—"}</h1>
                        <p className="mt-1 text-muted-foreground italic flex items-center gap-2">
                            <Mail className="h-4 w-4" />
                            {email}
                        </p>
                    </div>
                    <div className="flex flex-wrap gap-2">
                        {approvalStatus && (
                            <span className="inline-flex items-center gap-1 rounded-full bg-emerald-500/10 px-3 py-1 text-xs font-semibold text-emerald-600">
                                <BadgeCheck className="h-3.5 w-3.5" />
                                {approvalStatus}
                            </span>
                        )}
                        {subscriptionActive && (
                            <span className="inline-flex items-center gap-1 rounded-full bg-blue-500/10 px-3 py-1 text-xs font-semibold text-blue-600">
                                <Package className="h-3.5 w-3.5" />
                                Active subscription
                            </span>
                        )}
                        {hasPurchasedPackage && (
                            <span className="inline-flex items-center gap-1 rounded-full bg-purple-500/10 px-3 py-1 text-xs font-semibold text-purple-600">
                                <CreditCard className="h-3.5 w-3.5" />
                                Purchased package
                            </span>
                        )}
                    </div>
                </div>
            </div>

            {/* Profile Information Card */}
            <div className="glass rounded-3xl border border-border p-6">
                <h2 className="text-lg font-semibold mb-4 italic flex items-center gap-2">
                    <User className="h-5 w-5 text-primary" />
                    Profile Information
                </h2>
                <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">



                </div>
            </div>

            {/* Businesses Card */}
            <div className="glass rounded-3xl border border-border p-6">
                <h2 className="text-lg font-semibold mb-4 italic flex items-center gap-2">
                    <Building2 className="h-5 w-5 text-primary" />
                    Businesses ({businesses.length})
                </h2>
                {businesses.length === 0 ? (
                    <p className="text-sm text-muted-foreground italic py-8 text-center">
                        No businesses registered yet.
                    </p>
                ) : (
                    <div className="grid gap-4 md:grid-cols-2">
                        {businesses.map((b) => (
                            <div
                                key={b.businessId}
                                className="rounded-2xl border border-border/60 bg-background/60 p-4 space-y-3"
                            >
                                <div className="flex items-start justify-between gap-2">
                                    <div className="flex-1">
                                        <div className="font-semibold text-base">{b.firmName}</div>
                                        <div className="text-xs text-muted-foreground font-mono mt-1">
                                            {b.gstNumber}
                                        </div>
                                    </div>
                                    <span
                                        className={cn(
                                            "inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium",
                                            b.approvalStatus === "APPROVED" &&
                                            "bg-emerald-500/10 text-emerald-600",
                                            b.approvalStatus === "PENDING" &&
                                            "bg-amber-500/10 text-amber-600",
                                            b.approvalStatus === "REJECTED" &&
                                            "bg-rose-500/10 text-rose-600"
                                        )}
                                    >
                                        {b.approvalStatus}
                                    </span>
                                </div>
                                {b.isActive !== undefined && (
                                    <div className="flex items-center gap-2 text-xs text-muted-foreground">
                                        <ShieldCheck className="h-3.5 w-3.5" />
                                        Status: {b.isActive ? "Active" : "Inactive"}
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>
                )}
            </div>

            {/* Subscription Card */}
            <div className="glass rounded-3xl border border-border p-6">
                <h2 className="text-lg font-semibold mb-4 italic flex items-center gap-2">
                    <Package className="h-5 w-5 text-primary" />
                    Subscription Details
                </h2>
                {!subscription ? (
                    <div className="text-center py-8">
                        <Package className="h-12 w-12 text-muted-foreground/40 mx-auto mb-3" />
                        <p className="text-sm text-muted-foreground italic">
                            No active subscription for this user.
                        </p>
                    </div>
                ) : (
                    <div className="space-y-6">
                        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                            <div className="space-y-1">
                                <div className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                                    Package Name
                                </div>
                                <div className="text-base font-semibold">{subscription.packageName}</div>
                            </div>

                            <div className="space-y-1">
                                <div className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                                    Start Date
                                </div>
                                <div className="text-sm">
                                    {new Date(subscription.startDate).toLocaleDateString()}
                                </div>
                            </div>
                        </div>

                        <div className="grid gap-4 md:grid-cols-2 pt-4 border-t border-border">
                            <div className="rounded-2xl border border-border/60 bg-background/60 p-4">
                                <div className="flex items-center gap-2 mb-3">
                                    <FileText className="h-4 w-4 text-primary" />
                                    <div className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                                        Invoices
                                    </div>
                                </div>
                                <div className="space-y-2">
                                    <div className="flex justify-between text-sm">
                                        <span className="text-muted-foreground">Used:</span>
                                        <span className="font-semibold">{subscription.invoicesUsed}</span>
                                    </div>
                                    <div className="flex justify-between text-sm">
                                        <span className="text-muted-foreground">Limit:</span>
                                        <span className="font-semibold">{subscription.invoiceLimit}</span>
                                    </div>
                                    <div className="flex justify-between text-sm pt-2 border-t border-border">
                                        <span className="text-muted-foreground">Remaining:</span>
                                        <span className="font-bold text-primary">{remainingInvoices}</span>
                                    </div>
                                </div>
                            </div>

                            <div className="rounded-2xl border border-border/60 bg-background/60 p-4">
                                <div className="flex items-center gap-2 mb-3">
                                    <Quote className="h-4 w-4 text-primary" />
                                    <div className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                                        Quotations
                                    </div>
                                </div>
                                <div className="space-y-2">
                                    <div className="flex justify-between text-sm">
                                        <span className="text-muted-foreground">Used:</span>
                                        <span className="font-semibold">{subscription.quotationsUsed}</span>
                                    </div>
                                    <div className="flex justify-between text-sm">
                                        <span className="text-muted-foreground">Limit:</span>
                                        <span className="font-semibold">{subscription.quotationLimit}</span>
                                    </div>
                                    <div className="flex justify-between text-sm pt-2 border-t border-border">
                                        <span className="text-muted-foreground">Remaining:</span>
                                        <span className="font-bold text-primary">{remainingQuotations}</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                )}
            </div>

            {/* Subscriptions by Business */}
            <div className="glass rounded-3xl border border-border p-6">
                <h2 className="text-lg font-semibold mb-4 italic flex items-center gap-2">
                    <Building2 className="h-5 w-5 text-primary" />
                    Subscriptions by Business
                </h2>
                {!subscriptionsByBusiness || subscriptionsByBusiness.length === 0 ? (
                    <p className="text-sm text-muted-foreground italic py-4">
                        No active package for any business.
                    </p>
                ) : (
                    <div className="grid gap-4 md:grid-cols-2">
                        {subscriptionsByBusiness.map((sub) => {
                            const business = businesses.find(
                                (b) =>
                                    (sub.businessId && b.businessId === sub.businessId) ||
                                    (sub.gstNumber && b.gstNumber === sub.gstNumber)
                            );

                            const businessLabel = business
                                ? `${business.firmName || "—"}${business.gstNumber ? ` (${business.gstNumber})` : ""}`
                                : sub.gstNumber
                                    ? `GST: ${sub.gstNumber}`
                                    : sub.businessId
                                        ? `Business ID: ${sub.businessId}`
                                        : "Unknown business";

                            const remainingInvoicesForBusiness = Math.max(
                                (sub.invoiceLimit ?? 0) - (sub.invoicesUsed ?? 0),
                                0
                            );
                            const remainingQuotationsForBusiness = Math.max(
                                (sub.quotationLimit ?? 0) - (sub.quotationsUsed ?? 0),
                                0
                            );

                            return (
                                <div
                                    key={sub.subscriptionId}
                                    className="rounded-2xl border border-border/60 bg-background/60 p-4 space-y-3"
                                >
                                    <div className="flex items-start justify-between gap-2">
                                        <div className="flex items-start gap-2">
                                            <Building2 className="h-4 w-4 text-primary mt-0.5" />
                                            <div>
                                                <div className="font-semibold text-sm">{businessLabel}</div>
                                                <div className="text-xs text-muted-foreground mt-0.5">
                                                    Package: <span className="font-medium">{sub.packageName}</span>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="grid grid-cols-2 gap-3 text-xs">
                                        <div className="space-y-1">
                                            <div className="flex items-center gap-1 text-muted-foreground">
                                                <FileText className="h-3.5 w-3.5" />
                                                <span className="font-semibold">Invoices</span>
                                            </div>
                                            <div className="flex justify-between">
                                                <span className="text-muted-foreground">Limit:</span>
                                                <span className="font-medium">{sub.invoiceLimit}</span>
                                            </div>
                                            <div className="flex justify-between">
                                                <span className="text-muted-foreground">Used:</span>
                                                <span className="font-medium">{sub.invoicesUsed}</span>
                                            </div>
                                            <div className="flex justify-between pt-1 border-t border-border text-primary font-semibold">
                                                <span>Remaining:</span>
                                                <span>{remainingInvoicesForBusiness}</span>
                                            </div>
                                        </div>
                                        <div className="space-y-1">
                                            <div className="flex items-center gap-1 text-muted-foreground">
                                                <Quote className="h-3.5 w-3.5" />
                                                <span className="font-semibold">Quotations</span>
                                            </div>
                                            <div className="flex justify-between">
                                                <span className="text-muted-foreground">Limit:</span>
                                                <span className="font-medium">{sub.quotationLimit}</span>
                                            </div>
                                            <div className="flex justify-between">
                                                <span className="text-muted-foreground">Used:</span>
                                                <span className="font-medium">{sub.quotationsUsed}</span>
                                            </div>
                                            <div className="flex justify-between pt-1 border-t border-border text-primary font-semibold">
                                                <span>Remaining:</span>
                                                <span>{remainingQuotationsForBusiness}</span>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="text-[11px] text-muted-foreground flex items-center gap-1">
                                        <Calendar className="h-3 w-3" />
                                        <span>
                                            Started on{" "}
                                            {new Date(sub.startDate).toLocaleDateString()}
                                        </span>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                )}
            </div>
        </div>
    );
}
