
import { useAuth } from "@/contexts/AuthContext";
import { useNavigate, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { LogOut, User, Plus, Home, Code } from "lucide-react";

export const Navbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  const isActive = (path: string) => {
    return location.pathname === path;
  };

  const navItems = [
    { path: "/dashboard", label: "Problems", icon: Home },
    { path: "/create-problem", label: "Create", icon: Plus },
    { path: "/profile", label: "Profile", icon: User },
  ];

  return (
    <nav className="sticky top-0 z-50 backdrop-blur-lg bg-purple-950/60 border-b border-purple-500/20 shadow-lg shadow-purple-500/5">
      <div className="container mx-auto px-4 py-3">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-gradient-to-r from-purple-500 to-cyan-500 rounded-lg flex items-center justify-center">
              <Code className="w-5 h-5 text-white" />
            </div>
            <div className="text-xl font-bold">
              <span className="text-white">Code</span>
              <span className="text-cyan-400">Judge</span>
            </div>
          </div>
          
          {/* Navigation Items */}
          <div className="flex items-center space-x-2">
            {navItems.map((item) => {
              const Icon = item.icon;
              const active = isActive(item.path);
              
              return (
                <Button
                  key={item.path}
                  variant="ghost"
                  onClick={() => navigate(item.path)}
                  className={`
                    relative text-sm font-medium px-4 py-2 rounded-lg transition-all duration-300
                    ${active 
                      ? 'text-white bg-gradient-to-r from-purple-600/30 to-cyan-600/30 border border-purple-500/50 shadow-lg shadow-purple-500/20' 
                      : 'text-gray-300 hover:text-white hover:bg-gradient-to-r hover:from-purple-900/20 hover:to-cyan-900/20 border border-transparent hover:border-purple-500/30'
                    }
                  `}
                >
                  <Icon className="w-4 h-4 mr-2" />
                  {item.label}
                </Button>
              );
            })}
            
            {/* User Info & Logout */}
            <div className="flex items-center space-x-3 ml-4 pl-4 border-l border-purple-500/20">
              <div className="flex items-center space-x-2">
                <div className="w-8 h-8 bg-gradient-to-r from-purple-500 to-cyan-500 rounded-full flex items-center justify-center">
                  <span className="text-white text-sm font-semibold">
                    {user?.firstname?.charAt(0) || 'U'}
                  </span>
                </div>
                <div className="hidden md:block">
                  <div className="text-sm font-medium text-white">
                    {user?.firstname} {user?.lastname}
                  </div>
                  <div className="text-xs text-gray-400">
                    {user?.email}
                  </div>
                </div>
              </div>
              
              <Button
                variant="outline"
                size="sm"
                onClick={handleLogout}
                className="text-red-400 border-red-400/50 hover:bg-red-400/10 hover:border-red-400 transition-all duration-300 bg-transparent"
              >
                <LogOut className="w-4 h-4 mr-1" />
                <span className="hidden sm:inline">Logout</span>
              </Button>
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
};
