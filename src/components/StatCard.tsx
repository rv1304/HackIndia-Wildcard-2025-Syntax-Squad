import { Card } from "@/components/ui/card";
import { LucideIcon } from "lucide-react";

interface StatCardProps {
  icon: LucideIcon;
  label: string;
  value: string | number;
  gradient?: string;
}

const StatCard = ({ icon: Icon, label, value, gradient = "bg-gradient-primary" }: StatCardProps) => {
  return (
    <Card className="glass-card p-6 group hover:scale-105 transition-all duration-300">
      <div className="flex flex-col items-center space-y-3">
        <div className={`w-16 h-16 ${gradient} rounded-2xl flex items-center justify-center shadow-glow group-hover:shadow-glow-accent transition-all`}>
          <Icon className="w-8 h-8 text-primary-foreground" />
        </div>
        <div className="text-center">
          <p className="text-xs text-muted-foreground uppercase tracking-wider">{label}</p>
          <p className="text-xl font-bold text-foreground mt-1">{value}</p>
        </div>
      </div>
    </Card>
  );
};

export default StatCard;