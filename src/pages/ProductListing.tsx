// src/pages/ProductListing.jsx
import { useEffect, useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Calendar, Sparkles, Image as ImageIcon, DollarSign, Package } from "lucide-react";
import { getWalletClient, publicClient } from "../lib/wagmi";
import { waitForTx } from "../lib/tx";
import { CONTRACTS } from "../config/contracts";
import { useAuth } from "../context/AuthContext";
import { parseEther, getAddress } from "viem";
import { useAccount } from "wagmi";
import { AuthXNFTAbi, AuthXMarketplaceAbi } from "../abi";
import { anvil } from "../lib/wagmi";

const ProductListing = () => {
  const { user } = useAuth();
  const { address } = useAccount();
  const [priceEth, setPriceEth] = useState<string>("");
  const [tokenId, setTokenId] = useState<string>("");
  const [ownedNfts, setOwnedNfts] = useState<number[]>([]);
  const [name, setName] = useState<string>("");
  const [desc, setDesc] = useState<string>("");
  const [category, setCategory] = useState<string>("");
  const [qty, setQty] = useState<string>("1");
  const [image, setImage] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [aiSuggestedPrice, setAiSuggestedPrice] = useState<string>("");
  const [inspectionDate, setInspectionDate] = useState<string>("");
  const loadOwned = async () => {
      if (!address) return;
      const list: number[] = [];
      try {
        const total = await publicClient.readContract({
          abi: AuthXNFTAbi,
          address: CONTRACTS.AuthXNFT,
          functionName: 'totalSupply',
          args: [],
          authorizationList: [],
        });
        for (let i = 0n; i < (total as bigint); i++) {
          try {
            const owner = await publicClient.readContract({
              abi: AuthXNFTAbi,
              address: CONTRACTS.AuthXNFT,
              functionName: 'ownerOf',
              args: [i],
              authorizationList: [],
            });
            if ((owner as string).toLowerCase() === address.toLowerCase()) list.push(Number(i));
          } catch {}
        }
      } catch {}
      setOwnedNfts(list);
  };
  useEffect(() => { loadOwned(); }, [address]);


  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      const reader = new FileReader();
      reader.onload = () => {
        setImage(reader.result as string);
        // Trigger AI analysis when image is uploaded
        analyzeImageForPricing(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const analyzeImageForPricing = (imageData: string) => {
    // Simulate AI analysis based on image characteristics
    // In a real implementation, this would call an AI service
    const imgEl = new window.Image();
    imgEl.onload = () => {
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');
      canvas.width = imgEl.width;
      canvas.height = imgEl.height;
      ctx?.drawImage(imgEl, 0, 0);
      
      const imageData = ctx?.getImageData(0, 0, canvas.width, canvas.height);
      if (imageData) {
        // Simple analysis based on image complexity and colors
        const data = imageData.data;
        let complexity = 0;
        let colorVariety = 0;
        const colorCounts: { [key: string]: number } = {};
        
        for (let i = 0; i < data.length; i += 4) {
          const r = data[i];
          const g = data[i + 1];
          const b = data[i + 2];
          const color = `${r},${g},${b}`;
          colorCounts[color] = (colorCounts[color] || 0) + 1;
          
          // Calculate complexity based on color differences
          if (i > 0) {
            const prevR = data[i - 4];
            const prevG = data[i - 3];
            const prevB = data[i - 2];
            complexity += Math.abs(r - prevR) + Math.abs(g - prevG) + Math.abs(b - prevB);
          }
        }
        
        colorVariety = Object.keys(colorCounts).length;
        const normalizedComplexity = Math.min(complexity / (canvas.width * canvas.height), 1);
        const normalizedColorVariety = Math.min(colorVariety / 1000, 1);
        
        // Base price calculation
        let basePrice = 0.1;
        if (normalizedComplexity > 0.7) basePrice += 0.2;
        if (normalizedColorVariety > 0.5) basePrice += 0.1;
        if (canvas.width > 1000 || canvas.height > 1000) basePrice += 0.1;
        
        // Category-based adjustments
        if (category === 'art') basePrice *= 1.5;
        if (category === 'collectible') basePrice *= 1.2;
        if (category === 'gaming') basePrice *= 0.8;
        
        setAiSuggestedPrice(basePrice.toFixed(3));
      }
    };
    imgEl.src = imageData;
  };

  const getAISuggestedPrice = () => {
    if (aiSuggestedPrice) return aiSuggestedPrice;
    
    // Fallback AI suggestion based on form data
    let basePrice = 0.1;
    if (category === 'art') basePrice = 0.5;
    else if (category === 'collectible') basePrice = 0.3;
    else if (category === 'gaming') basePrice = 0.2;
    else if (category === 'music') basePrice = 0.4;
    else if (category === 'sports') basePrice = 0.6;
    
    // Adjust based on description length (more detailed = higher value)
    if (desc.length > 100) basePrice *= 1.2;
    if (desc.length > 200) basePrice *= 1.5;
    
    return basePrice.toFixed(3);
  };

  const savePending = () => {
    // Save listing metadata to localStorage for admin display
    if (!address) return;
    
    const listingData = {
      tokenId: Number(tokenId),
      name,
      desc,
      category,
      qty: Number(qty),
      priceEth,
      image,
      seller: address,
      timestamp: Date.now()
    };
    
    const pendingKey = `pending.listings.${address}`;
    const existing = JSON.parse(localStorage.getItem(pendingKey) || '[]');
    existing.push(listingData);
    localStorage.setItem(pendingKey, JSON.stringify(existing));
  };

  const onSubmitForApproval = async () => {
    if (!address) return;
    setLoading(true);
    try {
      // pay 0.01 ETH submission fee to admin treasury (for demo, pay to seller's own address to keep funds local)
      const wallet = await getWalletClient();
      if (!wallet) throw new Error("No wallet");
      await (wallet as any).sendTransaction({ account: address, chain: anvil, to: getAddress(CONTRACTS.AdminTreasury as `0x${string}`), value: parseEther("0.01") });

      // Verify token exists and caller owns it
      const tid = BigInt(Number(tokenId));
      const currentOwner = await publicClient.readContract({
        abi: AuthXNFTAbi,
        address: CONTRACTS.AuthXNFT,
        functionName: 'ownerOf',
        args: [tid],
        authorizationList: [],
      });
      if ((currentOwner as string).toLowerCase() !== address.toLowerCase()) {
        throw new Error(`You do not own token #${tokenId}.`);
      }

      // Approve marketplace and list on-chain immediately so buying can work post-approval
      const approveHash = await wallet.writeContract({
        account: address,
        chain: anvil,
        abi: AuthXNFTAbi,
        address: CONTRACTS.AuthXNFT,
        functionName: "setApprovalForAll",
        args: [CONTRACTS.AuthXMarketplace, true],
      });
      await waitForTx(approveHash);

      const listHash = await wallet.writeContract({
        account: address,
        chain: anvil,
        abi: AuthXMarketplaceAbi,
        address: CONTRACTS.AuthXMarketplace,
        functionName: "listAsset",
        args: [tid, parseEther(priceEth), CONTRACTS.AuthXNFT],
      });
      await waitForTx(listHash);

      savePending();
      alert("Submitted for admin approval. Listing will appear as pending until approved.");
    } catch (e) {
      console.error(e);
      alert((e as any)?.message || 'Submission failed');
    } finally {
      setLoading(false);
    }
  };

  const priceNum = Number(priceEth || 0);

  return (
    <div className="min-h-screen bg-gradient-dark py-8 px-6">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="mb-8 flex items-center justify-between">
          <div className="text-left">
            <h1 className="text-3xl font-bold mb-1">List Your Product</h1>
            <p className="text-muted-foreground">Upload details to list your product on AuthX Marketplace</p>
            <p className="text-xs text-muted-foreground mt-1">Connected: {address || '—'}</p>
          </div>
          <Button variant="outline" onClick={loadOwned} disabled={!address || loading}>Refresh NFTs</Button>
        </div>

        <div className="grid lg:grid-cols-2 gap-8">
          {/* Left Column - Image and Basic Info */}
          <Card className="glass-panel p-6 space-y-6">
            <h2 className="text-xl font-semibold flex items-center">
              <ImageIcon className="w-5 h-5 mr-2" />
              Product Image
            </h2>
            
            <div>
              <Label className="mb-2 block">Upload Product Image</Label>
              <Input type="file" accept="image/*" onChange={handleImageUpload} />
              {image && (
                <div className="mt-4">
                  <img
                    src={image}
                    alt="Product preview"
                    className="rounded-lg w-full max-w-sm h-64 object-cover shadow-md border border-border"
                  />
                  {aiSuggestedPrice && (
                    <div className="mt-2 p-3 bg-blue-500/10 rounded-lg border border-blue-500/20">
                      <div className="flex items-center text-sm text-blue-600">
                        <Sparkles className="w-4 h-4 mr-2" />
                        AI Suggested Price: {aiSuggestedPrice} ETH
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>

            <div>
              <Label className="mb-2 block">Select Minted NFT</Label>
              <Select value={tokenId} onValueChange={setTokenId}>
                <SelectTrigger>
                  <SelectValue placeholder={ownedNfts.length ? "Choose your NFT" : "No owned NFTs found"} />
                </SelectTrigger>
                <SelectContent>
                  {ownedNfts.map((id) => (
                    <SelectItem key={id} value={String(id)}>Token #{id}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <p className="text-xs text-muted-foreground mt-1">Only owners can list.</p>
            </div>

            <div>
              <Label className="mb-2 block">Quantity</Label>
              <Input 
                type="number" 
                value={qty} 
                onChange={(e) => setQty(e.target.value)} 
                placeholder="Number of NFTs" 
              />
              <p className="text-xs text-muted-foreground mt-1">
                Each quantity represents a separate NFT with the same properties
              </p>
            </div>
          </Card>

          {/* Right Column - Product Details */}
          <Card className="glass-panel p-6 space-y-6">
            <h2 className="text-xl font-semibold flex items-center">
              <Package className="w-5 h-5 mr-2" />
              Product Details
            </h2>

            <div>
              <Label className="mb-2 block">Product Name</Label>
              <Input 
                value={name} 
                onChange={(e) => setName(e.target.value)} 
                placeholder="Enter product name" 
              />
            </div>

            <div>
              <Label className="mb-2 block">Description</Label>
              <Textarea 
                value={desc} 
                onChange={(e) => setDesc(e.target.value)} 
                placeholder="Enter detailed product description..." 
                rows={4} 
              />
            </div>

            <div>
              <Label className="mb-2 block">Category</Label>
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
                  <SelectItem value="utility">Utility</SelectItem>
                  <SelectItem value="other">Other</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label className="mb-2 block flex items-center">
                <DollarSign className="w-4 h-4 mr-2" />
                Price (in ETH)
              </Label>
              <div className="flex space-x-2">
                <Input
                  type="number"
                  step="0.001"
                  placeholder="Enter price in ETH"
                  value={priceEth}
                  onChange={(e) => setPriceEth(e.target.value)}
                />
                <Button
                  variant="outline"
                  onClick={() => setPriceEth(getAISuggestedPrice())}
                  className="whitespace-nowrap"
                >
                  <Sparkles className="w-4 h-4 mr-2" />
                  AI Suggest
                </Button>
              </div>
              <p className="text-xs text-muted-foreground mt-1">
                AI Suggested: {getAISuggestedPrice()} ETH
              </p>
            </div>
          </Card>
        </div>

        <Card className="glass-panel p-6">

          {/* Physical Inspection if price > 1000 (UI-only rule retained) */}
          {priceNum > 1000 && (
            <Card className="glass-card p-6 mt-6">
              <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
                <Calendar className="w-5 h-5 text-primary" />
                Physical Inspection Required
              </h2>

              <div>
                <Label className="mb-2 block">Inspection Date</Label>
                <Input
                  type="date"
                  value={inspectionDate}
                  onChange={(e) => setInspectionDate(e.target.value)}
                />
              </div>

              <div className="mt-4">
                <Label className="mb-2 block">Inspection Location</Label>
                <Input placeholder="Enter location for inspection" />
              </div>
            </Card>
          )}

          <div className="grid md:grid-cols-1 gap-3">
            <Button onClick={onSubmitForApproval} disabled={loading || !tokenId} className="w-full bg-primary text-primary-foreground hover:bg-primary/80">
              {loading ? "Submitting…" : "Submit for Admin Approval (0.01 ETH)"}
            </Button>
          </div>
        </Card>
      </div>
    </div>
  );
};

export default ProductListing;
