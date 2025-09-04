import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { CreditCard, Wallet, ShieldCheck, Zap } from "lucide-react";

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
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="glass-panel border-border/50 max-w-2xl">
        <DialogHeader>
          <DialogTitle className="text-2xl gradient-text">Complete Purchase</DialogTitle>
        </DialogHeader>
        
        <div className="grid md:grid-cols-2 gap-6">
          {/* Product Summary */}
          <Card className="glass-card p-6">
            <div className="aspect-square bg-gradient-primary/20 rounded-xl mb-4 flex items-center justify-center">
              <div className="w-16 h-16 bg-gradient-primary rounded-xl opacity-80" />
            </div>
            <h3 className="font-semibold text-lg mb-2">{product.name}</h3>
            <div className="flex items-center justify-between">
              <span className="text-2xl font-bold gradient-text">{product.price}</span>
              <div className="flex items-center gap-1 text-success">
                <ShieldCheck className="w-4 h-4" />
                <span className="text-sm">Verified</span>
              </div>
            </div>
          </Card>

          {/* Payment Form */}
          <div className="space-y-6">
            <div className="flex gap-3">
              <Button className="flex-1 bg-gradient-primary hover:opacity-90 text-primary-foreground">
                <Wallet className="w-4 h-4 mr-2" />
                Crypto Wallet
              </Button>
              <Button variant="outline" className="flex-1 border-border/50">
                <CreditCard className="w-4 h-4 mr-2" />
                Card Payment
              </Button>
            </div>

            <div className="space-y-4">
              <div>
                <Label htmlFor="wallet">Wallet Address</Label>
                <Input 
                  id="wallet" 
                  placeholder="0x..." 
                  className="glass-card bg-card/50 border-border/50"
                />
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="amount">Amount</Label>
                  <Input 
                    id="amount" 
                    value={product.price} 
                    readOnly
                    className="glass-card bg-card/50 border-border/50"
                  />
                </div>
                <div>
                  <Label htmlFor="gas">Gas Fee</Label>
                  <Input 
                    id="gas" 
                    value="0.003 ETH" 
                    readOnly
                    className="glass-card bg-card/50 border-border/50"
                  />
                </div>
              </div>
            </div>

            <div className="flex items-center gap-2 p-4 bg-success/10 rounded-xl border border-success/20">
              <ShieldCheck className="w-5 h-5 text-success" />
              <div className="text-sm">
                <p className="font-medium text-success">Secure Transaction</p>
                <p className="text-muted-foreground">Protected by blockchain verification</p>
              </div>
            </div>

            <Button 
              className="w-full bg-gradient-primary hover:opacity-90 text-primary-foreground py-6 text-lg"
              onClick={onClose}
            >
              <Zap className="w-5 h-5 mr-2" />
              Complete Purchase
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default PurchaseModal;