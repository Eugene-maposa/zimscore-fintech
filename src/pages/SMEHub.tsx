import { useState } from "react";
import { motion } from "framer-motion";
import { Building2, FileText, DollarSign, BarChart3, ArrowRight, Plus, Send, Download, TrendingUp, TrendingDown } from "lucide-react";
import { AppLayout } from "@/components/layout/AppLayout";
import { formatCurrency } from "@/lib/mock-data";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";

interface Invoice {
  id: string;
  client: string;
  amount: number;
  status: "draft" | "sent" | "paid";
  date: string;
  description: string;
}

interface MicroLoan {
  id: string;
  amount: number;
  purpose: string;
  status: "pending" | "approved" | "rejected";
  date: string;
  term: number;
}

const tools = [
  { id: "invoice", title: "Create Invoice", description: "Generate professional invoices for your clients", icon: FileText, color: "bg-primary/15 text-primary" },
  { id: "loans", title: "Micro Loans", description: "Quick funding up to $5,000 for your business", icon: DollarSign, color: "bg-success/15 text-success" },
  { id: "analytics", title: "Business Analytics", description: "Track revenue, expenses, and cash flow", icon: BarChart3, color: "bg-accent/15 text-accent" },
  { id: "register", title: "Business Registration", description: "Register and formalize your business", icon: Building2, color: "bg-purple-500/15 text-purple-400" },
];

const mockAnalytics = {
  revenue: 12450,
  expenses: 8320,
  profit: 4130,
  monthlyData: [
    { month: "Aug", revenue: 1800, expenses: 1200 },
    { month: "Sep", revenue: 2100, expenses: 1400 },
    { month: "Oct", revenue: 1950, expenses: 1300 },
    { month: "Nov", revenue: 2400, expenses: 1500 },
    { month: "Dec", revenue: 2200, expenses: 1600 },
    { month: "Jan", revenue: 2000, expenses: 1320 },
  ],
};

export default function SMEHub() {
  const [activeModal, setActiveModal] = useState<string | null>(null);
  const [invoices, setInvoices] = useState<Invoice[]>([
    { id: "INV-001", client: "Harare Supplies Co.", amount: 1200, status: "paid", date: "2024-01-10", description: "Office supplies delivery" },
    { id: "INV-002", client: "Bulawayo Tech Ltd.", amount: 3500, status: "sent", date: "2024-01-12", description: "IT consulting services" },
  ]);
  const [microLoans, setMicroLoans] = useState<MicroLoan[]>([
    { id: "ML-001", amount: 2000, purpose: "Inventory purchase", status: "approved", date: "2024-01-05", term: 6 },
  ]);

  // Invoice form
  const [invClient, setInvClient] = useState("");
  const [invAmount, setInvAmount] = useState("");
  const [invDesc, setInvDesc] = useState("");

  // Loan form
  const [loanAmount, setLoanAmount] = useState("");
  const [loanPurpose, setLoanPurpose] = useState("");
  const [loanTerm, setLoanTerm] = useState("6");

  // Registration form
  const [bizName, setBizName] = useState("");
  const [bizType, setBizType] = useState("");
  const [bizOwner, setBizOwner] = useState("");

  const handleCreateInvoice = () => {
    if (!invClient || !invAmount || !invDesc) { toast.error("Please fill in all fields"); return; }
    const newInv: Invoice = {
      id: `INV-${String(invoices.length + 1).padStart(3, "0")}`,
      client: invClient, amount: Number(invAmount), description: invDesc,
      status: "draft", date: new Date().toISOString().split("T")[0],
    };
    setInvoices((prev) => [newInv, ...prev]);
    setInvClient(""); setInvAmount(""); setInvDesc("");
    toast.success(`Invoice ${newInv.id} created`, { description: `${formatCurrency(newInv.amount)} for ${newInv.client}` });
  };

  const sendInvoice = (id: string) => {
    setInvoices((prev) => prev.map((inv) => inv.id === id ? { ...inv, status: "sent" } : inv));
    toast.success(`Invoice ${id} sent to client`);
  };

  const markPaid = (id: string) => {
    setInvoices((prev) => prev.map((inv) => inv.id === id ? { ...inv, status: "paid" } : inv));
    toast.success(`Invoice ${id} marked as paid`);
  };

  const handleApplyLoan = () => {
    if (!loanAmount || !loanPurpose) { toast.error("Please fill in all fields"); return; }
    const amt = Number(loanAmount);
    if (amt > 5000) { toast.error("Maximum micro loan is $5,000"); return; }
    const newLoan: MicroLoan = {
      id: `ML-${String(microLoans.length + 1).padStart(3, "0")}`,
      amount: amt, purpose: loanPurpose, term: Number(loanTerm),
      status: "pending", date: new Date().toISOString().split("T")[0],
    };
    setMicroLoans((prev) => [newLoan, ...prev]);
    setLoanAmount(""); setLoanPurpose(""); setLoanTerm("6");
    toast.success("Loan application submitted", { description: "You'll be notified once reviewed" });
  };

  const handleRegisterBusiness = () => {
    if (!bizName || !bizType || !bizOwner) { toast.error("Please fill in all fields"); return; }
    toast.success("Business registration submitted!", { description: `${bizName} is being processed. You'll receive confirmation within 3-5 business days.` });
    setBizName(""); setBizType(""); setBizOwner("");
    setActiveModal(null);
  };

  const statusColors = { draft: "bg-muted text-muted-foreground", sent: "bg-accent/15 text-accent", paid: "bg-success/15 text-success", pending: "bg-accent/15 text-accent", approved: "bg-success/15 text-success", rejected: "bg-destructive/15 text-destructive" };

  return (
    <AppLayout title="SME Hub">
      <div className="max-w-5xl mx-auto space-y-6">
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
          <h2 className="font-display text-2xl font-bold">Small Business Tools</h2>
          <p className="text-muted-foreground text-sm">Everything you need to grow your business</p>
        </motion.div>

        {/* Tool Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {tools.map((tool, i) => (
            <motion.div key={tool.id} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.1 }}
              className="glass-card-hover p-6 cursor-pointer group" onClick={() => setActiveModal(tool.id)}>
              <div className="flex items-start gap-4">
                <div className={`p-3 rounded-xl ${tool.color}`}><tool.icon className="w-6 h-6" /></div>
                <div className="flex-1">
                  <h3 className="font-display font-semibold mb-1">{tool.title}</h3>
                  <p className="text-sm text-muted-foreground">{tool.description}</p>
                </div>
                <ArrowRight className="w-5 h-5 text-muted-foreground group-hover:text-primary group-hover:translate-x-1 transition-all" />
              </div>
            </motion.div>
          ))}
        </div>

        {/* Invoice Modal */}
        <Dialog open={activeModal === "invoice"} onOpenChange={(open) => !open && setActiveModal(null)}>
          <DialogContent className="max-w-2xl max-h-[85vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Invoice Manager</DialogTitle>
              <DialogDescription>Create and manage invoices for your clients</DialogDescription>
            </DialogHeader>
            <Tabs defaultValue="create">
              <TabsList className="w-full"><TabsTrigger value="create" className="flex-1">Create New</TabsTrigger><TabsTrigger value="list" className="flex-1">All Invoices ({invoices.length})</TabsTrigger></TabsList>
              <TabsContent value="create" className="space-y-4 pt-4">
                <div className="space-y-2"><Label>Client Name</Label><Input placeholder="e.g. Harare Supplies Co." value={invClient} onChange={(e) => setInvClient(e.target.value)} /></div>
                <div className="space-y-2"><Label>Amount (USD)</Label><Input type="number" placeholder="0.00" value={invAmount} onChange={(e) => setInvAmount(e.target.value)} /></div>
                <div className="space-y-2"><Label>Description</Label><Input placeholder="Services rendered..." value={invDesc} onChange={(e) => setInvDesc(e.target.value)} /></div>
                <Button onClick={handleCreateInvoice} className="w-full"><Plus className="w-4 h-4 mr-2" /> Create Invoice</Button>
              </TabsContent>
              <TabsContent value="list" className="space-y-3 pt-4">
                {invoices.map((inv) => (
                  <div key={inv.id} className="p-4 rounded-lg bg-secondary/30 border border-border">
                    <div className="flex items-center justify-between mb-2">
                      <div>
                        <p className="font-semibold text-sm">{inv.id} — {inv.client}</p>
                        <p className="text-xs text-muted-foreground">{inv.description}</p>
                      </div>
                      <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${statusColors[inv.status]}`}>{inv.status}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <p className="font-display font-bold">{formatCurrency(inv.amount)}</p>
                      <div className="flex gap-2">
                        {inv.status === "draft" && <Button size="sm" variant="outline" onClick={() => sendInvoice(inv.id)}><Send className="w-3 h-3 mr-1" /> Send</Button>}
                        {inv.status === "sent" && <Button size="sm" variant="outline" onClick={() => markPaid(inv.id)}><DollarSign className="w-3 h-3 mr-1" /> Mark Paid</Button>}
                      </div>
                    </div>
                  </div>
                ))}
              </TabsContent>
            </Tabs>
          </DialogContent>
        </Dialog>

        {/* Micro Loans Modal */}
        <Dialog open={activeModal === "loans"} onOpenChange={(open) => !open && setActiveModal(null)}>
          <DialogContent className="max-w-2xl max-h-[85vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Micro Loans</DialogTitle>
              <DialogDescription>Quick funding up to $5,000 for your business</DialogDescription>
            </DialogHeader>
            <Tabs defaultValue="apply">
              <TabsList className="w-full"><TabsTrigger value="apply" className="flex-1">Apply</TabsTrigger><TabsTrigger value="history" className="flex-1">My Loans ({microLoans.length})</TabsTrigger></TabsList>
              <TabsContent value="apply" className="space-y-4 pt-4">
                <div className="space-y-2"><Label>Loan Amount (USD, max $5,000)</Label><Input type="number" placeholder="0.00" max={5000} value={loanAmount} onChange={(e) => setLoanAmount(e.target.value)} /></div>
                <div className="space-y-2"><Label>Purpose</Label><Input placeholder="e.g. Inventory purchase" value={loanPurpose} onChange={(e) => setLoanPurpose(e.target.value)} /></div>
                <div className="space-y-2"><Label>Term (months)</Label>
                  <select value={loanTerm} onChange={(e) => setLoanTerm(e.target.value)} className="w-full h-10 rounded-md border border-input bg-background px-3 text-sm">
                    <option value="3">3 months</option><option value="6">6 months</option><option value="12">12 months</option>
                  </select>
                </div>
                {loanAmount && Number(loanAmount) > 0 && Number(loanAmount) <= 5000 && (
                  <div className="p-3 rounded-lg bg-primary/5 border border-primary/20 text-sm space-y-1">
                    <p className="font-medium">Estimated Repayment</p>
                    <p className="text-muted-foreground">Monthly: {formatCurrency(Number(loanAmount) * 1.08 / Number(loanTerm))}</p>
                    <p className="text-muted-foreground">Total: {formatCurrency(Number(loanAmount) * 1.08)} (8% interest)</p>
                  </div>
                )}
                <Button onClick={handleApplyLoan} className="w-full">Submit Application</Button>
              </TabsContent>
              <TabsContent value="history" className="space-y-3 pt-4">
                {microLoans.map((loan) => (
                  <div key={loan.id} className="p-4 rounded-lg bg-secondary/30 border border-border flex items-center justify-between">
                    <div>
                      <p className="font-semibold text-sm">{loan.id} — {loan.purpose}</p>
                      <p className="text-xs text-muted-foreground">{loan.term} months · {loan.date}</p>
                    </div>
                    <div className="text-right">
                      <p className="font-display font-bold">{formatCurrency(loan.amount)}</p>
                      <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${statusColors[loan.status]}`}>{loan.status}</span>
                    </div>
                  </div>
                ))}
              </TabsContent>
            </Tabs>
          </DialogContent>
        </Dialog>

        {/* Analytics Modal */}
        <Dialog open={activeModal === "analytics"} onOpenChange={(open) => !open && setActiveModal(null)}>
          <DialogContent className="max-w-2xl max-h-[85vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Business Analytics</DialogTitle>
              <DialogDescription>Overview of your business performance</DialogDescription>
            </DialogHeader>
            <div className="grid grid-cols-3 gap-3">
              {[
                { label: "Revenue", value: mockAnalytics.revenue, icon: TrendingUp, color: "text-success" },
                { label: "Expenses", value: mockAnalytics.expenses, icon: TrendingDown, color: "text-destructive" },
                { label: "Profit", value: mockAnalytics.profit, icon: DollarSign, color: "text-primary" },
              ].map((s) => (
                <div key={s.label} className="p-3 rounded-lg bg-secondary/30 border border-border text-center">
                  <s.icon className={`w-5 h-5 mx-auto mb-1 ${s.color}`} />
                  <p className="text-xs text-muted-foreground">{s.label}</p>
                  <p className="font-display font-bold">{formatCurrency(s.value)}</p>
                </div>
              ))}
            </div>
            <div className="space-y-2 pt-2">
              <h4 className="font-semibold text-sm">Monthly Breakdown</h4>
              {mockAnalytics.monthlyData.map((m) => (
                <div key={m.month} className="flex items-center gap-3 text-sm">
                  <span className="w-8 text-muted-foreground">{m.month}</span>
                  <div className="flex-1 flex gap-1 h-5">
                    <div className="bg-success/30 rounded" style={{ width: `${(m.revenue / 2500) * 100}%` }} title={`Revenue: ${formatCurrency(m.revenue)}`} />
                    <div className="bg-destructive/30 rounded" style={{ width: `${(m.expenses / 2500) * 100}%` }} title={`Expenses: ${formatCurrency(m.expenses)}`} />
                  </div>
                  <span className="text-xs font-medium text-success w-16 text-right">{formatCurrency(m.revenue - m.expenses)}</span>
                </div>
              ))}
              <div className="flex gap-4 text-xs text-muted-foreground pt-1">
                <span className="flex items-center gap-1"><span className="w-3 h-3 rounded bg-success/30" /> Revenue</span>
                <span className="flex items-center gap-1"><span className="w-3 h-3 rounded bg-destructive/30" /> Expenses</span>
              </div>
            </div>
          </DialogContent>
        </Dialog>

        {/* Business Registration Modal */}
        <Dialog open={activeModal === "register"} onOpenChange={(open) => !open && setActiveModal(null)}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Business Registration</DialogTitle>
              <DialogDescription>Register and formalize your business</DialogDescription>
            </DialogHeader>
            <div className="space-y-4">
              <div className="space-y-2"><Label>Business Name</Label><Input placeholder="e.g. Moyo Trading" value={bizName} onChange={(e) => setBizName(e.target.value)} /></div>
              <div className="space-y-2"><Label>Business Type</Label>
                <select value={bizType} onChange={(e) => setBizType(e.target.value)} className="w-full h-10 rounded-md border border-input bg-background px-3 text-sm">
                  <option value="">Select type...</option><option value="sole">Sole Proprietorship</option><option value="partnership">Partnership</option><option value="pvt">Private Limited (Pvt Ltd)</option><option value="coop">Cooperative</option>
                </select>
              </div>
              <div className="space-y-2"><Label>Owner Full Name</Label><Input placeholder="Full legal name" value={bizOwner} onChange={(e) => setBizOwner(e.target.value)} /></div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setActiveModal(null)}>Cancel</Button>
              <Button onClick={handleRegisterBusiness}>Submit Registration</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </AppLayout>
  );
}
