import { LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";

interface DashboardCardProps {
    title: string;
    value: string;
    description: string;
    icon: LucideIcon;
    trend?: {
        value: string;
        isPositive: boolean;
    };
    className?: string;
}

export function DashboardCard({
    title,
    value,
    description,
    icon: Icon,
    trend,
    className,
}: DashboardCardProps) {
    return (
        <div className={cn("glass rounded-2xl p-6 shadow-sm transition-all hover:shadow-md", className)}>
            <div className="flex items-center justify-between">
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10 text-primary">
                    <Icon className="h-6 w-6" />
                </div>
                {trend && (
                    <div className={cn(
                        "flex items-center rounded-full px-2 py-1 text-xs font-medium",
                        trend.isPositive ? "bg-emerald-500/10 text-emerald-500" : "bg-rose-500/10 text-rose-500"
                    )}>
                        {trend.isPositive ? "+" : "-"}{trend.value}
                    </div>
                )}
            </div>
            <div className="mt-4">
                <p className="text-sm font-medium text-muted-foreground">{title}</p>
                <h3 className="mt-1 text-2xl font-bold tracking-tight">{value}</h3>
                <p className="mt-1 text-xs text-muted-foreground">{description}</p>
            </div>
        </div>
    );
}
