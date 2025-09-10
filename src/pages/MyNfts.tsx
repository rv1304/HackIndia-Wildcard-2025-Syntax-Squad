import { useEffect, useState } from "react";
import { useAccount } from "wagmi";
import { publicClient } from "../lib/wagmi";
import { CONTRACTS } from "../config/contracts";
import { AuthXNFTAbi } from "../abi";

export default function MyNfts() {
  const { address } = useAccount();
  const [tokenIds, setTokenIds] = useState<bigint[]>([]);

  useEffect(() => {
    const run = async () => {
      if (!address) return;
      const owned: bigint[] = [];
      for (let i = 0n; i < 50n; i++) {
        try {
          const owner = await publicClient.readContract({
            abi: AuthXNFTAbi,
            address: CONTRACTS.AuthXNFT,
            functionName: "ownerOf",
            args: [i],
          });
          if ((owner as string).toLowerCase() === address.toLowerCase()) owned.push(i);
        } catch {}
      }
      setTokenIds(owned);
    };
    run();
  }, [address]);

  return (
    <div className="max-w-4xl mx-auto p-6">
      <h2 className="text-2xl font-semibold mb-4">My NFTs</h2>
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {tokenIds.map((id) => (
          <div key={id.toString()} className="glass-panel p-4 rounded-xl">
            <div className="text-lg font-medium">Token #{id.toString()}</div>
          </div>
        ))}
      </div>
    </div>
  );
}
