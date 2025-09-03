import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search, Filter, TrendingUp, Clock } from "lucide-react";
import CollectionCard from "@/components/CollectionCard";

const Collections = () => {
  const trendingCollections = [
    { title: "Cosmic Warriors", gradient: "bg-gradient-to-br from-purple-500 to-pink-500", floor: "2.4 ETH", volume: "342 ETH" },
    { title: "Digital Artifacts", gradient: "bg-gradient-to-br from-blue-500 to-cyan-500", floor: "1.8 ETH", volume: "256 ETH" },
    { title: "Meta Realms", gradient: "bg-gradient-to-br from-green-500 to-emerald-500", floor: "3.2 ETH", volume: "189 ETH" },
    { title: "Neon Dreams", gradient: "bg-gradient-to-br from-orange-500 to-red-500", floor: "0.9 ETH", volume: "412 ETH" },
    { title: "Void Walkers", gradient: "bg-gradient-to-br from-indigo-500 to-purple-500", floor: "1.5 ETH", volume: "298 ETH" },
    { title: "Crystal Shards", gradient: "bg-gradient-to-br from-pink-500 to-rose-500", floor: "2.1 ETH", volume: "167 ETH" }
  ];

  return (
    <div className="min-h-screen bg-gradient-dark py-8 px-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">Explore Collections</h1>
          <p className="text-muted-foreground">Discover verified digital assets and collections</p>
        </div>

        {/* Search and Filters */}
        <Card className="glass-panel p-6 mb-8">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-muted-foreground" />
              <Input 
                placeholder="Search collections..." 
                className="pl-10 bg-input/50 border-border/50 focus:border-primary"
              />
            </div>
            <Button variant="outline" className="border-border/50 hover:bg-card/50">
              <Filter className="w-4 h-4 mr-2" />
              Filters
            </Button>
            <Button variant="outline" className="border-border/50 hover:bg-card/50">
              <TrendingUp className="w-4 h-4 mr-2" />
              Trending
            </Button>
            <Button variant="outline" className="border-border/50 hover:bg-card/50">
              <Clock className="w-4 h-4 mr-2" />
              Recent
            </Button>
          </div>
        </Card>

        {/* Collection Stats */}
        <div className="grid md:grid-cols-4 gap-6 mb-8">
          <Card className="glass-card p-6">
            <p className="text-sm text-muted-foreground mb-2">Total Collections</p>
            <p className="text-2xl font-bold gradient-text">1,234</p>
            <p className="text-xs text-success mt-1">+12% this month</p>
          </Card>
          <Card className="glass-card p-6">
            <p className="text-sm text-muted-foreground mb-2">Total Volume</p>
            <p className="text-2xl font-bold gradient-text">5,678 ETH</p>
            <p className="text-xs text-success mt-1">+24% this month</p>
          </Card>
          <Card className="glass-card p-6">
            <p className="text-sm text-muted-foreground mb-2">Active Traders</p>
            <p className="text-2xl font-bold gradient-text">8.9K</p>
            <p className="text-xs text-success mt-1">+8% this month</p>
          </Card>
          <Card className="glass-card p-6">
            <p className="text-sm text-muted-foreground mb-2">Avg. Price</p>
            <p className="text-2xl font-bold gradient-text">1.82 ETH</p>
            <p className="text-xs text-destructive mt-1">-3% this month</p>
          </Card>
        </div>

        {/* Trending Collections Grid */}
        <div className="mb-8">
          <h2 className="text-2xl font-bold mb-6">Trending Collections</h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {trendingCollections.map((collection, index) => (
              <Card key={collection.title} className="glass-card p-6 hover:scale-105 transition-all duration-300 cursor-pointer group">
                <div className="relative w-full h-48 mb-4 rounded-lg overflow-hidden">
                  <div className={`absolute inset-0 ${collection.gradient} opacity-80`} />
                  <div className="absolute inset-0 bg-gradient-to-t from-background/80 to-transparent" />
                  <div className="absolute bottom-4 left-4 right-4">
                    <h3 className="text-xl font-bold text-white">{collection.title}</h3>
                  </div>
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-xs text-muted-foreground">Floor Price</p>
                    <p className="font-semibold text-foreground">{collection.floor}</p>
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground">Volume</p>
                    <p className="font-semibold text-primary">{collection.volume}</p>
                  </div>
                </div>
                
                <Button className="w-full mt-4 bg-primary/20 hover:bg-primary/30 text-primary border border-primary/30">
                  View Collection
                </Button>
              </Card>
            ))}
          </div>
        </div>

        {/* Load More */}
        <div className="text-center">
          <Button variant="outline" size="lg" className="border-border/50 hover:bg-card/50">
            Load More Collections
          </Button>
        </div>
      </div>
    </div>
  );
};

export default Collections;