"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useDispatch, useSelector } from "react-redux";
import {
    fetchUsers,
    clearUsers,
    AdminUser,
} from "@/store/slices/adminSlice";
import { AppDispatch, RootState } from "@/store/store";
import { Loader2, AlertCircle, User, Building2, BadgeCheck, ChevronRight } from "lucide-react";

export default function UsersPage() {
    const router = useRouter();
    const dispatch = useDispatch<AppDispatch>();
    const {
        users,
        usersNextToken,
        usersLoading,
        error,
    } = useSelector((state: RootState) => state.admin as any);

    useEffect(() => {
        dispatch(clearUsers());
        dispatch(fetchUsers({ limit: 50 }));
    }, [dispatch]);

    const loadMore = () => {
        if (usersNextToken && !usersLoading) {
            dispatch(
                fetchUsers({
                    limit: 50,
                    nextToken: usersNextToken,
                })
            );
        }
    };

    const renderSubscriptionCell = (user: AdminUser) => {
        if (!user.subscription) {
            return (
                <span className="inline-flex items-center rounded-full bg-muted px-2.5 py-0.5 text-xs font-medium text-muted-foreground">
                    No active subscription
                </span>
            );
        }

        const s = user.subscription;
        const subsByBusiness = user.subscriptionsByBusiness ?? [];

        return (
            <div className="space-y-1 text-xs">
                <div className="font-semibold">{s.packageName}</div>
                <div className="text-muted-foreground">
                    Trial: {new Date(user.trialStartDate).toLocaleDateString()} - {new Date(user.trialEndDate).toLocaleDateString()}
                </div>
                <div className="text-muted-foreground">
                    Remaining: {user.remainingInvoices} inv / {user.remainingQuotations} quotes
                </div>
                {subsByBusiness.length > 0 && (
                    <div className="mt-1 space-y-0.5">
                        {subsByBusiness.slice(0, 2).map((sub) => {
                            const business = user.businesses.find(
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
                                    className="flex items-center justify-between gap-2 text-[11px] text-muted-foreground"
                                >
                                    <span className="truncate max-w-[180px]">{businessLabel}</span>
                                    <span className="whitespace-nowrap">
                                        {remainingInvoicesForBusiness} inv / {remainingQuotationsForBusiness} quotes
                                    </span>
                                </div>
                            );
                        })}
                        {subsByBusiness.length > 2 && (
                            <div className="text-[10px] text-muted-foreground">
                                +{subsByBusiness.length - 2} more businesses
                            </div>
                        )}
                    </div>
                )}
            </div>
        );
    };


    return (
        <div className="space-y-8 animate-in fade-in duration-700">
            <header>
                <h1 className="text-3xl font-bold tracking-tight italic">Users & subscriptions</h1>
                <p className="mt-1 text-muted-foreground italic">
                    Users with their businesses and current subscription status.
                </p>
            </header>

            {error && (
                <div className="flex items-center gap-3 rounded-xl bg-destructive/10 p-4 text-sm text-destructive border border-destructive/20">
                    <AlertCircle className="h-5 w-5 shrink-0" />
                    <p>{error}</p>
                </div>
            )}

            <div className="glass overflow-hidden rounded-3xl border border-border">
                {usersLoading && users.length === 0 ? (
                    <div className="flex h-64 items-center justify-center">
                        <Loader2 className="h-10 w-10 animate-spin text-primary" />
                    </div>
                ) : users.length === 0 ? (
                    <div className="flex flex-col items-center justify-center py-16 text-center">
                        <User className="mb-4 h-12 w-12 text-muted-foreground/40" />
                        <h3 className="text-lg font-semibold italic">No users found</h3>
                        <p className="text-muted-foreground italic">
                            Users will appear here as they sign up and are approved.
                        </p>
                    </div>
                ) : (
                    <>
                        <div className="overflow-x-auto">
                            <table className="w-full text-left">
                                <thead>
                                    <tr className="border-b border-border bg-muted/30 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                                        <th className="px-6 py-4">User</th>
                                        <th className="px-6 py-4">Businesses</th>
                                        <th className="px-6 py-4">Subscription</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-border">
                                    {users.map((user: AdminUser) => (
                                        <tr
                                            key={user.userId}
                                            className="transition-colors hover:bg-muted/50 cursor-pointer"
                                            onClick={() => router.push(`/users/${user.userId}`)}
                                        >
                                            <td className="px-6 py-4 align-top">
                                                <div className="flex items-start gap-2">
                                                    <div className="mt-0.5">
                                                        <User className="h-4 w-4 text-primary" />
                                                    </div>
                                                    <div>
                                                        <div className="font-semibold italic">
                                                            {user.name || "—"}
                                                        </div>
                                                        <div className="text-xs text-muted-foreground">
                                                            {user.email}
                                                        </div>
                                                        <div className="mt-1 text-[11px] text-muted-foreground">
                                                            {user.approvalStatus && (
                                                                <span className="inline-flex items-center gap-1 rounded-full bg-emerald-500/5 px-2 py-0.5 text-[10px] font-semibold text-emerald-600">
                                                                    <BadgeCheck className="h-3 w-3" />
                                                                    {user.approvalStatus}
                                                                </span>
                                                            )}
                                                        </div>
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4 align-top text-xs text-muted-foreground">
                                                {user.businesses.length === 0 ? (
                                                    <span>—</span>
                                                ) : (
                                                    <div className="space-y-1">
                                                        {user.businesses.slice(0, 2).map((b) => (
                                                            <div
                                                                key={b.businessId}
                                                                className="flex items-center gap-2"
                                                            >
                                                                <Building2 className="h-3.5 w-3.5 text-primary" />
                                                                <span className="font-medium text-foreground">
                                                                    {b.firmName}
                                                                </span>
                                                                <span className="text-[11px] text-muted-foreground">
                                                                    {b.gstNumber}
                                                                </span>
                                                            </div>
                                                        ))}
                                                        {user.businesses.length > 2 && (
                                                            <div className="text-[11px] text-muted-foreground">
                                                                +{user.businesses.length - 2} more
                                                            </div>
                                                        )}
                                                    </div>
                                                )}
                                            </td>
                                            <td className="px-6 py-4 align-top">
                                                <div className="flex items-center justify-between gap-2">
                                                    <div className="flex-1">
                                                        {renderSubscriptionCell(user)}
                                                    </div>
                                                    <ChevronRight className="h-4 w-4 text-muted-foreground" />
                                                </div>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                        {usersNextToken && (
                            <div className="border-t border-border p-4 flex justify-center">
                                <button
                                    onClick={loadMore}
                                    disabled={usersLoading}
                                    className="flex items-center gap-2 rounded-xl border border-border bg-background px-6 py-2 text-sm font-medium hover:bg-muted disabled:opacity-50"
                                >
                                    {usersLoading ? (
                                        <Loader2 className="h-4 w-4 animate-spin" />
                                    ) : (
                                        "Load more"
                                    )}
                                </button>
                            </div>
                        )}
                    </>
                )}
            </div>
        </div>
    );
}

