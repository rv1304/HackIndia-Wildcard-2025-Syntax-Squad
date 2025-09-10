import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";
import DebugPanel from "./components/DebugPanel";
import Home from "./pages/Home";
import Dashboard from "./pages/Dashboard";
import Verification from "./pages/Verification";
import Marketplace from "./pages/Marketplace";
import ProductDetail from "./pages/ProductDetail";
import ProductListing from "./pages/ProductListing"; 
import NotFound from "./pages/NotFound";
import Mint from "./pages/Mint";
import MyNfts from "./pages/MyNfts";
import Login from "./pages/Login";
import AdminApprovals from "./pages/AdminApprovals";
import SellNft from "./pages/SellNft";
import WalletTest from "./pages/WalletTest";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <div className="min-h-screen bg-gradient-dark">
          <Navbar />
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/dashboard" element={<Dashboard />} />
            
            <Route path="/verification" element={<Verification />} />
            <Route path="/marketplace" element={<Marketplace />} />
            <Route path="/product/:id" element={<ProductDetail />} />
            <Route path="/list-product" element={<ProductListing />} /> 
            <Route path="/mint" element={<Mint />} />
            <Route path="/my-nfts" element={<MyNfts />} />
            <Route path="/sell-nft" element={<SellNft />} />
            <Route path="/login" element={<Login />} />
            <Route path="/admin/approvals" element={<AdminApprovals />} />
            <Route path="/wallet-test" element={<WalletTest />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
          <DebugPanel />
        </div>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
