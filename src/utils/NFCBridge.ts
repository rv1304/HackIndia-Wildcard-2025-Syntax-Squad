/**
 * NFC Bridge System
 * Handles NFC tag creation and verification for physical-digital linking
 */

export interface NFCTagData {
  tokenId: number;
  contractAddress: string;
  networkId: number;
  tagId: string;
  encryptionKey: string;
  verificationHash: string;
  createdAt: number;
  metadata?: {
    name: string;
    description: string;
    image: string;
  };
}

export interface NFCVerificationResult {
  valid: boolean;
  tokenId?: number;
  contractAddress?: string;
  metadata?: any;
  tagId?: string;
  verificationHash?: string;
  createdAt?: number;
  error?: string;
}

export interface NFCReadResult {
  success: boolean;
  data?: NFCTagData;
  error?: string;
}

export class NFCBridge {
  private tagRegistry: Map<string, NFCTagData> = new Map();
  private encryptionKeys: Map<string, string> = new Map();

  /**
   * Generate NFC tag data for a physical asset
   */
  generateNFCData(
    tokenId: number,
    contractAddress: string,
    networkId: number,
    metadata?: any
  ): NFCTagData {
    const tagId = this.generateTagId();
    const encryptionKey = this.generateEncryptionKey();
    
    const nfcData: NFCTagData = {
      tokenId,
      contractAddress,
      networkId,
      tagId,
      encryptionKey,
      verificationHash: this.generateVerificationHash(tokenId, contractAddress, tagId),
      createdAt: Date.now(),
      metadata
    };

    // Register the tag
    this.tagRegistry.set(tagId, nfcData);
    this.encryptionKeys.set(tagId, encryptionKey);

    console.log(`NFC Bridge: Generated NFC tag ${tagId} for token ${tokenId}`);
    return nfcData;
  }

  /**
   * Prepare NFC tag data for writing to physical tag
   */
  prepareTagForWriting(nfcData: NFCTagData): {
    tagId: string;
    encryptedData: string;
    publicData: {
      tokenId: number;
      contractAddress: string;
      networkId: number;
      verificationUrl: string;
    };
  } {
    // Encrypt sensitive data
    const sensitiveData = {
      verificationHash: nfcData.verificationHash,
      createdAt: nfcData.createdAt,
      metadata: nfcData.metadata
    };

    const encryptedData = this.encryptData(JSON.stringify(sensitiveData), nfcData.encryptionKey);

    // Public data that can be read without encryption
    const publicData = {
      tokenId: nfcData.tokenId,
      contractAddress: nfcData.contractAddress,
      networkId: nfcData.networkId,
      verificationUrl: `https://phigital-nft.com/nfc-verify/${nfcData.tagId}`
    };

    return {
      tagId: nfcData.tagId,
      encryptedData,
      publicData
    };
  }

  /**
   * Simulate NFC tag reading
   */
  async readNFCTag(tagId: string): Promise<NFCReadResult> {
    try {
      console.log(`NFC Bridge: Reading tag ${tagId}`);

      const tagData = this.tagRegistry.get(tagId);
      if (!tagData) {
        return {
          success: false,
          error: 'NFC tag not found'
        };
      }

      // Simulate NFC read delay
      await new Promise(resolve => setTimeout(resolve, 200));

      return {
        success: true,
        data: tagData
      };

    } catch (error) {
      console.error('NFC read error:', error);
      return {
        success: false,
        error: 'Failed to read NFC tag'
      };
    }
  }

  /**
   * Verify NFC tag authenticity
   */
  async verifyNFCTag(tagId: string, encryptedData?: string): Promise<NFCVerificationResult> {
    try {
      const tagData = this.tagRegistry.get(tagId);
      if (!tagData) {
        return {
          valid: false,
          error: 'NFC tag not registered'
        };
      }

      // Verify tag hasn't been tampered with
      const expectedHash = this.generateVerificationHash(
        tagData.tokenId,
        tagData.contractAddress,
        tagId
      );

      if (tagData.verificationHash !== expectedHash) {
        return {
          valid: false,
          error: 'Tag verification hash mismatch'
        };
      }

      // If encrypted data provided, decrypt and verify
      if (encryptedData) {
        const encryptionKey = this.encryptionKeys.get(tagId);
        if (!encryptionKey) {
          return {
            valid: false,
            error: 'Encryption key not found'
          };
        }

        try {
          const decryptedData = this.decryptData(encryptedData, encryptionKey);
          const parsedData = JSON.parse(decryptedData);
          
          // Verify decrypted data matches stored data
          if (parsedData.verificationHash !== tagData.verificationHash) {
            return {
              valid: false,
              error: 'Decrypted data verification failed'
            };
          }
        } catch (decryptError) {
          return {
            valid: false,
            error: 'Failed to decrypt tag data'
          };
        }
      }

      // Verify against blockchain (mock implementation)
      const blockchainValid = await this.verifyOnBlockchain(tagData);
      if (!blockchainValid) {
        return {
          valid: false,
          error: 'Asset not found on blockchain'
        };
      }

      return {
        valid: true,
        tokenId: tagData.tokenId,
        contractAddress: tagData.contractAddress,
        metadata: tagData.metadata,
        tagId: tagData.tagId,
        verificationHash: tagData.verificationHash,
        createdAt: tagData.createdAt
      };

    } catch (error) {
      console.error('NFC verification error:', error);
      return {
        valid: false,
        error: 'Verification failed'
      };
    }
  }

  /**
   * Get asset information from NFC tag
   */
  async getAssetInfoFromNFC(tagId: string): Promise<{
    tokenId?: number;
    name?: string;
    description?: string;
    image?: string;
    owner?: string;
    verified: boolean;
    securityLevel: 'high' | 'medium' | 'low';
  }> {
    const verification = await this.verifyNFCTag(tagId);
    
    if (!verification.valid) {
      return { 
        verified: false,
        securityLevel: 'low'
      };
    }

    return {
      tokenId: verification.tokenId,
      name: verification.metadata?.name || `Asset #${verification.tokenId}`,
      description: verification.metadata?.description || 'Phigital NFT Asset',
      image: verification.metadata?.image || '/placeholder.svg',
      owner: '0x1234...5678', // Mock owner
      verified: true,
      securityLevel: 'high' // NFC provides higher security than QR
    };
  }

  /**
   * Update NFC tag metadata
   */
  async updateTagMetadata(tagId: string, metadata: any): Promise<boolean> {
    const tagData = this.tagRegistry.get(tagId);
    if (!tagData) {
      return false;
    }

    tagData.metadata = { ...tagData.metadata, ...metadata };
    this.tagRegistry.set(tagId, tagData);

    console.log(`NFC Bridge: Updated metadata for tag ${tagId}`);
    return true;
  }

  /**
   * Disable/revoke NFC tag
   */
  revokeTag(tagId: string): boolean {
    const deleted = this.tagRegistry.delete(tagId);
    this.encryptionKeys.delete(tagId);
    
    if (deleted) {
      console.log(`NFC Bridge: Revoked tag ${tagId}`);
    }
    
    return deleted;
  }

  /**
   * Check if NFC is supported (mock implementation)
   */
  async checkNFCSupport(): Promise<{
    supported: boolean;
    enabled: boolean;
    error?: string;
  }> {
    // Mock NFC support check
    return new Promise((resolve) => {
      setTimeout(() => {
        // Simulate various device states
        const hasNFC = Math.random() > 0.3; // 70% chance of NFC support
        const isEnabled = hasNFC && Math.random() > 0.2; // 80% chance enabled if supported

        resolve({
          supported: hasNFC,
          enabled: isEnabled,
          error: !hasNFC ? 'NFC not supported on this device' : 
                 !isEnabled ? 'NFC is disabled' : undefined
        });
      }, 100);
    });
  }

  /**
   * Start NFC scanning session
   */
  async startNFCScanning(): Promise<{
    sessionId: string;
    timeout: number;
  }> {
    const sessionId = `nfc-session-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
    const timeout = 30000; // 30 second timeout

    console.log(`NFC Bridge: Started scanning session ${sessionId}`);

    return {
      sessionId,
      timeout
    };
  }

  /**
   * Stop NFC scanning session
   */
  stopNFCScanning(sessionId: string): void {
    console.log(`NFC Bridge: Stopped scanning session ${sessionId}`);
  }

  /**
   * Generate unique tag ID
   */
  private generateTagId(): string {
    return `nfc-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
  }

  /**
   * Generate encryption key for tag
   */
  private generateEncryptionKey(): string {
    return btoa(Math.random().toString(36).substr(2, 15)).replace(/[^a-zA-Z0-9]/g, '').substr(0, 32);
  }

  /**
   * Generate verification hash
   */
  private generateVerificationHash(tokenId: number, contractAddress: string, tagId: string): string {
    const data = `${tokenId}-${contractAddress}-${tagId}-nfc-${Date.now()}`;
    return btoa(data).replace(/[^a-zA-Z0-9]/g, '').substr(0, 24);
  }

  /**
   * Simple encryption (mock implementation)
   */
  private encryptData(data: string, key: string): string {
    // Simple XOR encryption for demo (use proper encryption in production)
    let result = '';
    for (let i = 0; i < data.length; i++) {
      result += String.fromCharCode(data.charCodeAt(i) ^ key.charCodeAt(i % key.length));
    }
    return btoa(result);
  }

  /**
   * Simple decryption (mock implementation)
   */
  private decryptData(encryptedData: string, key: string): string {
    const data = atob(encryptedData);
    let result = '';
    for (let i = 0; i < data.length; i++) {
      result += String.fromCharCode(data.charCodeAt(i) ^ key.charCodeAt(i % key.length));
    }
    return result;
  }

  /**
   * Verify asset exists on blockchain (mock implementation)
   */
  private async verifyOnBlockchain(tagData: NFCTagData): Promise<boolean> {
    // Mock blockchain verification
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve(tagData.tokenId > 0);
      }, 150);
    });
  }

  /**
   * Get NFC bridge statistics
   */
  getStatistics(): {
    totalTags: number;
    activeTags: number;
    verificationsPerformed: number;
  } {
    return {
      totalTags: this.tagRegistry.size,
      activeTags: this.tagRegistry.size,
      verificationsPerformed: this.tagRegistry.size * 2 // Mock: assume 2 verifications per tag
    };
  }

  /**
   * Export tag data for backup
   */
  exportTagData(): Array<NFCTagData> {
    return Array.from(this.tagRegistry.values());
  }

  /**
   * Import tag data from backup
   */
  importTagData(data: NFCTagData[]): void {
    data.forEach(tagData => {
      this.tagRegistry.set(tagData.tagId, tagData);
      this.encryptionKeys.set(tagData.tagId, tagData.encryptionKey);
    });
    console.log(`NFC Bridge: Imported ${data.length} NFC tags`);
  }

  /**
   * Clear all tag data
   */
  clearAllTags(): void {
    this.tagRegistry.clear();
    this.encryptionKeys.clear();
    console.log('NFC Bridge: All tag data cleared');
  }
}
