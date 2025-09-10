import { useEffect, useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useAccount } from "wagmi";
import { getWalletClient, publicClient, sepoliaAlchemy } from "../lib/wagmi";
import { parseEther } from "viem";

export default function WalletTest() {
  const { address, isConnected, chainId } = useAccount();
  const [balance, setBalance] = useState<string>("");
  const [isLoading, setIsLoading] = useState(false);
  const [logs, setLogs] = useState<string[]>([]);

  const log = (message: string) => {
    console.log(message);
    setLogs(prev => [...prev, `${new Date().toLocaleTimeString()}: ${message}`]);
  };

  useEffect(() => {
    if (address) {
      getBalance();
    }
  }, [address]);

  const getBalance = async () => {
    if (!address) return;
    try {
      const bal = await publicClient.getBalance({ address });
      setBalance((Number(bal) / 1e18).toFixed(4));
      log(`Balance loaded: ${(Number(bal) / 1e18).toFixed(4)} ETH`);
    } catch (error) {
      log(`Error getting balance: ${(error as any).message}`);
    }
  };

  const testSimpleTransaction = async () => {
    if (!address) {
      log("No address connected");
      return;
    }

    setIsLoading(true);
    try {
      log("Starting simple transaction test...");
      log(`Connected address: ${address}`);
      log(`Chain ID: ${chainId}`);
      
      // Check if we're on the right network
      if (chainId !== 11155111) {
        throw new Error(`Wrong network! Please switch to Sepolia testnet (Chain ID: 11155111). Current: ${chainId}`);
      }
      
      const wallet = await getWalletClient();
      if (!wallet) {
        throw new Error("No wallet client");
      }
      
      log("Wallet client created successfully");
      
      // Check balance first
      const currentBalance = await publicClient.getBalance({ address });
      log(`Current balance: ${(Number(currentBalance) / 1e18).toFixed(4)} ETH`);
      
      if (Number(currentBalance) < Number(parseEther("0.001"))) {
        throw new Error("Insufficient balance for test transaction");
      }
      
      // Send a small amount to self (0.001 ETH)
      log("Sending 0.001 ETH to self...");
      log("Please approve the transaction in MetaMask...");
      
      const hash = await (wallet as any).sendTransaction({
        account: address,
        to: address,
        value: parseEther("0.001"),
        // Let MetaMask/Anvil handle gas automatically
      });
      
      log(`Transaction submitted: ${hash}`);
      log("Waiting for confirmation on Sepolia network...");
      
      // Wait for transaction confirmation (no need to mine on real network)
      let receipt = null;
      let attempts = 0;
      const maxAttempts = 30; // 30 attempts * 2 seconds = 60 seconds max
      
      while (attempts < maxAttempts && !receipt) {
        try {
          receipt = await publicClient.getTransactionReceipt({ hash });
          if (receipt && receipt.blockNumber) {
            log(`✅ Transaction confirmed in block: ${receipt.blockNumber}`);
            log(`✅ Transaction status: ${receipt.status === 'success' ? 'SUCCESS' : 'FAILED'}`);
            break;
          }
        } catch (e) {
          // Transaction not yet mined
        }
        
        attempts++;
        if (attempts % 5 === 0) { // Log every 10 seconds
          log(`Still waiting... (attempt ${attempts}/${maxAttempts})`);
        }
        await new Promise(resolve => setTimeout(resolve, 2000)); // Wait 2 seconds
      }
      
      if (!receipt) {
        throw new Error("Transaction not confirmed after 60 seconds. Check Sepolia network status.");
      }
      
      // Refresh balance
      await getBalance();
      log("Test transaction completed successfully!");
      
    } catch (error) {
      const errorMsg = (error as any).message;
      log(`Transaction failed: ${errorMsg}`);
      
      if (errorMsg.includes("User denied")) {
        log("❌ User rejected the transaction in MetaMask");
      } else if (errorMsg.includes("insufficient funds")) {
        log("❌ Insufficient funds - need more ETH");
      } else if (errorMsg.includes("network")) {
        log("❌ Network error - check if Sepolia RPC is working");
      } else if (errorMsg.includes("Chain ID")) {
        log("❌ Wrong network - switch to Sepolia testnet in MetaMask");
      } else {
        log(`❌ Unknown error: ${errorMsg}`);
      }
    } finally {
      setIsLoading(false);
    }
  };

  const clearLogs = () => setLogs([]);

  return (
    <div className="min-h-screen bg-gradient-dark py-8 px-6">
      <div className="max-w-4xl mx-auto space-y-6">
        <Card className="glass-panel p-6">
          <h1 className="text-2xl font-bold mb-4">Wallet Connection Test</h1>
          
          <div className="space-y-4">
            <div>
              <strong>Connected:</strong> {isConnected ? "✅ Yes" : "❌ No"}
            </div>
            <div>
              <strong>Address:</strong> {address || "Not connected"}
            </div>
            <div>
              <strong>Chain ID:</strong> {chainId || "Unknown"} 
              {chainId === 11155111 ? " ✅ (Sepolia)" : chainId ? " ❌ (Wrong network)" : ""}
            </div>
            <div>
              <strong>Balance:</strong> {balance ? `${balance} ETH` : "Loading..."}
            </div>
            {chainId && chainId !== 11155111 && (
              <div className="p-3 bg-yellow-500/10 border border-yellow-500/20 rounded-lg">
                <p className="text-yellow-600 text-sm">
                  ⚠️ Wrong network! Please switch to Sepolia testnet (Chain ID: 11155111)
                </p>
              </div>
            )}
          </div>

          <div className="mt-6 space-x-4">
            <Button onClick={getBalance} disabled={!address}>
              Refresh Balance
            </Button>
            <Button 
              onClick={testSimpleTransaction} 
              disabled={!address || isLoading}
              variant="outline"
            >
              {isLoading ? "Testing..." : "Test Simple Transaction"}
            </Button>
          </div>
        </Card>

        <Card className="glass-panel p-6">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-semibold">Transaction Logs</h2>
            <Button onClick={clearLogs} variant="outline" size="sm">
              Clear Logs
            </Button>
          </div>
          
          <div className="bg-black/20 p-4 rounded-lg max-h-96 overflow-y-auto">
            {logs.length === 0 ? (
              <p className="text-muted-foreground">No logs yet...</p>
            ) : (
              logs.map((log, index) => (
                <div key={index} className="text-sm font-mono mb-1 text-green-400">
                  {log}
                </div>
              ))
            )}
          </div>
        </Card>
      </div>
    </div>
  );
}
