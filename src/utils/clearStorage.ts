// Utility to clear localStorage for testing different accounts
export const clearAccountData = (address: string) => {
  const keysToRemove = [
    `sales.history.${address}`,
    `ownership.history.${address}`,
    `pending.listings.${address}`,
    `user.listings.${address}`,
  ];
  
  keysToRemove.forEach(key => {
    localStorage.removeItem(key);
  });
  
  console.log(`Cleared data for account: ${address}`);
};

export const clearAllData = () => {
  const keysToRemove: string[] = [];
  
  for (let i = 0; i < localStorage.length; i++) {
    const key = localStorage.key(i);
    if (key && (
      key.startsWith('sales.history.') ||
      key.startsWith('ownership.history.') ||
      key.startsWith('pending.listings.') ||
      key.startsWith('user.listings.') ||
      key === 'approved.listings'
    )) {
      keysToRemove.push(key);
    }
  }
  
  keysToRemove.forEach(key => {
    localStorage.removeItem(key);
  });
  
  console.log('Cleared all marketplace data');
};

// Add to window for easy access in browser console
if (typeof window !== 'undefined') {
  (window as any).clearAccountData = clearAccountData;
  (window as any).clearAllData = clearAllData;
}
