import { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useAccount } from 'wagmi';
import { clearAccountData, clearAllData } from '../utils/clearStorage';

export default function DebugPanel() {
  const { address } = useAccount();
  const [isOpen, setIsOpen] = useState(false);

  if (process.env.NODE_ENV !== 'development') return null;

  return (
    <div className="fixed bottom-4 right-4 z-50">
      {!isOpen ? (
        <Button
          onClick={() => setIsOpen(true)}
          variant="outline"
          size="sm"
          className="bg-red-500 text-white hover:bg-red-600"
        >
          Debug
        </Button>
      ) : (
        <Card className="p-4 w-64 bg-black/90 text-white">
          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <h3 className="font-bold">Debug Panel</h3>
              <Button
                onClick={() => setIsOpen(false)}
                variant="ghost"
                size="sm"
                className="text-white hover:bg-white/20"
              >
                ×
              </Button>
            </div>
            
            <div className="text-xs text-gray-300">
              Account: {address ? `${address.slice(0, 6)}...${address.slice(-4)}` : 'Not connected'}
            </div>
            
            <div className="space-y-1">
              <Button
                onClick={() => {
                  if (address) {
                    clearAccountData(address);
                    alert('Cleared data for current account');
                  }
                }}
                variant="outline"
                size="sm"
                className="w-full text-xs"
                disabled={!address}
              >
                Clear Account Data
              </Button>
              
              <Button
                onClick={() => {
                  clearAllData();
                  alert('Cleared all marketplace data');
                }}
                variant="outline"
                size="sm"
                className="w-full text-xs"
              >
                Clear All Data
              </Button>
              
              <Button
                onClick={() => {
                  console.log('LocalStorage contents:');
                  for (let i = 0; i < localStorage.length; i++) {
                    const key = localStorage.key(i);
                    if (key && (
                      key.startsWith('sales.history.') ||
                      key.startsWith('ownership.history.') ||
                      key.startsWith('pending.listings.') ||
                      key.startsWith('user.listings.') ||
                      key === 'approved.listings'
                    )) {
                      console.log(key, JSON.parse(localStorage.getItem(key) || '[]'));
                    }
                  }
                }}
                variant="outline"
                size="sm"
                className="w-full text-xs"
              >
                Log Storage
              </Button>
            </div>
          </div>
        </Card>
      )}
    </div>
  );
}

