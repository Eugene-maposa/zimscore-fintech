import { motion } from "framer-motion";
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts";
import { AppLayout } from "@/components/layout/AppLayout";
import { CreditScoreGauge } from "@/components/dashboard/CreditScoreGauge";
import { mockUser, creditBreakdown, monthlyScoreHistory } from "@/lib/mock-data";
import { TrendingUp, Lightbulb } from "lucide-react";

const tips = [
  "Pay all bills on time to maintain your excellent payment history.",
  "Keep credit utilization below 30% for optimal scoring.",
  "Diversify your credit types with a mix of loans and credit lines.",
  "Avoid opening too many new credit accounts at once.",
];

export default function ScorePage() {
  return (
    <AppLayout title="Credit Score">
      <div className="max-w-5xl mx-auto space-y-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Gauge */}
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="glass-card p-6 flex flex-col items-center">
            <h3 className="font-display text-lg font-semibold mb-4">Your Credit Score</h3>
            <CreditScoreGauge score={mockUser.creditScore} maxScore={mockUser.maxScore} />
          </motion.div>

          {/* Score History */}
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="glass-card p-6">
            <div className="flex items-center gap-2 mb-4">
              <TrendingUp className="w-5 h-5 text-primary" />
              <h3 className="font-display text-lg font-semibold">Score History</h3>
            </div>
            <ResponsiveContainer width="100%" height={200}>
              <LineChart data={monthlyScoreHistory}>
                <XAxis dataKey="month" stroke="hsl(215, 20%, 55%)" fontSize={12} tickLine={false} axisLine={false} />
                <YAxis domain={[650, 800]} stroke="hsl(215, 20%, 55%)" fontSize={12} tickLine={false} axisLine={false} />
                <Tooltip
                  contentStyle={{ background: "hsl(222, 40%, 10%)", border: "1px solid hsl(222, 30%, 18%)", borderRadius: "8px", color: "hsl(210, 40%, 96%)" }}
                />
                <Line type="monotone" dataKey="score" stroke="hsl(224, 76%, 48%)" strokeWidth={2.5} dot={{ fill: "hsl(224, 76%, 48%)", r: 4 }} />
              </LineChart>
            </ResponsiveContainer>
          </motion.div>
        </div>

        {/* Breakdown */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="glass-card p-6">
          <h3 className="font-display text-lg font-semibold mb-4">Score Breakdown</h3>
          <div className="space-y-4">
            {creditBreakdown.map((item) => (
              <div key={item.label} className="space-y-1">
                <div className="flex justify-between text-sm">
                  <span>{item.label} <span className="text-muted-foreground">({item.weight}%)</span></span>
                  <span className="font-semibold">{item.score}/100</span>
                </div>
                <div className="h-2 bg-secondary rounded-full overflow-hidden">
                  <motion.div
                    className="h-full rounded-full"
                    style={{ background: item.color }}
                    initial={{ width: 0 }}
                    animate={{ width: `${item.score}%` }}
                    transition={{ duration: 1.5, ease: "easeOut" }}
                  />
                </div>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Tips */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }} className="glass-card p-6">
          <div className="flex items-center gap-2 mb-4">
            <Lightbulb className="w-5 h-5 text-accent" />
            <h3 className="font-display text-lg font-semibold">Improvement Tips</h3>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {tips.map((tip, i) => (
              <div key={i} className="p-3 rounded-lg bg-secondary/40 border border-border text-sm text-muted-foreground">
                {tip}
              </div>
            ))}
          </div>
        </motion.div>
      </div>
    </AppLayout>
  );
}
