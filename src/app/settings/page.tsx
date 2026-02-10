"use client";

import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchTrialDays, setTrialDays } from "@/store/slices/adminSlice";
import { AppDispatch, RootState } from "@/store/store";
import { Settings, Loader2, Save, AlertCircle, CheckCircle2, Info } from "lucide-react";

export default function SettingsPage() {
    const dispatch = useDispatch<AppDispatch>();
    const { trialDays, settingsLoading, error } = useSelector((state: RootState) => state.admin);
    const [value, setValue] = useState<string>("");
    const [saving, setSaving] = useState(false);
    const [localError, setLocalError] = useState<string | null>(null);
    const [successMessage, setSuccessMessage] = useState<string | null>(null);

    useEffect(() => {
        dispatch(fetchTrialDays());
    }, [dispatch]);

    useEffect(() => {
        if (trialDays !== null) {
            setValue(String(trialDays));
        }
    }, [trialDays]);

    const handleSave = async (e: React.FormEvent) => {
        e.preventDefault();
        setLocalError(null);
        setSuccessMessage(null);
        const num = parseFloat(value);
        if (Number.isNaN(num) || num < 0) {
            setLocalError("Trial days must be a non-negative number (decimals allowed for testing).");
            return;
        }
        setSaving(true);
        const result = await dispatch(setTrialDays(num));
        setSaving(false);
        if (setTrialDays.rejected.match(result)) {
            setLocalError((result.payload as string) || "Failed to save.");
        } else {
            setSuccessMessage(`Trial days successfully updated to ${num} days.`);
            // Clear success message after 5 seconds
            setTimeout(() => setSuccessMessage(null), 5000);
        }
    };

    return (
        <div className="space-y-8 animate-in fade-in duration-700">
            <header>
                <h1 className="text-3xl font-bold tracking-tight italic">Settings</h1>
                <p className="mt-1 text-muted-foreground italic">Global defaults for new user signups.</p>
            </header>

            {successMessage && (
                <div className="flex items-center gap-3 rounded-xl bg-emerald-500/10 p-4 text-sm text-emerald-600 border border-emerald-500/20 animate-in fade-in slide-in-from-top-2 duration-300">
                    <CheckCircle2 className="h-5 w-5 shrink-0" />
                    <p>{successMessage}</p>
                </div>
            )}

            {(error || localError) && (
                <div className="flex items-center gap-3 rounded-xl bg-destructive/10 p-4 text-sm text-destructive border border-destructive/20 animate-in fade-in slide-in-from-top-2 duration-300">
                    <AlertCircle className="h-5 w-5 shrink-0" />
                    <p>{localError ?? error}</p>
                </div>
            )}

            <div className="glass rounded-3xl border border-border p-8 max-w-md">
                <div className="flex items-center gap-3 mb-6">
                    <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10 text-primary">
                        <Settings className="h-5 w-5" />
                    </div>
                    <div>
                        <h2 className="text-lg font-semibold italic">Trial days</h2>
                        <p className="text-sm text-muted-foreground italic">
                            Default trial length for new users. Decimals allowed for testing.
                        </p>
                    </div>
                </div>

                {settingsLoading && trialDays === null ? (
                    <div className="flex items-center gap-2 text-muted-foreground">
                        <Loader2 className="h-5 w-5 animate-spin" />
                        <span className="italic">Loading…</span>
                    </div>
                ) : (
                    <form onSubmit={handleSave} className="space-y-4">
                        <div className="flex flex-col sm:flex-row gap-4 items-end">
                            <div className="flex-1 w-full sm:max-w-[200px]">
                                <label htmlFor="trial-days" className="block text-sm font-medium mb-1.5 italic">
                                    Trial days
                                </label>
                                <input
                                    id="trial-days"
                                    type="number"
                                    min={0}
                                    step="any"
                                    value={value}
                                    onChange={(e) => setValue(e.target.value)}
                                    placeholder="e.g., 14 or 0.0014"
                                    className="flex h-11 w-full rounded-xl border border-input bg-background px-4 text-sm focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
                                />
                            </div>
                            <button
                                type="submit"
                                disabled={saving || settingsLoading}
                                className="flex h-11 items-center gap-2 rounded-xl bg-primary px-6 text-sm font-semibold text-primary-foreground shadow-lg shadow-primary/20 transition-all hover:scale-[1.02] active:scale-[0.98] disabled:opacity-70 italic"
                            >
                                {saving ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
                                Save
                            </button>
                        </div>

                        <div className="rounded-xl bg-blue-500/5 border border-blue-500/20 p-4">
                            <div className="flex items-start gap-2 mb-2">
                                <Info className="h-4 w-4 text-blue-600 mt-0.5 shrink-0" />
                                <div className="text-xs text-blue-600 font-semibold">Common values & testing</div>
                            </div>
                            <div className="space-y-2 text-xs text-muted-foreground ml-6">
                                <div className="grid grid-cols-2 gap-2">
                                    <div>
                                        <span className="font-semibold text-foreground">Production:</span>
                                        <div className="mt-1 space-y-0.5">
                                            <div>• 7 days (1 week)</div>
                                            <div>• 14 days (2 weeks)</div>
                                            <div>• 30 days (1 month)</div>
                                        </div>
                                    </div>
                                    <div>
                                        <span className="font-semibold text-foreground">Testing:</span>
                                        <div className="mt-1 space-y-0.5">
                                            <div>• 0.0014 ≈ 2 minutes</div>
                                            <div>• 0.0035 ≈ 5 minutes</div>
                                            <div>• 0.0069 ≈ 10 minutes</div>
                                        </div>
                                    </div>
                                </div>
                                <div className="pt-2 border-t border-border/40 text-[11px] italic">
                                    💡 Decimal values allow testing short trial expirations. New users will get trial end date = signup time + trial days.
                                </div>
                            </div>
                        </div>
                    </form>
                )}
            </div>
        </div>
    );
}
