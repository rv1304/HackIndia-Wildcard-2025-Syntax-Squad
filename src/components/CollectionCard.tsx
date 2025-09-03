import { Card } from "@/components/ui/card";

interface CollectionCardProps {
  title: string;
  image: string;
  gradient: string;
  delay?: number;
}

const CollectionCard = ({ title, image, gradient, delay = 0 }: CollectionCardProps) => {
  return (
    <Card 
      className="glass-card p-6 hover:scale-105 transition-all duration-300 cursor-pointer group"
      style={{ animationDelay: `${delay}ms` }}
    >
      <div className="relative w-full h-48 mb-4 rounded-lg overflow-hidden">
        <div className={`absolute inset-0 ${gradient} opacity-80`} />
        <img 
          src={image} 
          alt={title} 
          className="w-full h-full object-cover mix-blend-overlay"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-background/80 to-transparent" />
      </div>
      <h3 className="text-lg font-semibold text-foreground group-hover:text-primary transition-colors">
        {title}
      </h3>
      <p className="text-sm text-muted-foreground mt-1">
        Floor: 0.42 ETH
      </p>
    </Card>
  );
};

export default CollectionCard;