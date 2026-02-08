"use client";

import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
    fetchPackages,
    createPackage,
    updatePackage,
    type Package,
} from "@/store/slices/adminSlice";
import { AppDispatch, RootState } from "@/store/store";
import {
    Package as PackageIcon,
    Plus,
    Loader2,
    AlertCircle,
    Pencil,
    X,
    FileText,
    Quote,
    Calendar,
    ToggleLeft,
    ToggleRight,
} from "lucide-react";
import { cn } from "@/lib/utils";

const emptyForm = {
    name: "",
    price: 0,
    invoiceLimit: 0,
    quotationLimit: 0,
    validityDays: 365 as number | "",
    isActive: true,
};

export default function PackagesPage() {
    const dispatch = useDispatch<AppDispatch>();
    const { packages, packagesLoading, error } = useSelector((state: RootState) => state.admin);
    const [showForm, setShowForm] = useState(false);
    const [editing, setEditing] = useState<Package | null>(null);
    const [form, setForm] = useState(emptyForm);
    const [submitError, setSubmitError] = useState<string | null>(null);

    useEffect(() => {
        dispatch(fetchPackages());
    }, [dispatch]);

    const openCreate = () => {
        setEditing(null);
        setForm(emptyForm);
        setSubmitError(null);
        setShowForm(true);
    };

    const openEdit = (pkg: Package) => {
        setEditing(pkg);
        setForm({
            name: pkg.name,
            price: pkg.price,
            invoiceLimit: pkg.invoiceLimit,
            quotationLimit: pkg.quotationLimit,
            validityDays: pkg.validityDays ?? "",
            isActive: pkg.isActive,
        });
        setSubmitError(null);
        setShowForm(true);
    };

    const closeForm = () => {
        setShowForm(false);
        setEditing(null);
        setForm(emptyForm);
        setSubmitError(null);
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setSubmitError(null);
        const payload = {
            name: form.name.trim(),
            price: Number(form.price),
            invoiceLimit: Number(form.invoiceLimit),
            quotationLimit: Number(form.quotationLimit),
            validityDays: form.validityDays === "" ? null : Number(form.validityDays),
            isActive: form.isActive,
        };
        if (!payload.name || payload.price < 0 || payload.invoiceLimit < 0 || payload.quotationLimit < 0) {
            setSubmitError("Name, price, and limits are required and must be non-negative.");
            return;
        }
        if (editing) {
            const result = await dispatch(
                updatePackage({
                    packageId: editing.packageId,
                    ...payload,
                })
            );
            if (updatePackage.fulfilled.match(result)) closeForm();
            else setSubmitError((result.payload as string) || "Update failed.");
        } else {
            const result = await dispatch(createPackage(payload));
            if (createPackage.fulfilled.match(result)) closeForm();
            else setSubmitError((result.payload as string) || "Create failed.");
        }
    };

    const toggleActive = async (pkg: Package) => {
        await dispatch(
            updatePackage({
                packageId: pkg.packageId,
                isActive: !pkg.isActive,
            })
        );
    };

    return (
        <div className="space-y-8 animate-in fade-in duration-700">
            <header className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight italic">Packages</h1>
                    <p className="mt-1 text-muted-foreground italic">Subscription plans: price, limits, and validity.</p>
                </div>
                <button
                    onClick={openCreate}
                    className="flex h-10 items-center gap-2 rounded-xl bg-primary px-4 text-sm font-semibold text-primary-foreground shadow-lg shadow-primary/20 transition-all hover:scale-[1.02] active:scale-[0.98] italic"
                >
                    <Plus className="h-4 w-4" />
                    Add package
                </button>
            </header>

            {error && (
                <div className="flex items-center gap-3 rounded-xl bg-destructive/10 p-4 text-sm text-destructive border border-destructive/20">
                    <AlertCircle className="h-5 w-5 shrink-0" />
                    <p>{error}</p>
                </div>
            )}

            {packagesLoading && packages.length === 0 ? (
                <div className="flex h-64 items-center justify-center">
                    <Loader2 className="h-10 w-10 animate-spin text-primary" />
                </div>
            ) : packages.length === 0 ? (
                <div className="glass flex h-64 flex-col items-center justify-center rounded-3xl text-center">
                    <PackageIcon className="mb-4 h-12 w-12 text-muted-foreground/40" />
                    <h3 className="text-lg font-semibold italic">No packages yet</h3>
                    <p className="text-muted-foreground italic">Add a package to get started.</p>
                    <button
                        onClick={openCreate}
                        className="mt-4 rounded-xl bg-primary px-6 py-2 text-sm font-medium text-primary-foreground"
                    >
                        Add package
                    </button>
                </div>
            ) : (
                <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                    {packages.map((pkg) => (
                        <div
                            key={pkg.packageId}
                            className={cn(
                                "glass rounded-3xl border p-6 transition-all",
                                !pkg.isActive && "opacity-70 border-muted"
                            )}
                        >
                            <div className="flex items-start justify-between mb-4">
                                <div className="flex items-center gap-3">
                                    <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10 text-primary">
                                        <PackageIcon className="h-5 w-5" />
                                    </div>
                                    <div>
                                        <h3 className="font-bold italic">{pkg.name}</h3>
                                        <p className="text-xs text-muted-foreground font-mono">₹{pkg.price}</p>
                                    </div>
                                </div>
                                <button
                                    onClick={() => toggleActive(pkg)}
                                    className="rounded-lg p-1 hover:bg-muted"
                                    title={pkg.isActive ? "Disable" : "Enable"}
                                >
                                    {pkg.isActive ? (
                                        <ToggleRight className="h-6 w-6 text-primary" />
                                    ) : (
                                        <ToggleLeft className="h-6 w-6 text-muted-foreground" />
                                    )}
                                </button>
                            </div>
                            <ul className="space-y-2 text-sm text-muted-foreground italic">
                                <li className="flex items-center gap-2">
                                    <FileText className="h-3.5 w-3.5 text-primary" />
                                    Invoice limit: {pkg.invoiceLimit}
                                </li>
                                <li className="flex items-center gap-2">
                                    <Quote className="h-3.5 w-3.5 text-primary" />
                                    Quotation limit: {pkg.quotationLimit}
                                </li>
                                <li className="flex items-center gap-2">
                                    <Calendar className="h-3.5 w-3.5 text-primary" />
                                    Validity: {pkg.validityDays ?? "No expiry"} days
                                </li>
                            </ul>
                            <div className="mt-4 pt-4 border-t border-border flex gap-2">
                                <button
                                    onClick={() => openEdit(pkg)}
                                    className="flex items-center gap-1.5 rounded-xl border border-border bg-background px-3 py-2 text-xs font-medium hover:bg-muted"
                                >
                                    <Pencil className="h-3.5 w-3.5" />
                                    Edit
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {showForm && (
                <div
                    className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-background/80 backdrop-blur-sm"
                    onClick={closeForm}
                >
                    <div
                        className="glass w-full max-w-md rounded-3xl border border-border shadow-2xl p-8"
                        onClick={(e) => e.stopPropagation()}
                    >
                        <div className="flex items-center justify-between mb-6">
                            <h2 className="text-xl font-bold italic">
                                {editing ? "Edit package" : "Add package"}
                            </h2>
                            <button onClick={closeForm} className="rounded-lg p-1 hover:bg-muted">
                                <X className="h-5 w-5" />
                            </button>
                        </div>
                        {submitError && (
                            <div className="mb-4 flex items-center gap-2 rounded-xl bg-destructive/10 p-3 text-sm text-destructive">
                                <AlertCircle className="h-4 w-4 shrink-0" />
                                {submitError}
                            </div>
                        )}
                        <form onSubmit={handleSubmit} className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium mb-1 italic">Name</label>
                                <input
                                    type="text"
                                    required
                                    value={form.name}
                                    onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
                                    className="flex h-10 w-full rounded-xl border border-input bg-background px-3 text-sm"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium mb-1 italic">Price (₹)</label>
                                <input
                                    type="number"
                                    min={0}
                                    step={1}
                                    required
                                    value={form.price || ""}
                                    onChange={(e) => setForm((f) => ({ ...f, price: e.target.value ? Number(e.target.value) : 0 }))}
                                    className="flex h-10 w-full rounded-xl border border-input bg-background px-3 text-sm"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium mb-1 italic">Invoice limit</label>
                                <input
                                    type="number"
                                    min={0}
                                    required
                                    value={form.invoiceLimit || ""}
                                    onChange={(e) =>
                                        setForm((f) => ({ ...f, invoiceLimit: e.target.value ? Number(e.target.value) : 0 }))
                                    }
                                    className="flex h-10 w-full rounded-xl border border-input bg-background px-3 text-sm"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium mb-1 italic">Quotation limit</label>
                                <input
                                    type="number"
                                    min={0}
                                    required
                                    value={form.quotationLimit || ""}
                                    onChange={(e) =>
                                        setForm((f) => ({ ...f, quotationLimit: e.target.value ? Number(e.target.value) : 0 }))
                                    }
                                    className="flex h-10 w-full rounded-xl border border-input bg-background px-3 text-sm"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium mb-1 italic">Validity (days, empty = no expiry)</label>
                                <input
                                    type="number"
                                    min={0}
                                    value={form.validityDays === "" ? "" : form.validityDays}
                                    onChange={(e) =>
                                        setForm((f) => ({
                                            ...f,
                                            validityDays: e.target.value === "" ? "" : Number(e.target.value),
                                        }))
                                    }
                                    className="flex h-10 w-full rounded-xl border border-input bg-background px-3 text-sm"
                                />
                            </div>
                            <label className="flex items-center gap-2 cursor-pointer">
                                <input
                                    type="checkbox"
                                    checked={form.isActive}
                                    onChange={(e) => setForm((f) => ({ ...f, isActive: e.target.checked }))}
                                    className="rounded border-input"
                                />
                                <span className="text-sm font-medium italic">Active</span>
                            </label>
                            <div className="flex gap-2 pt-2">
                                <button
                                    type="submit"
                                    className="flex-1 flex items-center justify-center gap-2 h-11 rounded-xl bg-primary text-primary-foreground font-semibold text-sm"
                                >
                                    {editing ? "Update" : "Create"}
                                </button>
                                <button
                                    type="button"
                                    onClick={closeForm}
                                    className="px-4 h-11 rounded-xl border border-border hover:bg-muted font-medium text-sm"
                                >
                                    Cancel
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}
