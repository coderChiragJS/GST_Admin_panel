"use client";

import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchTrialDays, setTrialDays } from "@/store/slices/adminSlice";
import { AppDispatch, RootState } from "@/store/store";
import { Settings, Loader2, Save, AlertCircle } from "lucide-react";

export default function SettingsPage() {
    const dispatch = useDispatch<AppDispatch>();
    const { trialDays, settingsLoading, error } = useSelector((state: RootState) => state.admin);
    const [value, setValue] = useState<string>("");
    const [saving, setSaving] = useState(false);
    const [localError, setLocalError] = useState<string | null>(null);

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
        const num = parseInt(value, 10);
        if (Number.isNaN(num) || num < 0) {
            setLocalError("Trial days must be a non-negative number.");
            return;
        }
        setSaving(true);
        const result = await dispatch(setTrialDays(num));
        setSaving(false);
        if (setTrialDays.rejected.match(result)) {
            setLocalError((result.payload as string) || "Failed to save.");
        }
    };

    return (
        <div className="space-y-8 animate-in fade-in duration-700">
            <header>
                <h1 className="text-3xl font-bold tracking-tight italic">Settings</h1>
                <p className="mt-1 text-muted-foreground italic">Global defaults for new user signups.</p>
            </header>

            {(error || localError) && (
                <div className="flex items-center gap-3 rounded-xl bg-destructive/10 p-4 text-sm text-destructive border border-destructive/20">
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
                        <p className="text-sm text-muted-foreground italic">Default trial length for new users (e.g. 7, 14, 30).</p>
                    </div>
                </div>

                {settingsLoading && trialDays === null ? (
                    <div className="flex items-center gap-2 text-muted-foreground">
                        <Loader2 className="h-5 w-5 animate-spin" />
                        <span className="italic">Loading…</span>
                    </div>
                ) : (
                    <form onSubmit={handleSave} className="flex flex-col sm:flex-row gap-4 items-end">
                        <div className="flex-1 w-full sm:max-w-[200px]">
                            <label htmlFor="trial-days" className="block text-sm font-medium mb-1.5 italic">
                                Default trial days
                            </label>
                            <input
                                id="trial-days"
                                type="number"
                                min={0}
                                step={1}
                                value={value}
                                onChange={(e) => setValue(e.target.value)}
                                className="flex h-11 w-full rounded-xl border border-input bg-background px-4 text-sm"
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
                    </form>
                )}
            </div>
        </div>
    );
}
