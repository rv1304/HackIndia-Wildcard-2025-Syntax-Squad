import { Link, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Home, Shield, Store, Wallet, Gem, LogOut, User, CheckCircle, Package, ShoppingCart, Settings, BarChart3 } from "lucide-react";
import WalletConnect from "./WalletConnect";
import { useAuth } from "../context/AuthContext";

const Navbar = () => {
  const location = useLocation();
  const { user, logout } = useAuth();
  
  // Role-specific navigation items
  const getNavItems = () => {
    if (!user?.role) {
      return [
        { path: "/", label: "Home", icon: Home },
        { path: "/marketplace", label: "Marketplace", icon: Store },
        { path: "/login", label: "Login", icon: User },
      ];
    }

    const commonItems = [
      { path: "/", label: "Home", icon: Home },
      { path: "/dashboard", label: "Dashboard", icon: Wallet },
      { path: "/marketplace", label: "Marketplace", icon: Store },
    ];

    switch (user.role) {
      case 'admin':
        return [
          ...commonItems,
          { path: "/admin/approvals", label: "Admin Approvals", icon: CheckCircle },
          // Removed analytics to avoid 404
        ];
      
      case 'seller':
        return [
          ...commonItems,
          { path: "/mint", label: "Mint", icon: Gem },
          { path: "/list-product", label: "List Product", icon: Package },
          { path: "/verification", label: "Verification", icon: Shield },
        ];
      
      case 'buyer':
        return [
          ...commonItems,
          { path: "/my-nfts", label: "My NFTs", icon: ShoppingCart },
          { path: "/sell-nft", label: "Sell NFT", icon: Gem },
        ];
      
      default:
        return commonItems;
    }
  };

  const navItems = getNavItems();

  const getRoleColor = () => {
    switch (user?.role) {
      case 'admin': return 'bg-red-500';
      case 'seller': return 'bg-blue-500';
      case 'buyer': return 'bg-green-500';
      default: return 'bg-gray-500';
    }
  };

  const getRoleIcon = () => {
    switch (user?.role) {
      case 'admin': return '👑';
      case 'seller': return '🏪';
      case 'buyer': return '🛒';
      default: return '👤';
    }
  };

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
              const Icon = item.icon as any;
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
        
        <div className="flex items-center space-x-3">
          {user?.role && (
            <div className="flex items-center space-x-2">
              <span className="text-xs px-2 py-1 rounded bg-card/60 border border-border/50 capitalize flex items-center space-x-1">
                <span className="text-sm">{getRoleIcon()}</span>
                <span>{user.role}</span>
              </span>
              <span className="text-xs text-muted-foreground">{user.name}</span>
            </div>
          )}
          <WalletConnect />
          {user?.role ? (
            <Button variant="outline" onClick={logout}><LogOut className="w-4 h-4 mr-2" />Logout</Button>
          ) : (
            <Link to="/login"><Button variant="outline"><User className="w-4 h-4 mr-2" />Login</Button></Link>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
