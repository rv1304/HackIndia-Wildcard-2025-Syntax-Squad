import { useEffect, useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { CONTRACTS } from "../config/contracts";
import { AuthXNFTAbi, AuthXMarketplaceAbi } from "../abi";
import { getWalletClient, publicClient } from "../lib/wagmi";
import { waitForTx } from "../lib/tx";
import { parseEther } from "viem";
import { useAccount } from "wagmi";

export default function AdminApprovals() {
  const [pending, setPending] = useState<any[]>([]);
  const [processing, setProcessing] = useState<string | null>(null);
  const { address } = useAccount();

  const refresh = async () => {
    // Collect pending listings from localStorage and verify they exist on-chain as inactive
    const allPending: any[] = [];
    
    // Get all pending listings from localStorage
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      if (key && key.startsWith('pending.listings.')) {
        const accountPending = JSON.parse(localStorage.getItem(key) || '[]');
        allPending.push(...accountPending);
      }
    }
    
    // Verify each listing exists on-chain as inactive
    const verifiedPending: any[] = [];
    for (const item of allPending) {
      try {
        const [price, seller, active] = await publicClient.readContract({
          abi: AuthXMarketplaceAbi,
          address: CONTRACTS.AuthXMarketplace,
          functionName: 'getListing',
          args: [BigInt(item.tokenId), CONTRACTS.AuthXNFT],
        });
        
        // Verify it's inactive and matches the seller
        if (!active && price > 0n && seller.toLowerCase() === item.seller.toLowerCase()) {
          verifiedPending.push({
            ...item,
            priceEth: String(Number(price) / 1e18)
          });
        }
      } catch (e) {
        // If on-chain check fails, still show the localStorage item
        verifiedPending.push(item);
      }
    }
    
    setPending(verifiedPending);
  };

  useEffect(() => { refresh(); const id = setInterval(refresh, 5000); return () => clearInterval(id); }, []);

  const approve = async (idx: number) => {
    const item = pending[idx];
    setProcessing(`approve-${idx}`);
    try {
      // Approve listing on-chain (activates it)
      const wallet = await getWalletClient();
      if (!wallet || !address) throw new Error("No wallet/account");
      const hash = await wallet.writeContract({
        account: address,
        abi: AuthXMarketplaceAbi,
        address: CONTRACTS.AuthXMarketplace,
        functionName: 'approveListing',
        args: [BigInt(item.tokenId), CONTRACTS.AuthXNFT],
      });
      await waitForTx(hash);

      // Remove from pending and add to approved listings
      const sellerAddress = item.seller;
      const pendingKey = `pending.listings.${sellerAddress}`;
      const accountPending = JSON.parse(localStorage.getItem(pendingKey) || '[]');
      const updatedAccountPending = accountPending.filter((p: any) => p.tokenId !== item.tokenId);
      localStorage.setItem(pendingKey, JSON.stringify(updatedAccountPending));
      
      // Add to approved listings (global)
      const approvedKey = 'approved.listings';
      const approved = JSON.parse(localStorage.getItem(approvedKey) || '[]');
      approved.push(item);
      localStorage.setItem(approvedKey, JSON.stringify(approved));
      
      await refresh(); // Refresh the admin view
      alert("Approved. Listing is now visible to buyers.");
    } catch (e) {
      console.error(e);
      alert((e as any)?.message || 'Approval failed');
    } finally {
      setProcessing(null);
    }
  };

  const reject = async (idx: number) => {
    const item = pending[idx];
    setProcessing(`reject-${idx}`);
    try {
      const wallet = await getWalletClient();
      if (!wallet || !address) throw new Error("No wallet/account");
      // Refund 0.01 ETH to seller
      await wallet.sendTransaction({ account: address, to: item.seller, value: parseEther("0.01") });
      
      // Remove from the specific account's pending list
      const sellerAddress = item.seller;
      const pendingKey = `pending.listings.${sellerAddress}`;
      const accountPending = JSON.parse(localStorage.getItem(pendingKey) || '[]');
      const updatedAccountPending = accountPending.filter((p: any) => p.tokenId !== item.tokenId);
      localStorage.setItem(pendingKey, JSON.stringify(updatedAccountPending));
      
      refresh(); // Refresh the admin view
      alert("Rejected and refunded 0.01 ETH.");
    } catch (e) {
      console.error(e);
    } finally {
      setProcessing(null);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-dark py-8 px-6">
      <div className="max-w-5xl mx-auto">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-3xl font-bold">Admin Approvals</h1>
          <Button variant="outline" onClick={refresh} disabled={processing !== null}>Refresh</Button>
        </div>
        <div className="grid gap-4">
          {pending.length === 0 && (
            <Card className="glass-panel p-6">No pending listings.</Card>
          )}
          {pending.map((p, i) => (
            <Card key={i} className="glass-panel p-6">
              <div className="flex gap-4">
                {p.image && <img src={p.image} className="w-24 h-24 object-cover rounded border border-border" />}
                <div className="flex-1">
                  <div className="font-semibold">{p.name} (#{p.tokenId})</div>
                  <div className="text-sm text-muted-foreground">{p.category}</div>
                  <div className="text-sm mt-1">{p.desc}</div>
                  <div className="text-sm mt-1">Qty: {p.qty}</div>
                  <div className="text-sm mt-1">Price: {p.priceEth} ETH</div>
                </div>
                <div className="flex flex-col gap-2">
                  <Button onClick={() => approve(i)} disabled={processing !== null} className="bg-gradient-primary text-primary-foreground">Approve</Button>
                  <Button variant="outline" onClick={() => reject(i)} disabled={processing !== null}>Reject</Button>
                </div>
              </div>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
}
