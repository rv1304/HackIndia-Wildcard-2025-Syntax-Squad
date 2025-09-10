import { http, createConfig } from "wagmi";
import { createPublicClient, createWalletClient, custom, type Chain } from "viem";
import { sepolia, anvil } from "viem/chains";

export const sepoliaAlchemy: Chain = {
  ...sepolia,
  rpcUrls: { 
    default: { 
      http: ["https://eth-sepolia.g.alchemy.com/v2/8nmbMWuaAdXLgqblqYNG6"] 
    } 
  },
};

export { anvil };

export const config = createConfig({
  chains: [sepoliaAlchemy],
  transports: {
    [sepoliaAlchemy.id]: http("https://eth-sepolia.g.alchemy.com/v2/8nmbMWuaAdXLgqblqYNG6"),
  },
});

export const publicClient = createPublicClient({
  chain: sepoliaAlchemy,
  transport: http("https://eth-sepolia.g.alchemy.com/v2/8nmbMWuaAdXLgqblqYNG6"),
});

export const switchToSepolia = async () => {
  if (!window.ethereum) throw new Error("No wallet detected");
  
  try {
    // Try to switch to Sepolia
    await window.ethereum.request({
      method: 'wallet_switchEthereumChain',
      params: [{ chainId: '0xaa36a7' }], // Sepolia
    });
  } catch (switchError: any) {
    // If the chain hasn't been added to MetaMask, add it
    if (switchError.code === 4902) {
      await window.ethereum.request({
        method: 'wallet_addEthereumChain',
        params: [{
          chainId: '0xaa36a7',
          chainName: 'Sepolia Testnet',
          nativeCurrency: {
            name: 'Sepolia ETH',
            symbol: 'SepoliaETH',
            decimals: 18,
          },
          rpcUrls: ['https://eth-sepolia.g.alchemy.com/v2/8nmbMWuaAdXLgqblqYNG6'],
          blockExplorerUrls: ['https://sepolia.etherscan.io/'],
        }],
      });
    } else {
      throw switchError;
    }
  }
};

export const getWalletClient = async () => {
  if (typeof window === "undefined") return null;
  
  const eth = (window as any).ethereum;
  if (!eth) {
    throw new Error("No Ethereum provider found. Please install MetaMask or another Web3 wallet.");
  }

  try {
    // Request account access if needed
    await eth.request({ method: 'eth_requestAccounts' });
    
    // Check if we're on the correct network
    const chainId = await eth.request({ method: 'eth_chainId' });
    console.log('Current chain ID from MetaMask:', chainId);
    console.log('Expected chain ID (Sepolia):', '0xaa36a7');
    
    if (chainId !== '0xaa36a7') { // 11155111 in hex (Sepolia)
      console.log('Wrong network detected, attempting to switch to Sepolia...');
      try {
        await switchToSepolia();
        console.log('Successfully switched to Sepolia');
      } catch (switchError) {
        console.error('Failed to switch to Sepolia:', switchError);
        throw new Error(`Please manually switch to Sepolia testnet (Chain ID: 11155111). Current chain ID: ${chainId}`);
      }
    }

    return createWalletClient({ 
      chain: sepoliaAlchemy, 
      transport: custom(eth),
      account: undefined // Let viem handle account detection
    });
  } catch (error) {
    console.error("Wallet client creation failed:", error);
    throw error;
  }
};
