import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {TopSellers} from "@/components/TopSellers";
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
      <section className="relative py-20 px-6 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-glow opacity-10 blur-3xl" />

        <div className="max-w-7xl mx-auto relative">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-6">
              <h1 className="text-5xl lg:text-6xl font-bold leading-tight">
                The Trust-First
                <br />
                Marketplace for
                <br />
                <span className="gradient-text">Phigital Assets</span>
              </h1>

              <p className="text-lg text-muted-foreground max-w-md">
                Trade physical and digital assets with complete transparency. Every item
                authenticated, every transaction traceable.
              </p>

              <div className="flex gap-4">
                <Button className="bg-gradient-primary hover:opacity-90 text-primary-foreground border-0 px-8 py-6 text-lg">
                  Start Trading
                </Button>
                <Button variant="outline" className="px-8 py-6 text-lg border-border/50 hover:bg-card/50">
                  Learn More
                </Button>
              </div>
            </div>

            <div className="flex justify-center lg:justify-end">
              <img src="/ring.png" alt="Digital Ring" className="w-80 h-80 lg:w-96 lg:h-96 object-contain" />
            </div>
          </div>
        </div>
      </section>

      {/* Top Sellers & Creators + Stats */}
      <section className="py-16 px-6">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-3xl font-bold mb-8">Top Sellers & Creators</h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
            <Card className="glass-card p-6 text-center">
              <div className="w-12 h-12 bg-gradient-primary rounded-full mx-auto mb-3" />
              <h3 className="font-semibold">Elixir Queen</h3>
              <p className="text-sm text-muted-foreground">Volume: 234 ETH</p>
            </Card>
            <Card className="glass-card p-6 text-center">
              <div className="w-12 h-12 bg-gradient-primary rounded-full mx-auto mb-3" />
              <h3 className="font-semibold">Pixel Wizard</h3>
              <p className="text-sm text-muted-foreground">Volume: 189 ETH</p>
            </Card>
            <Card className="glass-card p-6 text-center">
              <div className="w-12 h-12 bg-gradient-primary rounded-full mx-auto mb-3" />
              <h3 className="font-semibold">Meta Vision</h3>
              <p className="text-sm text-muted-foreground">Volume: 156 ETH</p>
            </Card>
            <Card className="glass-card p-6 text-center">
              <div className="w-12 h-12 bg-gradient-primary rounded-full mx-auto mb-3" />
              <h3 className="font-semibold">Crypto Sage</h3>
              <p className="text-sm text-muted-foreground">Volume: 142 ETH</p>
            </Card>
          </div>
          <div className="grid md:grid-cols-4 gap-6">
            <Card className="glass-card p-6 text-center">
              <Users className="w-8 h-8 text-primary mx-auto mb-3" />
              <div className="text-3xl font-bold gradient-text">250K+</div>
              <p className="text-sm text-muted-foreground mt-1">Active Users</p>
            </Card>
            <Card className="glass-card p-6 text-center">
              <TrendingUp className="w-8 h-8 text-accent mx-auto mb-3" />
              <div className="text-3xl font-bold gradient-text">$2.5B</div>
              <p className="text-sm text-muted-foreground mt-1">Trading Volume</p>
            </Card>
            <Card className="glass-card p-6 text-center">
              <Shield className="w-8 h-8 text-success mx-auto mb-3" />
              <div className="text-3xl font-bold gradient-text">99.9%</div>
              <p className="text-sm text-muted-foreground mt-1">Verified Assets</p>
            </Card>
            <Card className="glass-card p-6 text-center">
              <Zap className="w-8 h-8 text-warning mx-auto mb-3" />
              <div className="text-3xl font-bold gradient-text">&lt;2s</div>
              <p className="text-sm text-muted-foreground mt-1">Verification Time</p>
            </Card>
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
      <section className="min-h-screen flex items-center py-20 px-6 bg-gradient-to-br from-primary/5 to-transparent">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl lg:text-5xl font-bold mb-6">Trust Workflow, Built-In</h2>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              Our step-by-step process ensures every asset is verified, protected, and ready for secure trading
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {workflowSteps.map((step, index) => (
              <Card key={index} className="glass-card p-6 text-center hover:scale-105 transition-all duration-300">
                <div className="w-12 h-12 bg-gradient-primary rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-primary-foreground font-bold">{index + 1}</span>
                </div>
                <h3 className="text-lg font-semibold mb-2">{step.step}</h3>
                <p className="text-muted-foreground text-sm">{step.description}</p>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Section 4 – Why AuthX Is Different */}
      <section className="min-h-screen flex items-center py-20 px-6">
        <div className="max-w-7xl mx-auto w-full">
          <div className="text-center mb-16">
            <h2 className="text-4xl lg:text-5xl font-bold mb-6">Not Just NFTs. Verified Phigital Assets.</h2>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">See how AuthX compares to traditional NFT marketplaces</p>
          </div>
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
        </div>
      </section>

    </div>
  );
};

export default Home;
