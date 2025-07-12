import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { MessageSquare, Star } from "lucide-react";

interface Connection {
  id: string;
  name: string;
  avatar?: string;
  skillsOffered: string[];
  rating: number;
  reviewCount: number;
}

interface ConnectionsModalProps {
  isOpen: boolean;
  onClose: () => void;
  connections: Connection[];
  onChatClick: (userId: string) => void;
}

const mockConnections: Connection[] = [
  {
    id: "2",
    name: "Michael Chen",
    avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150",
    skillsOffered: ["Python", "Machine Learning", "Data Science"],
    rating: 4.9,
    reviewCount: 31
  },
  {
    id: "3",
    name: "Emily Rodriguez",
    avatar: "https://images.unsplash.com/photo-1494790108755-2616b612b47c?w=150",
    skillsOffered: ["Graphic Design", "Photoshop", "Illustrator"],
    rating: 4.7,
    reviewCount: 18
  },
  {
    id: "5",
    name: "Lisa Zhang",
    avatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150",
    skillsOffered: ["Digital Marketing", "SEO", "Content Strategy"],
    rating: 4.9,
    reviewCount: 35
  },
  {
    id: "6",
    name: "Alex Thompson",
    avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150",
    skillsOffered: ["Photography", "Video Production", "Adobe Premiere"],
    rating: 4.5,
    reviewCount: 27
  }
];

export function ConnectionsModal({ isOpen, onClose, onChatClick }: ConnectionsModalProps) {
  const connections = mockConnections; // Use mock data for demo

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[600px]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <span className="bg-gradient-to-r from-primary to-primary-glow bg-clip-text text-transparent">
              My Connections
            </span>
            <Badge variant="secondary" className="ml-2">
              {connections.length}
            </Badge>
          </DialogTitle>
        </DialogHeader>
        
        <ScrollArea className="max-h-[500px] pr-4">
          <div className="space-y-4">
            {connections.map((connection) => (
              <div
                key={connection.id}
                className="p-4 border border-border rounded-lg hover:shadow-md transition-all bg-card"
              >
                <div className="flex items-center gap-4">
                  <Avatar className="h-16 w-16 avatar-professional">
                    <AvatarImage src={connection.avatar} alt={connection.name} />
                    <AvatarFallback className="bg-gradient-to-r from-primary to-primary-glow text-primary-foreground text-lg">
                      {connection.name.split(' ').map(n => n[0]).join('').toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                  
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between mb-2">
                      <div>
                        <h3 className="font-semibold text-lg">{connection.name}</h3>
                        <div className="rating-display mt-1">
                          <Star className="h-4 w-4 rating-star" />
                          <span className="font-medium">{connection.rating}</span>
                          <span className="text-xs">({connection.reviewCount})</span>
                        </div>
                      </div>
                      
                      <Button
                        size="sm"
                        onClick={() => {
                          onChatClick(connection.id);
                          onClose();
                        }}
                        className="btn-gradient"
                      >
                        <MessageSquare className="h-4 w-4 mr-2" />
                        Chat
                      </Button>
                    </div>

                    <div>
                      <p className="text-sm font-medium text-foreground mb-2">Skills</p>
                      <div className="flex flex-wrap gap-1.5">
                        {connection.skillsOffered.map((skill, index) => (
                          <Badge key={index} variant="secondary" className="skill-badge-offered">
                            {skill}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
}