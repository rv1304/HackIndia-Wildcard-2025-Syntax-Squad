import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import StatCard from "@/components/StatCard";
import TrustScoreCard from "@/components/TrustScoreCard";
import ActivityFeed from "@/components/ActivityFeed";
import { Wallet, Shield, TrendingUp, Activity } from "lucide-react";

const Dashboard = () => {
  const holdings = [
    { id: 1, name: "MetaCube #142", value: "3.5 ETH", change: "+12%" },
    { id: 2, name: "Crystal Shard", value: "1.8 ETH", change: "+5%" },
    { id: 3, name: "Neon Genesis", value: "2.1 ETH", change: "-3%" },
    { id: 4, name: "Void Walker", value: "5.2 ETH", change: "+18%" }
  ];

  return (
    <div className="min-h-screen bg-gradient-dark py-8 px-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">Your Holdings</h1>
          <p className="text-muted-foreground">Manage and track your digital assets</p>
        </div>

        {/* Balance Overview */}
        <Card className="glass-panel p-8 mb-8">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground mb-2">Total Balance</p>
              <div className="text-4xl font-bold gradient-text">12.34 ETH</div>
              <p className="text-sm text-success mt-2">+5.2% this week</p>
            </div>
            <Button className="bg-gradient-primary hover:opacity-90 text-primary-foreground border-0">
              Manage Funds
            </Button>
          </div>
        </Card>

        {/* Stats Grid */}
        <div className="grid md:grid-cols-4 gap-6 mb-8">
          <StatCard
            icon={Wallet}
            label="Wallet Balance"
            value="12.34 ETH"
            gradient="bg-gradient-primary"
          />
          <StatCard
            icon={Shield}
            label="Verified Assets"
            value="24"
            gradient="bg-gradient-accent"
          />
          <StatCard
            icon={TrendingUp}
            label="Portfolio Growth"
            value="+18.5%"
            gradient="bg-gradient-to-br from-success to-green-600"
          />
          <StatCard
            icon={Activity}
            label="Recent Trades"
            value="142"
            gradient="bg-gradient-to-br from-warning to-orange-600"
          />
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Holdings List */}
          <div className="lg:col-span-2 space-y-6">
            <Card className="glass-panel p-6">
              <h2 className="text-xl font-semibold mb-4">Active Holdings</h2>
              <div className="space-y-3">
                {holdings.map((holding) => (
                  <Card key={holding.id} className="glass-card p-4 hover:scale-[1.02] transition-all">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-4">
                        <div className="w-12 h-12 bg-gradient-primary rounded-xl" />
                        <div>
                          <h3 className="font-semibold text-foreground">{holding.name}</h3>
                          <p className="text-sm text-muted-foreground">Current Value</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="font-semibold text-foreground">{holding.value}</p>
                        <p className={`text-sm ${holding.change.startsWith('+') ? 'text-success' : 'text-destructive'}`}>
                          {holding.change}
                        </p>
                      </div>
                    </div>
                  </Card>
                ))}
              </div>
            </Card>

            {/* Trust Score */}
            <TrustScoreCard 
              score={75} 
              trend="up"
              description="Your assets maintain high authenticity standards"
            />
          </div>

          {/* Activity Feed */}
          <div>
            <ActivityFeed />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;