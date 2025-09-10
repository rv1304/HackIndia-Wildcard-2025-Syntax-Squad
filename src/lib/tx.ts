import { publicClient } from "./wagmi";
import { createPublicClient, custom, http, type Hex } from "viem";

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
}


