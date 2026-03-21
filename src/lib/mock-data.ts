export interface Transaction {
  id: string;
  type: 'credit' | 'debit';
  description: string;
  amount: number;
  date: string;
  category: string;
}

export interface LoanRequest {
  id: string;
  borrower: string;
  amount: number;
  purpose: string;
  interestRate: number;
  term: number;
  riskRating: 'Low' | 'Medium' | 'High';
  funded: number;
  avatar: string;
}

export const mockUser = {
  name: "Tendai Moyo",
  email: "tendai@zimscore.co.zw",
  avatar: "TM",
  walletBalance: 4250.00,
  lockedBalance: 750.00,
  creditScore: 742,
  maxScore: 850,
  memberSince: "2023-06-15",
};

export const creditBreakdown = [
  { label: "Payment History", score: 92, weight: 35, color: "hsl(160, 84%, 39%)" },
  { label: "Credit Utilization", score: 78, weight: 30, color: "hsl(224, 76%, 48%)" },
  { label: "Credit Length", score: 85, weight: 15, color: "hsl(45, 93%, 58%)" },
  { label: "Credit Mix", score: 70, weight: 10, color: "hsl(280, 70%, 55%)" },
  { label: "New Credit", score: 88, weight: 10, color: "hsl(340, 80%, 55%)" },
];

export const transactions: Transaction[] = [
  { id: "1", type: "credit", description: "Loan Repayment Received", amount: 320.00, date: "2024-01-15", category: "Lending" },
  { id: "2", type: "debit", description: "P2P Loan to J. Nyathi", amount: 500.00, date: "2024-01-14", category: "Lending" },
  { id: "3", type: "credit", description: "Wallet Top-up", amount: 1000.00, date: "2024-01-13", category: "Deposit" },
  { id: "4", type: "debit", description: "SME Invoice Payment", amount: 150.00, date: "2024-01-12", category: "Business" },
  { id: "5", type: "credit", description: "Interest Earned", amount: 45.50, date: "2024-01-11", category: "Interest" },
  { id: "6", type: "debit", description: "Transfer to EcoCash", amount: 200.00, date: "2024-01-10", category: "Transfer" },
];

export const loanRequests: LoanRequest[] = [
  { id: "1", borrower: "John Nyathi", amount: 2500, purpose: "Farm Equipment", interestRate: 12, term: 12, riskRating: "Low", funded: 68, avatar: "JN" },
  { id: "2", borrower: "Grace Chirume", amount: 1000, purpose: "School Fees", interestRate: 8, term: 6, riskRating: "Low", funded: 45, avatar: "GC" },
  { id: "3", borrower: "Peter Zulu", amount: 5000, purpose: "Business Expansion", interestRate: 15, term: 24, riskRating: "Medium", funded: 22, avatar: "PZ" },
  { id: "4", borrower: "Mary Dube", amount: 800, purpose: "Medical Bills", interestRate: 6, term: 3, riskRating: "Low", funded: 90, avatar: "MD" },
  { id: "5", borrower: "Samuel Ncube", amount: 3500, purpose: "Vehicle Purchase", interestRate: 18, term: 18, riskRating: "High", funded: 15, avatar: "SN" },
];

export const monthlyScoreHistory = [
  { month: "Jul", score: 680 },
  { month: "Aug", score: 695 },
  { month: "Sep", score: 702 },
  { month: "Oct", score: 718 },
  { month: "Nov", score: 730 },
  { month: "Dec", score: 735 },
  { month: "Jan", score: 742 },
];

export const formatCurrency = (amount: number) =>
  new Intl.NumberFormat("en-US", { style: "currency", currency: "USD" }).format(amount);

export const formatDate = (dateStr: string) =>
  new Date(dateStr).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
