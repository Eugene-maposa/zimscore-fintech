import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Rocket, Users, Clock, Plus, Heart, Share2, Search, TrendingUp } from "lucide-react";
import { AppLayout } from "@/components/layout/AppLayout";
import { formatCurrency } from "@/lib/mock-data";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";

interface Project {
  id: number;
  title: string;
  description: string;
  goal: number;
  raised: number;
  backers: number;
  daysLeft: number;
  category: string;
  creator: string;
}

const initialProjects: Project[] = [
  { id: 1, title: "Solar Farm in Masvingo", description: "Community solar energy project powering 200 homes with clean, sustainable energy.", goal: 15000, raised: 11250, backers: 87, daysLeft: 14, category: "Energy", creator: "Masvingo Council" },
  { id: 2, title: "Tech Hub Harare", description: "Co-working space and incubator for tech startups in downtown Harare.", goal: 25000, raised: 8500, backers: 42, daysLeft: 28, category: "Technology", creator: "ZimTech Foundation" },
  { id: 3, title: "Clean Water Bulawayo", description: "Water purification system for rural communities in Matabeleland.", goal: 8000, raised: 7200, backers: 124, daysLeft: 5, category: "Infrastructure", creator: "WaterAid Zim" },
  { id: 4, title: "Mobile Clinic Network", description: "Health services for remote farming communities across rural Zimbabwe.", goal: 20000, raised: 4000, backers: 31, daysLeft: 45, category: "Health", creator: "HealthBridge" },
];

const categories = ["All", "Energy", "Technology", "Infrastructure", "Health", "Education", "Agriculture"];

export default function Crowdfunding() {
  const [projects, setProjects] = useState<Project[]>(initialProjects);
  const [categoryFilter, setCategoryFilter] = useState("All");
  const [searchQuery, setSearchQuery] = useState("");
  const [backDialog, setBackDialog] = useState<Project | null>(null);
  const [backAmount, setBackAmount] = useState("");
  const [createOpen, setCreateOpen] = useState(false);
  const [detailProject, setDetailProject] = useState<Project | null>(null);
  const [myBackings, setMyBackings] = useState<{ projectId: number; amount: number; date: string }[]>([]);

  // Create project form
  const [newTitle, setNewTitle] = useState("");
  const [newDesc, setNewDesc] = useState("");
  const [newGoal, setNewGoal] = useState("");
  const [newCategory, setNewCategory] = useState("Technology");
  const [newDays, setNewDays] = useState("30");

  const filtered = projects.filter((p) => {
    const matchesCat = categoryFilter === "All" || p.category === categoryFilter;
    const matchesSearch = p.title.toLowerCase().includes(searchQuery.toLowerCase()) || p.description.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCat && matchesSearch;
  });

  const totalBacked = myBackings.reduce((s, b) => s + b.amount, 0);
  const projectsBacked = new Set(myBackings.map(b => b.projectId)).size;

  const handleBack = () => {
    if (!backDialog) return;
    const amt = Number(backAmount);
    if (!amt || amt <= 0) { toast.error("Enter a valid amount"); return; }
    const remaining = backDialog.goal - backDialog.raised;
    if (amt > remaining) { toast.error(`Maximum contribution is ${formatCurrency(remaining)}`); return; }

    setProjects(prev => prev.map(p =>
      p.id === backDialog.id ? { ...p, raised: p.raised + amt, backers: p.backers + 1 } : p
    ));
    setMyBackings(prev => [...prev, { projectId: backDialog.id, amount: amt, date: new Date().toLocaleDateString() }]);
    toast.success(`Thank you! ${formatCurrency(amt)} contributed to ${backDialog.title}`, {
      description: "Your contribution makes a difference!",
    });
    setBackDialog(null);
    setBackAmount("");
  };

  const handleCreateProject = () => {
    if (!newTitle.trim() || !newDesc.trim() || !newGoal) {
      toast.error("Please fill in all fields");
      return;
    }
    const goal = Number(newGoal);
    if (goal < 100) { toast.error("Minimum goal is $100"); return; }

    const newProject: Project = {
      id: Date.now(),
      title: newTitle,
      description: newDesc,
      goal,
      raised: 0,
      backers: 0,
      daysLeft: Number(newDays),
      category: newCategory,
      creator: "You",
    };
    setProjects(prev => [newProject, ...prev]);
    toast.success("Project created!", { description: "Your project is now live for funding" });
    setCreateOpen(false);
    setNewTitle(""); setNewDesc(""); setNewGoal(""); setNewCategory("Technology"); setNewDays("30");
  };

  const shareProject = (project: Project) => {
    navigator.clipboard.writeText(`Check out "${project.title}" on ZimScore Crowdfunding!`);
    toast.success("Link copied to clipboard!");
  };

  const quickBackAmounts = [10, 25, 50, 100, 250];

  return (
    <AppLayout title="Crowdfunding">
      <div className="max-w-5xl mx-auto space-y-6">
        {/* Header */}
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
          <div>
            <h2 className="font-display text-2xl font-bold">Community Projects</h2>
            <p className="text-muted-foreground text-sm">Fund projects that make a difference</p>
          </div>
          <Button onClick={() => setCreateOpen(true)} className="glow-primary">
            <Plus className="w-4 h-4 mr-2" /> Create Project
          </Button>
        </motion.div>

        {/* Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {[
            { label: "Active Projects", value: projects.length.toString(), icon: Rocket, color: "text-primary" },
            { label: "Your Contributions", value: formatCurrency(totalBacked), icon: Heart, color: "text-success" },
            { label: "Projects Backed", value: projectsBacked.toString(), icon: TrendingUp, color: "text-accent" },
          ].map((stat) => (
            <motion.div key={stat.label} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="glass-card p-4 flex items-center gap-3">
              <div className={`p-2 rounded-lg bg-secondary ${stat.color}`}><stat.icon className="w-5 h-5" /></div>
              <div>
                <p className="text-xs text-muted-foreground">{stat.label}</p>
                <p className="font-display font-bold text-lg">{stat.value}</p>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Filters */}
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input placeholder="Search projects..." value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} className="pl-9 bg-secondary border-border" />
          </div>
          <div className="flex gap-1.5 flex-wrap">
            {categories.map((cat) => (
              <button key={cat} onClick={() => setCategoryFilter(cat)}
                className={`px-3 py-1.5 rounded-full text-xs font-medium transition-colors ${categoryFilter === cat ? "bg-primary text-primary-foreground" : "bg-secondary text-muted-foreground hover:text-foreground border border-border"}`}>
                {cat}
              </button>
            ))}
          </div>
        </div>

        {/* Project Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {filtered.length === 0 && (
            <p className="text-sm text-muted-foreground text-center py-8 col-span-2">No projects match your filters.</p>
          )}
          {filtered.map((project, i) => {
            const pct = Math.min(100, (project.raised / project.goal) * 100);
            const isFullyFunded = pct >= 100;
            return (
              <motion.div
                key={project.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.05 }}
                className={`glass-card-hover p-5 ${isFullyFunded ? "opacity-80" : ""}`}
              >
                <div className="flex items-center gap-2 mb-3">
                  <span className="px-2.5 py-0.5 rounded-full bg-primary/15 text-primary text-xs font-medium">{project.category}</span>
                  {isFullyFunded && <span className="px-2.5 py-0.5 rounded-full bg-success/15 text-success text-xs font-medium">Fully Funded ✓</span>}
                  <div className="flex items-center gap-1 text-xs text-muted-foreground ml-auto">
                    <Clock className="w-3 h-3" /> {project.daysLeft} days left
                  </div>
                </div>

                <h3 className="font-display font-semibold mb-1 cursor-pointer hover:text-primary transition-colors" onClick={() => setDetailProject(project)}>
                  {project.title}
                </h3>
                <p className="text-sm text-muted-foreground mb-1">{project.description}</p>
                <p className="text-xs text-muted-foreground mb-3">by {project.creator}</p>

                <div className="space-y-2">
                  <div className="h-2 bg-secondary rounded-full overflow-hidden">
                    <motion.div
                      className={`h-full rounded-full ${isFullyFunded ? "bg-success" : "bg-gradient-to-r from-primary to-success"}`}
                      initial={{ width: 0 }}
                      animate={{ width: `${pct}%` }}
                      transition={{ duration: 0.8 }}
                    />
                  </div>
                  <div className="flex justify-between text-xs">
                    <span className="font-semibold">{formatCurrency(project.raised)} <span className="text-muted-foreground font-normal">of {formatCurrency(project.goal)}</span></span>
                    <span className="flex items-center gap-1 text-muted-foreground"><Users className="w-3 h-3" /> {project.backers} backers</span>
                  </div>
                </div>

                <div className="flex gap-2 mt-4">
                  <button
                    disabled={isFullyFunded}
                    onClick={() => setBackDialog(project)}
                    className="flex-1 py-2 rounded-lg bg-primary/10 text-primary text-sm font-medium hover:bg-primary/20 border border-primary/20 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {isFullyFunded ? "Fully Funded" : "Back This Project"}
                  </button>
                  <button onClick={() => shareProject(project)} className="p-2 rounded-lg bg-secondary border border-border hover:border-primary/30 transition-colors">
                    <Share2 className="w-4 h-4 text-muted-foreground" />
                  </button>
                </div>
              </motion.div>
            );
          })}
        </div>

        {/* My Backings */}
        {myBackings.length > 0 && (
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="glass-card p-6">
            <h3 className="font-display text-lg font-semibold mb-4">Your Contributions</h3>
            <div className="space-y-3">
              {myBackings.map((b, i) => {
                const proj = projects.find(p => p.id === b.projectId);
                return (
                  <div key={i} className="flex items-center justify-between p-3 rounded-lg bg-secondary/30 border border-border">
                    <div>
                      <p className="text-sm font-medium">{proj?.title || "Project"}</p>
                      <p className="text-xs text-muted-foreground">{b.date}</p>
                    </div>
                    <p className="font-display font-bold text-success">{formatCurrency(b.amount)}</p>
                  </div>
                );
              })}
            </div>
          </motion.div>
        )}
      </div>

      {/* Back Project Dialog */}
      <Dialog open={!!backDialog} onOpenChange={(open) => !open && setBackDialog(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Back "{backDialog?.title}"</DialogTitle>
            <DialogDescription>Contribute to this community project</DialogDescription>
          </DialogHeader>
          {backDialog && (
            <div className="space-y-4 py-2">
              <div className="p-3 rounded-lg bg-secondary/30 border border-border text-sm">
                <div className="flex justify-between mb-1">
                  <span className="text-muted-foreground">Goal</span>
                  <span className="font-medium">{formatCurrency(backDialog.goal)}</span>
                </div>
                <div className="flex justify-between mb-1">
                  <span className="text-muted-foreground">Raised</span>
                  <span className="font-medium text-success">{formatCurrency(backDialog.raised)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Remaining</span>
                  <span className="font-bold">{formatCurrency(backDialog.goal - backDialog.raised)}</span>
                </div>
              </div>
              <div className="space-y-2">
                <Label>Contribution Amount (USD)</Label>
                <Input type="number" placeholder="0.00" value={backAmount} onChange={(e) => setBackAmount(e.target.value)} min={1} />
                <div className="flex gap-2 flex-wrap">
                  {quickBackAmounts.map((qa) => (
                    <button key={qa} onClick={() => setBackAmount(String(qa))} className="px-3 py-1 rounded-full text-xs bg-secondary border border-border hover:border-primary/30 transition-colors">
                      ${qa}
                    </button>
                  ))}
                </div>
              </div>
              {backAmount && Number(backAmount) > 0 && (
                <div className="p-3 rounded-lg bg-success/5 border border-success/20 text-sm text-muted-foreground">
                  New total: <span className="text-success font-bold">{formatCurrency(backDialog.raised + Number(backAmount))}</span> ({((backDialog.raised + Number(backAmount)) / backDialog.goal * 100).toFixed(0)}% funded)
                </div>
              )}
            </div>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => setBackDialog(null)}>Cancel</Button>
            <Button onClick={handleBack} className="glow-primary">Contribute {backAmount ? formatCurrency(Number(backAmount)) : ""}</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Create Project Dialog */}
      <Dialog open={createOpen} onOpenChange={setCreateOpen}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle>Create a Project</DialogTitle>
            <DialogDescription>Start a crowdfunding campaign for your community initiative</DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-2">
            <div className="space-y-2"><Label>Project Title</Label><Input placeholder="e.g. Solar Panels for School" value={newTitle} onChange={(e) => setNewTitle(e.target.value)} /></div>
            <div className="space-y-2"><Label>Description</Label><Textarea placeholder="Describe your project and its impact..." value={newDesc} onChange={(e) => setNewDesc(e.target.value)} rows={3} /></div>
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-2">
                <Label>Funding Goal (USD)</Label>
                <Input type="number" placeholder="5000" value={newGoal} onChange={(e) => setNewGoal(e.target.value)} min={100} />
              </div>
              <div className="space-y-2">
                <Label>Duration (days)</Label>
                <select value={newDays} onChange={(e) => setNewDays(e.target.value)} className="w-full h-10 rounded-md border border-input bg-background px-3 text-sm">
                  <option value="15">15 days</option><option value="30">30 days</option><option value="45">45 days</option><option value="60">60 days</option><option value="90">90 days</option>
                </select>
              </div>
            </div>
            <div className="space-y-2">
              <Label>Category</Label>
              <div className="flex gap-2 flex-wrap">
                {categories.filter(c => c !== "All").map((cat) => (
                  <button key={cat} onClick={() => setNewCategory(cat)}
                    className={`px-3 py-1.5 rounded-full text-xs font-medium border transition-colors ${newCategory === cat ? "bg-primary/15 border-primary/40 text-primary" : "bg-secondary border-border text-muted-foreground"}`}>
                    {cat}
                  </button>
                ))}
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setCreateOpen(false)}>Cancel</Button>
            <Button onClick={handleCreateProject} className="glow-primary"><Rocket className="w-4 h-4 mr-2" /> Launch Project</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Project Detail Dialog */}
      <Dialog open={!!detailProject} onOpenChange={(open) => !open && setDetailProject(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{detailProject?.title}</DialogTitle>
            <DialogDescription>by {detailProject?.creator}</DialogDescription>
          </DialogHeader>
          {detailProject && (
            <div className="space-y-4 py-2">
              <p className="text-sm text-muted-foreground">{detailProject.description}</p>
              <div className="space-y-2">
                <div className="h-2.5 bg-secondary rounded-full overflow-hidden">
                  <div className="h-full bg-gradient-to-r from-primary to-success rounded-full" style={{ width: `${Math.min(100, (detailProject.raised / detailProject.goal) * 100)}%` }} />
                </div>
                <div className="grid grid-cols-3 gap-3 text-center text-sm">
                  <div><p className="font-display font-bold text-success">{formatCurrency(detailProject.raised)}</p><p className="text-xs text-muted-foreground">Raised</p></div>
                  <div><p className="font-display font-bold">{detailProject.backers}</p><p className="text-xs text-muted-foreground">Backers</p></div>
                  <div><p className="font-display font-bold">{detailProject.daysLeft}</p><p className="text-xs text-muted-foreground">Days Left</p></div>
                </div>
              </div>
              <div className="flex gap-2">
                <Button className="flex-1 glow-primary" onClick={() => { setDetailProject(null); setBackDialog(detailProject); }}>Back This Project</Button>
                <Button variant="outline" onClick={() => shareProject(detailProject)}><Share2 className="w-4 h-4" /></Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </AppLayout>
  );
}
