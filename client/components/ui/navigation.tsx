import { Link, useLocation } from "react-router-dom";
import { cn } from "@/lib/utils";
import { Button } from "./button";
import {
  Home,
  LayoutDashboard,
  Play,
  Settings,
  Menu,
  X,
  Bot,
  LogOut,
  User,
  Gamepad2,
} from "lucide-react";
import { useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { ThemeToggle } from "./theme-toggle";

const navigation = [
  { name: "Home", href: "/", icon: Home },
  { name: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
  { name: "Practice Mode", href: "/practice", icon: Play },
  { name: "Game Arena", href: "/game-arena", icon: Gamepad2 },
  { name: "Virtual Tutor", href: "/virtual-tutor", icon: Bot },
  { name: "Settings", href: "/settings", icon: Settings },
];

export function Navigation() {
  const location = useLocation();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const { currentUser, logout } = useAuth();

  const handleLogout = async () => {
    try {
      await logout();
    } catch (error) {
      console.error("Logout error:", error);
    }
  };

  return (
    <nav className="bg-background/80 backdrop-blur-lg border-b border-border/50 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-3 group">
            <div className="relative">
              <div className="w-10 h-10 bg-gradient-to-br from-nova-500 via-electric-500 to-cyber-500 rounded-xl flex items-center justify-center glow">
                <span className="text-white font-bold text-xl">A</span>
              </div>
              <div className="absolute -inset-1 bg-gradient-to-br from-nova-500 via-electric-500 to-cyber-500 rounded-xl blur opacity-25 group-hover:opacity-50 transition-opacity"></div>
            </div>
            <div className="flex flex-col">
              <span className="text-lg font-bold bg-gradient-to-r from-nova-400 via-electric-400 to-cyber-400 bg-clip-text text-transparent">
                Aangilam
              </span>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-1">
            {navigation.map((item) => {
              const Icon = item.icon;
              const isActive = location.pathname === item.href;

              return (
                <Link
                  key={item.name}
                  to={item.href}
                  className={cn(
                    "px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 flex items-center space-x-2 group relative",
                    isActive
                      ? "text-nova-400 bg-nova-500/10 glow"
                      : "text-muted-foreground hover:text-foreground hover:bg-accent",
                  )}
                >
                  <Icon className="w-4 h-4" />
                  <span>{item.name}</span>
                  {isActive && (
                    <div className="absolute inset-0 bg-gradient-to-r from-nova-500/20 via-electric-500/20 to-cyber-500/20 rounded-lg -z-10"></div>
                  )}
                </Link>
              );
            })}
          </div>

          {/* User Menu */}
          <div className="hidden md:flex items-center space-x-4">
            <ThemeToggle />
            <div className="flex items-center space-x-3">
              <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                <User className="w-4 h-4" />
                <span>{currentUser?.displayName || currentUser?.email}</span>
              </div>
              <Button
                variant="outline"
                size="sm"
                onClick={handleLogout}
                className="flex items-center space-x-2 hover:bg-red-500/10 hover:border-red-500/30 hover:text-red-500"
              >
                <LogOut className="w-4 h-4" />
                <span>Logout</span>
              </Button>
            </div>
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="text-foreground"
            >
              {isMobileMenuOpen ? (
                <X className="w-5 h-5" />
              ) : (
                <Menu className="w-5 h-5" />
              )}
            </Button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isMobileMenuOpen && (
          <div className="md:hidden pb-4 pt-2 space-y-1 bg-gradient-to-b from-background via-background/95 to-background/90 backdrop-blur-lg rounded-b-xl border-x border-b border-border/50">
            {navigation.map((item) => {
              const Icon = item.icon;
              const isActive = location.pathname === item.href;

              return (
                <Link
                  key={item.name}
                  to={item.href}
                  onClick={() => setIsMobileMenuOpen(false)}
                  className={cn(
                    "block px-4 py-3 text-sm font-medium transition-all duration-200 flex items-center space-x-3 rounded-lg mx-2",
                    isActive
                      ? "text-nova-400 bg-nova-500/10 glow"
                      : "text-muted-foreground hover:text-foreground hover:bg-accent",
                  )}
                >
                  <Icon className="w-5 h-5" />
                  <span>{item.name}</span>
                </Link>
              );
            })}
            <div className="px-2 pt-4 space-y-3">
              <div className="flex items-center justify-between px-2">
                <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                  <User className="w-4 h-4" />
                  <span>{currentUser?.displayName || currentUser?.email}</span>
                </div>
                <ThemeToggle />
              </div>
              <Button
                onClick={handleLogout}
                variant="outline"
                className="w-full flex items-center justify-center space-x-2 hover:bg-red-500/10 hover:border-red-500/30 hover:text-red-500"
              >
                <LogOut className="w-4 h-4" />
                <span>Logout</span>
              </Button>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
}
