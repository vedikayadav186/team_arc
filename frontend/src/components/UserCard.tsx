import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Star, MapPin, Clock } from "lucide-react";

interface UserProfile {
  id: string;
  name: string;
  location?: string;
  avatar?: string;
  skillsOffered: string[];
  skillsWanted: string[];
  availability: string;
  rating: number;
  reviewCount: number;
}

interface UserCardProps {
  user: UserProfile;
  isLoggedIn: boolean;
  onRequestClick: (userId: string) => void;
  onProfileClick: (userId: string) => void;
  layout?: 'grid' | 'list';
}

export function UserCard({ user, isLoggedIn, onRequestClick, onProfileClick, layout = 'grid' }: UserCardProps) {
  if (layout === 'list') {
    return (
      <Card className="card-elevated cursor-pointer group hover:shadow-lg transition-all" onClick={() => onProfileClick(user.id)}>
        <CardContent className="p-6">
          <div className="flex items-center gap-6">
            <Avatar className="h-20 w-20 avatar-professional flex-shrink-0">
              <AvatarImage src={user.avatar} alt={user.name} />
              <AvatarFallback className="bg-gradient-to-r from-primary to-primary-glow text-primary-foreground text-xl">
                {user.name.split(' ').map(n => n[0]).join('').toUpperCase()}
              </AvatarFallback>
            </Avatar>
            
            <div className="flex-1 min-w-0">
              <div className="flex items-start justify-between mb-3">
                <div>
                  <h3 className="font-semibold text-xl text-foreground group-hover:text-primary transition-colors">
                    {user.name}
                  </h3>
                  {user.location && (
                    <div className="flex items-center gap-1 text-sm text-muted-foreground mt-1">
                      <MapPin className="h-4 w-4" />
                      {user.location}
                    </div>
                  )}
                </div>
                
                <div className="rating-display">
                  <Star className="h-4 w-4 rating-star" />
                  <span className="font-medium">{user.rating}</span>
                  <span className="text-xs">({user.reviewCount})</span>
                </div>
              </div>

              <div className="flex items-center gap-2 text-sm text-muted-foreground mb-4">
                <Clock className="h-4 w-4" />
                <span>{user.availability}</span>
              </div>

              <div className="grid md:grid-cols-2 gap-4 mb-4">
                <div>
                  <p className="text-sm font-medium text-foreground mb-2">Skills Offered</p>
                  <div className="flex flex-wrap gap-1.5">
                    {user.skillsOffered.slice(0, 3).map((skill, index) => (
                      <Badge key={index} variant="secondary" className="skill-badge-offered">
                        {skill}
                      </Badge>
                    ))}
                    {user.skillsOffered.length > 3 && (
                      <Badge variant="secondary" className="text-xs">
                        +{user.skillsOffered.length - 3} more
                      </Badge>
                    )}
                  </div>
                </div>

                <div>
                  <p className="text-sm font-medium text-foreground mb-2">Skills Wanted</p>
                  <div className="flex flex-wrap gap-1.5">
                    {user.skillsWanted.slice(0, 3).map((skill, index) => (
                      <Badge key={index} variant="outline" className="skill-badge-wanted">
                        {skill}
                      </Badge>
                    ))}
                    {user.skillsWanted.length > 3 && (
                      <Badge variant="outline" className="text-xs">
                        +{user.skillsWanted.length - 3} more
                      </Badge>
                    )}
                  </div>
                </div>
              </div>
            </div>
            
            <div className="flex-shrink-0">
              <Button
                size="lg"
                disabled={!isLoggedIn}
                onClick={(e) => {
                  e.stopPropagation();
                  onRequestClick(user.id);
                }}
                className="btn-gradient min-w-[120px]"
              >
                {isLoggedIn ? 'Send Request' : 'Login to Request'}
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="card-elevated cursor-pointer group" onClick={() => onProfileClick(user.id)}>
      <CardContent className="p-6">
        <div className="flex items-start gap-4">
          <Avatar className="h-16 w-16 avatar-professional">
            <AvatarImage src={user.avatar} alt={user.name} />
            <AvatarFallback className="bg-gradient-to-r from-primary to-primary-glow text-primary-foreground text-lg">
              {user.name.split(' ').map(n => n[0]).join('').toUpperCase()}
            </AvatarFallback>
          </Avatar>
          
          <div className="flex-1 min-w-0">
            <div className="flex items-start justify-between mb-2">
              <div>
                <h3 className="font-semibold text-lg text-foreground group-hover:text-primary transition-colors">
                  {user.name}
                </h3>
                {user.location && (
                  <div className="flex items-center gap-1 text-sm text-muted-foreground mt-1">
                    <MapPin className="h-3 w-3" />
                    {user.location}
                  </div>
                )}
              </div>
              
              <div className="rating-display">
                <Star className="h-4 w-4 rating-star" />
                <span className="font-medium">{user.rating}</span>
                <span className="text-xs">({user.reviewCount})</span>
              </div>
            </div>

            <div className="flex items-center gap-2 text-sm text-muted-foreground mb-4">
              <Clock className="h-3 w-3" />
              <span>{user.availability}</span>
            </div>

            <div className="space-y-3">
              <div>
                <p className="text-sm font-medium text-foreground mb-2">Skills Offered</p>
                <div className="flex flex-wrap gap-1.5">
                  {user.skillsOffered.map((skill, index) => (
                    <Badge key={index} variant="secondary" className="skill-badge-offered">
                      {skill}
                    </Badge>
                  ))}
                </div>
              </div>

              <div>
                <p className="text-sm font-medium text-foreground mb-2">Skills Wanted</p>
                <div className="flex flex-wrap gap-1.5">
                  {user.skillsWanted.map((skill, index) => (
                    <Badge key={index} variant="outline" className="skill-badge-wanted">
                      {skill}
                    </Badge>
                  ))}
                </div>
              </div>
            </div>

            <div className="mt-4 pt-4 border-t border-border">
              <Button
                size="sm"
                disabled={!isLoggedIn}
                onClick={(e) => {
                  e.stopPropagation();
                  onRequestClick(user.id);
                }}
                className="w-full btn-gradient"
              >
                {isLoggedIn ? 'Send Request' : 'Login to Request'}
              </Button>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}