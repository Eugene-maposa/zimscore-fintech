import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Users, AlertTriangle, CheckCircle, Clock, TrendingUp, DollarSign, Search, Filter } from "lucide-react";
import { AppLayout } from "@/components/layout/AppLayout";
import { loanRequests as initialLoans, formatCurrency, LoanRequest } from "@/lib/mock-data";
import { cn } from "@/lib/utils";
import { toast } from "sonner";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";

const riskColors = { Low: "text-success bg-success/15", Medium: "text-accent bg-accent/15", High: "text-destructive bg-destructive/15" };
const riskIcons = { Low: CheckCircle, Medium: Clock, High: AlertTriangle };

export default function P2PLending() {
  const [loans, setLoans] = useState<LoanRequest[]>(initialLoans);
  const [selectedLoan, setSelectedLoan] = useState<string | null>(null);
  const [bidAmounts, setBidAmounts] = useState<Record<string, string>>({});
  const [riskFilter, setRiskFilter] = useState<string>("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [confirmDialog, setConfirmDialog] = useState<{ open: boolean; loan: LoanRequest | null; amount: number }>({ open: false, loan: null, amount: 0 });
  const [myBids, setMyBids] = useState<{ loanId: string; amount: number; borrower: string; date: string }[]>([]);

  const filteredLoans = loans.filter((loan) => {
    const matchesRisk = riskFilter === "all" || loan.riskRating.toLowerCase() === riskFilter;
    const matchesSearch = loan.borrower.toLowerCase().includes(searchQuery.toLowerCase()) || loan.purpose.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesRisk && matchesSearch;
  });

  const totalInvested = myBids.reduce((sum, b) => sum + b.amount, 0);
  const avgReturn = loans.reduce((sum, l) => sum + l.interestRate, 0) / loans.length;

  const handleBidClick = (loan: LoanRequest) => {
    const amountStr = bidAmounts[loan.id];
    if (!amountStr || isNaN(Number(amountStr)) || Number(amountStr) <= 0) {
      toast.error("Please enter a valid bid amount");
      return;
    }
    const amount = Number(amountStr);
    const remaining = loan.amount * (1 - loan.funded / 100);
    if (amount > remaining) {
      toast.error(`Maximum bid is ${formatCurrency(remaining)}`);
      return;
    }
    setConfirmDialog({ open: true, loan, amount });
  };

  const confirmBid = () => {
    if (!confirmDialog.loan) return;
    const { loan, amount } = confirmDialog;
    const additionalPercent = (amount / loan.amount) * 100;
    setLoans((prev) =>
      prev.map((l) => (l.id === loan.id ? { ...l, funded: Math.min(100, l.funded + additionalPercent) } : l))
    );
    setMyBids((prev) => [...prev, { loanId: loan.id, amount, borrower: loan.borrower, date: new Date().toLocaleDateString() }]);
    setBidAmounts((prev) => ({ ...prev, [loan.id]: "" }));
    setSelectedLoan(null);
    setConfirmDialog({ open: false, loan: null, amount: 0 });
    toast.success(`Successfully placed ${formatCurrency(amount)} bid on ${loan.borrower}'s loan`, {
      description: `Expected return: ${loan.interestRate}% over ${loan.term} months`,
    });
  };

  return (
    <AppLayout title="P2P Lending Marketplace">
      <div className="max-w-5xl mx-auto space-y-6">
        {/* Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {[
            { label: "Active Listings", value: loans.length.toString(), icon: Users, color: "text-primary" },
            { label: "Your Investments", value: formatCurrency(totalInvested), icon: DollarSign, color: "text-success" },
            { label: "Avg. Return Rate", value: `${avgReturn.toFixed(1)}%`, icon: TrendingUp, color: "text-accent" },
          ].map((stat) => (
            <motion.div key={stat.label} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="glass-card p-4">
              <div className="flex items-center gap-3">
                <div className={`p-2 rounded-lg bg-secondary ${stat.color}`}>
                  <stat.icon className="w-5 h-5" />
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">{stat.label}</p>
                  <p className="font-display font-bold text-lg">{stat.value}</p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Filters */}
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input placeholder="Search borrowers or purposes..." value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} className="pl-9 bg-secondary border-border" />
          </div>
          <Tabs value={riskFilter} onValueChange={setRiskFilter}>
            <TabsList className="bg-secondary">
              <TabsTrigger value="all">All</TabsTrigger>
              <TabsTrigger value="low">Low Risk</TabsTrigger>
              <TabsTrigger value="medium">Medium</TabsTrigger>
              <TabsTrigger value="high">High Risk</TabsTrigger>
            </TabsList>
          </Tabs>
        </div>

        {/* Loan List */}
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="glass-card p-6">
          <div className="flex items-center gap-2 mb-1">
            <Users className="w-5 h-5 text-primary" />
            <h3 className="font-display text-lg font-semibold">Loan Marketplace</h3>
          </div>
          <p className="text-sm text-muted-foreground mb-6">Fund borrowers and earn returns on your investment</p>

          <div className="space-y-4">
            {filteredLoans.length === 0 && <p className="text-sm text-muted-foreground text-center py-8">No loans match your filters.</p>}
            {filteredLoans.map((loan) => {
              const RiskIcon = riskIcons[loan.riskRating];
              const remaining = loan.amount * (1 - loan.funded / 100);
              return (
                <motion.div
                  key={loan.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className={cn(
                    "p-4 rounded-xl border transition-all duration-200 cursor-pointer",
                    loan.funded >= 100 ? "border-success/30 bg-success/5 opacity-70" : selectedLoan === loan.id ? "border-primary/40 bg-primary/5" : "border-border hover:border-primary/20 bg-secondary/20"
                  )}
                  onClick={() => loan.funded < 100 && setSelectedLoan(selectedLoan === loan.id ? null : loan.id)}
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
                      <span>{loan.funded >= 100 ? "Fully Funded ✓" : `${Math.round(loan.funded)}% funded`}</span>
                      <span>{formatCurrency(loan.amount * loan.funded / 100)} raised</span>
                    </div>
                    <div className="h-1.5 bg-secondary rounded-full overflow-hidden">
                      <motion.div
                        className={cn("h-full rounded-full", loan.funded >= 100 ? "bg-success" : "bg-primary")}
                        initial={{ width: 0 }}
                        animate={{ width: `${Math.min(100, loan.funded)}%` }}
                        transition={{ duration: 0.5 }}
                      />
                    </div>
                  </div>

                  <AnimatePresence>
                    {selectedLoan === loan.id && loan.funded < 100 && (
                      <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }} exit={{ height: 0, opacity: 0 }} className="overflow-hidden">
                        <div className="mt-4 pt-4 border-t border-border space-y-3">
                          <p className="text-xs text-muted-foreground">Remaining: {formatCurrency(remaining)}</p>
                          <div className="flex gap-3">
                            <Input
                              type="number"
                              placeholder="Enter bid amount"
                              value={bidAmounts[loan.id] || ""}
                              onChange={(e) => setBidAmounts((prev) => ({ ...prev, [loan.id]: e.target.value }))}
                              onClick={(e) => e.stopPropagation()}
                              className="flex-1 bg-secondary border-border"
                              min={1}
                              max={remaining}
                            />
                            <Button onClick={(e) => { e.stopPropagation(); handleBidClick(loan); }} className="glow-primary">
                              Place Bid
                            </Button>
                          </div>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </motion.div>
              );
            })}
          </div>
        </motion.div>

        {/* My Bids */}
        {myBids.length > 0 && (
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="glass-card p-6">
            <h3 className="font-display text-lg font-semibold mb-4">Your Bids</h3>
            <div className="space-y-3">
              {myBids.map((bid, i) => (
                <div key={i} className="flex items-center justify-between p-3 rounded-lg bg-secondary/30 border border-border">
                  <div>
                    <p className="text-sm font-medium">{bid.borrower}</p>
                    <p className="text-xs text-muted-foreground">{bid.date}</p>
                  </div>
                  <p className="font-display font-bold text-success">{formatCurrency(bid.amount)}</p>
                </div>
              ))}
            </div>
          </motion.div>
        )}
      </div>

      {/* Confirm Dialog */}
      <Dialog open={confirmDialog.open} onOpenChange={(open) => !open && setConfirmDialog({ open: false, loan: null, amount: 0 })}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Confirm Bid</DialogTitle>
            <DialogDescription>Review your bid details before confirming.</DialogDescription>
          </DialogHeader>
          {confirmDialog.loan && (
            <div className="space-y-3 py-2">
              <div className="flex justify-between"><span className="text-sm text-muted-foreground">Borrower</span><span className="text-sm font-medium">{confirmDialog.loan.borrower}</span></div>
              <div className="flex justify-between"><span className="text-sm text-muted-foreground">Purpose</span><span className="text-sm font-medium">{confirmDialog.loan.purpose}</span></div>
              <div className="flex justify-between"><span className="text-sm text-muted-foreground">Bid Amount</span><span className="text-sm font-bold text-primary">{formatCurrency(confirmDialog.amount)}</span></div>
              <div className="flex justify-between"><span className="text-sm text-muted-foreground">Interest Rate</span><span className="text-sm font-medium">{confirmDialog.loan.interestRate}%</span></div>
              <div className="flex justify-between"><span className="text-sm text-muted-foreground">Term</span><span className="text-sm font-medium">{confirmDialog.loan.term} months</span></div>
              <div className="flex justify-between"><span className="text-sm text-muted-foreground">Est. Return</span><span className="text-sm font-bold text-success">{formatCurrency(confirmDialog.amount * (1 + confirmDialog.loan.interestRate / 100))}</span></div>
            </div>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => setConfirmDialog({ open: false, loan: null, amount: 0 })}>Cancel</Button>
            <Button onClick={confirmBid} className="glow-primary">Confirm Bid</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </AppLayout>
  );
}
