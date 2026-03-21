import { motion } from "framer-motion";
import { Shield, Users, DollarSign, Activity, CheckCircle, XCircle } from "lucide-react";
import { AppLayout } from "@/components/layout/AppLayout";
import { StatCard } from "@/components/dashboard/StatCard";

const pendingUsers = [
  { name: "Alice Mutasa", email: "alice@mail.co.zw", status: "pending", date: "Jan 15, 2024" },
  { name: "Brian Chimedza", email: "brian@mail.co.zw", status: "pending", date: "Jan 14, 2024" },
  { name: "Clara Dzviti", email: "clara@mail.co.zw", status: "pending", date: "Jan 13, 2024" },
];

export default function AdminPortal() {
  return (
    <AppLayout title="Admin Portal">
      <div className="max-w-5xl mx-auto space-y-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <StatCard title="Total Users" value="2,847" icon={Users} trend={{ value: "5.2%", positive: true }} />
          <StatCard title="Active Loans" value="342" icon={DollarSign} />
          <StatCard title="Platform Volume" value="$1.2M" icon={Activity} trend={{ value: "18%", positive: true }} />
          <StatCard title="Pending Verifications" value="12" icon={Shield} />
        </div>

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="glass-card p-6">
          <h3 className="font-display text-lg font-semibold mb-4">Pending Verifications</h3>
          <div className="space-y-3">
            {pendingUsers.map((user) => (
              <div key={user.email} className="flex items-center justify-between p-3 rounded-lg bg-secondary/30 border border-border">
                <div>
                  <p className="font-medium text-sm">{user.name}</p>
                  <p className="text-xs text-muted-foreground">{user.email} · {user.date}</p>
                </div>
                <div className="flex gap-2">
                  <button className="p-2 rounded-lg bg-success/15 text-success hover:bg-success/25 transition-colors">
                    <CheckCircle className="w-4 h-4" />
                  </button>
                  <button className="p-2 rounded-lg bg-destructive/15 text-destructive hover:bg-destructive/25 transition-colors">
                    <XCircle className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </motion.div>
      </div>
    </AppLayout>
  );
}
