import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import StatCard from "@/components/StatCard";
import TrustScoreCard from "@/components/TrustScoreCard";
import ActivityFeed from "@/components/ActivityFeed";
import { Wallet, Shield, TrendingUp, Activity, BarChart3, PieChart } from "lucide-react";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, AreaChart, Area, PieChart as RechartsPieChart, Cell, Pie } from 'recharts';

const Dashboard = () => {
  const holdings = [
    { id: 1, name: "MetaCube #142", value: "3.5 ETH", change: "+12%" },
    { id: 2, name: "Crystal Shard", value: "1.8 ETH", change: "+5%" },
    { id: 3, name: "Neon Genesis", value: "2.1 ETH", change: "-3%" },
    { id: 4, name: "Void Walker", value: "5.2 ETH", change: "+18%" }
  ];

  const chartData = [
    { month: 'Jan', value: 8.2 },
    { month: 'Feb', value: 9.1 },
    { month: 'Mar', value: 10.5 },
    { month: 'Apr', value: 11.8 },
    { month: 'May', value: 12.1 },
    { month: 'Jun', value: 12.34 }
  ];

  const portfolioData = [
    { name: 'Digital Art', value: 45, color: '#8b5cf6' },
    { name: 'Collectibles', value: 30, color: '#06b6d4' },
    { name: 'Physical Assets', value: 25, color: '#ec4899' }
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
          {/* Portfolio Performance Chart */}
          <div className="lg:col-span-2 space-y-6">
            <Card className="glass-panel p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-semibold">Portfolio Performance</h2>
                <div className="flex items-center gap-2">
                  <BarChart3 className="w-5 h-5 text-primary" />
                  <span className="text-sm text-muted-foreground">Last 6 months</span>
                </div>
              </div>
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
                      contentStyle={{ 
                        backgroundColor: '#1f2937', 
                        border: '1px solid #374151',
                        borderRadius: '8px'
                      }} 
                    />
                    <Area 
                      type="monotone" 
                      dataKey="value" 
                      stroke="#8b5cf6" 
                      strokeWidth={3}
                      fillOpacity={1} 
                      fill="url(#colorValue)" 
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </Card>

            <div className="grid md:grid-cols-2 gap-6">
              {/* Holdings List */}
              <Card className="glass-panel p-6">
                <h2 className="text-xl font-semibold mb-4">Active Holdings</h2>
                <div className="space-y-3">
                  {holdings.map((holding) => (
                    <Card key={holding.id} className="glass-card p-4 hover:scale-[1.02] hover:shadow-glow-accent transition-all duration-300">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-4">
                          <div className="w-12 h-12 bg-gradient-primary rounded-xl animate-pulse" />
                          <div>
                            <h3 className="font-semibold text-foreground">{holding.name}</h3>
                            <p className="text-sm text-muted-foreground">Current Value</p>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="font-semibold text-foreground">{holding.value}</p>
                          <p className={`text-sm transition-colors ${holding.change.startsWith('+') ? 'text-success' : 'text-destructive'}`}>
                            {holding.change}
                          </p>
                        </div>
                      </div>
                    </Card>
                  ))}
                </div>
              </Card>

              {/* Portfolio Distribution */}
              <Card className="glass-panel p-6">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-xl font-semibold">Portfolio Distribution</h2>
                  <PieChart className="w-5 h-5 text-primary" />
                </div>
                <div className="h-48">
                  <ResponsiveContainer width="100%" height="100%">
                    <RechartsPieChart>
                      <Pie
                        data={portfolioData}
                        cx="50%"
                        cy="50%"
                        innerRadius={40}
                        outerRadius={80}
                        paddingAngle={5}
                        dataKey="value"
                      >
                        {portfolioData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </Pie>
                      <Tooltip 
                        contentStyle={{ 
                          backgroundColor: '#1f2937', 
                          border: '1px solid #374151',
                          borderRadius: '8px'
                        }} 
                      />
                    </RechartsPieChart>
                  </ResponsiveContainer>
                </div>
                <div className="space-y-2 mt-4">
                  {portfolioData.map((item) => (
                    <div key={item.name} className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <div className="w-3 h-3 rounded-full" style={{ backgroundColor: item.color }} />
                        <span className="text-sm text-muted-foreground">{item.name}</span>
                      </div>
                      <span className="text-sm font-medium">{item.value}%</span>
                    </div>
                  ))}
                </div>
              </Card>
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            <TrustScoreCard 
              score={75} 
              trend="up"
              description="Your assets maintain high authenticity standards"
            />
            <ActivityFeed />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;