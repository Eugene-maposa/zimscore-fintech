import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import Index from "./pages/Index";
import Dashboard from "./pages/Dashboard";
import WalletPage from "./pages/WalletPage";
import ScorePage from "./pages/ScorePage";
import P2PLending from "./pages/P2PLending";
import SMEHub from "./pages/SMEHub";
import Crowdfunding from "./pages/Crowdfunding";
import AdminPortal from "./pages/AdminPortal";
import Login from "./pages/Login";
import Register from "./pages/Register";
import MFIMarketplace from "./pages/MFIMarketplace";
import Notifications from "./pages/Notifications";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/wallet" element={<WalletPage />} />
          <Route path="/score" element={<ScorePage />} />
          <Route path="/p2p" element={<P2PLending />} />
          <Route path="/sme" element={<SMEHub />} />
          <Route path="/crowdfunding" element={<Crowdfunding />} />
          <Route path="/admin" element={<AdminPortal />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
