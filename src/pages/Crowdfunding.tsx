import { motion } from "framer-motion";
import { Rocket, Users, Clock } from "lucide-react";
import { AppLayout } from "@/components/layout/AppLayout";
import { formatCurrency } from "@/lib/mock-data";

const projects = [
  { id: 1, title: "Solar Farm in Masvingo", description: "Community solar energy project powering 200 homes", goal: 15000, raised: 11250, backers: 87, daysLeft: 14, category: "Energy" },
  { id: 2, title: "Tech Hub Harare", description: "Co-working space and incubator for tech startups", goal: 25000, raised: 8500, backers: 42, daysLeft: 28, category: "Technology" },
  { id: 3, title: "Clean Water Bulawayo", description: "Water purification system for rural communities", goal: 8000, raised: 7200, backers: 124, daysLeft: 5, category: "Infrastructure" },
  { id: 4, title: "Mobile Clinic Network", description: "Health services for remote farming communities", goal: 20000, raised: 4000, backers: 31, daysLeft: 45, category: "Health" },
];

export default function Crowdfunding() {
  return (
    <AppLayout title="Crowdfunding">
      <div className="max-w-5xl mx-auto space-y-6">
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
          <h2 className="font-display text-2xl font-bold">Community Projects</h2>
          <p className="text-muted-foreground text-sm">Fund projects that make a difference</p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {projects.map((project, i) => (
            <motion.div
              key={project.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
              className="glass-card-hover p-5 cursor-pointer"
            >
              <div className="flex items-center gap-2 mb-3">
                <span className="px-2.5 py-0.5 rounded-full bg-primary/15 text-primary text-xs font-medium">{project.category}</span>
                <div className="flex items-center gap-1 text-xs text-muted-foreground ml-auto">
                  <Clock className="w-3 h-3" /> {project.daysLeft} days left
                </div>
              </div>
              <h3 className="font-display font-semibold mb-1">{project.title}</h3>
              <p className="text-sm text-muted-foreground mb-4">{project.description}</p>

              <div className="space-y-2">
                <div className="h-2 bg-secondary rounded-full overflow-hidden">
                  <div className="h-full bg-gradient-to-r from-primary to-success rounded-full" style={{ width: `${(project.raised / project.goal) * 100}%` }} />
                </div>
                <div className="flex justify-between text-xs">
                  <span className="font-semibold">{formatCurrency(project.raised)} <span className="text-muted-foreground font-normal">of {formatCurrency(project.goal)}</span></span>
                  <span className="flex items-center gap-1 text-muted-foreground"><Users className="w-3 h-3" /> {project.backers}</span>
                </div>
              </div>

              <button className="w-full mt-4 py-2 rounded-lg bg-primary/10 text-primary text-sm font-medium hover:bg-primary/20 border border-primary/20 transition-colors">
                Back This Project
              </button>
            </motion.div>
          ))}
        </div>
      </div>
    </AppLayout>
  );
}
