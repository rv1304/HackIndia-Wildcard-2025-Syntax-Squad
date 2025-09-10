/**
 * QR Code Bridge System
 * Handles QR code generation and verification for physical-digital linking
 */

export interface QRCodeData {
  tokenId: number;
  contractAddress: string;
  networkId: number;
  verificationHash: string;
  createdAt: number;
  metadata?: {
    name: string;
    description: string;
    image: string;
  };
}

export interface QRVerificationResult {
  valid: boolean;
  tokenId?: number;
  contractAddress?: string;
  metadata?: any;
  verificationHash?: string;
  createdAt?: number;
  error?: string;
}

export class QRCodeBridge {
  private verificationCache: Map<string, QRCodeData> = new Map();

  /**
   * Generate QR code data for a physical asset
   */
  generateQRData(
    tokenId: number,
    contractAddress: string,
    networkId: number,
    metadata?: any
  ): QRCodeData {
    const qrData: QRCodeData = {
      tokenId,
      contractAddress,
      networkId,
      verificationHash: this.generateVerificationHash(tokenId, contractAddress, networkId),
      createdAt: Date.now(),
      metadata
    };

    // Cache the QR data for verification
    this.verificationCache.set(qrData.verificationHash, qrData);

    console.log(`QR Bridge: Generated QR code for token ${tokenId}`);
    return qrData;
  }

  /**
   * Generate QR code string (base64 data URL or JSON)
   */
  generateQRCodeString(qrData: QRCodeData, format: 'json' | 'url' = 'json'): string {
    if (format === 'url') {
      // Create a verification URL
      const baseUrl = 'https://phigital-nft.com/verify';
      const params = new URLSearchParams({
        h: qrData.verificationHash,
        t: qrData.tokenId.toString(),
        c: qrData.contractAddress,
        n: qrData.networkId.toString()
      });
      return `${baseUrl}?${params.toString()}`;
    }

    // Return JSON format for offline verification
    return JSON.stringify(qrData);
  }

  /**
   * Verify QR code data
   */
  async verifyQRCode(qrCodeString: string): Promise<QRVerificationResult> {
    try {
      let qrData: Partial<QRCodeData>;

      // Try to parse as URL first
      if (qrCodeString.startsWith('http')) {
        qrData = this.parseQRCodeURL(qrCodeString);
      } else {
        // Try to parse as JSON
        qrData = JSON.parse(qrCodeString);
      }

      if (!qrData.verificationHash || !qrData.tokenId || !qrData.contractAddress) {
        return {
          valid: false,
          error: 'Invalid QR code data format'
        };
      }

      // Verify the hash
      const expectedHash = this.generateVerificationHash(
        qrData.tokenId!,
        qrData.contractAddress!,
        qrData.networkId || 1
      );

      if (qrData.verificationHash !== expectedHash) {
        return {
          valid: false,
          error: 'Invalid verification hash'
        };
      }

      // Check if QR code exists in cache
      const cachedData = this.verificationCache.get(qrData.verificationHash);
      if (cachedData) {
        return {
          valid: true,
          tokenId: cachedData.tokenId,
          contractAddress: cachedData.contractAddress,
          metadata: cachedData.metadata,
          verificationHash: cachedData.verificationHash,
          createdAt: cachedData.createdAt
        };
      }

      // If not in cache, verify against blockchain (mock for now)
      const blockchainValid = await this.verifyOnBlockchain(qrData as QRCodeData);
      
      if (blockchainValid) {
        return {
          valid: true,
          tokenId: qrData.tokenId,
          contractAddress: qrData.contractAddress,
          verificationHash: qrData.verificationHash,
          createdAt: qrData.createdAt
        };
      }

      return {
        valid: false,
        error: 'Asset not found on blockchain'
      };

    } catch (error) {
      console.error('QR verification error:', error);
      return {
        valid: false,
        error: 'Failed to parse QR code'
      };
    }
  }

  /**
   * Parse QR code URL format
   */
  private parseQRCodeURL(url: string): Partial<QRCodeData> {
    try {
      const urlObj = new URL(url);
      const params = urlObj.searchParams;

      return {
        verificationHash: params.get('h') || '',
        tokenId: parseInt(params.get('t') || '0'),
        contractAddress: params.get('c') || '',
        networkId: parseInt(params.get('n') || '1')
      };
    } catch (error) {
      throw new Error('Invalid QR code URL format');
    }
  }

  /**
   * Generate verification hash for QR code
   */
  private generateVerificationHash(tokenId: number, contractAddress: string, networkId: number): string {
    const data = `${tokenId}-${contractAddress}-${networkId}-${Date.now()}`;
    // Simple hash (in production, use proper cryptographic hash)
    return btoa(data).replace(/[^a-zA-Z0-9]/g, '').substr(0, 16);
  }

  /**
   * Verify asset exists on blockchain (mock implementation)
   */
  private async verifyOnBlockchain(qrData: QRCodeData): Promise<boolean> {
    // Mock blockchain verification
    // In a real implementation, this would call the blockchain to verify the NFT exists
    return new Promise((resolve) => {
      setTimeout(() => {
        // Mock: assume valid if tokenId > 0
        resolve(qrData.tokenId > 0);
      }, 100);
    });
  }

  /**
   * Get asset information from QR code
   */
  async getAssetInfo(qrCodeString: string): Promise<{
    tokenId?: number;
    name?: string;
    description?: string;
    image?: string;
    owner?: string;
    verified: boolean;
  }> {
    const verification = await this.verifyQRCode(qrCodeString);
    
    if (!verification.valid) {
      return { verified: false };
    }

    // Mock asset information (in production, fetch from blockchain/metadata)
    return {
      tokenId: verification.tokenId,
      name: verification.metadata?.name || `Asset #${verification.tokenId}`,
      description: verification.metadata?.description || 'Phigital NFT Asset',
      image: verification.metadata?.image || '/placeholder.svg',
      owner: '0x1234...5678', // Mock owner
      verified: true
    };
  }

  /**
   * Create QR code for physical attachment
   */
  createPhysicalQRCode(
    tokenId: number,
    contractAddress: string,
    networkId: number = 1,
    options: {
      size?: number;
      includeMetadata?: boolean;
      format?: 'json' | 'url';
    } = {}
  ): {
    qrData: QRCodeData;
    qrString: string;
    displayInfo: {
      title: string;
      subtitle: string;
      instructions: string;
    };
  } {
    const qrData = this.generateQRData(tokenId, contractAddress, networkId);
    const qrString = this.generateQRCodeString(qrData, options.format);

    return {
      qrData,
      qrString,
      displayInfo: {
        title: `Phigital NFT #${tokenId}`,
        subtitle: 'Scan to verify authenticity',
        instructions: 'Use the Phigital NFT app to scan this code and verify the digital ownership of this physical item.'
      }
    };
  }

  /**
   * Batch generate QR codes for multiple assets
   */
  batchGenerateQRCodes(
    assets: Array<{
      tokenId: number;
      contractAddress: string;
      networkId?: number;
      metadata?: any;
    }>
  ): Array<{
    tokenId: number;
    qrData: QRCodeData;
    qrString: string;
  }> {
    return assets.map(asset => {
      const qrData = this.generateQRData(
        asset.tokenId,
        asset.contractAddress,
        asset.networkId || 1,
        asset.metadata
      );
      
      return {
        tokenId: asset.tokenId,
        qrData,
        qrString: this.generateQRCodeString(qrData)
      };
    });
  }

  /**
   * Get QR code statistics
   */
  getStatistics(): {
    totalGenerated: number;
    totalVerified: number;
    cacheSize: number;
  } {
    return {
      totalGenerated: this.verificationCache.size,
      totalVerified: this.verificationCache.size, // Mock: assume all generated codes were verified
      cacheSize: this.verificationCache.size
    };
  }

  /**
   * Clear verification cache
   */
  clearCache(): void {
    this.verificationCache.clear();
    console.log('QR Bridge: Cache cleared');
  }

  /**
   * Export QR code data for backup
   */
  exportQRData(): Array<QRCodeData> {
    return Array.from(this.verificationCache.values());
  }

  /**
   * Import QR code data from backup
   */
  importQRData(data: QRCodeData[]): void {
    data.forEach(qrData => {
      this.verificationCache.set(qrData.verificationHash, qrData);
    });
    console.log(`QR Bridge: Imported ${data.length} QR codes`);
  }
}
