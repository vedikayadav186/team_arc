import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Link, useLocation } from "react-router-dom";
import { User } from "lucide-react";

interface NavbarProps {
  user?: {
    name: string;
    avatar?: string;
  };
  onProfileClick?: () => void;
}

export function Navbar({ user, onProfileClick }: NavbarProps) {
  const location = useLocation();
  
  const isActive = (path: string) => {
    return location.pathname === path;
  };

  return (
    <nav className="sticky top-0 z-50 bg-card/80 backdrop-blur-lg border-b border-border">
      <div className="container mx-auto px-4 h-16 flex items-center justify-between">
        <div className="flex items-center gap-8">
          <Link to="/" className="flex items-center">
            <h1 className="text-xl font-bold bg-gradient-to-r from-primary to-primary-glow bg-clip-text text-transparent">
              Skill Swap Platform
            </h1>
          </Link>
          
          <div className="hidden md:flex items-center gap-6">
            <Link 
              to="/" 
              className={`text-sm font-medium transition-colors hover:text-primary ${
                isActive('/') ? 'text-primary' : 'text-muted-foreground'
              }`}
            >
              Home
            </Link>
            {user && (
              <>
                <Link 
                  to="/requests" 
                  className={`text-sm font-medium transition-colors hover:text-primary ${
                    isActive('/requests') ? 'text-primary' : 'text-muted-foreground'
                  }`}
                >
                  Swap Requests
                </Link>
                <Link 
                  to="/chat" 
                  className={`text-sm font-medium transition-colors hover:text-primary ${
                    isActive('/chat') ? 'text-primary' : 'text-muted-foreground'
                  }`}
                >
                  Chat
                </Link>
              </>
            )}
          </div>
        </div>

        <div className="flex items-center gap-4">
          {user ? (
            <Button
              variant="ghost"
              size="sm"
              onClick={onProfileClick}
              className="flex items-center gap-2 hover:bg-primary/10"
            >
              <Avatar className="h-8 w-8 avatar-professional">
                <AvatarImage src={user.avatar} alt={user.name} />
                <AvatarFallback className="bg-gradient-to-r from-primary to-primary-glow text-primary-foreground">
                  {user.name.split(' ').map(n => n[0]).join('').toUpperCase()}
                </AvatarFallback>
              </Avatar>
              <span className="hidden sm:inline text-sm font-medium">{user.name}</span>
            </Button>
          ) : (
            <Link to="/login">
              <Button variant="outline" size="sm" className="btn-outline-primary">
                <User className="h-4 w-4 mr-2" />
                Login
              </Button>
            </Link>
          )}
        </div>
      </div>
    </nav>
  );
}