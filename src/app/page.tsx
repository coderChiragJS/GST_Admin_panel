"use client";

import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import Link from "next/link";
import {
    fetchPendingApprovals,
    fetchTrialDays,
    fetchExpiredTrialUsers,
} from "@/store/slices/adminSlice";
import { AppDispatch, RootState } from "@/store/store";
import {
    Clock,
    UserX,
    Settings,
    ArrowUpRight,
    Loader2,
} from "lucide-react";
import { DashboardCard } from "@/components/DashboardCard";

export default function Home() {
    const dispatch = useDispatch<AppDispatch>();
    const {
        pendingApprovals,
        trialDays,
        expiredTrialUsers,
        loading,
        settingsLoading,
        expiredLoading,
    } = useSelector((state: RootState) => state.admin);

    useEffect(() => {
        dispatch(fetchPendingApprovals());
        dispatch(fetchTrialDays());
        dispatch(fetchExpiredTrialUsers({ limit: 50 }));
    }, [dispatch]);

    const loadingStats = loading || settingsLoading || expiredLoading;

    return (
        <div className="space-y-8 animate-in fade-in duration-700">
            <header>
                <h1 className="text-3xl font-bold tracking-tight italic">Dashboard</h1>
                <p className="mt-1 text-muted-foreground italic">Overview of admin tasks and settings.</p>
            </header>

            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                <Link href="/pending">
                    <DashboardCard
                        title="Pending approvals"
                        value={loadingStats ? "—" : String(pendingApprovals.length)}
                        description="Businesses awaiting approval"
                        icon={Clock}
                        className="transition-all hover:shadow-lg hover:border-primary/20 cursor-pointer"
                    />
                </Link>
                <Link href="/expired-trials">
                    <DashboardCard
                        title="Expired trials"
                        value={loadingStats ? "—" : String(expiredTrialUsers.length)}
                        description="Users with trial ended"
                        icon={UserX}
                        className="transition-all hover:shadow-lg hover:border-primary/20 cursor-pointer"
                    />
                </Link>
                <div className="flex items-center gap-3 rounded-2xl border border-border bg-card/40 glass p-6">
                    <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10 text-primary">
                        <Settings className="h-6 w-6" />
                    </div>
                    <div>
                        <p className="text-sm font-medium text-muted-foreground italic">Default trial days</p>
                        <p className="text-2xl font-bold italic">
                            {settingsLoading ? <Loader2 className="h-6 w-6 animate-spin" /> : trialDays ?? "—"}
                        </p>
                        <Link
                            href="/settings"
                            className="mt-1 inline-flex items-center gap-1 text-sm font-medium text-primary hover:underline"
                        >
                            Edit in Settings
                            <ArrowUpRight className="h-3.5 w-3.5" />
                        </Link>
                    </div>
                </div>
            </div>

            <div className="glass rounded-2xl border border-border p-6">
                <h2 className="text-lg font-semibold italic mb-2">Quick actions</h2>
                <div className="flex flex-wrap gap-3">
                    <Link
                        href="/pending"
                        className="inline-flex items-center gap-2 rounded-xl border border-border bg-background px-4 py-2 text-sm font-medium hover:bg-muted"
                    >
                        <Clock className="h-4 w-4" />
                        Pending reviews
                    </Link>
                    <Link
                        href="/packages"
                        className="inline-flex items-center gap-2 rounded-xl border border-border bg-background px-4 py-2 text-sm font-medium hover:bg-muted"
                    >
                        Manage packages
                    </Link>
                    <Link
                        href="/expired-trials"
                        className="inline-flex items-center gap-2 rounded-xl border border-border bg-background px-4 py-2 text-sm font-medium hover:bg-muted"
                    >
                        <UserX className="h-4 w-4" />
                        Expired trials
                    </Link>
                    <Link
                        href="/settings"
                        className="inline-flex items-center gap-2 rounded-xl border border-border bg-background px-4 py-2 text-sm font-medium hover:bg-muted"
                    >
                        <Settings className="h-4 w-4" />
                        Trial days
                    </Link>
                </div>
            </div>
        </div>
    );
}
