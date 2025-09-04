import { useParams, useNavigate } from "react-router-dom";
import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Separator } from "@/components/ui/separator";
import { 
  ShoppingCart, 
  Heart, 
  Share2, 
  Shield, 
  Verified, 
  Clock, 
  TrendingUp,
  Eye,
  Star,
  ChevronLeft,
  Zap,
  Lock
} from "lucide-react";
import PurchaseModal from "@/components/PurchaseModal";

const ProductDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [isPurchaseModalOpen, setIsPurchaseModalOpen] = useState(false);

  // Mock product data - in a real app this would come from an API
  const product = {
    id: id,
    name: "Quantum Portal #142",
    price: "3.5 ETH",
    usdPrice: "$8,420",
    creator: "CryptoArtist",
    owner: "0x742d...2b3c",
    likes: 234,
    views: 1420,
    verified: true,
    description: "A mesmerizing digital artwork that explores the boundaries between quantum mechanics and digital art. This unique piece features dynamic visual elements that respond to blockchain interactions.",
    attributes: [
      { trait: "Rarity", value: "Legendary" },
      { trait: "Generation", value: "Genesis" },
      { trait: "Type", value: "Animated" },
      { trait: "Edition", value: "1 of 1" }
    ],
    history: [
      { event: "Listed", price: "3.5 ETH", from: "0x742d...2b3c", date: "2 hours ago" },
      { event: "Transfer", price: "2.8 ETH", from: "0x3a2b...4d5e", to: "0x742d...2b3c", date: "3 days ago" },
      { event: "Sold", price: "2.8 ETH", from: "0x1f2e...3c4d", to: "0x3a2b...4d5e", date: "1 week ago" },
      { event: "Minted", price: "—", from: "CryptoArtist", date: "2 months ago" }
    ]
  };

  return (
    <div className="min-h-screen bg-gradient-dark py-8 px-6">
      <div className="max-w-7xl mx-auto">
        {/* Back Button */}
        <Button 
          variant="ghost" 
          onClick={() => navigate("/marketplace")}
          className="mb-6 text-muted-foreground hover:text-primary"
        >
          <ChevronLeft className="w-4 h-4 mr-2" />
          Back to Marketplace
        </Button>

        <div className="grid lg:grid-cols-2 gap-8">
          {/* Product Image */}
          <div className="space-y-4">
            <Card className="glass-card overflow-hidden">
              <div className="relative aspect-square bg-gradient-to-br from-primary/20 to-secondary/20">
                <div className="absolute inset-0 bg-gradient-to-t from-background/80 to-transparent" />
                {product.verified && (
                  <Badge className="absolute top-4 right-4 bg-primary/90 backdrop-blur-sm text-primary-foreground">
                    <Verified className="w-3 h-3 mr-1" />
                    Verified
                  </Badge>
                )}
                <div className="absolute top-4 left-4 flex gap-2">
                  <Badge variant="outline" className="bg-background/60 backdrop-blur-sm">
                    <Eye className="w-3 h-3 mr-1" />
                    {product.views}
                  </Badge>
                  <Badge variant="outline" className="bg-background/60 backdrop-blur-sm">
                    <Heart className="w-3 h-3 mr-1" />
                    {product.likes}
                  </Badge>
                </div>
              </div>
            </Card>

            {/* Attributes */}
            <Card className="glass-card p-6">
              <h3 className="text-lg font-semibold mb-4">Properties</h3>
              <div className="grid grid-cols-2 gap-3">
                {product.attributes.map((attr, index) => (
                  <div key={index} className="glass-card p-3 rounded-lg border border-border/50">
                    <p className="text-xs text-muted-foreground">{attr.trait}</p>
                    <p className="text-sm font-semibold text-primary">{attr.value}</p>
                  </div>
                ))}
              </div>
            </Card>
          </div>

          {/* Product Details */}
          <div className="space-y-6">
            <div>
              <h1 className="text-3xl font-bold mb-2">{product.name}</h1>
              <div className="flex items-center gap-4 text-sm text-muted-foreground">
                <span>Created by <span className="text-primary">{product.creator}</span></span>
                <span>Owned by <span className="text-primary">{product.owner}</span></span>
              </div>
            </div>

            {/* Price Card */}
            <Card className="glass-card p-6 border-primary/30 bg-gradient-to-br from-primary/10 to-transparent">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <p className="text-sm text-muted-foreground mb-1">Current Price</p>
                  <p className="text-3xl font-bold gradient-text">{product.price}</p>
                  <p className="text-sm text-muted-foreground">{product.usdPrice}</p>
                </div>
                <div className="flex gap-2">
                  <Button size="icon" variant="outline" className="border-border/50">
                    <Heart className="w-4 h-4" />
                  </Button>
                  <Button size="icon" variant="outline" className="border-border/50">
                    <Share2 className="w-4 h-4" />
                  </Button>
                </div>
              </div>

              <div className="space-y-3">
                <Button 
                  className="w-full bg-gradient-primary hover:opacity-90 text-primary-foreground border-0" 
                  size="lg"
                  onClick={() => setIsPurchaseModalOpen(true)}
                >
                  <ShoppingCart className="w-5 h-5 mr-2" />
                  Buy Now
                </Button>
                <Button variant="outline" className="w-full" size="lg">
                  <Zap className="w-5 h-5 mr-2" />
                  Make Offer
                </Button>
              </div>

              <Separator className="my-4" />

              <div className="flex items-center justify-between text-sm">
                <div className="flex items-center gap-2 text-muted-foreground">
                  <Shield className="w-4 h-4 text-primary" />
                  <span>Authentic & Verified</span>
                </div>
                <div className="flex items-center gap-2 text-muted-foreground">
                  <Lock className="w-4 h-4 text-primary" />
                  <span>Secure Transaction</span>
                </div>
              </div>
            </Card>

            {/* Tabs */}
            <Tabs defaultValue="description" className="w-full">
              <TabsList className="glass-card p-1 w-full">
                <TabsTrigger value="description" className="flex-1">Description</TabsTrigger>
                <TabsTrigger value="history" className="flex-1">Price History</TabsTrigger>
                <TabsTrigger value="offers" className="flex-1">Offers</TabsTrigger>
              </TabsList>

              <TabsContent value="description" className="mt-4">
                <Card className="glass-card p-6">
                  <p className="text-muted-foreground leading-relaxed">{product.description}</p>
                  
                  <div className="mt-6 space-y-3">
                    <div className="flex items-center gap-2">
                      <Clock className="w-4 h-4 text-primary" />
                      <span className="text-sm">Listed 2 hours ago</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <TrendingUp className="w-4 h-4 text-success" />
                      <span className="text-sm">25% increase in last 7 days</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Star className="w-4 h-4 text-warning" />
                      <span className="text-sm">Featured collection</span>
                    </div>
                  </div>
                </Card>
              </TabsContent>

              <TabsContent value="history" className="mt-4">
                <Card className="glass-card p-6">
                  <div className="space-y-3">
                    {product.history.map((item, index) => (
                      <div key={index} className="flex items-center justify-between p-3 rounded-lg hover:bg-card/50 transition-colors">
                        <div className="flex items-center gap-3">
                          <div className="w-2 h-2 rounded-full bg-primary animate-pulse" />
                          <div>
                            <p className="font-semibold">{item.event}</p>
                            <p className="text-xs text-muted-foreground">
                              {item.from} {item.to && `→ ${item.to}`}
                            </p>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="font-semibold text-primary">{item.price}</p>
                          <p className="text-xs text-muted-foreground">{item.date}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </Card>
              </TabsContent>

              <TabsContent value="offers" className="mt-4">
                <Card className="glass-card p-6">
                  <div className="text-center py-8">
                    <p className="text-muted-foreground">No active offers</p>
                    <Button variant="outline" className="mt-4">
                      Make the first offer
                    </Button>
                  </div>
                </Card>
              </TabsContent>
            </Tabs>
          </div>
        </div>

        {/* Similar Items */}
        <div className="mt-12">
          <h2 className="text-2xl font-bold mb-6">Similar Items</h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[1, 2, 3, 4].map((item) => (
              <Card key={item} className="glass-card overflow-hidden group hover:scale-105 transition-all duration-300">
                <div className="relative h-48 bg-gradient-to-br from-primary/20 to-secondary/20">
                  <div className="absolute inset-0 bg-gradient-to-t from-background/80 to-transparent" />
                </div>
                <div className="p-4">
                  <h3 className="font-semibold mb-2">Digital Art #{item + 100}</h3>
                  <p className="text-primary font-bold">1.2 ETH</p>
                </div>
              </Card>
            ))}
          </div>
        </div>
      </div>

      {/* Purchase Modal */}
      <PurchaseModal
        isOpen={isPurchaseModalOpen}
        onClose={() => setIsPurchaseModalOpen(false)}
        product={{
          name: product.name,
          price: product.price,
          image: "/placeholder.svg"
        }}
      />
    </div>
  );
};

export default ProductDetail;