import { motion } from "framer-motion";
import { Building2, FileText, DollarSign, BarChart3, ArrowRight } from "lucide-react";
import { AppLayout } from "@/components/layout/AppLayout";

const tools = [
  { title: "Create Invoice", description: "Generate professional invoices for your clients", icon: FileText, color: "bg-primary/15 text-primary" },
  { title: "Micro Loans", description: "Quick funding up to $5,000 for your business", icon: DollarSign, color: "bg-success/15 text-success" },
  { title: "Business Analytics", description: "Track revenue, expenses, and cash flow", icon: BarChart3, color: "bg-accent/15 text-accent" },
  { title: "Business Registration", description: "Register and formalize your business", icon: Building2, color: "bg-purple-500/15 text-purple-400" },
];

export default function SMEHub() {
  return (
    <AppLayout title="SME Hub">
      <div className="max-w-5xl mx-auto space-y-6">
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
          <h2 className="font-display text-2xl font-bold">Small Business Tools</h2>
          <p className="text-muted-foreground text-sm">Everything you need to grow your business</p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {tools.map((tool, i) => (
            <motion.div
              key={tool.title}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
              className="glass-card-hover p-6 cursor-pointer group"
            >
              <div className="flex items-start gap-4">
                <div className={`p-3 rounded-xl ${tool.color}`}>
                  <tool.icon className="w-6 h-6" />
                </div>
                <div className="flex-1">
                  <h3 className="font-display font-semibold mb-1">{tool.title}</h3>
                  <p className="text-sm text-muted-foreground">{tool.description}</p>
                </div>
                <ArrowRight className="w-5 h-5 text-muted-foreground group-hover:text-primary group-hover:translate-x-1 transition-all" />
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </AppLayout>
  );
}
