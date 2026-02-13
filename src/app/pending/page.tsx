"use client";

import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchPendingApprovals, approveBusiness, approveUser } from "@/store/slices/adminSlice";
import { AppDispatch, RootState } from "@/store/store";
import {
    User,
    Building2,
    Mail,
    Phone,
    MapPin,
    Calendar,
    BadgeCheck,
    Clock,
    Loader2,
    AlertCircle,
    X,
    Fingerprint,
    Info,
    UserCheck,
    Building
} from "lucide-react";
import { cn } from "@/lib/utils";

export default function PendingApprovalsPage() {
    const dispatch = useDispatch<AppDispatch>();
    const { pendingApprovals, loading, error } = useSelector((state: RootState) => state.admin);
    const [selectedUserId, setSelectedUserId] = useState<string | null>(null);
    const [trialDaysInput, setTrialDaysInput] = useState<string>("");

    useEffect(() => {
        dispatch(fetchPendingApprovals());
    }, [dispatch]);

    useEffect(() => {
        if (selectedUserId) setTrialDaysInput("");
    }, [selectedUserId]);

    // Group pending items by user
    const groupedApprovals = pendingApprovals.reduce((acc: any, item: any) => {
        const userId = item.user.userId;
        if (!acc[userId]) {
            acc[userId] = {
                user: item.user,
                businesses: []
            };
        }
        acc[userId].businesses.push(item.business);
        return acc;
    }, {});

    const uniqueUsers = Object.values(groupedApprovals) as { user: any; businesses: any[] }[];

    // Derive the currently selected user from the latest data
    const activeUser = selectedUserId ? uniqueUsers.find(u => u.user.userId === selectedUserId) : null;

    // Auto-close modal if the selected user no longer exists in the pending list (e.g., all approved)
    useEffect(() => {
        if (selectedUserId && !activeUser) {
            setSelectedUserId(null);
        }
    }, [selectedUserId, activeUser]);

    const handleApproveBusiness = async (e: React.MouseEvent, userId: string, businessId: string) => {
        e.stopPropagation();
        if (!userId || !businessId) return;
        await dispatch(approveBusiness({ userId, businessId }));
        // No need to manually close; if it was the last business, activeUser becomes undefined and effect closes it.
        // If other businesses remain, activeUser updates automatically.
    };

    const handleApproveUser = async (e: React.MouseEvent, userId: string) => {
        e.stopPropagation();
        if (!userId) return;
        const trialDays = trialDaysInput.trim() ? parseInt(trialDaysInput, 10) : undefined;
        if (trialDaysInput.trim() && (Number.isNaN(trialDays) || (trialDays as number) < 0)) return;
        await dispatch(approveUser({ userId, trialDays }));
    };

    if (loading && pendingApprovals.length === 0) {
        return (
            <div className="flex h-[70vh] items-center justify-center">
                <div className="flex flex-col items-center gap-4">
                    <Loader2 className="h-10 w-10 animate-spin text-primary" />
                    <p className="text-muted-foreground animate-pulse font-medium italic">Fetching pending registrations...</p>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="flex h-[70vh] items-center justify-center">
                <div className="glass flex max-w-md flex-col items-center gap-4 rounded-3xl p-8 text-center border-destructive/20 bg-destructive/5">
                    <AlertCircle className="h-12 w-12 text-destructive" />
                    <h3 className="text-xl font-bold italic">Failed to load data</h3>
                    <p className="text-muted-foreground italic">{error}</p>
                    <button
                        onClick={() => dispatch(fetchPendingApprovals())}
                        className="mt-2 rounded-xl bg-primary px-6 py-2 text-sm font-medium text-primary-foreground shadow-lg shadow-primary/20 transition-all hover:scale-105"
                    >
                        Try Again
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="space-y-8 animate-in fade-in duration-700">
            <header className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight italic">Pending Approvals</h1>
                    <p className="mt-1 text-muted-foreground italic">Review and manage new user registrations awaiting verification.</p>
                </div>
                <div className="flex h-10 items-center justify-center rounded-xl bg-amber-500/10 px-4 text-sm font-semibold text-amber-600 border border-amber-500/20 italic">
                    <Clock className="mr-2 h-4 w-4" />
                    {uniqueUsers.length} Users Pending
                </div>
            </header>

            {uniqueUsers.length === 0 ? (
                <div className="glass flex h-64 flex-col items-center justify-center rounded-3xl text-center">
                    <BadgeCheck className="mb-4 h-12 w-12 text-muted-foreground/40" />
                    <h3 className="text-lg font-semibold italic">All caught up!</h3>
                    <p className="text-muted-foreground italic">There are no pending approvals at the moment.</p>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {uniqueUsers.map((item) => (
                        <div
                            key={item.user.userId}
                            onClick={() => setSelectedUserId(item.user.userId)}
                            className="relative group rounded-3xl border border-border bg-card/40 glass p-6 transition-all hover:shadow-xl hover:translate-y-[-4px] cursor-pointer"
                        >
                            <div className="flex items-start justify-between mb-5">
                                <div className="flex items-center gap-3">
                                    <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10 text-primary group-hover:bg-primary group-hover:text-primary-foreground transition-colors">
                                        <User className="h-5 w-5" />
                                    </div>
                                    <div>
                                        <h5 className="font-bold text-base italic line-clamp-1">{item.user.name || "—"}</h5>
                                        <p className="text-xs text-muted-foreground italic">{item.user.email}</p>
                                    </div>
                                </div>
                                <div className="flex flex-col items-end gap-2">
                                    <span className="inline-flex items-center rounded-full bg-amber-500/10 px-2.5 py-0.5 text-[10px] font-bold text-amber-500 uppercase italic border border-amber-500/20">
                                        {item.businesses.length} Pending
                                    </span>
                                </div>
                            </div>

                            <div className="space-y-3 mb-6">
                                <div className="flex items-center gap-2 text-sm italic font-medium text-muted-foreground">
                                    <Building2 className="h-3.5 w-3.5 text-primary" />
                                    <span className="line-clamp-1">
                                        {item.businesses.length === 1
                                            ? item.businesses[0].firmName
                                            : `${item.businesses.length} Businesses waiting`}
                                    </span>
                                </div>
                            </div>

                            <div className="absolute top-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity">
                                <div className="bg-primary/5 p-1 rounded-lg">
                                    <Info className="h-4 w-4 text-primary" />
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {/* Detail Modal */}
            {activeUser && (
                <div
                    className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-background/80 backdrop-blur-sm animate-in fade-in duration-300"
                    onClick={() => setSelectedUserId(null)}
                >
                    <div
                        className="glass w-full max-w-3xl max-h-[90vh] overflow-y-auto rounded-[2rem] border border-border shadow-2xl animate-in zoom-in duration-300"
                        onClick={(e) => e.stopPropagation()}
                    >
                        <div className="sticky top-0 z-10 bg-background/50 backdrop-blur-md px-8 py-6 border-b border-border flex items-center justify-between">
                            <div className="flex items-center gap-4">
                                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-primary text-primary-foreground">
                                    <User className="h-6 w-6" />
                                </div>
                                <div>
                                    <h2 className="text-xl font-bold italic">{activeUser.user.name || "—"}</h2>
                                    <p className="text-sm text-muted-foreground italic font-medium">{activeUser.user.email}</p>
                                </div>
                            </div>
                            <button
                                onClick={() => setSelectedUserId(null)}
                                className="rounded-xl p-2 hover:bg-muted transition-colors"
                            >
                                <X className="h-6 w-6" />
                            </button>
                        </div>

                        <div className="p-8 space-y-8">
                            {/* User User Actions: Approve user (with trial days) */}
                            <section className="space-y-4">
                                <div className="flex items-center justify-between">
                                    <h3 className="text-xs font-bold uppercase tracking-[0.2em] text-primary flex items-center gap-2 italic">
                                        <UserCheck className="h-3 w-3" /> Approve User Access
                                    </h3>
                                </div>
                                <div className="flex flex-col sm:flex-row gap-4 flex-wrap bg-muted/20 p-4 rounded-2xl border border-border/50">
                                    <div className="flex flex-col gap-2 sm:flex-row sm:items-end flex-1">
                                        <div>
                                            <label className="block text-xs font-medium text-muted-foreground mb-1 italic">Trial days (optional)</label>
                                            <input
                                                type="number"
                                                min={0}
                                                placeholder="e.g. 14"
                                                value={trialDaysInput}
                                                onChange={(e) => setTrialDaysInput(e.target.value)}
                                                className="h-10 w-28 rounded-xl border border-input bg-background px-3 text-sm"
                                            />
                                        </div>
                                        <button
                                            disabled={loading}
                                            onClick={(e) => handleApproveUser(e, activeUser.user?.userId ?? "")}
                                            className="flex items-center gap-2 rounded-xl bg-primary/90 px-4 py-2 text-sm font-semibold text-primary-foreground hover:bg-primary disabled:opacity-50 italic"
                                        >
                                            {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <UserCheck className="h-4 w-4" />}
                                            Approve User Globally
                                        </button>
                                    </div>
                                </div>
                            </section>

                            {/* Pending Businesses List */}
                            <section className="space-y-6">
                                <h3 className="text-xs font-bold uppercase tracking-[0.2em] text-primary flex items-center gap-2 italic">
                                    <Building2 className="h-3 w-3" /> Pending Businesses ({activeUser.businesses.length})
                                </h3>

                                {activeUser.businesses.map((business, index) => (
                                    <div key={business.businessId} className="rounded-3xl border border-border bg-card/40 glass p-6 space-y-6">
                                        <div className="flex items-center justify-between">
                                            <div>
                                                <h4 className="text-lg font-bold italic">{business.businessName || business.firmName || "—"}</h4>
                                                <div className="flex items-center gap-2 text-sm font-mono text-muted-foreground mt-1">
                                                    <BadgeCheck className="h-4 w-4 text-primary" />
                                                    {business.gstNumber}
                                                </div>
                                            </div>
                                            <button
                                                disabled={loading}
                                                onClick={(e) => handleApproveBusiness(e, activeUser.user?.userId ?? "", business.businessId ?? "")}
                                                className="flex items-center gap-2 rounded-xl border-2 border-primary bg-primary/10 px-4 py-2 text-xs font-bold text-primary hover:bg-primary/20 disabled:opacity-50 italic"
                                            >
                                                {loading ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <Building className="h-3.5 w-3.5" />}
                                                Approve Business
                                            </button>
                                        </div>

                                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                            <DetailItem label="Address" value={`${business.address.street}, ${business.address.city}, ${business.address.state}`} icon={MapPin} />
                                            <DetailItem label="Mobile" value={business.mobile} icon={Phone} />
                                            <DetailItem label="Email" value={business.email} icon={Mail} />
                                            <DetailItem label="PAN" value={business.pan} icon={Fingerprint} mono />
                                        </div>
                                    </div>
                                ))}
                            </section>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

function DetailItem({ label, value, icon: Icon, mono = false, className = "" }: any) {
    return (
        <div className={cn("glass rounded-2xl border border-border/50 p-4 transition-colors hover:border-primary/20", className)}>
            <div className="flex items-center gap-2 text-muted-foreground mb-1.5">
                <Icon className="h-3.5 w-3.5 text-primary/60" />
                <span className="text-[10px] font-bold uppercase tracking-widest italic">{label}</span>
            </div>
            <p className={cn(
                "text-sm font-bold italic truncate",
                mono ? "font-mono tracking-tighter" : ""
            )}>
                {value}
            </p>
        </div>
    );
}
