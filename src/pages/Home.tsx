"use client";

import React, { useRef } from "react";  // ⬅️ added useRef
import { Button } from "@/components/ui/button";
import { motion, useScroll, useTransform } from "framer-motion";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import CollectionCard from "@/components/CollectionCard";
import {
  Users,
  TrendingUp,
  Shield,
  Zap,
  Search,
  Bot,
  Link,
  Ban,
  Key,
  FileText,
  CheckCircle,
  AlertTriangle,
  Globe,
  Star,
  Eye,
  History
} from "lucide-react";

const ScrollTable = ({ children }: { children: React.ReactNode }) => {
  const ref = useRef<HTMLDivElement>(null);

  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"], // smoother, less jumpy
  });

  // Animations (only scale + tilt, no opacity)
  const scale = useTransform(scrollYProgress, [0, 1], [0.95, 1]);
  const rotateX = useTransform(scrollYProgress, [0, 1], [-5, 0]);
  const translateY = useTransform(scrollYProgress, [0, 1], [50, 0]);

  return (
    <div ref={ref} className="relative flex items-center justify-center py-10">
      <motion.div
        style={{
          scale,
          rotateX,
          y: translateY,
          transformPerspective: "1200px",
        }}
        className="w-full max-w-6xl"
      >
        {children}
      </motion.div>
    </div>
  );
};




const Home = () => {
  const solutionFeatures = [
    {
      icon: Search,
      title: "Physical Inspections for High-Value Assets",
      description:
        "Luxury items like art, jewelry, and watches are physically verified and tagged (NFC/QR).",
    },
    {
      icon: Bot,
      title: "AI-Powered MeTTa Agents",
      description:
        "Everyday assets are instantly checked by MeTTa-based autonomous agents – ensuring authenticity, approval, and fraud detection.",
    },
    {
      icon: Link,
      title: "Immutable Blockchain",
      description: "Every ownership transfer, inspection, and sale is recorded forever.",
    },
    {
      icon: Ban,
      title: "Zero Tolerance for Fraud",
      description:
        "Fraudulent actors are blocked, frozen, and their assets are transferred into AuthX custody.",
    },
    {
      icon: Key,
      title: "Controlled Transactions with AuthX Keys",
      description:
        "No trade happens without an AuthX-provided approval key, guaranteeing marketplace security.",
    },
    {
      icon: FileText,
      title: "Automated Smart Contracts",
      description:
        "Royalties, payouts, and ownership transfers happen automatically and transparently.",
    },
  ];

  const workflowSteps = [
    { step: "Create", description: "Mint your phigital asset." },
    { step: "Inspect", description: "Physical inspection for expensive assets." },
    { step: "Verify", description: "MeTTa verification for affordable assets." },
    { step: "Approve", description: "AI agents + AuthX team validate authenticity." },
    { step: "List", description: "Asset is live on the AuthX Marketplace with a verified trust badge." },
    { step: "Trade", description: "Transactions execute via smart contracts + AuthX approval key." },
    { step: "Verify", description: "Buyers access the full history of the asset." },
    { step: "Secure", description: "Fraud attempts instantly blocked, assets frozen, offenders blacklisted." },
  ];

  return (
    <div className="min-h-screen bg-gradient-dark">
      {/* Hero Section */}
      <section className="relative py-20 px-6 h-screen flex items-center">
        <div className="absolute inset-0 bg-gradient-glow opacity-10 blur-3xl z-0" />
        <div className="max-w-7xl mx-auto relative z-10">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-6 flex flex-col justify-center">
              <h1 className="text-5xl lg:text-6xl font-bold leading-tight">
                The Trust-First
                <br />
                Marketplace for
                <br />
                <span className="gradient-text">Phigital Assets</span>
              </h1>
              <p className="text-lg text-muted-foreground max-w-md">
                Trade physical and digital assets with complete transparency. Every
                item authenticated, every transaction traceable.
              </p>
              <div className="flex gap-4">
                <Button className="bg-gradient-primary hover:opacity-90 text-primary-foreground border-0 px-8 py-6 text-lg">
                  Start Trading
                </Button>
                <Button
                  variant="outline"
                  className="px-8 py-6 text-lg border-border/50 hover:bg-card/50"
                >
                  Learn More
                </Button>
              </div>
            </div>
            <div className="flex justify-center lg:justify-end">
              <img
                src="/ring.png"
                alt="Digital Ring"
                className="w-80 h-80 lg:w-96 lg:h-96 object-contain max-w-full"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Top Sellers & Creators + Stats */}
      <section className="py-16 px-6">
        <div className="max-w-7xl mx-auto">
        <h2 className="text-4xl font-extrabold mb-10 text-center text-white tracking-tight">
      Top Sellers & Creators
    </h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8 mb-12">
      {[
        { name: "Elixir Queen", volume: "234 ETH" },
        { name: "Pixel Wizard", volume: "189 ETH" },
        { name: "Meta Vision", volume: "156 ETH" },
        { name: "Crypto Sage", volume: "142 ETH" },
      ].map((creator, index) => (
        <div
          key={index}
          className="p-6 text-center rounded-xl bg-white/10 backdrop-blur-lg border border-white/20 hover:scale-105 transition-transform duration-300"
        >
          <div className="w-14 h-14 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full mx-auto mb-4 animate-pulse" />
          <h3 className="font-semibold text-lg text-white">{creator.name}</h3>
          <p className="text-sm text-gray-400">Volume: {creator.volume}</p>
        </div>
      ))}
    </div>
    <div className="grid md:grid-cols-4 gap-8">
      {[
        { icon: "Users", value: "250K+", label: "Active Users", color: "text-purple-400" },
        { icon: "TrendingUp", value: "$2.5B", label: "Trading Volume", color: "text-pink-400" },
        { icon: "Shield", value: "99.9%", label: "Verified Assets", color: "text-green-400" },
        { icon: "Zap", value: "<2s", label: "Verification Time", color: "text-yellow-400" },
      ].map((stat, index) => (
        <div
          key={index}
          className="p-6 text-center rounded-xl bg-white/10 backdrop-blur-lg border border-white/20 hover:shadow-xl transition-shadow duration-300"
        >
          <div className={`w-8 h-8 ${stat.color} mx-auto mb-3`}>
            <svg
              className="w-8 h-8"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d={
                  stat.icon === "Users"
                    ? "M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z"
                    : stat.icon === "TrendingUp"
                    ? "M13 7h8m0 0v8m0-8l-8 8-4-4-6 6"
                    : stat.icon === "Shield"
                    ? "M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                    : "M13 10V3L4 14h7v7l9-11h-7z"
                }
              />
            </svg>
          </div>
          <div className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-purple-400 to-pink-400">
            {stat.value}
          </div>
          <p className="text-sm text-gray-400 mt-1">{stat.label}</p>
        </div>
      ))}
        </div>
        </div>
      </section>


      
      <section className="min-h-screen flex items-center py-20 px-6 bg-gradient-to-br from-destructive/5 to-transparent">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl lg:text-5xl font-bold mb-6">Why Trust Is Broken in Digital Marketplaces</h2>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            <Card className="glass-card p-8 text-center hover:scale-105 transition-all duration-300">
              <AlertTriangle className="w-12 h-12 text-destructive mx-auto mb-4" />
              <h3 className="text-xl font-semibold mb-3">Counterfeits plague luxury collectibles</h3>
              <p className="text-muted-foreground">Fake luxury items flood the market, deceiving buyers and damaging brand reputation.</p>
            </Card>
            <Card className="glass-card p-8 text-center hover:scale-105 transition-all duration-300">
              <Bot className="w-12 h-12 text-destructive mx-auto mb-4" />
              <h3 className="text-xl font-semibold mb-3">Anyone can mint fake NFTs</h3>
              <p className="text-muted-foreground">No verification process allows fraudulent digital assets to enter the ecosystem.</p>
            </Card>
            <Card className="glass-card p-8 text-center hover:scale-105 transition-all duration-300">
              <Eye className="w-12 h-12 text-destructive mx-auto mb-4" />
              <h3 className="text-xl font-semibold mb-3">Buyers can't confirm what's real</h3>
              <p className="text-muted-foreground">Lack of verification tools leaves buyers uncertain about asset authenticity.</p>
            </Card>
            <Card className="glass-card p-8 text-center hover:scale-105 transition-all duration-300">
              <TrendingUp className="w-12 h-12 text-destructive mx-auto mb-4" />
              <h3 className="text-xl font-semibold mb-3">Sellers lose credibility and revenue</h3>
              <p className="text-muted-foreground">Trust issues reduce market participation and legitimate seller profits.</p>
            </Card>
            <Card className="glass-card p-8 text-center hover:scale-105 transition-all duration-300 md:col-span-2 lg:col-span-1">
              <Shield className="w-12 h-12 text-destructive mx-auto mb-4" />
              <h3 className="text-xl font-semibold mb-3">A digital economy full of uncertainty</h3>
              <p className="text-muted-foreground">The result is a marketplace where trust is compromised and transactions are risky.</p>
            </Card>
          </div>

          <div className="text-center mt-16">
            <div className="inline-flex items-center gap-3 bg-gradient-primary/10 px-8 py-4 rounded-full border border-primary/20">
              <Star className="w-6 h-6 text-primary" />
              <span className="text-xl font-semibold gradient-text">AuthX is here to fix it.</span>
            </div>
          </div>
        </div>
      </section>

      {/* Section 2 – Our Solution */}
      <section className="min-h-screen flex items-center py-20 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl lg:text-5xl font-bold mb-6">Verified. Protected. Automated.</h2>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              The AuthX Difference - a comprehensive solution that combines AI, blockchain, and real-world verification
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {solutionFeatures.map((feature, index) => (
              <Card key={index} className="glass-card p-8 hover:scale-105 transition-all duration-300">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-gradient-primary/20 rounded-xl flex items-center justify-center flex-shrink-0">
                    <feature.icon className="w-6 h-6 text-primary" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold mb-3">{feature.title}</h3>
                    <p className="text-muted-foreground text-sm">{feature.description}</p>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Section 3 – How It Works */}
      <section className="min-h-screen flex items-center py-20 px-6 bg-gradient-to-br from-[#0A0F2C] to-[#020617]">
  <div className="max-w-7xl mx-auto w-full">
    {/* Header */}
    <div className="mb-12">
      <p className="text-sm text-blue-400 font-semibold mb-2">8 Secure Points</p>
      <h2 className="text-4xl lg:text-5xl font-bold text-white">
        Secure, Reliable , and Transparent Workflow
      </h2>
    </div>

    {/* Steps Grid */}
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
      {workflowSteps.map((step, index) => (
        <div
          key={index}
          className="bg-[#0F173A] rounded-xl p-8 text-left shadow-lg border border-white/10"
        >
          <p className="text-lg font-semibold text-white mb-3">
            0{index + 1}. {step.step}
          </p>
          <p className="text-gray-400 text-sm">{step.description}</p>
        </div>
      ))}
    </div>

    {/* CTA */}
    <div className="flex flex-col md:flex-row items-center justify-between gap-6 bg-[#0F173A] p-6 rounded-xl border border-white/10">
      <div className="flex items-center gap-4">
        {/* Avatars */}
        <div className="flex -space-x-3">
          <img src="https://i.pravatar.cc/40?img=1" className="w-10 h-10 rounded-full border-2 border-[#0F173A]" />
          <img src="https://i.pravatar.cc/40?img=2" className="w-10 h-10 rounded-full border-2 border-[#0F173A]" />
          <img src="https://i.pravatar.cc/40?img=3" className="w-10 h-10 rounded-full border-2 border-[#0F173A]" />
          <img src="https://i.pravatar.cc/40?img=4" className="w-10 h-10 rounded-full border-2 border-[#0F173A]" />
        </div>
        <p className="text-gray-300">
          With AuthX {" "}
          <span className="font-semibold text-white">Choose Quality Buy Quality </span>
        </p>
      </div>

      <button className="px-6 py-3 bg-gradient-to-r from-blue-500 to-indigo-500 text-white rounded-full font-semibold shadow-lg hover:opacity-90 transition">
        Buy Now →
      </button>
    </div>
  </div>
</section>

      {/* Section 4 – Why AuthX Is Different */}
       {/* Section 4 – Why AuthX Is Different */}
       <section className="min-h-screen flex items-center py-20 px-6">
        <div className="max-w-7xl mx-auto w-full">
          <div className="text-center mb-16">
            <h2 className="text-4xl lg:text-5xl font-bold mb-6">Not Just NFTs. Verified Phigital Assets.</h2>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">See how AuthX compares to traditional NFT marketplaces</p>
          </div>

          {/* ✅ Table with Scroll Animation */}
          <ScrollTable>
            <Card className="glass-card p-8 w-full overflow-x-auto">
              <table className="w-full min-w-[720px]">
                <thead>
                  <tr className="border-b border-border/50">
                    <th className="text-left py-4 px-6 font-semibold">Feature</th>
                    <th className="text-center py-4 px-6 font-semibold">Traditional NFT Markets</th>
                    <th className="text-center py-4 px-6 font-semibold">AuthX</th>
                  </tr>
                </thead>
                <tbody>
                  <tr className="border-b border-border/20">
                    <td className="py-4 px-6 font-medium">Anyone can mint</td>
                    <td className="py-4 px-6 text-center"><CheckCircle className="w-5 h-5 text-success inline" /></td>
                    <td className="py-4 px-6 text-center"><Ban className="w-5 h-5 text-destructive inline" /></td>
                  </tr>
                  <tr className="border-b border-border/20">
                    <td className="py-4 px-6 font-medium">Physical inspection</td>
                    <td className="py-4 px-6 text-center"><Ban className="w-5 h-5 text-destructive inline" /></td>
                    <td className="py-4 px-6 text-center"><CheckCircle className="w-5 h-5 text-success inline" /></td>
                  </tr>
                  <tr className="border-b border-border/20">
                    <td className="py-4 px-6 font-medium">AI-powered approval</td>
                    <td className="py-4 px-6 text-center"><Ban className="w-5 h-5 text-destructive inline" /></td>
                    <td className="py-4 px-6 text-center"><CheckCircle className="w-5 h-5 text-success inline" /></td>
                  </tr>
                  <tr className="border-b border-border/20">
                    <td className="py-4 px-6 font-medium">Fraud detection</td>
                    <td className="py-4 px-6 text-center"><span className="text-muted-foreground">Weak</span></td>
                    <td className="py-4 px-6 text-center"><span className="text-primary font-semibold">Freeze + custody</span></td>
                  </tr>
                  <tr className="border-b border-border/20">
                    <td className="py-4 px-6 font-medium">Royalties</td>
                    <td className="py-4 px-6 text-center"><span className="text-muted-foreground">Sometimes</span></td>
                    <td className="py-4 px-6 text-center"><span className="text-primary font-semibold">Guaranteed</span></td>
                  </tr>
                  <tr className="border-b border-border/20">
                    <td className="py-4 px-6 font-medium">Ownership history</td>
                    <td className="py-4 px-6 text-center"><span className="text-muted-foreground">Limited</span></td>
                    <td className="py-4 px-6 text-center"><span className="text-primary font-semibold">Full + immutable</span></td>
                  </tr>
                  <tr>
                    <td className="py-4 px-6 font-medium">Transaction control</td>
                    <td className="py-4 px-6 text-center"><span className="text-muted-foreground">Open</span></td>
                    <td className="py-4 px-6 text-center"><span className="text-primary font-semibold">Secured by AuthX Key</span></td>
                  </tr>
                </tbody>
              </table>
            </Card>
          </ScrollTable>
        </div>
      </section>

    </div>
  );
};

export default Home;
