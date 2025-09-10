import { useParams, useNavigate } from "react-router-dom";
import { useEffect, useMemo, useState } from "react";
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
import { publicClient, getWalletClient } from "../lib/wagmi";
import { CONTRACTS } from "../config/contracts";
import { AuthXMarketplaceAbi } from "../abi";
import { useAccount } from "wagmi";

const formatEth = (wei: bigint) => (Number(wei) / 1e18).toFixed(4);

const ProductDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { address, isConnected } = useAccount();
  const [isPurchaseModalOpen, setIsPurchaseModalOpen] = useState(false);
  const [buying, setBuying] = useState(false);
  const tokenId = Number(id || 0);
  const [price, setPrice] = useState<bigint | null>(null);

  useEffect(() => {
    const load = async () => {
      try {
        const result = await (publicClient.readContract as any)({
          abi: AuthXMarketplaceAbi,
          address: CONTRACTS.AuthXMarketplace,
          functionName: "getListing",
          args: [BigInt(tokenId), CONTRACTS.AuthXNFT],
        });
        const [p, seller, active] = result as [bigint, string, boolean];
        if (active) setPrice(p);
      } catch (error) {
        console.log("Error loading listing:", error);
      }
    };
    load();
  }, [tokenId]);

  const product = useMemo(() => {
    return {
      id,
      name: `Token #${tokenId}`,
      priceText: price ? `${formatEth(price)} ETH` : '—',
      usdPrice: price ? `$${(Number(price) / 1e18 * 2000).toFixed(2)}` : '',
      creator: '',
      owner: '',
      likes: Math.floor(Math.random() * 100),
      views: Math.floor(Math.random() * 1000),
      verified: true,
      description: `A unique digital asset with token ID ${tokenId}`,
      category: 'Digital Asset',
      image: null as string | null,
      quantity: 1,
      attributes: [
        { trait_type: 'Token ID', value: tokenId.toString() },
        { trait_type: 'Category', value: 'Digital Asset' },
        { trait_type: 'Rarity', value: tokenId % 10 === 0 ? 'Legendary' : tokenId % 5 === 0 ? 'Rare' : 'Common' },
      ],
      history: [] as any[],
    };
  }, [id, tokenId, price]);

  const buyNow = async () => {
    if (!price || !isConnected || !address) return;
    setBuying(true);
    try {
      const wallet = await getWalletClient();
      if (!wallet) throw new Error("No wallet");

      const hash = await (wallet as any).writeContract({
        account: address,
        abi: AuthXMarketplaceAbi,
        address: CONTRACTS.AuthXMarketplace,
        functionName: "buyAsset",
        args: [BigInt(tokenId), CONTRACTS.AuthXNFT],
        value: price,
      });
      
      console.log("Transaction submitted:", hash);
      const receipt = await publicClient.waitForTransactionReceipt({ hash });
      console.log("Transaction confirmed:", receipt);
      
      // Record sale for dashboard (account-specific)
      const salesKey = `sales.history.${address}`;
      const sales = JSON.parse(localStorage.getItem(salesKey) || '[]');
      sales.push({ 
        tokenId, 
        priceEth: Number(price) / 1e18, 
        buyer: address, 
        seller: product.creator,
        timestamp: Date.now(),
        transactionHash: hash
      });
      localStorage.setItem(salesKey, JSON.stringify(sales));
      
      // Record ownership history (account-specific)
      const ownershipKey = `ownership.history.${address}`;
      const ownershipHistory = JSON.parse(localStorage.getItem(ownershipKey) || '[]');
      ownershipHistory.push({
        tokenId,
        from: product.creator,
        to: address,
        price: Number(price) / 1e18,
        timestamp: Date.now(),
        transactionHash: hash
      });
      localStorage.setItem(ownershipKey, JSON.stringify(ownershipHistory));
      
      // No localStorage mutation; marketplace state comes from-chain
      
      alert("Purchase successful! NFT transferred to your wallet.");
      navigate('/my-nfts');
    } catch (e) {
      console.error("Buy error:", e);
      alert(`Purchase failed: ${e.message || 'Please try again.'}`);
    } finally {
      setBuying(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-dark py-8 px-6">
      <div className="max-w-7xl mx-auto">
        <Button 
          variant="ghost" 
          onClick={() => navigate("/marketplace")}
          className="mb-6 text-muted-foreground hover:text-primary"
        >
          <ChevronLeft className="w-4 h-4 mr-2" />
          Back to Marketplace
        </Button>

        <div className="grid lg:grid-cols-2 gap-8">
          <div className="space-y-4">
            <Card className="glass-card overflow-hidden">
              <div className="relative aspect-square">
                {product.image ? (
                  <img
                    src={product.image}
                    alt={product.name}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full bg-gradient-to-br from-primary/20 to-secondary/20 flex items-center justify-center">
                    <div className="text-center">
                      <div className="w-24 h-24 bg-primary/20 rounded-full flex items-center justify-center mx-auto mb-4">
                        <span className="text-2xl font-bold text-primary">#{tokenId}</span>
                      </div>
                      <p className="text-muted-foreground">No image available</p>
                    </div>
                  </div>
                )}
                <div className="absolute inset-0 bg-gradient-to-t from-background/80 to-transparent" />
                {product.verified && (
                  <Badge className="absolute top-4 right-4 bg-primary/90 backdrop-blur-sm text-primary-foreground">
                    <Verified className="w-3 h-3 mr-1" />
                    Verified
                  </Badge>
                )}
                {product.quantity && product.quantity > 1 && (
                  <Badge className="absolute top-4 left-4 bg-green-500/90 backdrop-blur-sm">
                    {product.quantity} Available
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
            <Card className="glass-card p-4">
              <h3 className="font-semibold mb-3">Attributes</h3>
              <div className="grid grid-cols-2 gap-2">
                {product.attributes.map((attr, idx) => (
                  <div key={idx} className="p-2 bg-card/50 rounded border border-border/50">
                    <div className="text-xs text-muted-foreground">{attr.trait_type}</div>
                    <div className="text-sm font-medium">{attr.value}</div>
                  </div>
                ))}
              </div>
            </Card>
          </div>

          <div className="space-y-6">
            <div>
              <h1 className="text-3xl font-bold mb-2">{product.name}</h1>
            </div>

            <Card className="glass-card p-6 border-primary/30 bg-gradient-to-br from-primary/10 to-transparent">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <p className="text-sm text-muted-foreground mb-1">Current Price</p>
                  <p className="text-3xl font-bold gradient-text">{product.priceText}</p>
                  {product.usdPrice && (
                    <p className="text-sm text-muted-foreground">{product.usdPrice} USD</p>
                  )}
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
                  onClick={buyNow}
                  disabled={buying || !price || !isConnected}
                >
                  <ShoppingCart className="w-5 h-5 mr-2" />
                  {buying ? "Buying…" : !isConnected ? "Connect Wallet" : "Buy Now"}
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

            <Tabs defaultValue="description" className="w-full">
              <TabsList className="glass-card p-1 w-full">
                <TabsTrigger value="description" className="flex-1">Description</TabsTrigger>
                <TabsTrigger value="history" className="flex-1">Price History</TabsTrigger>
                <TabsTrigger value="offers" className="flex-1">Offers</TabsTrigger>
              </TabsList>

              <TabsContent value="description" className="mt-4">
                <Card className="glass-card p-6">
                  <p className="text-muted-foreground leading-relaxed">{product.description || '—'}</p>
                </Card>
              </TabsContent>

              <TabsContent value="history" className="mt-4">
                <Card className="glass-card p-6">—</Card>
              </TabsContent>

              <TabsContent value="offers" className="mt-4">
                <Card className="glass-card p-6">
                  <div className="text-center py-8">
                    <p className="text-muted-foreground">Offers coming soon</p>
                  </div>
                </Card>
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </div>

      <PurchaseModal
        isOpen={isPurchaseModalOpen}
        onClose={() => setIsPurchaseModalOpen(false)}
        product={{
          name: product.name,
          price: product.priceText,
          image: "/placeholder.svg"
        }}
      />
    </div>
  );
};

export default ProductDetail;