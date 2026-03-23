import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Shield, Users, DollarSign, Activity, CheckCircle, XCircle, Eye, Loader2 } from "lucide-react";
import { AppLayout } from "@/components/layout/AppLayout";
import { StatCard } from "@/components/dashboard/StatCard";
import { supabase } from "@/integrations/supabase/client";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

interface Profile {
  id: string;
  user_id: string;
  full_name: string;
  verification_status: string;
  created_at: string;
  national_id_front_url: string | null;
  national_id_back_url: string | null;
  passport_photo_url: string | null;
}

export default function AdminPortal() {
  const [profiles, setProfiles] = useState<Profile[]>([]);
  const [loading, setLoading] = useState(true);
  const [viewProfile, setViewProfile] = useState<Profile | null>(null);
  const [docUrls, setDocUrls] = useState<{ front?: string; back?: string; photo?: string }>({});
  const [statusFilter, setStatusFilter] = useState("all");

  useEffect(() => {
    fetchProfiles();
  }, []);

  const fetchProfiles = async () => {
    setLoading(true);
    const { data, error } = await supabase.from("profiles").select("*").order("created_at", { ascending: false });
    if (error) {
      toast.error("Failed to load profiles");
    } else {
      setProfiles(data || []);
    }
    setLoading(false);
  };

  const getSignedUrl = async (path: string | null): Promise<string | undefined> => {
    if (!path) return undefined;
    const { data } = await supabase.storage.from("kyc-documents").createSignedUrl(path, 300);
    return data?.signedUrl;
  };

  const viewDocs = async (profile: Profile) => {
    setViewProfile(profile);
    const [front, back, photo] = await Promise.all([
      getSignedUrl(profile.national_id_front_url),
      getSignedUrl(profile.national_id_back_url),
      getSignedUrl(profile.passport_photo_url),
    ]);
    setDocUrls({ front, back, photo });
  };

  const updateStatus = async (profileId: string, status: string) => {
    const { error } = await supabase.from("profiles").update({ verification_status: status, updated_at: new Date().toISOString() }).eq("id", profileId);
    if (error) {
      toast.error("Failed to update status");
      return;
    }
    setProfiles(prev => prev.map(p => p.id === profileId ? { ...p, verification_status: status } : p));
    toast.success(`User ${status === "verified" ? "approved" : "rejected"}`);
    if (viewProfile?.id === profileId) setViewProfile(null);
  };

  const filtered = statusFilter === "all" ? profiles : profiles.filter(p => p.verification_status === statusFilter);
  const pendingCount = profiles.filter(p => p.verification_status === "pending").length;
  const verifiedCount = profiles.filter(p => p.verification_status === "verified").length;

  const statusColors: Record<string, string> = {
    pending: "bg-accent/15 text-accent",
    verified: "bg-success/15 text-success",
    rejected: "bg-destructive/15 text-destructive",
  };

  return (
    <AppLayout title="Admin Portal">
      <div className="max-w-5xl mx-auto space-y-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <StatCard title="Total Users" value={profiles.length.toString()} icon={Users} />
          <StatCard title="Verified" value={verifiedCount.toString()} icon={CheckCircle} />
          <StatCard title="Pending Verifications" value={pendingCount.toString()} icon={Shield} />
          <StatCard title="Rejected" value={profiles.filter(p => p.verification_status === "rejected").length.toString()} icon={XCircle} />
        </div>

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="glass-card p-6">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 mb-4">
            <h3 className="font-display text-lg font-semibold">User Verifications</h3>
            <div className="flex gap-2">
              {["all", "pending", "verified", "rejected"].map((f) => (
                <button key={f} onClick={() => setStatusFilter(f)}
                  className={`px-3 py-1 rounded-full text-xs font-medium transition-colors ${statusFilter === f ? "bg-primary text-primary-foreground" : "bg-secondary text-muted-foreground hover:text-foreground"}`}>
                  {f.charAt(0).toUpperCase() + f.slice(1)}
                </button>
              ))}
            </div>
          </div>

          {loading ? (
            <div className="flex items-center justify-center py-12">
              <Loader2 className="w-6 h-6 animate-spin text-primary" />
            </div>
          ) : filtered.length === 0 ? (
            <p className="text-sm text-muted-foreground text-center py-8">No users found.</p>
          ) : (
            <div className="space-y-3">
              {filtered.map((profile) => (
                <div key={profile.id} className="flex items-center justify-between p-3 rounded-lg bg-secondary/30 border border-border">
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-full bg-primary/20 border border-primary/30 flex items-center justify-center text-xs font-bold text-primary">
                      {profile.full_name.split(" ").map(n => n[0]).join("").slice(0, 2)}
                    </div>
                    <div>
                      <p className="font-medium text-sm">{profile.full_name}</p>
                      <p className="text-xs text-muted-foreground">{new Date(profile.created_at).toLocaleDateString()}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${statusColors[profile.verification_status] || "bg-muted text-muted-foreground"}`}>
                      {profile.verification_status}
                    </span>
                    <button onClick={() => viewDocs(profile)} className="p-2 rounded-lg bg-primary/10 text-primary hover:bg-primary/20 transition-colors">
                      <Eye className="w-4 h-4" />
                    </button>
                    {profile.verification_status === "pending" && (
                      <>
                        <button onClick={() => updateStatus(profile.id, "verified")} className="p-2 rounded-lg bg-success/15 text-success hover:bg-success/25 transition-colors">
                          <CheckCircle className="w-4 h-4" />
                        </button>
                        <button onClick={() => updateStatus(profile.id, "rejected")} className="p-2 rounded-lg bg-destructive/15 text-destructive hover:bg-destructive/25 transition-colors">
                          <XCircle className="w-4 h-4" />
                        </button>
                      </>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </motion.div>
      </div>

      {/* Document Viewer */}
      <Dialog open={!!viewProfile} onOpenChange={(open) => !open && setViewProfile(null)}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>{viewProfile?.full_name} — KYC Documents</DialogTitle>
            <DialogDescription>Review submitted identity documents</DialogDescription>
          </DialogHeader>
          <div className="grid grid-cols-3 gap-4 py-4">
            <div className="text-center space-y-2">
              <p className="text-xs font-medium text-muted-foreground">ID Front</p>
              {docUrls.front ? <img src={docUrls.front} alt="ID Front" className="w-full h-32 object-cover rounded-lg border border-border" /> : <div className="w-full h-32 bg-secondary rounded-lg flex items-center justify-center text-xs text-muted-foreground">No image</div>}
            </div>
            <div className="text-center space-y-2">
              <p className="text-xs font-medium text-muted-foreground">ID Back</p>
              {docUrls.back ? <img src={docUrls.back} alt="ID Back" className="w-full h-32 object-cover rounded-lg border border-border" /> : <div className="w-full h-32 bg-secondary rounded-lg flex items-center justify-center text-xs text-muted-foreground">No image</div>}
            </div>
            <div className="text-center space-y-2">
              <p className="text-xs font-medium text-muted-foreground">Passport Photo</p>
              {docUrls.photo ? <img src={docUrls.photo} alt="Photo" className="w-full h-32 object-cover rounded-lg border border-border" /> : <div className="w-full h-32 bg-secondary rounded-lg flex items-center justify-center text-xs text-muted-foreground">No image</div>}
            </div>
          </div>
          {viewProfile?.verification_status === "pending" && (
            <div className="flex gap-3 justify-end">
              <Button variant="destructive" onClick={() => updateStatus(viewProfile.id, "rejected")}>Reject</Button>
              <Button onClick={() => updateStatus(viewProfile.id, "verified")} className="glow-primary">Approve</Button>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </AppLayout>
  );
}
