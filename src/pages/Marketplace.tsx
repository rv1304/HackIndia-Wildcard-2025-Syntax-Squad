import React from "react";
import { useNavigate } from "react-router-dom";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Heart, Eye, ShieldCheck, Zap } from "lucide-react";

const Marketplace = () => {
  const navigate = useNavigate();
  
  const featuredItems = [
    { id: 1, name: "Quantum Portal #142", price: "3.5 ETH", likes: 234, views: 1420, verified: true, image: "/placeholder.svg" },
    { id: 2, name: "Digital Phoenix", price: "2.8 ETH", likes: 189, views: 982, verified: true, image: "/placeholder.svg" },
    { id: 3, name: "Neon Genesis #88", price: "1.9 ETH", likes: 156, views: 743, verified: false, image: "/placeholder.svg" },
    { id: 4, name: "Crystal Dimension", price: "4.2 ETH", likes: 298, views: 1876, verified: true, image: "/placeholder.svg" },
    { id: 5, name: "Void Walker #23", price: "2.1 ETH", likes: 142, views: 621, verified: true, image: "/placeholder.svg" },
    { id: 6, name: "Meta Artifact", price: "5.7 ETH", likes: 412, views: 2341, verified: true, image: "/placeholder.svg" }
  ];

  return (
    <div className="min-h-screen bg-gradient-dark py-8 px-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-4 gradient-text">Marketplace</h1>
          <p className="text-lg text-muted-foreground">Browse and trade verified phigital assets with complete transparency</p>
        </div>

        {/* Market Stats */}
        <div className="grid md:grid-cols-4 gap-6 mb-8">
          <Card className="glass-card p-6 hover-lift micro-interaction bg-gradient-to-br from-primary/10 to-transparent">
            <p className="text-sm text-muted-foreground mb-2">24h Volume</p>
            <p className="text-2xl font-bold text-primary">892.4 ETH</p>
            <p className="text-xs text-success mt-1">+18.2%</p>
          </Card>
          <Card className="glass-card p-6 hover-lift micro-interaction bg-gradient-to-br from-accent/10 to-transparent">
            <p className="text-sm text-muted-foreground mb-2">Floor Price</p>
            <p className="text-2xl font-bold text-accent">0.82 ETH</p>
            <p className="text-xs text-destructive mt-1">-2.4%</p>
          </Card>
          <Card className="glass-card p-6 hover-lift micro-interaction bg-gradient-to-br from-success/10 to-transparent">
            <p className="text-sm text-muted-foreground mb-2">Listed Items</p>
            <p className="text-2xl font-bold text-success">3,421</p>
            <p className="text-xs text-muted-foreground mt-1">Active listings</p>
          </Card>
          <Card className="glass-card p-6 hover-lift micro-interaction bg-gradient-to-br from-warning/10 to-transparent">
            <p className="text-sm text-muted-foreground mb-2">Avg. Sale</p>
            <p className="text-2xl font-bold text-warning">2.34 ETH</p>
            <p className="text-xs text-success mt-1">+5.6%</p>
          </Card>
        </div>

        {/* Marketplace Tabs */}
        <Tabs defaultValue="all" className="mb-8">
          <TabsList className="glass-card p-1 mb-8">
            <TabsTrigger value="all" className="data-[state=active]:bg-primary/20">All Items</TabsTrigger>
            <TabsTrigger value="art" className="data-[state=active]:bg-primary/20">Digital Art</TabsTrigger>
            <TabsTrigger value="collectibles" className="data-[state=active]:bg-primary/20">Collectibles</TabsTrigger>
            <TabsTrigger value="phigital" className="data-[state=active]:bg-primary/20">Phigital Assets</TabsTrigger>
          </TabsList>

          <TabsContent value="all" className="mt-6">
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {featuredItems.map((item, index) => (
                <Card key={item.id} className="glass-card overflow-hidden group hover:scale-105 hover:shadow-glow-accent transition-all duration-300" style={{ animationDelay: `${index * 100}ms` }}>
                  <div className="relative h-64 bg-gradient-to-br from-primary/20 to-accent/20">
                    <div className="absolute inset-0 bg-gradient-to-t from-background/80 to-transparent" />
                    {item.verified && (
                      <Badge className="absolute top-4 right-4 bg-primary/90 backdrop-blur-sm pulse-glow">
                        <ShieldCheck className="w-3 h-3 mr-1" />
                        Verified
                      </Badge>
                    )}
                    <div className="absolute bottom-4 left-4 right-4">
                      <h3 className="text-xl font-bold text-white">{item.name}</h3>
                    </div>
                  </div>
                  
                  <div className="p-6">
                    <div className="flex items-center justify-between mb-6">
                      <div>
                        <p className="text-xs text-muted-foreground mb-1">Current Price</p>
                        <p className="text-2xl font-bold gradient-text">{item.price}</p>
                      </div>
                      <div className="flex gap-4 text-muted-foreground">
                        <div className="flex items-center gap-1 hover:text-destructive transition-colors cursor-pointer">
                          <Heart className="w-4 h-4" />
                          <span className="text-sm">{item.likes}</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <Eye className="w-4 h-4" />
                          <span className="text-sm">{item.views}</span>
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex gap-3">
                      <Button 
                        className="flex-1 bg-gradient-primary hover:opacity-90 hover:scale-105 text-primary-foreground border-0 transition-all duration-300"
                        onClick={() => navigate(`/product/${item.id}`)}
                      >
                        <Zap className="w-4 h-4 mr-2" />
                        Buy
                      </Button>
                      <Button 
                        variant="outline"
                        size="icon"
                        className="border-border/50 hover:bg-card/50 hover:scale-110 transition-all duration-300"
                        onClick={() => navigate(`/product/${item.id}`)}
                      >
                        <Eye className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="art" className="mt-6">
            <div className="text-center py-16">
              <div className="w-24 h-24 bg-gradient-primary/20 rounded-full mx-auto mb-4 flex items-center justify-center">
                <Zap className="w-12 h-12 text-primary" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Digital Art Collection</h3>
              <p className="text-muted-foreground">Curated digital artworks coming soon...</p>
            </div>
          </TabsContent>

          <TabsContent value="collectibles" className="mt-6">
            <div className="text-center py-16">
              <div className="w-24 h-24 bg-gradient-accent/20 rounded-full mx-auto mb-4 flex items-center justify-center">
                <ShieldCheck className="w-12 h-12 text-accent" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Collectibles</h3>
              <p className="text-muted-foreground">Rare collectibles coming soon...</p>
            </div>
          </TabsContent>

          <TabsContent value="phigital" className="mt-6">
            <div className="text-center py-16">
              <div className="w-24 h-24 bg-gradient-to-br from-success/20 to-warning/20 rounded-full mx-auto mb-4 flex items-center justify-center">
                <Heart className="w-12 h-12 text-success" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Phigital Assets</h3>
              <p className="text-muted-foreground">Physical + Digital assets coming soon...</p>
            </div>
          </TabsContent>
        </Tabs>

        {/* Load More */}
        <div className="text-center">
          <Button variant="outline" size="lg" className="border-border/50 hover:bg-card/50 hover:scale-105 transition-all duration-300 px-8 py-4">
            Load More Items
          </Button>
        </div>
      </div>

    </div>
  );
};

export default Marketplace;