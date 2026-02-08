"use client";

import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
    fetchExpiredTrialUsers,
    clearExpiredTrialList,
} from "@/store/slices/adminSlice";
import { AppDispatch, RootState } from "@/store/store";
import {
    UserX,
    Loader2,
    AlertCircle,
    Mail,
    Calendar,
    User,
    ChevronDown,
} from "lucide-react";

export default function ExpiredTrialsPage() {
    const dispatch = useDispatch<AppDispatch>();
    const {
        expiredTrialUsers,
        expiredTrialNextToken,
        expiredLoading,
        error,
    } = useSelector((state: RootState) => state.admin);

    useEffect(() => {
        dispatch(clearExpiredTrialList());
        dispatch(fetchExpiredTrialUsers({ limit: 50 }));
    }, [dispatch]);

    const loadMore = () => {
        if (expiredTrialNextToken && !expiredLoading) {
            dispatch(
                fetchExpiredTrialUsers({
                    limit: 50,
                    nextToken: expiredTrialNextToken,
                })
            );
        }
    };

    return (
        <div className="space-y-8 animate-in fade-in duration-700">
            <header>
                <h1 className="text-3xl font-bold tracking-tight italic">Expired trials</h1>
                <p className="mt-1 text-muted-foreground italic">
                    Users whose trial has ended. Use for follow-up or upsell.
                </p>
            </header>

            {error && (
                <div className="flex items-center gap-3 rounded-xl bg-destructive/10 p-4 text-sm text-destructive border border-destructive/20">
                    <AlertCircle className="h-5 w-5 shrink-0" />
                    <p>{error}</p>
                </div>
            )}

            <div className="glass overflow-hidden rounded-3xl border border-border">
                {expiredLoading && expiredTrialUsers.length === 0 ? (
                    <div className="flex h-64 items-center justify-center">
                        <Loader2 className="h-10 w-10 animate-spin text-primary" />
                    </div>
                ) : expiredTrialUsers.length === 0 ? (
                    <div className="flex flex-col items-center justify-center py-16 text-center">
                        <UserX className="mb-4 h-12 w-12 text-muted-foreground/40" />
                        <h3 className="text-lg font-semibold italic">No expired trials</h3>
                        <p className="text-muted-foreground italic">No users with expired trials right now.</p>
                    </div>
                ) : (
                    <>
                        <div className="overflow-x-auto">
                            <table className="w-full text-left">
                                <thead>
                                    <tr className="border-b border-border bg-muted/30 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                                        <th className="px-6 py-4">Name</th>
                                        <th className="px-6 py-4">Email</th>
                                        <th className="px-6 py-4">Trial start</th>
                                        <th className="px-6 py-4">Trial end</th>
                                        <th className="px-6 py-4">Created</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-border">
                                    {expiredTrialUsers.map((u) => (
                                        <tr key={u.userId} className="transition-colors hover:bg-muted/50">
                                            <td className="px-6 py-4">
                                                <div className="flex items-center gap-2">
                                                    <User className="h-4 w-4 text-muted-foreground" />
                                                    <span className="font-medium italic">{u.name}</span>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4">
                                                <div className="flex items-center gap-2 text-sm">
                                                    <Mail className="h-3.5 w-3.5 text-muted-foreground" />
                                                    {u.email}
                                                </div>
                                            </td>
                                            <td className="px-6 py-4 text-sm text-muted-foreground">
                                                <div className="flex items-center gap-1">
                                                    <Calendar className="h-3.5 w-3.5" />
                                                    {new Date(u.trialStartDate).toLocaleDateString()}
                                                </div>
                                            </td>
                                            <td className="px-6 py-4 text-sm font-medium">
                                                {new Date(u.trialEndDate).toLocaleDateString()}
                                            </td>
                                            <td className="px-6 py-4 text-sm text-muted-foreground">
                                                {new Date(u.createdAt).toLocaleDateString()}
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                        {expiredTrialNextToken && (
                            <div className="border-t border-border p-4 flex justify-center">
                                <button
                                    onClick={loadMore}
                                    disabled={expiredLoading}
                                    className="flex items-center gap-2 rounded-xl border border-border bg-background px-6 py-2 text-sm font-medium hover:bg-muted disabled:opacity-50"
                                >
                                    {expiredLoading ? (
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
