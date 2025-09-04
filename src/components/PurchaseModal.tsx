import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { 
  CreditCard, 
  Wallet, 
  ShieldCheck, 
  Zap, 
  CheckCircle, 
  Clock, 
  TrendingUp,
  Star,
  Lock,
  ArrowRight,
  Sparkles
} from "lucide-react";

interface PurchaseModalProps {
  isOpen: boolean;
  onClose: () => void;
  product: {
    name: string;
    price: string;
    image: string;
  };
}

const PurchaseModal = ({ isOpen, onClose, product }: PurchaseModalProps) => {
  const [paymentMethod, setPaymentMethod] = useState<'crypto' | 'card'>('crypto');
  const [isProcessing, setIsProcessing] = useState(false);

  const handlePurchase = async () => {
    setIsProcessing(true);
    // Simulate processing
    setTimeout(() => {
      setIsProcessing(false);
      onClose();
    }, 2000);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="glass-panel border-border/50 max-w-4xl p-0 overflow-hidden">
        <div className="relative">
          {/* Header with gradient background */}
          <div className="bg-gradient-to-r from-primary/20 via-primary/10 to-transparent p-6 border-b border-border/50">
            <DialogHeader>
              <DialogTitle className="text-3xl gradient-text flex items-center gap-3">
                <Sparkles className="w-8 h-8 text-primary" />
                Complete Your Purchase
              </DialogTitle>
              <p className="text-muted-foreground mt-2">Secure blockchain transaction with instant verification</p>
            </DialogHeader>
          </div>

          <div className="grid lg:grid-cols-2 gap-0">
            {/* Left Side - Product Details */}
            <div className="p-6 bg-gradient-to-br from-card/50 to-transparent">
              <Card className="glass-card p-6 border-primary/30 bg-gradient-to-br from-primary/5 to-transparent">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-12 h-12 bg-gradient-primary rounded-xl flex items-center justify-center">
                    <Star className="w-6 h-6 text-primary-foreground" />
                  </div>
                  <div>
                    <Badge className="bg-success/20 text-success border-success/30">
                      <ShieldCheck className="w-3 h-3 mr-1" />
                      Verified
                    </Badge>
                  </div>
                </div>
                
                <h3 className="font-bold text-xl mb-3 gradient-text">{product.name}</h3>
                
                <div className="space-y-3 mb-6">
                  <div className="flex items-center justify-between p-3 bg-card/30 rounded-lg">
                    <span className="text-sm text-muted-foreground">Item Price</span>
                    <span className="text-xl font-bold gradient-text">{product.price}</span>
                  </div>
                  <div className="flex items-center justify-between p-3 bg-card/30 rounded-lg">
                    <span className="text-sm text-muted-foreground">Network Fee</span>
                    <span className="text-lg font-semibold">0.003 ETH</span>
                  </div>
                  <Separator className="my-2" />
                  <div className="flex items-center justify-between p-3 bg-gradient-primary/10 rounded-lg border border-primary/20">
                    <span className="text-lg font-semibold">Total Amount</span>
                    <span className="text-2xl font-bold gradient-text">3.503 ETH</span>
                  </div>
                </div>

                <div className="space-y-2">
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <CheckCircle className="w-4 h-4 text-success" />
                    <span>Authentic & Verified</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Lock className="w-4 h-4 text-primary" />
                    <span>Secure Transaction</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <TrendingUp className="w-4 h-4 text-success" />
                    <span>25% increase in last 7 days</span>
                  </div>
                </div>
              </Card>
            </div>

            {/* Right Side - Payment Form */}
            <div className="p-6">
              <div className="space-y-6">
                {/* Payment Method Selection */}
                <div>
                  <Label className="text-lg font-semibold mb-3 block">Choose Payment Method</Label>
                  <div className="grid grid-cols-2 gap-3">
                    <Button 
                      className={`h-16 transition-all duration-300 ${
                        paymentMethod === 'crypto' 
                          ? 'bg-gradient-primary text-primary-foreground shadow-lg shadow-primary/25' 
                          : 'bg-card/50 border-border/50 hover:bg-card/70'
                      }`}
                      onClick={() => setPaymentMethod('crypto')}
                    >
                      <Wallet className="w-5 h-5 mr-2" />
                      <div className="text-left">
                        <div className="font-semibold">Crypto Wallet</div>
                        <div className="text-xs opacity-80">Connect & Pay</div>
                      </div>
                    </Button>
                    <Button 
                      className={`h-16 transition-all duration-300 ${
                        paymentMethod === 'card' 
                          ? 'bg-gradient-primary text-primary-foreground shadow-lg shadow-primary/25' 
                          : 'bg-card/50 border-border/50 hover:bg-card/70'
                      }`}
                      onClick={() => setPaymentMethod('card')}
                    >
                      <CreditCard className="w-5 h-5 mr-2" />
                      <div className="text-left">
                        <div className="font-semibold">Card Payment</div>
                        <div className="text-xs opacity-80">Instant Buy</div>
                      </div>
                    </Button>
                  </div>
                </div>

                {/* Payment Form */}
                {paymentMethod === 'crypto' ? (
                  <div className="space-y-4">
                    <div>
                      <Label htmlFor="wallet" className="text-sm font-medium">Wallet Address</Label>
                      <Input 
                        id="wallet" 
                        placeholder="0x742d...2b3c" 
                        className="glass-card bg-card/30 border-border/50 h-12 text-lg"
                      />
                    </div>
                    
                    <div className="p-4 bg-warning/10 rounded-xl border border-warning/20">
                      <div className="flex items-center gap-2 text-warning">
                        <Clock className="w-4 h-4" />
                        <span className="text-sm font-medium">Transaction Time: ~2 minutes</span>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="space-y-4">
                    <div>
                      <Label htmlFor="card" className="text-sm font-medium">Card Number</Label>
                      <Input 
                        id="card" 
                        placeholder="1234 5678 9012 3456" 
                        className="glass-card bg-card/30 border-border/50 h-12 text-lg"
                      />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="expiry" className="text-sm font-medium">Expiry</Label>
                        <Input 
                          id="expiry" 
                          placeholder="MM/YY" 
                          className="glass-card bg-card/30 border-border/50 h-12"
                        />
                      </div>
                      <div>
                        <Label htmlFor="cvv" className="text-sm font-medium">CVV</Label>
                        <Input 
                          id="cvv" 
                          placeholder="123" 
                          className="glass-card bg-card/30 border-border/50 h-12"
                        />
                      </div>
                    </div>
                  </div>
                )}

                {/* Security Notice */}
                <div className="flex items-start gap-3 p-4 bg-success/10 rounded-xl border border-success/20">
                  <ShieldCheck className="w-5 h-5 text-success mt-0.5" />
                  <div className="text-sm">
                    <p className="font-medium text-success">Protected by Blockchain</p>
                    <p className="text-muted-foreground">Your transaction is secured with cryptographic verification and smart contract execution.</p>
                  </div>
                </div>

                {/* Purchase Button */}
                <Button 
                  className="w-full bg-gradient-primary hover:opacity-90 text-primary-foreground py-6 text-lg font-semibold transition-all duration-300 hover:scale-[1.02] shadow-lg shadow-primary/25"
                  onClick={handlePurchase}
                  disabled={isProcessing}
                >
                  {isProcessing ? (
                    <>
                      <div className="w-5 h-5 mr-2 border-2 border-primary-foreground/30 border-t-primary-foreground rounded-full animate-spin" />
                      Processing Transaction...
                    </>
                  ) : (
                    <>
                      <Zap className="w-5 h-5 mr-2" />
                      Complete Purchase
                      <ArrowRight className="w-5 h-5 ml-2" />
                    </>
                  )}
                </Button>

                <p className="text-xs text-muted-foreground text-center">
                  By completing this purchase, you agree to our Terms of Service and Privacy Policy
                </p>
              </div>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default PurchaseModal;