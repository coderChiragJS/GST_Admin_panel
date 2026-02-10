"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
    LayoutDashboard,
    Settings,
    LogOut,
    TrendingUp,
    Clock,
    Package,
    UserX,
    CreditCard,
    Users,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useDispatch } from "react-redux";
import { logout } from "@/store/slices/authSlice";
import { AppDispatch } from "@/store/store";

const menuItems = [
    { icon: LayoutDashboard, label: "Dashboard", href: "/" },
    { icon: Users, label: "Users", href: "/users" },
    { icon: Clock, label: "Pending Approvals", href: "/pending" },
    { icon: Package, label: "Packages", href: "/packages" },
    { icon: UserX, label: "Expired Trials", href: "/expired-trials" },
    { icon: CreditCard, label: "Payment details", href: "/payments" },
];

const secondaryItems = [
    { icon: Settings, label: "Settings", href: "/settings" },
];

export function Sidebar() {
    const pathname = usePathname();
    const dispatch = useDispatch<AppDispatch>();

    return (
        <aside className="fixed left-0 top-0 z-40 h-screen w-64 border-r border-border bg-card/50 backdrop-blur-xl transition-transform dark:bg-card/20">
            <div className="flex h-full flex-col px-3 py-4">
                <div className="mb-10 flex items-center px-2">
                    <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary shadow-lg shadow-primary/20">
                        <TrendingUp className="h-6 w-6 text-primary-foreground" />
                    </div>
                    <span className="ml-3 text-xl font-bold tracking-tight gradient-text">GST Admin</span>
                </div>

                <div className="flex-1 space-y-1">
                    <p className="px-2 text-xs font-semibold uppercase tracking-wider text-muted-foreground/60 mb-2">Main Menu</p>
                    {menuItems.map((item) => (
                        <Link
                            key={item.href}
                            href={item.href}
                            className={cn(
                                "group flex items-center rounded-xl px-3 py-2.5 text-sm font-medium transition-all duration-200 hover:bg-accent/50 hover:text-accent-foreground",
                                pathname === item.href
                                    ? "bg-primary/10 text-primary shadow-sm"
                                    : "text-muted-foreground"
                            )}
                        >
                            <item.icon className={cn(
                                "mr-3 h-5 w-5 transition-colors",
                                pathname === item.href ? "text-primary" : "text-muted-foreground group-hover:text-accent-foreground"
                            )} />
                            {item.label}
                            {pathname === item.href && (
                                <div className="ml-auto h-1.5 w-1.5 rounded-full bg-primary" />
                            )}
                        </Link>
                    ))}
                </div>

                <div className="mt-auto space-y-1 border-t border-border pt-4">
                    <p className="px-2 text-xs font-semibold uppercase tracking-wider text-muted-foreground/60 mb-2">Support</p>
                    {secondaryItems.map((item) => (
                        <Link
                            key={item.href}
                            href={item.href}
                            className={cn(
                                "group flex items-center rounded-xl px-3 py-2.5 text-sm font-medium transition-all duration-200 hover:bg-accent/50 hover:text-accent-foreground",
                                pathname === item.href
                                    ? "bg-primary/10 text-primary"
                                    : "text-muted-foreground"
                            )}
                        >
                            <item.icon className="mr-3 h-5 w-5" />
                            {item.label}
                        </Link>
                    ))}
                    <button
                        onClick={() => {
                            dispatch(logout());
                            window.location.href = "/login";
                        }}
                        className="group mt-2 flex w-full items-center rounded-xl px-3 py-2.5 text-sm font-medium text-destructive transition-all duration-200 hover:bg-destructive/10 cursor-pointer"
                    >
                        <LogOut className="mr-3 h-5 w-5" />
                        Sign Out
                    </button>
                </div>
            </div>
        </aside>
    );
}
