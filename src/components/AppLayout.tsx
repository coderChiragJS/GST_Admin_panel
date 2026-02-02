"use client";

import { usePathname, useRouter } from "next/navigation";
import { Sidebar } from "@/components/Sidebar";
import { useSelector } from "react-redux";
import { RootState } from "@/store/store";
import { useEffect, useState } from "react";

export function AppLayout({ children }: { children: React.ReactNode }) {
    const pathname = usePathname();
    const router = useRouter();
    const { token } = useSelector((state: RootState) => state.auth);
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
    }, []);

    const isAuthPage = pathname === "/login" || pathname === "/register";

    useEffect(() => {
        if (!mounted) return;

        if (!token && !isAuthPage) {
            router.replace("/login");
        }

        if (token && isAuthPage) {
            router.replace("/");
        }
    }, [token, isAuthPage, router, mounted]);

    // Prevent hydration mismatch and flash of protected content
    if (!mounted) return null;

    // While checking auth, show nothing or a loader to avoid flashing protected content
    if (!token && !isAuthPage) return null;
    if (token && isAuthPage) return null;

    if (isAuthPage) {
        return <div className="min-h-screen bg-background">{children}</div>;
    }

    return (
        <>
            <Sidebar />
            <main className="ml-64 min-h-screen p-8 transition-all duration-300">
                <div className="mx-auto max-w-7xl">
                    {children}
                </div>
            </main>
        </>
    );
}
