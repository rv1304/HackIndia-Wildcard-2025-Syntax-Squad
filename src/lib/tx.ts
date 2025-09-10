import { publicClient } from "./wagmi";
import { createPublicClient, custom, http, type Hex } from "viem";

<<<<<<< HEAD
export async function waitForTx(hash: Hex, timeoutMs = 120000, pollMs = 2000) {
  const start = Date.now();
  console.log(`Waiting for transaction: ${hash}`);

  // Try immediate receipt check first
  try {
    const receipt = await publicClient.getTransactionReceipt({ hash });
    if (receipt && receipt.blockNumber) {
      console.log(`Transaction already confirmed: ${hash}`, receipt);
      return receipt;
    }
  } catch (error) {
    console.log(`Transaction not yet mined: ${hash}`);
  }

  // Regular polling for real networks
  let attempts = 0;
  const maxAttempts = Math.floor(timeoutMs / pollMs);
  
  while (attempts < maxAttempts) {
    try {
      const receipt = await publicClient.getTransactionReceipt({ hash });
      if (receipt && receipt.blockNumber) {
        console.log(`Transaction confirmed via polling: ${hash}`, receipt);
        return receipt;
      }
    } catch (pollError) {
      console.log(`Poll attempt ${attempts + 1}/${maxAttempts} failed for ${hash}:`, pollError);
    }

    attempts++;
    if (attempts % 5 === 0) { // Log every 10 seconds
      console.log(`Still waiting for transaction ${hash} (attempt ${attempts}/${maxAttempts})`);
    }
    
    if (Date.now() - start > timeoutMs) {
      const errorMsg = `Timeout waiting for transaction receipt: ${hash}. Check network status.`;
      console.error(errorMsg);
      throw new Error(errorMsg);
    }
    
    await new Promise((res) => setTimeout(res, pollMs));
  }

  throw new Error(`Failed to get transaction receipt after ${maxAttempts} attempts: ${hash}`);
=======
export async function waitForTx(hash: Hex, timeoutMs = 120000, pollMs = 1500) {
  const start = Date.now();

  // Prefer the HTTP client first (stable, not subject to wallet UI gating)
  try {
    // @ts-expect-error viem types may not expose timeout
    return await publicClient.waitForTransactionReceipt({ hash, timeout: timeoutMs });
  } catch (_) {}

  // Build an injected client tied to the wallet, if available
  let injectedClient: ReturnType<typeof createPublicClient> | null = null;
  try {
    if (typeof window !== "undefined" && (window as any).ethereum) {
      injectedClient = createPublicClient({
        // Chain id is inferred from the wallet; transport uses the injected provider
        transport: custom((window as any).ethereum),
      }) as any;
    }
  } catch {}

  // Fallback to manual polling on both clients
  // eslint-disable-next-line no-constant-condition
  while (true) {
    try {
      const r = await publicClient.getTransactionReceipt({ hash });
      if (r && r.blockNumber) return r;
    } catch {}

    if (injectedClient) {
      try {
        const r2 = await injectedClient.getTransactionReceipt({ hash });
        if (r2 && r2.blockNumber) return r2 as any;
      } catch {}
    }

    if (Date.now() - start > timeoutMs) throw new Error("Timeout waiting for transaction receipt");
    await new Promise((res) => setTimeout(res, pollMs));
  }
>>>>>>> 1e851595ae0f0b837ef639a22767adb445fbfb26
}


