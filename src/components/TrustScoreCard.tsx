import { Card } from "@/components/ui/card";
import { Shield, TrendingUp } from "lucide-react";

interface TrustScoreCardProps {
  score: number;
  trend?: "up" | "down" | "stable";
  description?: string;
}

const TrustScoreCard = ({ score, trend = "stable", description }: TrustScoreCardProps) => {
  return (
    <Card className="glass-panel p-8 relative overflow-hidden">
      <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-glow opacity-30 blur-3xl" />
      
      <div className="relative">
        <div className="flex items-start justify-between mb-6">
          <div>
            <h3 className="text-xl font-semibold text-foreground mb-2">Trust Score Card</h3>
            <p className="text-sm text-muted-foreground max-w-xs">
              {description || "Overall asset authenticity and trust metrics"}
            </p>
          </div>
          <div className="bg-primary/20 p-3 rounded-xl">
            <Shield className="w-6 h-6 text-primary" />
          </div>
        </div>

        <div className="flex items-end justify-between">
          <div className="text-6xl font-bold gradient-text">{score}</div>
          
          {trend === "up" && (
            <div className="flex items-center text-success text-sm">
              <TrendingUp className="w-4 h-4 mr-1" />
              <span>+5 this week</span>
            </div>
          )}
        </div>

        <div className="mt-6 space-y-2">
          <div className="flex justify-between text-sm">
            <span className="text-muted-foreground">Verification Status</span>
            <span className="text-primary">Verified</span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-muted-foreground">Risk Level</span>
            <span className="text-success">Low</span>
          </div>
        </div>
      </div>
    </Card>
  );
};

export default TrustScoreCard;