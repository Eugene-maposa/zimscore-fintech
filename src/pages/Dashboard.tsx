import { motion } from "framer-motion";
import { Wallet, BarChart3, ArrowUpRight, ArrowDownLeft, Send, CreditCard, Users, TrendingUp } from "lucide-react";
import { AppLayout } from "@/components/layout/AppLayout";
import { CreditScoreGauge } from "@/components/dashboard/CreditScoreGauge";
import { StatCard } from "@/components/dashboard/StatCard";
import { mockUser, transactions, formatCurrency, formatDate } from "@/lib/mock-data";

const quickActions = [
  { label: "Pay", icon: Send, color: "bg-primary/15 text-primary" },
  { label: "Request", icon: ArrowDownLeft, color: "bg-success/15 text-success" },
  { label: "Transfer", icon: ArrowUpRight, color: "bg-accent/15 text-accent" },
  { label: "Cards", icon: CreditCard, color: "bg-purple-500/15 text-purple-400" },
];

export default function Dashboard() {
  return (
    <AppLayout title="Dashboard">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Welcome */}
        <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}>
          <h2 className="font-display text-2xl font-bold">Welcome back, {mockUser.name.split(" ")[0]} 👋</h2>
          <p className="text-muted-foreground text-sm">Here's your financial overview</p>
        </motion.div>

        {/* Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <StatCard title="Wallet Balance" value={formatCurrency(mockUser.walletBalance)} icon={Wallet} trend={{ value: "12% this month", positive: true }} />
          <StatCard title="Credit Score" value={String(mockUser.creditScore)} subtitle="Excellent" icon={BarChart3} trend={{ value: "+12 pts", positive: true }} />
          <StatCard title="Active Loans" value="3" subtitle="$2,800 outstanding" icon={Users} />
          <StatCard title="Monthly Earnings" value={formatCurrency(365.50)} icon={TrendingUp} trend={{ value: "8.2%", positive: true }} />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Credit Score */}
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="glass-card p-6">
            <h3 className="font-display text-lg font-semibold mb-4">Credit Score</h3>
            <CreditScoreGauge score={mockUser.creditScore} maxScore={mockUser.maxScore} />
            <p className="text-center text-sm text-muted-foreground mt-3">Last updated: Jan 15, 2024</p>
          </motion.div>

          {/* Quick Actions */}
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }} className="glass-card p-6">
            <h3 className="font-display text-lg font-semibold mb-4">Quick Actions</h3>
            <div className="grid grid-cols-2 gap-3">
              {quickActions.map((action) => (
                <button
                  key={action.label}
                  className="flex flex-col items-center gap-2 p-4 rounded-xl bg-secondary/40 hover:bg-secondary/70 border border-border hover:border-primary/20 transition-all duration-200"
                >
                  <div className={`p-3 rounded-full ${action.color}`}>
                    <action.icon className="w-5 h-5" />
                  </div>
                  <span className="text-sm font-medium">{action.label}</span>
                </button>
              ))}
            </div>
          </motion.div>

          {/* Recent Activity */}
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }} className="glass-card p-6">
            <h3 className="font-display text-lg font-semibold mb-4">Recent Activity</h3>
            <div className="space-y-3">
              {transactions.slice(0, 5).map((tx) => (
                <div key={tx.id} className="flex items-center justify-between py-2 border-b border-border/50 last:border-0">
                  <div className="flex items-center gap-3">
                    <div className={`p-2 rounded-lg ${tx.type === 'credit' ? 'bg-success/15' : 'bg-destructive/15'}`}>
                      {tx.type === 'credit' ? <ArrowDownLeft className="w-4 h-4 text-success" /> : <ArrowUpRight className="w-4 h-4 text-destructive" />}
                    </div>
                    <div>
                      <p className="text-sm font-medium">{tx.description}</p>
                      <p className="text-xs text-muted-foreground">{formatDate(tx.date)}</p>
                    </div>
                  </div>
                  <span className={`text-sm font-semibold ${tx.type === 'credit' ? 'text-success' : 'text-destructive'}`}>
                    {tx.type === 'credit' ? '+' : '-'}{formatCurrency(tx.amount)}
                  </span>
                </div>
              ))}
            </div>
          </motion.div>
        </div>
      </div>
    </AppLayout>
  );
}
