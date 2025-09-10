/**
 * Physical Asset Verifier
 * Coordinates QR and NFC verification for physical-digital linking
 */

import { QRCodeBridge, QRCodeData, QRVerificationResult } from './QRCodeBridge';
import { NFCBridge, NFCTagData, NFCVerificationResult } from './NFCBridge';

export interface PhysicalVerificationResult {
  verified: boolean;
  verificationMethod: 'qr' | 'nfc' | 'both' | 'none';
  tokenId?: number;
  contractAddress?: string;
  metadata?: any;
  securityLevel: 'high' | 'medium' | 'low';
  confidence: number;
  details: {
    qrResult?: QRVerificationResult;
    nfcResult?: NFCVerificationResult;
  };
  warnings: string[];
  timestamp: number;
}

export interface PhysicalAssetCreationData {
  tokenId: number;
  contractAddress: string;
  networkId: number;
  metadata: {
    name: string;
    description: string;
    image: string;
    attributes?: Array<{ trait_type: string; value: string | number }>;
  };
  verificationMethods: Array<'qr' | 'nfc'>;
}

export interface InspectionReport {
  inspectorId: string;
  assetId: number;
  physicalCondition: 'excellent' | 'good' | 'fair' | 'poor';
  authenticity: 'verified' | 'suspicious' | 'counterfeit';
  bridgingQuality: 'secure' | 'adequate' | 'weak';
  notes: string;
  photos?: string[];
  timestamp: number;
  signature: string;
}

export class PhysicalAssetVerifier {
  private qrBridge: QRCodeBridge;
  private nfcBridge: NFCBridge;
  private inspectionReports: Map<number, InspectionReport> = new Map();
  private verificationHistory: Array<PhysicalVerificationResult> = [];

  constructor() {
    this.qrBridge = new QRCodeBridge();
    this.nfcBridge = new NFCBridge();
  }

  /**
   * Create physical-digital bridge for a new asset
   */
  async createPhysicalBridge(data: PhysicalAssetCreationData): Promise<{
    qrCode?: {
      data: QRCodeData;
      displayString: string;
      printableInfo: {
        title: string;
        subtitle: string;
        instructions: string;
      };
    };
    nfcTag?: {
      data: NFCTagData;
      writeData: {
        tagId: string;
        encryptedData: string;
        publicData: any;
      };
    };
    verificationUrl: string;
    setupInstructions: string[];
  }> {
    console.log(`Physical Verifier: Creating bridge for asset ${data.tokenId}`);

    const result: any = {
      verificationUrl: `https://phigital-nft.com/verify-asset/${data.tokenId}`,
      setupInstructions: []
    };

    // Generate QR code if requested
    if (data.verificationMethods.includes('qr')) {
      const qrData = this.qrBridge.generateQRData(
        data.tokenId,
        data.contractAddress,
        data.networkId,
        data.metadata
      );

      const qrInfo = this.qrBridge.createPhysicalQRCode(
        data.tokenId,
        data.contractAddress,
        data.networkId
      );

      result.qrCode = {
        data: qrData,
        displayString: qrInfo.qrString,
        printableInfo: qrInfo.displayInfo
      };

      result.setupInstructions.push(
        'Print the QR code and attach it securely to the physical item',
        'Ensure the QR code is clearly visible and scannable',
        'Consider using tamper-evident materials for the QR code'
      );
    }

    // Generate NFC tag if requested
    if (data.verificationMethods.includes('nfc')) {
      const nfcData = this.nfcBridge.generateNFCData(
        data.tokenId,
        data.contractAddress,
        data.networkId,
        data.metadata
      );

      const writeData = this.nfcBridge.prepareTagForWriting(nfcData);

      result.nfcTag = {
        data: nfcData,
        writeData
      };

      result.setupInstructions.push(
        'Write the provided data to an NFC tag using an NFC writing app',
        'Embed the NFC tag securely within the physical item',
        'Test the NFC tag before finalizing the physical placement',
        'Ensure the NFC tag is protected from physical damage'
      );
    }

    // Add general instructions
    result.setupInstructions.push(
      'Test the verification process after setup',
      'Document the physical bridge installation',
      'Store backup verification data securely'
    );

    console.log(`Physical Verifier: Bridge created for asset ${data.tokenId} with methods: ${data.verificationMethods.join(', ')}`);

    return result;
  }

  /**
   * Verify physical asset using available methods
   */
  async verifyPhysicalAsset(
    qrCode?: string,
    nfcTagId?: string
  ): Promise<PhysicalVerificationResult> {
    console.log('Physical Verifier: Starting asset verification');

    const result: PhysicalVerificationResult = {
      verified: false,
      verificationMethod: 'none',
      securityLevel: 'low',
      confidence: 0,
      details: {},
      warnings: [],
      timestamp: Date.now()
    };

    const verificationPromises: Promise<any>[] = [];

    // Verify QR code if provided
    if (qrCode) {
      verificationPromises.push(
        this.qrBridge.verifyQRCode(qrCode).then(qrResult => ({
          type: 'qr',
          result: qrResult
        }))
      );
    }

    // Verify NFC tag if provided
    if (nfcTagId) {
      verificationPromises.push(
        this.nfcBridge.verifyNFCTag(nfcTagId).then(nfcResult => ({
          type: 'nfc',
          result: nfcResult
        }))
      );
    }

    if (verificationPromises.length === 0) {
      result.warnings.push('No verification methods provided');
      return result;
    }

    // Wait for all verifications to complete
    const verificationResults = await Promise.all(verificationPromises);

    // Process results
    let qrValid = false;
    let nfcValid = false;
    let tokenId: number | undefined;
    let contractAddress: string | undefined;
    let metadata: any;

    for (const verification of verificationResults) {
      if (verification.type === 'qr') {
        result.details.qrResult = verification.result;
        qrValid = verification.result.valid;
        if (qrValid) {
          tokenId = verification.result.tokenId;
          contractAddress = verification.result.contractAddress;
          metadata = verification.result.metadata;
        }
      } else if (verification.type === 'nfc') {
        result.details.nfcResult = verification.result;
        nfcValid = verification.result.valid;
        if (nfcValid) {
          tokenId = verification.result.tokenId;
          contractAddress = verification.result.contractAddress;
          metadata = verification.result.metadata;
        }
      }
    }

    // Determine verification status
    if (qrValid && nfcValid) {
      // Verify both methods point to the same asset
      if (result.details.qrResult?.tokenId === result.details.nfcResult?.tokenId) {
        result.verified = true;
        result.verificationMethod = 'both';
        result.securityLevel = 'high';
        result.confidence = 0.95;
      } else {
        result.verified = false;
        result.verificationMethod = 'both';
        result.warnings.push('QR and NFC verification methods point to different assets');
        result.confidence = 0.1;
      }
    } else if (qrValid || nfcValid) {
      result.verified = true;
      result.verificationMethod = qrValid ? 'qr' : 'nfc';
      result.securityLevel = nfcValid ? 'high' : 'medium';
      result.confidence = nfcValid ? 0.85 : 0.75;
    } else {
      result.verified = false;
      result.warnings.push('All verification methods failed');
      result.confidence = 0;
    }

    // Set asset information
    if (result.verified) {
      result.tokenId = tokenId;
      result.contractAddress = contractAddress;
      result.metadata = metadata;

      // Check for inspection report
      if (tokenId && this.inspectionReports.has(tokenId)) {
        const inspection = this.inspectionReports.get(tokenId)!;
        if (inspection.authenticity === 'suspicious' || inspection.authenticity === 'counterfeit') {
          result.warnings.push('Physical inspection flagged potential authenticity issues');
          result.confidence *= 0.7;
        }
        if (inspection.bridgingQuality === 'weak') {
          result.warnings.push('Physical-digital bridge quality is compromised');
          result.confidence *= 0.8;
        }
      }
    }

    // Store verification history
    this.verificationHistory.push(result);

    console.log(`Physical Verifier: Verification complete - ${result.verified ? 'VERIFIED' : 'FAILED'} (${result.verificationMethod})`);

    return result;
  }

  /**
   * Submit physical inspection report
   */
  submitInspectionReport(report: InspectionReport): void {
    // Validate report
    if (!report.inspectorId || !report.assetId) {
      throw new Error('Invalid inspection report: missing required fields');
    }

    // Generate signature (mock implementation)
    report.signature = this.generateInspectionSignature(report);

    this.inspectionReports.set(report.assetId, report);

    console.log(`Physical Verifier: Inspection report submitted for asset ${report.assetId} by inspector ${report.inspectorId}`);
  }

  /**
   * Get inspection report for an asset
   */
  getInspectionReport(assetId: number): InspectionReport | undefined {
    return this.inspectionReports.get(assetId);
  }

  /**
   * Get asset verification status
   */
  async getAssetVerificationStatus(assetId: number): Promise<{
    hasQRCode: boolean;
    hasNFCTag: boolean;
    hasInspectionReport: boolean;
    lastVerification?: PhysicalVerificationResult;
    verificationCount: number;
    securityScore: number;
  }> {
    // Check QR code
    const qrStats = this.qrBridge.getStatistics();
    const hasQRCode = qrStats.totalGenerated > 0; // Simplified check

    // Check NFC tag
    const nfcStats = this.nfcBridge.getStatistics();
    const hasNFCTag = nfcStats.totalTags > 0; // Simplified check

    // Check inspection report
    const hasInspectionReport = this.inspectionReports.has(assetId);

    // Find last verification for this asset
    const lastVerification = this.verificationHistory
      .filter(v => v.tokenId === assetId)
      .sort((a, b) => b.timestamp - a.timestamp)[0];

    // Count verifications for this asset
    const verificationCount = this.verificationHistory
      .filter(v => v.tokenId === assetId).length;

    // Calculate security score
    let securityScore = 0;
    if (hasQRCode) securityScore += 25;
    if (hasNFCTag) securityScore += 35;
    if (hasInspectionReport) securityScore += 20;
    if (lastVerification?.verified) securityScore += 20;

    return {
      hasQRCode,
      hasNFCTag,
      hasInspectionReport,
      lastVerification,
      verificationCount,
      securityScore
    };
  }

  /**
   * Generate tamper-evident verification code
   */
  generateTamperEvidenceCode(assetId: number): string {
    const timestamp = Date.now();
    const randomComponent = Math.random().toString(36).substr(2, 9);
    const code = `TE-${assetId}-${timestamp}-${randomComponent}`;
    
    // In production, this would use proper cryptographic signatures
    return btoa(code).replace(/[^a-zA-Z0-9]/g, '').substr(0, 16);
  }

  /**
   * Verify tamper-evident code
   */
  verifyTamperEvidenceCode(code: string, assetId: number): boolean {
    try {
      const decoded = atob(code + '=='); // Add padding if needed
      return decoded.includes(`TE-${assetId}-`);
    } catch {
      return false;
    }
  }

  /**
   * Get verification analytics
   */
  getVerificationAnalytics(): {
    totalVerifications: number;
    successRate: number;
    methodDistribution: Record<string, number>;
    securityLevelDistribution: Record<string, number>;
    averageConfidence: number;
  } {
    const total = this.verificationHistory.length;
    const successful = this.verificationHistory.filter(v => v.verified).length;
    
    const methodDist: Record<string, number> = {};
    const securityDist: Record<string, number> = {};
    let totalConfidence = 0;

    this.verificationHistory.forEach(v => {
      methodDist[v.verificationMethod] = (methodDist[v.verificationMethod] || 0) + 1;
      securityDist[v.securityLevel] = (securityDist[v.securityLevel] || 0) + 1;
      totalConfidence += v.confidence;
    });

    return {
      totalVerifications: total,
      successRate: total > 0 ? successful / total : 0,
      methodDistribution: methodDist,
      securityLevelDistribution: securityDist,
      averageConfidence: total > 0 ? totalConfidence / total : 0
    };
  }

  /**
   * Clear verification history (for maintenance)
   */
  clearVerificationHistory(): void {
    this.verificationHistory = [];
    console.log('Physical Verifier: Verification history cleared');
  }

  /**
   * Export verification data
   */
  exportVerificationData(): {
    qrCodes: any[];
    nfcTags: any[];
    inspectionReports: InspectionReport[];
    verificationHistory: PhysicalVerificationResult[];
  } {
    return {
      qrCodes: this.qrBridge.exportQRData(),
      nfcTags: this.nfcBridge.exportTagData(),
      inspectionReports: Array.from(this.inspectionReports.values()),
      verificationHistory: [...this.verificationHistory]
    };
  }

  /**
   * Generate inspection signature (mock implementation)
   */
  private generateInspectionSignature(report: InspectionReport): string {
    const data = `${report.inspectorId}-${report.assetId}-${report.timestamp}-${report.authenticity}`;
    return btoa(data).replace(/[^a-zA-Z0-9]/g, '').substr(0, 24);
  }

  /**
   * Get bridges for direct access
   */
  getBridges() {
    return {
      qr: this.qrBridge,
      nfc: this.nfcBridge
    };
  }
}
