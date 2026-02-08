"use client";

import Link from "next/link";
import { ShieldX } from "lucide-react";

export default function ForbiddenPage() {
    return (
        <div className="flex min-h-screen items-center justify-center bg-background px-4">
            <div className="w-full max-w-md space-y-6 text-center">
                <div className="flex justify-center">
                    <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-destructive/10 text-destructive">
                        <ShieldX className="h-8 w-8" />
                    </div>
                </div>
                <h1 className="text-2xl font-bold italic">Access denied</h1>
                <p className="text-muted-foreground italic">Admins only. You do not have permission to access this panel.</p>
                <Link
                    href="/login"
                    className="inline-flex h-11 items-center justify-center rounded-xl bg-primary px-6 text-sm font-semibold text-primary-foreground shadow-lg shadow-primary/20 hover:scale-[1.02] active:scale-[0.98]"
                >
                    Back to login
                </Link>
            </div>
        </div>
    );
}
