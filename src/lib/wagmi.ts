import { http, createConfig } from "wagmi";
import { createPublicClient, createWalletClient, custom, type Chain } from "viem";

export const anvil: Chain = {
  id: 31337,
  name: "Anvil (Local)",
  nativeCurrency: { name: "ETH", symbol: "ETH", decimals: 18 },
  rpcUrls: { default: { http: ["http://127.0.0.1:8545"] } },
};

export const config = createConfig({
  chains: [anvil],
  transports: {
    [anvil.id]: http("http://127.0.0.1:8545"),
  },
});

export const publicClient = createPublicClient({
  chain: anvil,
  transport: http("http://127.0.0.1:8545"),
});

export const getWalletClient = async () => {
  if (typeof window === "undefined") return null;
  const eth = (window as any).ethereum;
  if (!eth) return null;
  return createWalletClient({ chain: anvil, transport: custom(eth) });
};
