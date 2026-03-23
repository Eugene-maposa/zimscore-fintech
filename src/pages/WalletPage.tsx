import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Wallet, ArrowUpRight, ArrowDownLeft, Lock, Filter, Plus, Minus, Copy, Download, Search } from "lucide-react";
import { AppLayout } from "@/components/layout/AppLayout";
import { StatCard } from "@/components/dashboard/StatCard";
import { mockUser, transactions as initialTransactions, formatCurrency, formatDate, Transaction } from "@/lib/mock-data";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { toast } from "sonner";

export default function WalletPage() {
  const [filter, setFilter] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [transactions, setTransactions] = useState<Transaction[]>(initialTransactions);
  const [balance, setBalance] = useState(mockUser.walletBalance);
  const [lockedBalance] = useState(mockUser.lockedBalance);
  const [depositOpen, setDepositOpen] = useState(false);
  const [withdrawOpen, setWithdrawOpen] = useState(false);
  const [amount, setAmount] = useState("");
  const [method, setMethod] = useState("ecocash");
  const [accountRef, setAccountRef] = useState("");

  const filtered = transactions.filter((t) => {
    const matchesType = filter === "all" || t.type === filter;
    const matchesSearch = t.description.toLowerCase().includes(searchQuery.toLowerCase()) || t.category.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesType && matchesSearch;
  });

  const totalIncome = transactions.filter(t => t.type === "credit").reduce((s, t) => s + t.amount, 0);
  const totalExpenses = transactions.filter(t => t.type === "debit").reduce((s, t) => s + t.amount, 0);

  const handleDeposit = () => {
    const amt = Number(amount);
    if (!amt || amt <= 0) { toast.error("Enter a valid amount"); return; }
    if (amt > 10000) { toast.error("Maximum deposit is $10,000"); return; }
    setBalance(prev => prev + amt);
    const newTx: Transaction = {
      id: String(Date.now()),
      type: "credit",
      description: `Deposit via ${method === "ecocash" ? "EcoCash" : method === "bank" ? "Bank Transfer" : "USD Cash"}`,
      amount: amt,
      date: new Date().toISOString().split("T")[0],
      category: "Deposit",
    };
    setTransactions(prev => [newTx, ...prev]);
    toast.success(`${formatCurrency(amt)} deposited successfully`, { description: `Via ${method === "ecocash" ? "EcoCash" : method === "bank" ? "Bank Transfer" : "USD Cash"}` });
    setDepositOpen(false);
    setAmount("");
    setAccountRef("");
  };

  const handleWithdraw = () => {
    const amt = Number(amount);
    if (!amt || amt <= 0) { toast.error("Enter a valid amount"); return; }
    if (amt > balance) { toast.error(`Insufficient balance. Available: ${formatCurrency(balance)}`); return; }
    if (!accountRef.trim()) { toast.error("Please enter account/phone number"); return; }
    setBalance(prev => prev - amt);
    const newTx: Transaction = {
      id: String(Date.now()),
      type: "debit",
      description: `Withdrawal to ${method === "ecocash" ? "EcoCash" : method === "bank" ? "Bank Account" : "Cash Pickup"}`,
      amount: amt,
      date: new Date().toISOString().split("T")[0],
      category: "Withdrawal",
    };
    setTransactions(prev => [newTx, ...prev]);
    toast.success(`${formatCurrency(amt)} withdrawn successfully`, { description: `To ${accountRef}` });
    setWithdrawOpen(false);
    setAmount("");
    setAccountRef("");
  };

  const copyWalletId = () => {
    navigator.clipboard.writeText("ZIM-WAL-" + mockUser.name.replace(/\s/g, "").toUpperCase().slice(0, 6) + "-7742");
    toast.success("Wallet ID copied to clipboard");
  };

  const exportTransactions = () => {
    const csv = ["Date,Description,Category,Type,Amount"]
      .concat(filtered.map(t => `${t.date},"${t.description}",${t.category},${t.type},${t.type === "credit" ? "" : "-"}${t.amount}`))
      .join("\n");
    const blob = new Blob([csv], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "transactions.csv";
    a.click();
    URL.revokeObjectURL(url);
    toast.success("Transactions exported");
  };

  const quickAmounts = [50, 100, 250, 500, 1000];

  return (
    <AppLayout title="Wallet">
      <div className="max-w-5xl mx-auto space-y-6">
        {/* Balances */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <StatCard title="Available Balance" value={formatCurrency(balance)} icon={Wallet} trend={{ value: `${((totalIncome - totalExpenses) / (totalIncome || 1) * 100).toFixed(0)}% net`, positive: totalIncome > totalExpenses }} />
          <StatCard title="Locked Balance" value={formatCurrency(lockedBalance)} subtitle="In active loans" icon={Lock} />
          <StatCard title="Total Balance" value={formatCurrency(balance + lockedBalance)} icon={Wallet} />
        </div>

        {/* Wallet ID + Actions */}
        <div className="flex flex-col sm:flex-row gap-3 items-start sm:items-center justify-between">
          <div className="flex gap-3">
            <Button onClick={() => setDepositOpen(true)} className="glow-primary">
              <Plus className="w-4 h-4 mr-2" /> Deposit
            </Button>
            <Button variant="outline" onClick={() => setWithdrawOpen(true)}>
              <Minus className="w-4 h-4 mr-2" /> Withdraw
            </Button>
          </div>
          <button onClick={copyWalletId} className="flex items-center gap-2 text-xs text-muted-foreground hover:text-foreground transition-colors px-3 py-1.5 rounded-lg bg-secondary/50 border border-border">
            <Copy className="w-3 h-3" /> Wallet ID: ZIM-WAL-{mockUser.name.replace(/\s/g, "").toUpperCase().slice(0, 6)}-7742
          </button>
        </div>

        {/* Income/Expense summary */}
        <div className="grid grid-cols-2 gap-4">
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="glass-card p-4 flex items-center gap-3">
            <div className="p-2 rounded-lg bg-success/15"><ArrowDownLeft className="w-5 h-5 text-success" /></div>
            <div>
              <p className="text-xs text-muted-foreground">Total Income</p>
              <p className="font-display font-bold text-success">{formatCurrency(totalIncome)}</p>
            </div>
          </motion.div>
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.05 }} className="glass-card p-4 flex items-center gap-3">
            <div className="p-2 rounded-lg bg-destructive/15"><ArrowUpRight className="w-5 h-5 text-destructive" /></div>
            <div>
              <p className="text-xs text-muted-foreground">Total Expenses</p>
              <p className="font-display font-bold text-destructive">{formatCurrency(totalExpenses)}</p>
            </div>
          </motion.div>
        </div>

        {/* Transaction History */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="glass-card p-6">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 mb-4">
            <h3 className="font-display text-lg font-semibold">Transaction History</h3>
            <div className="flex items-center gap-2 flex-wrap">
              <Button size="sm" variant="outline" onClick={exportTransactions}>
                <Download className="w-3 h-3 mr-1" /> Export
              </Button>
              <Tabs value={filter} onValueChange={setFilter}>
                <TabsList className="h-8">
                  <TabsTrigger value="all" className="text-xs px-3 h-6">All</TabsTrigger>
                  <TabsTrigger value="credit" className="text-xs px-3 h-6">Income</TabsTrigger>
                  <TabsTrigger value="debit" className="text-xs px-3 h-6">Expenses</TabsTrigger>
                </TabsList>
              </Tabs>
            </div>
          </div>

          <div className="relative mb-4">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input placeholder="Search transactions..." value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} className="pl-9 bg-secondary border-border" />
          </div>

          <div className="space-y-1">
            <AnimatePresence>
              {filtered.map((tx) => (
                <motion.div
                  key={tx.id}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 10 }}
                  className="flex items-center justify-between p-3 rounded-lg hover:bg-secondary/40 transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <div className={`p-2 rounded-lg ${tx.type === 'credit' ? 'bg-success/15' : 'bg-destructive/15'}`}>
                      {tx.type === 'credit' ? <ArrowDownLeft className="w-4 h-4 text-success" /> : <ArrowUpRight className="w-4 h-4 text-destructive" />}
                    </div>
                    <div>
                      <p className="text-sm font-medium">{tx.description}</p>
                      <p className="text-xs text-muted-foreground">{formatDate(tx.date)} · {tx.category}</p>
                    </div>
                  </div>
                  <span className={`text-sm font-semibold ${tx.type === 'credit' ? 'text-success' : 'text-destructive'}`}>
                    {tx.type === 'credit' ? '+' : '-'}{formatCurrency(tx.amount)}
                  </span>
                </motion.div>
              ))}
            </AnimatePresence>
            {filtered.length === 0 && (
              <p className="text-sm text-muted-foreground text-center py-8">No transactions match your search.</p>
            )}
          </div>
        </motion.div>
      </div>

      {/* Deposit Dialog */}
      <Dialog open={depositOpen} onOpenChange={setDepositOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Deposit Funds</DialogTitle>
            <DialogDescription>Add money to your ZimScore wallet</DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-2">
            <div className="space-y-2">
              <Label>Payment Method</Label>
              <div className="grid grid-cols-3 gap-2">
                {[{ id: "ecocash", label: "EcoCash" }, { id: "bank", label: "Bank Transfer" }, { id: "cash", label: "USD Cash" }].map((m) => (
                  <button key={m.id} onClick={() => setMethod(m.id)}
                    className={`py-2 px-3 rounded-lg text-xs font-medium border transition-colors ${method === m.id ? "bg-primary/15 border-primary/40 text-primary" : "bg-secondary border-border text-muted-foreground hover:text-foreground"}`}>
                    {m.label}
                  </button>
                ))}
              </div>
            </div>
            <div className="space-y-2">
              <Label>Amount (USD)</Label>
              <Input type="number" placeholder="0.00" value={amount} onChange={(e) => setAmount(e.target.value)} min={1} max={10000} />
              <div className="flex gap-2 flex-wrap">
                {quickAmounts.map((qa) => (
                  <button key={qa} onClick={() => setAmount(String(qa))} className="px-3 py-1 rounded-full text-xs bg-secondary border border-border hover:border-primary/30 transition-colors">
                    ${qa}
                  </button>
                ))}
              </div>
            </div>
            {amount && Number(amount) > 0 && (
              <div className="p-3 rounded-lg bg-success/5 border border-success/20 text-sm">
                <p className="text-muted-foreground">New balance: <span className="text-success font-bold">{formatCurrency(balance + Number(amount))}</span></p>
              </div>
            )}
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDepositOpen(false)}>Cancel</Button>
            <Button onClick={handleDeposit} className="glow-primary">Deposit {amount ? formatCurrency(Number(amount)) : ""}</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Withdraw Dialog */}
      <Dialog open={withdrawOpen} onOpenChange={setWithdrawOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Withdraw Funds</DialogTitle>
            <DialogDescription>Transfer money from your wallet</DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-2">
            <div className="space-y-2">
              <Label>Withdrawal Method</Label>
              <div className="grid grid-cols-3 gap-2">
                {[{ id: "ecocash", label: "EcoCash" }, { id: "bank", label: "Bank Account" }, { id: "cash", label: "Cash Pickup" }].map((m) => (
                  <button key={m.id} onClick={() => setMethod(m.id)}
                    className={`py-2 px-3 rounded-lg text-xs font-medium border transition-colors ${method === m.id ? "bg-primary/15 border-primary/40 text-primary" : "bg-secondary border-border text-muted-foreground hover:text-foreground"}`}>
                    {m.label}
                  </button>
                ))}
              </div>
            </div>
            <div className="space-y-2">
              <Label>{method === "ecocash" ? "Phone Number" : method === "bank" ? "Account Number" : "Pickup Reference"}</Label>
              <Input placeholder={method === "ecocash" ? "077X XXX XXXX" : method === "bank" ? "Enter account number" : "Enter reference"} value={accountRef} onChange={(e) => setAccountRef(e.target.value)} />
            </div>
            <div className="space-y-2">
              <Label>Amount (USD)</Label>
              <Input type="number" placeholder="0.00" value={amount} onChange={(e) => setAmount(e.target.value)} min={1} max={balance} />
              <p className="text-xs text-muted-foreground">Available: {formatCurrency(balance)}</p>
              <div className="flex gap-2 flex-wrap">
                {quickAmounts.filter(a => a <= balance).map((qa) => (
                  <button key={qa} onClick={() => setAmount(String(qa))} className="px-3 py-1 rounded-full text-xs bg-secondary border border-border hover:border-primary/30 transition-colors">
                    ${qa}
                  </button>
                ))}
              </div>
            </div>
            {amount && Number(amount) > 0 && Number(amount) <= balance && (
              <div className="p-3 rounded-lg bg-destructive/5 border border-destructive/20 text-sm">
                <p className="text-muted-foreground">Remaining balance: <span className="text-foreground font-bold">{formatCurrency(balance - Number(amount))}</span></p>
              </div>
            )}
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setWithdrawOpen(false)}>Cancel</Button>
            <Button variant="destructive" onClick={handleWithdraw}>Withdraw {amount ? formatCurrency(Number(amount)) : ""}</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </AppLayout>
  );
}
