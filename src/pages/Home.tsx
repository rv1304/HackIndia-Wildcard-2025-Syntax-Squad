import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import CollectionCard from "@/components/CollectionCard";
import GlowingRing from "@/components/GlowingRing";
import { Users, TrendingUp, Shield, Zap } from "lucide-react";

const Home = () => {
  const collections = [
    { title: "Verified by MeTa", gradient: "bg-gradient-to-br from-purple-500 to-pink-500" },
    { title: "History Snapshots", gradient: "bg-gradient-to-br from-blue-500 to-cyan-500" },
    { title: "Immutable History", gradient: "bg-gradient-to-br from-orange-500 to-red-500" }
  ];

  const topSellers = [
    { name: "Elixir Queen", sales: "234 ETH", verified: true },
    { name: "Pixel Wizard", sales: "189 ETH", verified: true },
    { name: "Meta Vision", sales: "156 ETH", verified: false },
    { name: "Crypto Sage", sales: "142 ETH", verified: true }
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
                The Trust-First<br />
                Marketplace for<br />
                <span className="gradient-text">Phigital Assets</span>
              </h1>
              
              <p className="text-lg text-muted-foreground max-w-md">
                Trade physical and digital assets with complete transparency. 
                Every item authenticated, every transaction traceable.
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
              <GlowingRing />
            </div>
          </div>
        </div>
      </section>

      {/* Featured Collections */}
      <section className="py-16 px-6">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-3xl font-bold mb-8">Featured Collections</h2>
          
          <div className="grid md:grid-cols-3 gap-6">
            {collections.map((collection, index) => (
              <CollectionCard
                key={collection.title}
                title={collection.title}
                image="/placeholder.svg"
                gradient={collection.gradient}
                delay={index * 100}
              />
            ))}
          </div>
        </div>
      </section>

      {/* Top Sellers & Creators */}
      <section className="py-16 px-6">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-3xl font-bold mb-8">Top Sellers & Creators</h2>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {topSellers.map((seller, index) => (
              <Card key={seller.name} className="glass-card p-6 hover:scale-105 transition-all duration-300">
                <div className="flex items-center space-x-4">
                  <div className="w-12 h-12 bg-gradient-primary rounded-full" />
                  <div className="flex-1">
                    <h3 className="font-semibold text-foreground flex items-center gap-2">
                      {seller.name}
                      {seller.verified && (
                        <Shield className="w-4 h-4 text-primary" />
                      )}
                    </h3>
                    <p className="text-sm text-muted-foreground">
                      Volume: {seller.sales}
                    </p>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 px-6 bg-gradient-card">
        <div className="max-w-7xl mx-auto">
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
    </div>
  );
};

export default Home;