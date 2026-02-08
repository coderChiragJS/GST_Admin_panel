"use client";

import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchPendingApprovals, approveBusiness } from "@/store/slices/adminSlice";
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
    ChevronRight,
    Loader2,
    AlertCircle,
    Zap,
    X,
    Fingerprint,
    Info
} from "lucide-react";
import { cn } from "@/lib/utils";

export default function PendingApprovalsPage() {
    const dispatch = useDispatch<AppDispatch>();
    const { pendingApprovals, loading, error } = useSelector((state: RootState) => state.admin);
    const [selectedItem, setSelectedItem] = useState<{ user: any, business: any } | null>(null);

    useEffect(() => {
        dispatch(fetchPendingApprovals());
    }, [dispatch]);

    const handleApprove = async (e: React.MouseEvent, userId: string, businessId: string) => {
        e.stopPropagation(); // Prevent modal from opening
        
        // Validate that both IDs are present
        if (!userId || !businessId) {
            console.error('User ID and Business ID are required');
            return;
        }
        
        await dispatch(approveBusiness({ 
            userId, 
            businessId
        }));
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
                    <p className="mt-1 text-muted-foreground italic">Review and manage new business registrations awaiting verification.</p>
                </div>
                <div className="flex h-10 items-center justify-center rounded-xl bg-amber-500/10 px-4 text-sm font-semibold text-amber-600 border border-amber-500/20 italic">
                    <Clock className="mr-2 h-4 w-4" />
                    {pendingApprovals.length} Requests
                </div>
            </header>

            {pendingApprovals.length === 0 ? (
                <div className="glass flex h-64 flex-col items-center justify-center rounded-3xl text-center">
                    <BadgeCheck className="mb-4 h-12 w-12 text-muted-foreground/40" />
                    <h3 className="text-lg font-semibold italic">All caught up!</h3>
                    <p className="text-muted-foreground italic">There are no pending approvals at the moment.</p>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {pendingApprovals.map((item) => (
                        <div
                            key={item.business.businessId}
                            onClick={() => setSelectedItem({ user: item.user, business: item.business })}
                            className="relative group rounded-3xl border border-border bg-card/40 glass p-6 transition-all hover:shadow-xl hover:translate-y-[-4px] cursor-pointer"
                        >
                            <div className="flex items-start justify-between mb-5">
                                <div className="flex items-center gap-3">
                                    <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10 text-primary group-hover:bg-primary group-hover:text-primary-foreground transition-colors">
                                        <Building2 className="h-5 w-5" />
                                    </div>
                                    <div>
                                        <h5 className="font-bold text-base italic line-clamp-1">{item.business.businessName ?? item.business.firmName ?? "—"}</h5>
                                        <p className="text-xs text-muted-foreground font-mono uppercase italic tracking-wider">{item.business.gstNumber}</p>
                                    </div>
                                </div>
                                <div className="flex flex-col items-end gap-2">
                                    <span className="inline-flex items-center rounded-full bg-amber-500/10 px-2.5 py-0.5 text-[10px] font-bold text-amber-500 uppercase italic border border-amber-500/20">
                                        {item.business.approvalStatus}
                                    </span>
                                </div>
                            </div>

                            <div className="space-y-3 mb-6">
                                <div className="flex items-center gap-2 text-sm italic font-medium text-muted-foreground">
                                    <User className="h-3.5 w-3.5 text-primary" />
                                    <span className="line-clamp-1">{item.user?.name || 'N/A'}</span>
                                </div>
                                <div className="grid grid-cols-1 gap-y-2 text-xs italic font-medium">
                                    <div className="flex items-center gap-2 text-muted-foreground">
                                        <Phone className="h-3.5 w-3.5 shrink-0 text-primary" />
                                        <span>{item.business.mobile}</span>
                                    </div>
                                    <div className="flex items-center gap-2 text-muted-foreground">
                                        <MapPin className="h-3.5 w-3.5 shrink-0 text-primary" />
                                        <span className="line-clamp-1">{item.business.address.city}, {item.business.address.state}</span>
                                    </div>
                                </div>
                            </div>

                            <div className="pt-4 border-t border-border/50">
                                <div className="flex flex-col gap-3">
                                    <div className="flex items-center justify-between">
                                        <div className="flex items-center gap-1 text-[10px] text-muted-foreground italic font-medium">
                                            <Clock className="h-3 w-3" />
                                            {new Date(item.business.createdAt).toLocaleDateString()}
                                        </div>
                                    </div>
                                    <button
                                        disabled={loading || !(item.user?.userId || item.business?.userId) || !item.business?.businessId}
                                        onClick={(e) => handleApprove(e, item.user?.userId || item.business?.userId || '', item.business?.businessId || '')}
                                        className="rounded-xl bg-primary px-4 py-2 text-xs font-bold text-primary-foreground shadow-lg shadow-primary/20 transition-all hover:scale-105 active:scale-95 disabled:opacity-50 italic flex items-center gap-2"
                                    >
                                        {loading ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : "Approve"}
                                    </button>
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
            {selectedItem && (
                <div
                    className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-background/80 backdrop-blur-sm animate-in fade-in duration-300"
                    onClick={() => setSelectedItem(null)}
                >
                    <div
                        className="glass w-full max-w-2xl max-h-[90vh] overflow-y-auto rounded-[2rem] border border-border shadow-2xl animate-in zoom-in duration-300"
                        onClick={(e) => e.stopPropagation()}
                    >
                        <div className="sticky top-0 z-10 bg-background/50 backdrop-blur-md px-8 py-6 border-b border-border flex items-center justify-between">
                            <div className="flex items-center gap-4">
                                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-primary text-primary-foreground">
                                    <Building2 className="h-6 w-6" />
                                </div>
                                <div>
                                    <h2 className="text-xl font-bold italic">{selectedItem.business.businessName ?? selectedItem.business.firmName ?? "—"}</h2>
                                    <p className="text-sm text-muted-foreground italic font-medium font-mono tracking-tight">{selectedItem.business.gstNumber}</p>
                                </div>
                            </div>
                            <button
                                onClick={() => setSelectedItem(null)}
                                className="rounded-xl p-2 hover:bg-muted transition-colors"
                            >
                                <X className="h-6 w-6" />
                            </button>
                        </div>

                        <div className="p-8 space-y-8">
                            {/* User Section */}
                            <section className="space-y-4">
                                <h3 className="text-xs font-bold uppercase tracking-[0.2em] text-primary flex items-center gap-2 italic">
                                    <User className="h-3 w-3" /> User Information
                                </h3>
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                    <DetailItem label="Full Name" value={selectedItem.user.name} icon={User} />
                                    <DetailItem label="Email Address" value={selectedItem.user.email} icon={Mail} />
                                    <DetailItem label="User ID" value={selectedItem.user.userId} icon={Fingerprint} mono className="sm:col-span-2" />
                                </div>
                            </section>

                            {/* Business Section */}
                            <section className="space-y-4">
                                <h3 className="text-xs font-bold uppercase tracking-[0.2em] text-primary flex items-center gap-2 italic">
                                    <Building2 className="h-3 w-3" /> Business Information
                                </h3>
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                    <DetailItem label="GST Number" value={selectedItem.business.gstNumber} icon={BadgeCheck} mono />
                                    <DetailItem label="PAN Number" value={selectedItem.business.pan} icon={Fingerprint} mono />
                                    <DetailItem label="Mobile" value={selectedItem.business.mobile} icon={Phone} />
                                    <DetailItem label="Business Email" value={selectedItem.business.email} icon={Mail} />
                                    <DetailItem label="Registered On" value={new Date(selectedItem.business.createdAt).toLocaleString()} icon={Calendar} />
                                    <DetailItem label="Last Updated" value={new Date(selectedItem.business.updatedAt).toLocaleString()} icon={Clock} />
                                    {selectedItem.business.companyLogoUrl && (
                                        <DetailItem label="Logo URL" value={selectedItem.business.companyLogoUrl} icon={Info} className="sm:col-span-2" />
                                    )}
                                    <DetailItem label="Business ID" value={selectedItem.business.businessId} icon={Fingerprint} mono className="sm:col-span-2" />
                                </div>
                            </section>

                            {/* Address Section */}
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-8 pb-4">
                                <section className="space-y-4">
                                    <h3 className="text-xs font-bold uppercase tracking-[0.2em] text-primary flex items-center gap-2 italic">
                                        <MapPin className="h-3 w-3" /> Registered Address
                                    </h3>
                                    <div className="rounded-2xl border border-border bg-muted/20 p-6 italic font-medium text-sm leading-relaxed">
                                        <p>{selectedItem.business.address.street}</p>
                                        <p>{selectedItem.business.address.city}, {selectedItem.business.address.state}</p>
                                        <p className="text-primary font-bold mt-1">PIN: {selectedItem.business.address.pincode}</p>
                                    </div>
                                </section>

                                {selectedItem.business.dispatchAddress && (
                                    <section className="space-y-4">
                                        <h3 className="text-xs font-bold uppercase tracking-[0.2em] text-primary flex items-center gap-2 italic">
                                            <MapPin className="h-3 w-3" /> Dispatch Address
                                        </h3>
                                        <div className="rounded-2xl border border-border bg-muted/20 p-6 italic font-medium text-sm leading-relaxed">
                                            <p>{selectedItem.business.dispatchAddress.street}</p>
                                            <p>{selectedItem.business.dispatchAddress.city}, {selectedItem.business.dispatchAddress.state}</p>
                                        </div>
                                    </section>
                                )}
                            </div>
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
