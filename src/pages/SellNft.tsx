import { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useAccount } from "wagmi";
import { publicClient, getWalletClient } from "../lib/wagmi";
import { waitForTx } from "../lib/tx";
import { CONTRACTS } from "../config/contracts";
import { AuthXNFTAbi, AuthXMarketplaceAbi } from "../abi";
import { parseEther } from "viem";
import { Gem, DollarSign, Image, Package } from "lucide-react";

export default function SellNft() {
  const { address, isConnected } = useAccount();
  const [ownedNfts, setOwnedNfts] = useState<number[]>([]);
  const [selectedNft, setSelectedNft] = useState<number | null>(null);
  const [price, setPrice] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const loadOwnedNfts = async () => {
      if (!address) return;
      const list: number[] = [];
      for (let i = 0n; i < 200n; i++) {
        try {
          const owner = await publicClient.readContract({
            abi: AuthXNFTAbi,
            address: CONTRACTS.AuthXNFT,
            functionName: 'ownerOf',
            args: [i],
          });
          if ((owner as string).toLowerCase() === address.toLowerCase()) {
            list.push(Number(i));
          }
        } catch {}
      }
      setOwnedNfts(list);
    };
    loadOwnedNfts();
  }, [address]);

  const handleSellNft = async () => {
    if (!selectedNft || !price || !description || !category) {
      alert("Please fill in all fields");
      return;
    }

    if (!address) {
      alert("Please connect your wallet");
      return;
    }

    setIsLoading(true);
    try {
      const wallet = await getWalletClient();
      if (!wallet) throw new Error("Wallet not connected");

      // First, approve the marketplace to transfer the NFT
      const approveHash = await wallet.writeContract({
        address: CONTRACTS.AuthXNFT,
        abi: AuthXNFTAbi,
        functionName: 'approve',
        args: [CONTRACTS.AuthXMarketplace, BigInt(selectedNft)],
        account: address,
      });
      await waitForTx(approveHash);

      // Then list the NFT on the marketplace
      const txHash = await wallet.writeContract({
        address: CONTRACTS.AuthXMarketplace,
        abi: AuthXMarketplaceAbi,
        functionName: 'listAsset',
        args: [BigInt(selectedNft), parseEther(price), CONTRACTS.AuthXNFT],
        account: address,
      });
      await waitForTx(txHash);

      // Save to local storage for tracking (account-specific)
      const listing = {
        tokenId: selectedNft,
        price: parseFloat(price),
        description,
        category,
        seller: address,
        timestamp: Date.now(),
        status: 'listed'
      };

      const userListingsKey = `user.listings.${address}`;
      const existingListings = JSON.parse(localStorage.getItem(userListingsKey) || '[]');
      existingListings.push(listing);
      localStorage.setItem(userListingsKey, JSON.stringify(existingListings));

      alert("NFT listed successfully!");
      setSelectedNft(null);
      setPrice("");
      setDescription("");
      setCategory("");
    } catch (error) {
      alert("Failed to list NFT. Please check ownership and try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const getAISuggestedPrice = (tokenId: number) => {
    // Simple AI-like price suggestion based on token ID
    const basePrice = 0.1;
    const rarityMultiplier = tokenId % 10 === 0 ? 2 : tokenId % 5 === 0 ? 1.5 : 1;
    const suggestedPrice = basePrice * rarityMultiplier;
    return suggestedPrice.toFixed(2);
  };

  if (!isConnected) {
    return (
      <div className="min-h-screen bg-gradient-dark flex items-center justify-center">
        <Card className="glass-panel p-8 text-center">
          <h2 className="text-2xl font-bold mb-4">Connect Your Wallet</h2>
          <p className="text-muted-foreground">Please connect your wallet to sell NFTs</p>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-dark py-8 px-6">
      <div className="max-w-4xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">Sell Your NFT</h1>
          <p className="text-muted-foreground">List your NFTs for sale on the marketplace</p>
        </div>

        <div className="grid lg:grid-cols-2 gap-8">
          {/* NFT Selection */}
          <Card className="glass-panel p-6">
            <h2 className="text-xl font-semibold mb-4 flex items-center">
              <Package className="w-5 h-5 mr-2" />
              Select NFT to Sell
            </h2>
            
            {ownedNfts.length === 0 ? (
              <div className="text-center py-8">
                <Gem className="w-16 h-16 mx-auto text-muted-foreground mb-4" />
                <p className="text-muted-foreground">You don't own any NFTs yet</p>
                <p className="text-sm text-muted-foreground">Browse the marketplace to buy some!</p>
              </div>
            ) : (
              <div className="grid grid-cols-2 gap-4">
                {ownedNfts.map((tokenId) => (
                  <button
                    key={tokenId}
                    onClick={() => setSelectedNft(tokenId)}
                    className={`p-4 rounded-lg border-2 transition-all ${
                      selectedNft === tokenId
                        ? 'border-primary bg-primary/10'
                        : 'border-border hover:border-primary/50'
                    }`}
                  >
                    <div className="w-full h-24 bg-gradient-primary rounded-lg flex items-center justify-center mb-2">
                      <span className="text-white font-bold text-lg">#{tokenId}</span>
                    </div>
                    <div className="text-sm font-medium">Token #{tokenId}</div>
                    <div className="text-xs text-muted-foreground">
                      Suggested: {getAISuggestedPrice(tokenId)} ETH
                    </div>
                  </button>
                ))}
              </div>
            )}
          </Card>

          {/* Listing Form */}
          <Card className="glass-panel p-6">
            <h2 className="text-xl font-semibold mb-4 flex items-center">
              <DollarSign className="w-5 h-5 mr-2" />
              Listing Details
            </h2>

            {selectedNft !== null ? (
              <div className="space-y-4">
                <div>
                  <Label>Selected NFT</Label>
                  <div className="flex items-center space-x-3 p-3 bg-card rounded-lg">
                    <div className="w-12 h-12 bg-gradient-primary rounded-lg flex items-center justify-center">
                      <span className="text-white font-bold">#{selectedNft}</span>
                    </div>
                    <div>
                      <div className="font-medium">Token #{selectedNft}</div>
                      <div className="text-sm text-muted-foreground">Ready to list</div>
                    </div>
                  </div>
                </div>

                <div>
                  <Label htmlFor="price">Price (ETH)</Label>
                  <div className="flex space-x-2">
                    <Input
                      id="price"
                      type="number"
                      step="0.001"
                      placeholder="0.1"
                      value={price}
                      onChange={(e) => setPrice(e.target.value)}
                    />
                    <Button
                      variant="outline"
                      onClick={() => setPrice(getAISuggestedPrice(selectedNft))}
                    >
                      AI Suggest
                    </Button>
                  </div>
                  <p className="text-xs text-muted-foreground mt-1">
                    AI suggested: {getAISuggestedPrice(selectedNft)} ETH
                  </p>
                </div>

                <div>
                  <Label htmlFor="category">Category</Label>
                  <Select value={category} onValueChange={setCategory}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select category" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="art">Digital Art</SelectItem>
                      <SelectItem value="collectible">Collectible</SelectItem>
                      <SelectItem value="gaming">Gaming</SelectItem>
                      <SelectItem value="music">Music</SelectItem>
                      <SelectItem value="sports">Sports</SelectItem>
                      <SelectItem value="other">Other</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label htmlFor="description">Description</Label>
                  <Textarea
                    id="description"
                    placeholder="Describe your NFT..."
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    rows={3}
                  />
                </div>

                <Button
                  onClick={handleSellNft}
                  disabled={isLoading || !price || !description || !category}
                  className="w-full bg-gradient-primary hover:opacity-90 text-primary-foreground"
                >
                  {isLoading ? "Listing..." : "List for Sale"}
                </Button>
              </div>
            ) : (
              <div className="text-center py-8">
                <Image className="w-16 h-16 mx-auto text-muted-foreground mb-4" />
                <p className="text-muted-foreground">Select an NFT to list for sale</p>
              </div>
            )}
          </Card>
        </div>
      </div>
    </div>
  );
}
