import { publicClient } from "./wagmi";
import { createPublicClient, custom, http, type Hex } from "viem";

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
}


