import { useState } from "react";
import { motion } from "framer-motion";
import { Users, AlertTriangle, CheckCircle, Clock } from "lucide-react";
import { AppLayout } from "@/components/layout/AppLayout";
import { loanRequests, formatCurrency } from "@/lib/mock-data";
import { cn } from "@/lib/utils";

const riskColors = { Low: "text-success bg-success/15", Medium: "text-accent bg-accent/15", High: "text-destructive bg-destructive/15" };
const riskIcons = { Low: CheckCircle, Medium: Clock, High: AlertTriangle };

export default function P2PLending() {
  const [selectedLoan, setSelectedLoan] = useState<string | null>(null);

  return (
    <AppLayout title="P2P Lending Marketplace">
      <div className="max-w-5xl mx-auto space-y-6">
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="glass-card p-6">
          <div className="flex items-center gap-2 mb-1">
            <Users className="w-5 h-5 text-primary" />
            <h3 className="font-display text-lg font-semibold">Loan Marketplace</h3>
          </div>
          <p className="text-sm text-muted-foreground mb-6">Fund borrowers and earn returns on your investment</p>

          <div className="space-y-4">
            {loanRequests.map((loan) => {
              const RiskIcon = riskIcons[loan.riskRating];
              return (
                <motion.div
                  key={loan.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className={cn(
                    "p-4 rounded-xl border transition-all duration-200 cursor-pointer",
                    selectedLoan === loan.id ? "border-primary/40 bg-primary/5" : "border-border hover:border-primary/20 bg-secondary/20"
                  )}
                  onClick={() => setSelectedLoan(selectedLoan === loan.id ? null : loan.id)}
                >
                  <div className="flex items-center justify-between flex-wrap gap-3">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-primary/20 border border-primary/30 flex items-center justify-center text-xs font-bold text-primary">
                        {loan.avatar}
                      </div>
                      <div>
                        <p className="font-semibold text-sm">{loan.borrower}</p>
                        <p className="text-xs text-muted-foreground">{loan.purpose}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-4 flex-wrap">
                      <div className="text-right">
                        <p className="font-display font-bold">{formatCurrency(loan.amount)}</p>
                        <p className="text-xs text-muted-foreground">{loan.interestRate}% · {loan.term}mo</p>
                      </div>
                      <span className={cn("px-2.5 py-1 rounded-full text-xs font-medium flex items-center gap-1", riskColors[loan.riskRating])}>
                        <RiskIcon className="w-3 h-3" /> {loan.riskRating}
                      </span>
                    </div>
                  </div>

                  {/* Funding progress */}
                  <div className="mt-3 space-y-1">
                    <div className="flex justify-between text-xs text-muted-foreground">
                      <span>{loan.funded}% funded</span>
                      <span>{formatCurrency(loan.amount * loan.funded / 100)} raised</span>
                    </div>
                    <div className="h-1.5 bg-secondary rounded-full overflow-hidden">
                      <div className="h-full bg-primary rounded-full transition-all" style={{ width: `${loan.funded}%` }} />
                    </div>
                  </div>

                  {selectedLoan === loan.id && (
                    <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }} className="mt-4 pt-4 border-t border-border">
                      <div className="flex gap-3">
                        <input type="number" placeholder="Enter bid amount" className="flex-1 px-3 py-2 rounded-lg bg-secondary border border-border text-sm outline-none focus:border-primary transition-colors" />
                        <button className="px-5 py-2 rounded-lg bg-primary text-primary-foreground text-sm font-medium hover:bg-primary/90 glow-primary transition-all">
                          Place Bid
                        </button>
                      </div>
                    </motion.div>
                  )}
                </motion.div>
              );
            })}
          </div>
        </motion.div>
      </div>
    </AppLayout>
  );
}
