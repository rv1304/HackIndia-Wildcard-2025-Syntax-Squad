import { Card } from "@/components/ui/card";
import { Activity, ArrowDown, ArrowUp, ShoppingCart } from "lucide-react";

interface ActivityItem {
  id: string;
  type: "sale" | "listing" | "transfer";
  title: string;
  value?: string;
  time: string;
  icon: React.ReactNode;
}

const ActivityFeed = () => {
  const activities: ActivityItem[] = [
    {
      id: "1",
      type: "sale",
      title: "Mystic Dragon #142",
      value: "2.5 ETH",
      time: "2 mins ago",
      icon: <ShoppingCart className="w-4 h-4" />
    },
    {
      id: "2",
      type: "listing",
      title: "Cosmic Warrior #88",
      value: "1.2 ETH",
      time: "15 mins ago",
      icon: <ArrowUp className="w-4 h-4" />
    },
    {
      id: "3",
      type: "transfer",
      title: "Galaxy Token #304",
      value: "Transfer",
      time: "1 hour ago",
      icon: <ArrowDown className="w-4 h-4" />
    }
  ];

  return (
    <Card className="glass-panel p-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-foreground">Activity Feed</h3>
        <Activity className="w-5 h-5 text-primary" />
      </div>
      
      <div className="space-y-3">
        {activities.map((activity) => (
          <div
            key={activity.id}
            className="flex items-center justify-between p-3 rounded-lg bg-card/40 hover:bg-card/60 transition-colors"
          >
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-primary/20 rounded-lg flex items-center justify-center">
                {activity.icon}
              </div>
              <div>
                <p className="text-sm font-medium text-foreground">{activity.title}</p>
                <p className="text-xs text-muted-foreground">{activity.time}</p>
              </div>
            </div>
            {activity.value && (
              <span className="text-sm font-semibold text-primary">{activity.value}</span>
            )}
          </div>
        ))}
      </div>
    </Card>
  );
};

export default ActivityFeed;