import { useAuth } from "@/contexts/AuthContext";
import { useNavigate, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { LogOut, User, Home, Code } from "lucide-react";

export const Navbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  const isActive = (path: string) => location.pathname === path;

  const navItems = [
    { path: "/dashboard", label: "Problems", icon: Home },
    { path: "/profile", label: "Profile", icon: User },
  ];

  return (
    <nav className="sticky top-0 z-50 bg-[#0f0f1a] border-b border-gray-800 shadow-md">
      <div className="container mx-auto px-4 py-3">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-gradient-to-r from-purple-500 to-cyan-500 rounded-lg flex items-center justify-center">
              <Code className="w-5 h-5 text-white" />
            </div>
            <div className="text-xl font-bold">
              <span className="text-white">Code</span>
              <span className="text-cyan-400">Verse</span>
            </div>
          </div>

          {/* Navigation Items */}
          <div className="flex items-center space-x-2">
            {navItems.map(({ path, label, icon: Icon }) => (
              <Button
                key={path}
                onClick={() => navigate(path)}
                className={`
                  relative text-sm font-medium px-4 py-2 rounded-lg transition-all duration-300
                  text-white bg-gradient-to-r from-purple-600 to-cyan-600 border border-purple-700 shadow-md
                `}
              >
                <Icon className="w-4 h-4 mr-2" />
                {label}
              </Button>
            ))}

            {/* User Info & Logout */}
            <div className="flex items-center space-x-3 ml-4 pl-4 border-l border-gray-700">
              <div className="flex items-center space-x-2">
                <div className="w-8 h-8 bg-gradient-to-r from-purple-500 to-cyan-500 rounded-full flex items-center justify-center">
                  <span className="text-white text-sm font-semibold">
                    {user?.firstname?.charAt(0) || "U"}
                  </span>
                </div>
                <div className="hidden md:block">
                  <div className="text-sm font-medium text-white">
                    {user?.firstname} {user?.lastname}
                  </div>
                  <div className="text-xs text-gray-400">{user?.email}</div>
                </div>
              </div>

              <Button
                size="sm"
                onClick={handleLogout}
                className="text-white bg-gradient-to-r from-purple-600 to-cyan-600 border border-purple-700 hover:from-purple-700 hover:to-cyan-700 transition-all duration-300 shadow-md"
              >
                <LogOut className="w-4 h-4 mr-1" />
                Logout
              </Button>
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
};
