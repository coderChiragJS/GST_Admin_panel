import {
  IndianRupee,
  Users,
  FileText,
  ArrowUpRight,
  Search,
  Filter,
  MoreVertical,
  Plus
} from "lucide-react";
import { DashboardCard } from "@/components/DashboardCard";
import { cn } from "@/lib/utils";

const recentTransactions = [
  { id: "INV-001", client: "Acme Corp", amount: "₹45,200", status: "Paid", date: "Feb 2, 2026" },
  { id: "INV-002", client: "Global Tech", amount: "₹1,12,000", status: "Pending", date: "Feb 1, 2026" },
  { id: "INV-003", client: "Nexus Inc", amount: "₹12,400", status: "Paid", date: "Jan 30, 2026" },
  { id: "INV-004", client: "Zenith Ltd", amount: "₹88,900", status: "Overdue", date: "Jan 28, 2026" },
  { id: "INV-005", client: "Quantum Solutions", amount: "₹67,500", status: "Paid", date: "Jan 25, 2026" },
];

export default function Home() {
  return (
    <div className="space-y-8 animate-in fade-in duration-700">
      <header className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Dashboard Overview</h1>
          <p className="mt-1 text-muted-foreground">Welcome back! Here's what's happening today.</p>
        </div>
        <div className="flex items-center gap-3">
          <button className="flex h-10 items-center justify-center rounded-xl border border-border bg-card px-4 text-sm font-medium shadow-sm transition-all hover:bg-accent">
            <Filter className="mr-2 h-4 w-4" />
            Filters
          </button>
          <button className="flex h-10 items-center justify-center rounded-xl bg-primary px-4 text-sm font-medium text-primary-foreground shadow-lg shadow-primary/20 transition-all hover:scale-[1.02] active:scale-[0.98]">
            <Plus className="mr-2 h-4 w-4" />
            New Invoice
          </button>
        </div>
      </header>

      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        <DashboardCard
          title="Total Revenue"
          value="₹12,45,200"
          description="Total GST collected this quarter"
          icon={IndianRupee}
          trend={{ value: "12.5%", isPositive: true }}
        />
        <DashboardCard
          title="Active Clients"
          value="148"
          description="24 new clients added this month"
          icon={Users}
          trend={{ value: "8.2%", isPositive: true }}
        />
        <DashboardCard
          title="Pending Invoices"
          value="32"
          description="Requires immediate attention"
          icon={FileText}
          trend={{ value: "4.1%", isPositive: false }}
        />
      </div>

      <div className="glass overflow-hidden rounded-2xl border border-border">
        <div className="flex items-center justify-between border-b border-border p-6">
          <div className="flex items-center gap-4">
            <h2 className="text-lg font-semibold">Recent Transactions</h2>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <input
                type="text"
                placeholder="Search..."
                className="h-9 w-64 rounded-xl border border-border bg-background/50 pl-9 pr-4 text-sm outline-none focus:ring-2 focus:ring-primary/20"
              />
            </div>
          </div>
          <button className="text-sm font-medium text-primary hover:underline">View All</button>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="border-b border-border bg-muted/30 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                <th className="px-6 py-4">Transaction ID</th>
                <th className="px-6 py-4">Client</th>
                <th className="px-6 py-4">Amount</th>
                <th className="px-6 py-4">Status</th>
                <th className="px-6 py-4">Date</th>
                <th className="px-6 py-4 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {recentTransactions.map((tx) => (
                <tr key={tx.id} className="group transition-colors hover:bg-muted/50">
                  <td className="whitespace-nowrap px-6 py-4 text-sm font-medium">{tx.id}</td>
                  <td className="whitespace-nowrap px-6 py-4 text-sm">{tx.client}</td>
                  <td className="whitespace-nowrap px-6 py-4 text-sm font-semibold">{tx.amount}</td>
                  <td className="whitespace-nowrap px-6 py-4 text-sm">
                    <span className={cn(
                      "inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium",
                      tx.status === "Paid" ? "bg-emerald-500/10 text-emerald-500" :
                        tx.status === "Pending" ? "bg-amber-500/10 text-amber-500" :
                          "bg-rose-500/10 text-rose-500"
                    )}>
                      {tx.status}
                    </span>
                  </td>
                  <td className="whitespace-nowrap px-6 py-4 text-sm text-muted-foreground">{tx.date}</td>
                  <td className="whitespace-nowrap px-6 py-4 text-right">
                    <button className="rounded-lg p-1 text-muted-foreground transition-colors hover:bg-border">
                      <MoreVertical className="h-4 w-4" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
