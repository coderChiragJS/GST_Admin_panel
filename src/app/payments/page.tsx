"use client";

import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
    fetchPayments,
    clearPaymentsList,
} from "@/store/slices/adminSlice";
import { AppDispatch, RootState } from "@/store/store";
import {
    CreditCard,
    Loader2,
    AlertCircle,
    IndianRupee,
    CheckCircle2,
    XCircle,
    Clock,
    ChevronDown,
} from "lucide-react";
import { cn } from "@/lib/utils";

export default function PaymentsPage() {
    const dispatch = useDispatch<AppDispatch>();
    const {
        payments,
        paymentsNextToken,
        paymentsLoading,
        error,
    } = useSelector((state: RootState) => state.admin);

    useEffect(() => {
        dispatch(clearPaymentsList());
        dispatch(fetchPayments({ limit: 50 }));
    }, [dispatch]);

    const loadMore = () => {
        if (paymentsNextToken && !paymentsLoading) {
            dispatch(
                fetchPayments({
                    limit: 50,
                    nextToken: paymentsNextToken,
                })
            );
        }
    };

    return (
        <div className="space-y-8 animate-in fade-in duration-700">
            <header>
                <h1 className="text-3xl font-bold tracking-tight italic">Payment details</h1>
                <p className="mt-1 text-muted-foreground italic">
                    All payment orders (pending, completed, failed). Reconcile with gateway using transaction IDs.
                </p>
            </header>

            {error && (
                <div className="flex items-center gap-3 rounded-xl bg-destructive/10 p-4 text-sm text-destructive border border-destructive/20">
                    <AlertCircle className="h-5 w-5 shrink-0" />
                    <p>{error}</p>
                </div>
            )}

            <div className="glass overflow-hidden rounded-3xl border border-border">
                {paymentsLoading && payments.length === 0 ? (
                    <div className="flex h-64 items-center justify-center">
                        <Loader2 className="h-10 w-10 animate-spin text-primary" />
                    </div>
                ) : payments.length === 0 ? (
                    <div className="flex flex-col items-center justify-center py-16 text-center">
                        <CreditCard className="mb-4 h-12 w-12 text-muted-foreground/40" />
                        <h3 className="text-lg font-semibold italic">No payments yet</h3>
                        <p className="text-muted-foreground italic">Payment orders will appear here when users initiate payment.</p>
                    </div>
                ) : (
                    <>
                        <div className="overflow-x-auto">
                            <table className="w-full text-left">
                                <thead>
                                    <tr className="border-b border-border bg-muted/30 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                                        <th className="px-6 py-4">Order ID</th>
                                        <th className="px-6 py-4">User ID</th>
                                        <th className="px-6 py-4">Amount</th>
                                        <th className="px-6 py-4">Status</th>
                                        <th className="px-6 py-4">Transaction ID</th>
                                        <th className="px-6 py-4">Created</th>
                                        <th className="px-6 py-4">Updated</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-border">
                                    {payments.map((p) => {
                                        const orderId = p.orderId || p.merchantOrderId || "—";
                                        const amountInPaise = p.amountPaise ?? p.amount ?? 0;
                                        const transactionId = p.transactionId || p.phonePeOrderId || p.gatewayRef || "—";
                                        
                                        return (
                                        <tr
                                            key={orderId}
                                            className="transition-colors hover:bg-muted/50"
                                        >
                                            <td
                                                className="px-6 py-4 font-mono text-xs truncate max-w-[160px]"
                                                title={orderId}
                                            >
                                                {orderId}
                                            </td>
                                            <td className="px-6 py-4 font-mono text-xs truncate max-w-[140px]" title={p.userId}>
                                                {p.userId}
                                            </td>
                                            <td className="px-6 py-4">
                                                <div className="flex items-center gap-1">
                                                    <IndianRupee className="h-3.5 w-3.5 text-muted-foreground" />
                                                    <span className="font-semibold">
                                                        {(amountInPaise / 100).toFixed(2)}
                                                    </span>
                                                    <span className="text-muted-foreground text-xs">
                                                        {p.currency || "INR"}
                                                    </span>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4">
                                                <span
                                                    className={cn(
                                                        "inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-xs font-medium",
                                                        (p.status === "completed" || p.status === "SUCCESS") && "bg-emerald-500/10 text-emerald-500",
                                                        (p.status === "pending" || p.status === "PENDING") && "bg-amber-500/10 text-amber-500",
                                                        (p.status === "failed" || p.status === "FAILED") && "bg-rose-500/10 text-rose-500"
                                                    )}
                                                >
                                                    {(p.status === "completed" || p.status === "SUCCESS") && <CheckCircle2 className="h-3.5 w-3.5" />}
                                                    {(p.status === "failed" || p.status === "FAILED") && <XCircle className="h-3.5 w-3.5" />}
                                                    {(p.status === "pending" || p.status === "PENDING") && <Clock className="h-3.5 w-3.5" />}
                                                    {p.status}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4 font-mono text-xs truncate max-w-[180px]" title={transactionId}>
                                                {transactionId}
                                            </td>
                                            <td className="px-6 py-4 text-sm text-muted-foreground">
                                                {new Date(p.createdAt).toLocaleString()}
                                            </td>
                                            <td className="px-6 py-4 text-sm text-muted-foreground">
                                                {new Date(p.updatedAt).toLocaleString()}
                                            </td>
                                        </tr>
                                        );
                                    })}
                                </tbody>
                            </table>
                        </div>
                        {paymentsNextToken && (
                            <div className="border-t border-border p-4 flex justify-center">
                                <button
                                    onClick={loadMore}
                                    disabled={paymentsLoading}
                                    className="flex items-center gap-2 rounded-xl border border-border bg-background px-6 py-2 text-sm font-medium hover:bg-muted disabled:opacity-50"
                                >
                                    {paymentsLoading ? (
                                        <Loader2 className="h-4 w-4 animate-spin" />
                                    ) : (
                                        <ChevronDown className="h-4 w-4" />
                                    )}
                                    Load more
                                </button>
                            </div>
                        )}
                    </>
                )}
            </div>
        </div>
    );
}
