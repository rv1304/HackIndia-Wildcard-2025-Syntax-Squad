import { Link, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Home, Shield, Store, Wallet, Gem } from "lucide-react";

const Navbar = () => {
  const location = useLocation();
  
  const navItems = [
    { path: "/", label: "Home", icon: Home },
    { path: "/dashboard", label: "Dashboard", icon: Wallet },
    { path: "/verification", label: "Verification", icon: Shield },
    { path: "/marketplace", label: "Marketplace", icon: Store },
    { path: "/list-product", label: "List Product", icon: Gem },
  ];

  return (
    <nav className="glass-panel border-b border-border/30 px-6 py-4 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        <div className="flex items-center space-x-8">
          <Link to="/" className="flex items-center space-x-3 group">
            <div className="w-10 h-10 bg-gradient-primary rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
              <Gem className="w-6 h-6 text-primary-foreground" />
            </div>
            <span className="text-2xl font-bold gradient-text">AuthX</span>
          </Link>
          
          <div className="hidden md:flex items-center space-x-1">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = location.pathname === item.path;
              
              return (
                <Link key={item.path} to={item.path}>
                  <Button
                    variant="ghost"
                    className={`text-sm ${
                      isActive 
                        ? "text-primary bg-primary/10" 
                        : "text-muted-foreground hover:text-foreground"
                    }`}
                  >
                    <Icon className="w-4 h-4 mr-2" />
                    {item.label}
                  </Button>
                </Link>
              );
            })}
          </div>
        </div>
        
        <div className="flex items-center space-x-4">
          <Button className="bg-gradient-primary hover:opacity-90 hover:scale-105 text-primary-foreground border-0 transition-all duration-300">
            <Wallet className="w-4 h-4 mr-2" />
            Connect Wallet
          </Button>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
