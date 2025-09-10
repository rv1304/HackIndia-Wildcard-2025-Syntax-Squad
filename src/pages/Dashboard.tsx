import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import StatCard from "@/components/StatCard";
import TrustScoreCard from "@/components/TrustScoreCard";
import ActivityFeed from "@/components/ActivityFeed";
import { Wallet, Shield, TrendingUp, Activity, BarChart3, PieChart, Package, ShoppingCart, CheckCircle, DollarSign, Users, Eye, Gem } from "lucide-react";
import { ResponsiveContainer, AreaChart, Area, CartesianGrid, XAxis, YAxis, Tooltip } from 'recharts';
import { useAccount, useBalance } from "wagmi";
import { useEffect, useMemo, useState } from "react";
import { publicClient } from "../lib/wagmi";
import { CONTRACTS } from "../config/contracts";
import { AuthXMarketplaceAbi, AuthXNFTAbi } from "../abi";
import { useAuth } from "../context/AuthContext";

interface OwnershipHistory {
  tokenId: number;
  from: string;
  to: string;
  timestamp: number;
  price?: number;
  transactionHash?: string;
}

export default function Dashboard() {
  const { address, isConnected } = useAccount();
  const { data: balance } = useBalance({ address, chainId: 31337, query: { enabled: !!address } });
  const { user } = useAuth();

  const [owned, setOwned] = useState<number[]>([]);
  const [totalSalesEth, setTotalSalesEth] = useState<number>(0);
  const [ownershipHistory, setOwnershipHistory] = useState<OwnershipHistory[]>([]);
  const [pendingListings, setPendingListings] = useState<any[]>([]);
  const [approvedListings, setApprovedListings] = useState<any[]>([]);

  useEffect(() => {
    const loadOwned = async () => {
      if (!address) return;
      const list: number[] = [];
      for (let i = 0n; i < 200n; i++) {
        try {
          const owner = await publicClient.readContract({
            abi: AuthXNFTAbi,
            address: CONTRACTS.AuthXNFT,
            functionName: 'ownerOf',
            args: [i],
          });
          if ((owner as string).toLowerCase() === address.toLowerCase()) list.push(Number(i));
        } catch {}
      }
      setOwned(list);
    };
    loadOwned();
  }, [address]);

  useEffect(() => {
    if (!address) return;
    
    // Load sales history and ownership history (account-specific)
    const salesKey = `sales.history.${address}`;
    const ownershipKey = `ownership.history.${address}`;
    const sales = JSON.parse(localStorage.getItem(salesKey) || '[]');
    const history = JSON.parse(localStorage.getItem(ownershipKey) || '[]');
    
    const startOfMonth = new Date();
    startOfMonth.setDate(1); startOfMonth.setHours(0,0,0,0);
    const monthSales = sales.filter((s: any) => s.timestamp >= startOfMonth.getTime());
    const total = monthSales.reduce((acc: number, s: any) => acc + Number(s.priceEth || 0), 0);
    setTotalSalesEth(total);
    
    setOwnershipHistory(history);
  }, [address]);

  useEffect(() => {
    if (!address) return;
    
    // Load role-specific data (account-specific for sellers)
    if (user?.role === 'seller') {
      const pendingKey = `pending.listings.${address}`;
      const pending = JSON.parse(localStorage.getItem(pendingKey) || '[]');
      setPendingListings(pending);
    }
    
    if (user?.role === 'admin') {
      // Admin sees all approved listings (global)
      const approved = JSON.parse(localStorage.getItem('approved.listings') || '[]');
      setApprovedListings(approved);
    }
  }, [user?.role, address]);

  const chartData = useMemo(() => {
    const days = Array.from({ length: 6 }).map((_, idx) => ({ month: `W${idx+1}`, value: totalSalesEth / 6 }));
    return days;
  }, [totalSalesEth]);

  const getRoleSpecificContent = () => {
    switch (user?.role) {
      case 'admin':
        return (
          <div className="grid lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 space-y-6">
              <Card className="glass-panel p-6">
                <h2 className="text-xl font-semibold mb-4">Admin Analytics</h2>
                <div className="grid grid-cols-2 gap-4">
                  <div className="text-center p-4 bg-blue-500/10 rounded-lg">
                    <div className="text-2xl font-bold text-blue-500">{pendingListings.length}</div>
                    <div className="text-sm text-muted-foreground">Pending Approvals</div>
                  </div>
                  <div className="text-center p-4 bg-green-500/10 rounded-lg">
                    <div className="text-2xl font-bold text-green-500">{approvedListings.length}</div>
                    <div className="text-sm text-muted-foreground">Approved Listings</div>
                  </div>
                </div>
              </Card>

              <Card className="glass-panel p-6">
                <h2 className="text-xl font-semibold mb-4">Recent Activity</h2>
                <div className="space-y-2">
                  {ownershipHistory.slice(0, 5).map((item, idx) => (
                    <div key={idx} className="flex items-center justify-between p-3 rounded-lg border border-border/50">
                      <div>
                        <div className="font-medium">Token #{item.tokenId}</div>
                        <div className="text-sm text-muted-foreground">
                          {new Date(item.timestamp).toLocaleDateString()}
                        </div>
                      </div>
                      <div className="text-sm text-muted-foreground">
                        {item.price ? `${item.price} ETH` : 'Transfer'}
                      </div>
                    </div>
                  ))}
                </div>
              </Card>
            </div>

            <div className="space-y-6">
              <Card className="glass-panel p-6">
                <h3 className="font-semibold mb-4">Quick Actions</h3>
                <div className="space-y-2">
                  <Button className="w-full justify-start" variant="outline">
                    <CheckCircle className="w-4 h-4 mr-2" />
                    Review Approvals
                  </Button>
                  <Button className="w-full justify-start" variant="outline">
                    <BarChart3 className="w-4 h-4 mr-2" />
                    View Analytics
                  </Button>
                </div>
              </Card>
            </div>
          </div>
        );

      case 'seller':
        return (
          <div className="grid lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 space-y-6">
              <Card className="glass-panel p-6">
                <h2 className="text-xl font-semibold mb-4">Sales Performance</h2>
                <div className="h-64">
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={chartData}>
                      <defs>
                        <linearGradient id="colorValue" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="#8b5cf6" stopOpacity={0.3}/>
                          <stop offset="95%" stopColor="#8b5cf6" stopOpacity={0}/>
                        </linearGradient>
                      </defs>
                      <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                      <XAxis dataKey="month" stroke="#9ca3af" />
                      <YAxis stroke="#9ca3af" />
                      <Tooltip 
                        contentStyle={{ backgroundColor: '#1f2937', border: '1px solid #374151', borderRadius: '8px' }} 
                      />
                      <Area type="monotone" dataKey="value" stroke="#8b5cf6" strokeWidth={3} fillOpacity={1} fill="url(#colorValue)" />
                    </AreaChart>
                  </ResponsiveContainer>
                </div>
              </Card>

              <Card className="glass-panel p-6">
                <h2 className="text-xl font-semibold mb-4">My Minted NFTs</h2>
                <div className="space-y-2">
                  {owned.length === 0 && <div className="text-sm text-muted-foreground">No NFTs minted/owned.</div>}
                  {owned.map((id) => (
                    <div key={id} className="flex items-center justify-between p-3 rounded-lg border border-border/50">
                      <div className="flex items-center space-x-3">
                        <div className="w-10 h-10 bg-gradient-primary rounded-lg flex items-center justify-center">
                          <span className="text-sm font-bold text-white">#{id}</span>
                        </div>
                        <div>
                          <div className="font-medium">Token #{id}</div>
                          <div className="text-sm text-muted-foreground">Minted / Owned</div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </Card>

              <Card className="glass-panel p-6">
                <h2 className="text-xl font-semibold mb-4">My Products</h2>
                <div className="space-y-2">
                  {pendingListings.length === 0 && <div className="text-sm text-muted-foreground">No pending listings.</div>}
                  {pendingListings.map((listing, idx) => (
                    <div key={idx} className="flex items-center justify-between p-3 rounded-lg border border-border/50">
                      <div>
                        <div className="font-medium">{listing.name}</div>
                        <div className="text-sm text-muted-foreground">Pending Approval</div>
                      </div>
                      <div className="text-sm text-yellow-500">Waiting</div>
                    </div>
                  ))}
                </div>
              </Card>
            </div>

            <div className="space-y-6">
              <TrustScoreCard 
                score={75} 
                trend="up"
                description="Your assets maintain high authenticity standards"
              />
              <Card className="glass-panel p-6">
                <h3 className="font-semibold mb-4">Quick Actions</h3>
                <div className="space-y-2">
                  <Button className="w-full justify-start" variant="outline">
                    <Package className="w-4 h-4 mr-2" />
                    List New Product
                  </Button>
                  <Button className="w-full justify-start" variant="outline">
                    <Shield className="w-4 h-4 mr-2" />
                    Verification Status
                  </Button>
                </div>
              </Card>
            </div>
          </div>
        );

      case 'buyer':
      default:
        return (
          <div className="grid lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 space-y-6">
              <Card className="glass-panel p-6">
                <h2 className="text-xl font-semibold mb-4">Portfolio Performance</h2>
                <div className="h-64">
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={chartData}>
                      <defs>
                        <linearGradient id="colorValue" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="#8b5cf6" stopOpacity={0.3}/>
                          <stop offset="95%" stopColor="#8b5cf6" stopOpacity={0}/>
                        </linearGradient>
                      </defs>
                      <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                      <XAxis dataKey="month" stroke="#9ca3af" />
                      <YAxis stroke="#9ca3af" />
                      <Tooltip 
                        contentStyle={{ backgroundColor: '#1f2937', border: '1px solid #374151', borderRadius: '8px' }} 
                      />
                      <Area type="monotone" dataKey="value" stroke="#8b5cf6" strokeWidth={3} fillOpacity={1} fill="url(#colorValue)" />
                    </AreaChart>
                  </ResponsiveContainer>
                </div>
              </Card>

              <Card className="glass-panel p-6">
                <h2 className="text-xl font-semibold mb-4">My NFTs</h2>
                <div className="space-y-2">
                  {owned.length === 0 && <div className="text-sm text-muted-foreground">No NFTs owned.</div>}
                  {owned.map((id) => (
                    <div key={id} className="flex items-center justify-between p-3 rounded-lg border border-border/50">
                      <div className="flex items-center space-x-3">
                        <div className="w-10 h-10 bg-gradient-primary rounded-lg flex items-center justify-center">
                          <span className="text-sm font-bold text-white">#{id}</span>
                        </div>
                        <div>
                          <div className="font-medium">Token #{id}</div>
                          <div className="text-sm text-muted-foreground">Owned</div>
                        </div>
                      </div>
                      <Button size="sm" variant="outline">
                        Sell
                      </Button>
                    </div>
                  ))}
                </div>
              </Card>
            </div>

            <div className="space-y-6">
              <Card className="glass-panel p-6">
                <h3 className="font-semibold mb-4">Quick Actions</h3>
                <div className="space-y-2">
                  <Button className="w-full justify-start" variant="outline">
                    <ShoppingCart className="w-4 h-4 mr-2" />
                    Browse Marketplace
                  </Button>
                  <Button className="w-full justify-start" variant="outline">
                    <Gem className="w-4 h-4 mr-2" />
                    Sell My NFTs
                  </Button>
                </div>
              </Card>
              <ActivityFeed />
            </div>
          </div>
        );
    }
  };

  return (
    <div className="min-h-screen bg-gradient-dark py-8 px-6">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">
            {user?.role === 'admin' ? 'Admin Dashboard' : 
             user?.role === 'seller' ? 'Seller Dashboard' : 
             'Buyer Dashboard'}
          </h1>
          <p className="text-muted-foreground">
            {user?.role === 'admin' ? 'Manage marketplace operations and approvals' :
             user?.role === 'seller' ? 'Manage your products and track sales' :
             'Manage and track your digital assets'}
          </p>
        </div>

        <Card className="glass-panel p-4 mb-4">
          <div className="flex items-center justify-between text-sm">
            <div>
              <div className="text-muted-foreground">Connected</div>
              <div className="font-mono break-all">{isConnected ? address : 'Not connected'}</div>
            </div>
            <div className="text-right">
              <div className="text-muted-foreground">Balance</div>
              <div className="font-semibold">{balance ? `${balance.formatted} ${balance.symbol}` : '—'}</div>
            </div>
          </div>
        </Card>

        <Card className="glass-panel p-8 mb-8">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground mb-2">
                {user?.role === 'admin' ? 'Total Approvals (this month)' :
                 user?.role === 'seller' ? 'Total Sales (this month)' :
                 'Total Spent (this month)'}
              </p>
              <div className="text-4xl font-bold gradient-text">{totalSalesEth.toFixed(4)} ETH</div>
            </div>
            <Button className="bg-gradient-primary hover:opacity-90 text-primary-foreground border-0">
              {user?.role === 'admin' ? 'View Analytics' :
               user?.role === 'seller' ? 'Manage Products' :
               'Manage Funds'}
            </Button>
          </div>
        </Card>

        {getRoleSpecificContent()}
      </div>
    </div>
  );
}