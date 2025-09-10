import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { getWalletClient, publicClient, anvil } from "../lib/wagmi";
import { waitForTx } from "../lib/tx";
import { CONTRACTS } from "../config/contracts";
import { AuthXNFTAbi } from "../abi/index";
import { useAccount } from "wagmi";

export default function Mint() {
  const { address, isConnected } = useAccount();
  const [loading, setLoading] = useState(false);
  const [image, setImage] = useState<string | null>(null);
  const [name, setName] = useState("");
  const [desc, setDesc] = useState("");
  const [category, setCategory] = useState("");
  const [requiresInspection, setRequiresInspection] = useState(false);
  const [inspectionDate, setInspectionDate] = useState("");
  const [addressLine, setAddressLine] = useState("");

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const reader = new FileReader();
      reader.onload = () => setImage(reader.result as string);
      reader.readAsDataURL(e.target.files[0]);
    }
  };

  const ensureLocalChain = async () => {
    const eth = (window as any)?.ethereum;
    if (!eth) return;
    try {
      const chainIdHex: string = await eth.request({ method: "eth_chainId" });
      console.log("Current chainId:", chainIdHex);
      if (chainIdHex !== "0x7a69") {
        await eth.request({ method: "wallet_switchEthereumChain", params: [{ chainId: "0x7a69" }] });
      }
    } catch (err) {
      console.error("Failed to ensure local chain", err);
      throw err;
    }
  };

  const mint = async () => {
    if (!isConnected || !address) return;
    if (!name || !category) { console.error("Validation: name and category are required"); return; }
    setLoading(true);
    try {
      await ensureLocalChain();

      const wallet = await getWalletClient();
      if (!wallet) throw new Error("No wallet");

      const metadata = { name, description: desc, image };
      const uri = `data:application/json,${encodeURIComponent(JSON.stringify(metadata))}`;

      const hash = await wallet.writeContract({
        chain: anvil,
        account: address,
        abi: AuthXNFTAbi,
        address: CONTRACTS.AuthXNFT,
        functionName: 'mintPhigitalAsset',
        args: [address, uri, category, 0n, requiresInspection],
        value: 0n,
        gas: 300000n,
        maxFeePerGas: 20000000000n, // 20 gwei
        maxPriorityFeePerGas: 1000000000n, // 1 gwei
      });

      console.log("Transaction submitted", { txHash: hash });
      // Do not block UI waiting for receipt; poll in background
      waitForTx(hash).then((receipt) => {
        console.log("Minted successfully", { txHash: hash, receipt });
      }).catch((err) => {
        console.error("Background receipt wait failed", err);
      });
    } catch (e) {
      const err: any = e;
      console.error("Mint failed", {
        message: err?.message,
        shortMessage: err?.shortMessage,
        cause: err?.cause,
        data: err
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-dark py-8 px-6">
      <div className="max-w-4xl mx-auto">
        <div className="mb-8 text-center">
          <h1 className="text-3xl font-bold mb-2">Mint New NFT</h1>
          <p className="text-muted-foreground">Create a new digital/phigital NFT</p>
        </div>

        <div className="grid lg:grid-cols-2 gap-8">
          <Card className="glass-panel p-6 space-y-6">
            <div>
              <Label className="mb-2 block">Product Image</Label>
              <Input type="file" accept="image/*" onChange={handleImageUpload} />
              {image && (
                <img src={image} className="mt-3 w-full h-64 object-cover rounded border border-border" />
              )}
            </div>

            <div>
              <Label className="mb-2 block">Product Name</Label>
              <Input value={name} onChange={(e) => setName(e.target.value)} placeholder="Enter product name" />
            </div>

            <div>
              <Label className="mb-2 block">Description</Label>
              <Textarea value={desc} onChange={(e) => setDesc(e.target.value)} placeholder="Enter detailed description..." rows={4} />
            </div>
          </Card>

          <Card className="glass-panel p-6 space-y-6">
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
                  <SelectItem value="phigital">Phigital</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label className="mb-2 block">Physical Inspection (buyers reselling only)</Label>
              <p className="text-xs text-muted-foreground">Companies do not require physical inspection here.</p>
            </div>

            <Button onClick={mint} disabled={loading || !isConnected} className="w-full bg-gradient-primary text-primary-foreground">
              {!isConnected ? "Connect Wallet" : loading ? "Minting…" : "Mint NFT"}
            </Button>
          </Card>
        </div>
      </div>
    </div>
  );
}
