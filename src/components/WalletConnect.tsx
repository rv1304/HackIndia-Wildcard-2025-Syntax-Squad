import { Button } from "@/components/ui/button";
import { useAccount, useConnect, useDisconnect } from "wagmi";
import { Wallet } from "lucide-react";

export default function WalletConnect() {
  const { address, isConnected, chainId } = useAccount();
  const { connect, connectors, isPending } = useConnect();
  const { disconnect } = useDisconnect();

  const addOrSwitch = async () => {
    const provider = (window as any)?.ethereum;
    if (!provider) return;
    try {
      await provider.request({
        method: "wallet_switchEthereumChain",
        params: [{ chainId: "0x7A69" }],
      });
    } catch (err: any) {
      if (err?.code === 4902) {
        await provider.request({
          method: "wallet_addEthereumChain",
          params: [
            {
              chainId: "0x7A69",
              chainName: "Anvil (Local)",
              nativeCurrency: { name: "ETH", symbol: "ETH", decimals: 18 },
              rpcUrls: ["http://127.0.0.1:8545"],
            },
          ],
        });
      }
    }
  };

  if (!isConnected) {
    return (
      <Button
        className="bg-gradient-primary hover:opacity-90 hover:scale-105 text-primary-foreground border-0 transition-all duration-300"
        onClick={() => connect({ connector: connectors[0] })}
        disabled={isPending}
      >
        <Wallet className="w-4 h-4 mr-2" />
        {isPending ? "Connecting…" : "Connect Wallet"}
      </Button>
    );
  }

  return (
    <div className="flex items-center gap-2">
      {chainId !== 31337 && (
        <Button variant="outline" onClick={addOrSwitch}>Switch to Anvil</Button>
      )}
      <Button variant="secondary" onClick={() => disconnect()}>
        {address?.slice(0, 6)}…{address?.slice(-4)}
      </Button>
    </div>
  );
}
