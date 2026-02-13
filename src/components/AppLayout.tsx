"use client";

import { usePathname, useRouter } from "next/navigation";
import { Sidebar } from "@/components/Sidebar";
import { useSelector } from "react-redux";
import { RootState } from "@/store/store";
import { useEffect, useState } from "react";
// test÷?÷
export function AppLayout({ children }: { children: React.ReactNode }) {
    const pathname = usePathname();
    const router = useRouter();
    const { token } = useSelector((state: RootState) => state.auth);
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
    }, []);

    const isAuthPage = pathname === "/login" || pathname === "/register";
    const isForbiddenPage = pathname === "/forbidden";
    const isPublicPage = isAuthPage || isForbiddenPage;

    useEffect(() => {
        if (!mounted) return;

        if (!token && !isPublicPage) {
            router.replace("/login");
        }

        if (token && isAuthPage) {
            router.replace("/");
        }
    }, [token, isAuthPage, isPublicPage, router, mounted]);

    if (!mounted) return null;

    if (!token && !isPublicPage) return null;
    if (token && isAuthPage) return null;

    if (isPublicPage) {
        return <div className="min-h-screen bg-background">{children}</div>;
    }
    // test te fuekd
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
