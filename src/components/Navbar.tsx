import { Link, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Home, Layers, Shield, Store, Wallet } from "lucide-react";

const Navbar = () => {
  const location = useLocation();
  
  const navItems = [
    { path: "/", label: "Home", icon: Home },
    { path: "/dashboard", label: "Dashboard", icon: Wallet },
    { path: "/collections", label: "Collections", icon: Layers },
    { path: "/verification", label: "Verification", icon: Shield },
    { path: "/marketplace", label: "Marketplace", icon: Store },
  ];

  return (
    <nav className="glass-panel border-b border-border/30 px-6 py-4 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        <div className="flex items-center space-x-8">
          <Link to="/" className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-gradient-primary rounded-lg flex items-center justify-center">
              <span className="text-primary-foreground font-bold text-lg">A</span>
            </div>
            <span className="text-xl font-bold gradient-text">AuthX</span>
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
          <Button variant="ghost" size="sm" className="text-muted-foreground">
            Support
          </Button>
          <Button className="bg-gradient-primary hover:opacity-90 text-primary-foreground border-0">
            Connect Wallet
          </Button>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;