import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Heart, Eye, ShieldCheck, Zap, Package, Star } from "lucide-react";
import { publicClient } from "../lib/wagmi";
import { CONTRACTS } from "../config/contracts";
import { AuthXMarketplaceAbi } from "../abi";

const formatEth = (wei: bigint) => (Number(wei) / 1e18).toFixed(4);

interface MarketplaceItem {
  tokenId: bigint;
  price: bigint;
  seller: string;
  name?: string;
  description?: string;
  category?: string;
  image?: string;
  quantity?: number;
}

const Marketplace = () => {
  const navigate = useNavigate();
  const [listed, setListed] = useState<MarketplaceItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const run = async () => {
      setLoading(true);
      const items: MarketplaceItem[] = [];
      
      // Get listings from blockchain
      for (let i = 0n; i < 200n; i++) {
        try {
          const [price, seller, active] = await publicClient.readContract({
            abi: AuthXMarketplaceAbi,
            address: CONTRACTS.AuthXMarketplace,
            functionName: "getListing",
            args: [i, CONTRACTS.AuthXNFT],
          });
          if (active) {
            items.push({ 
              tokenId: i, 
              price, 
              seller: seller as string,
              name: `Token #${i.toString()}`,
              description: `A unique digital asset with token ID ${i.toString()}`,
              category: 'Digital Asset',
              quantity: 1
            });
          }
        } catch {}
      }
      
      setListed(items);
      setLoading(false);
    };
    run();
  }, []);

  return (
    <div className="min-h-screen bg-gradient-dark py-8 px-6">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-4 gradient-text">Marketplace</h1>
          <p className="text-lg text-muted-foreground">Browse and trade verified phigital assets with complete transparency</p>
        </div>

        <Tabs defaultValue="all" className="mb-8">
          <TabsList className="glass-card p-1 mb-8">
            <TabsTrigger value="all" className="data-[state=active]:bg-primary/20">All Items</TabsTrigger>
          </TabsList>

          <TabsContent value="all" className="mt-6">
            {loading ? (
              <div className="flex items-center justify-center py-12">
                <div className="text-center">
                  <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
                  <p className="text-muted-foreground">Loading marketplace...</p>
                </div>
              </div>
            ) : listed.length === 0 ? (
              <div className="text-center py-12">
                <Package className="w-16 h-16 mx-auto text-muted-foreground mb-4" />
                <h3 className="text-xl font-semibold mb-2">No items available</h3>
                <p className="text-muted-foreground">Check back later for new listings</p>
              </div>
            ) : (
              <div className="grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {listed.map((item) => (
                  <Card key={item.tokenId.toString()} className="glass-card overflow-hidden group hover:scale-105 hover:shadow-glow-accent transition-all duration-300">
                    <div className="relative h-64">
                      {item.image ? (
                        <img
                          src={item.image}
                          alt={item.name}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="w-full h-full bg-gradient-to-br from-primary/20 to-accent/20 flex items-center justify-center">
                          <Package className="w-16 h-16 text-primary/50" />
                        </div>
                      )}
                      <div className="absolute inset-0 bg-gradient-to-t from-background/80 to-transparent" />
                      <Badge className="absolute top-4 right-4 bg-primary/90 backdrop-blur-sm pulse-glow">
                        <ShieldCheck className="w-3 h-3 mr-1" />
                        Verified
                      </Badge>
                      {item.quantity && item.quantity > 1 && (
                        <Badge className="absolute top-4 left-4 bg-green-500/90 backdrop-blur-sm">
                          <Package className="w-3 h-3 mr-1" />
                          {item.quantity} Available
                        </Badge>
                      )}
                      <div className="absolute bottom-4 left-4 right-4">
                        <h3 className="text-xl font-bold text-white">{item.name}</h3>
                        {item.category && (
                          <p className="text-sm text-white/80">{item.category}</p>
                        )}
                      </div>
                    </div>
                    
                    <div className="p-6">
                      <div className="mb-4">
                        <p className="text-sm text-muted-foreground line-clamp-2 mb-2">
                          {item.description}
                        </p>
                        <div className="flex items-center gap-2 text-xs text-muted-foreground">
                          <Star className="w-3 h-3 fill-yellow-400 text-yellow-400" />
                          <span>4.8 (24 reviews)</span>
                        </div>
                      </div>
                      
                      <div className="flex items-center justify-between mb-6">
                        <div>
                          <p className="text-xs text-muted-foreground mb-1">Current Price</p>
                          <p className="text-2xl font-bold gradient-text">{formatEth(item.price)} ETH</p>
                        </div>
                        <div className="flex gap-4 text-muted-foreground">
                          <div className="flex items-center gap-1 hover:text-destructive transition-colors cursor-pointer">
                            <Heart className="w-4 h-4" />
                            <span className="text-sm">12</span>
                          </div>
                          <div className="flex items-center gap-1">
                            <Eye className="w-4 h-4" />
                            <span className="text-sm">156</span>
                          </div>
                        </div>
                      </div>
                      
                      <div className="flex gap-3">
                        <Button 
                          className="flex-1 bg-gradient-primary hover:opacity-90 hover:scale-105 text-primary-foreground border-0 transition-all duration-300"
                          onClick={() => navigate(`/product/${item.tokenId.toString()}`)}
                        >
                          <Zap className="w-4 h-4 mr-2" />
                          Buy Now
                        </Button>
                        <Button 
                          variant="outline"
                          size="icon"
                          className="border-border/50 hover:bg-card/50 hover:scale-110 transition-all duration-300"
                          onClick={() => navigate(`/product/${item.tokenId.toString()}`)}
                        >
                          <Eye className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                  </Card>
                ))}
              </div>
            )}
          </TabsContent>
        </Tabs>
      </div>

    </div>
  );
};

export default Marketplace;