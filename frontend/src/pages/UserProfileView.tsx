import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Navbar } from "@/components/Navbar";
import { RequestModal } from "@/components/RequestModal";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";
import { Star, MapPin, Clock, MessageCircle, ArrowLeft } from "lucide-react";

// Mock user data (in a real app, this would come from an API)
const mockUsers: Record<string, any> = {
  "1": {
    id: "1",
    name: "Sarah Johnson",
    location: "San Francisco, CA",
    avatar: "https://images.unsplash.com/photo-1494790108755-2616b612b47c?w=150",
    skillsOffered: ["React", "TypeScript", "UI/UX Design"],
    skillsWanted: ["Python", "Data Analysis"],
    availability: "Weekends",
    rating: 4.8,
    reviewCount: 24,
    joinedDate: "March 2023",
    bio: "Full-stack developer with 5+ years of experience in React and modern web technologies. Passionate about creating beautiful, user-friendly interfaces and helping others learn to code.",
    reviews: [
      {
        id: "1",
        reviewer: "Michael Chen",
        rating: 5,
        comment: "Sarah is an excellent teacher! She helped me understand React hooks in a way that finally clicked. Very patient and knowledgeable.",
        date: "2 weeks ago"
      },
      {
        id: "2", 
        reviewer: "Emily Rodriguez",
        rating: 5,
        comment: "Great experience learning TypeScript from Sarah. She provided excellent resources and practical examples.",
        date: "1 month ago"
      },
      {
        id: "3",
        reviewer: "David Kumar", 
        rating: 4,
        comment: "Very helpful session on UI/UX principles. Sarah has great design sense and explains concepts clearly.",
        date: "2 months ago"
      }
    ]
  },
  "2": {
    id: "2",
    name: "Michael Chen", 
    location: "New York, NY",
    skillsOffered: ["Python", "Machine Learning", "Data Science"],
    skillsWanted: ["React", "Frontend Development"],
    availability: "Evenings",
    rating: 4.9,
    reviewCount: 31,
    joinedDate: "January 2023",
    bio: "Data scientist with expertise in machine learning and Python. Love sharing knowledge about data analysis and helping developers transition into data science.",
    reviews: [
      {
        id: "1",
        reviewer: "Sarah Johnson",
        rating: 5,
        comment: "Michael is a fantastic data science mentor. His explanation of ML concepts was clear and practical.",
        date: "1 week ago"
      }
    ]
  }
};

const mockCurrentUser = {
  id: "current",
  name: "John Doe",
  avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150",
  skillsOffered: ["React", "JavaScript", "Node.js", "Project Management"]
};

export default function UserProfileView() {
  const { userId } = useParams<{ userId: string }>();
  const navigate = useNavigate();
  const [currentUser, setCurrentUser] = useState<typeof mockCurrentUser | null>(null);
  const [requestModalOpen, setRequestModalOpen] = useState(false);
  
  const user = userId ? mockUsers[userId] : null;

  useEffect(() => {
    const savedUser = localStorage.getItem('currentUser');
    if (savedUser) {
      setCurrentUser(JSON.parse(savedUser));
    }
  }, []);

  if (!user) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar user={currentUser} />
        <div className="container mx-auto px-4 py-16 text-center">
          <h1 className="text-2xl font-bold mb-4">User Not Found</h1>
          <Button onClick={() => navigate('/')} variant="outline">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Home
          </Button>
        </div>
      </div>
    );
  }

  const handleRequestClick = () => {
    if (currentUser) {
      setRequestModalOpen(true);
    } else {
      navigate('/login');
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar user={currentUser} />
      
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          {/* Back Button */}
          <Button
            variant="ghost" 
            onClick={() => navigate('/')}
            className="mb-6"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Home
          </Button>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Main Profile Card */}
            <div className="lg:col-span-2">
              <Card className="card-elevated">
                <CardHeader>
                  <div className="flex items-start gap-6">
                    <Avatar className="h-24 w-24 avatar-professional">
                      <AvatarImage src={user.avatar} alt={user.name} />
                      <AvatarFallback className="bg-gradient-to-r from-primary to-primary-glow text-primary-foreground text-2xl">
                        {user.name.split(' ').map((n: string) => n[0]).join('').toUpperCase()}
                      </AvatarFallback>
                    </Avatar>
                    
                    <div className="flex-1">
                      <CardTitle className="text-2xl mb-2">{user.name}</CardTitle>
                      
                      <div className="flex flex-wrap items-center gap-4 text-muted-foreground mb-4">
                        {user.location && (
                          <div className="flex items-center gap-1">
                            <MapPin className="h-4 w-4" />
                            <span>{user.location}</span>
                          </div>
                        )}
                        <div className="flex items-center gap-1">
                          <Clock className="h-4 w-4" />
                          <span>{user.availability}</span>
                        </div>
                        <div className="rating-display">
                          <Star className="h-4 w-4 rating-star" />
                          <span className="font-medium">{user.rating}</span>
                          <span>({user.reviewCount} reviews)</span>
                        </div>
                      </div>

                      <p className="text-muted-foreground mb-4">{user.bio}</p>
                      
                      <Button
                        onClick={handleRequestClick}
                        disabled={!currentUser}
                        className="btn-gradient"
                      >
                        <MessageCircle className="h-4 w-4 mr-2" />
                        {currentUser ? 'Send Request' : 'Login to Request'}
                      </Button>
                    </div>
                  </div>
                </CardHeader>
              </Card>

              {/* Skills Section */}
              <Card className="card-elevated mt-6">
                <CardContent className="pt-6">
                  <div className="space-y-6">
                    <div>
                      <h3 className="font-semibold text-lg mb-3">Skills Offered</h3>
                      <div className="flex flex-wrap gap-2">
                        {user.skillsOffered.map((skill: string, index: number) => (
                          <Badge key={index} className="skill-badge-offered">
                            {skill}
                          </Badge>
                        ))}
                      </div>
                    </div>

                    <Separator />

                    <div>
                      <h3 className="font-semibold text-lg mb-3">Skills Wanted</h3>
                      <div className="flex flex-wrap gap-2">
                        {user.skillsWanted.map((skill: string, index: number) => (
                          <Badge key={index} variant="outline" className="skill-badge-wanted">
                            {skill}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Sidebar */}
            <div className="space-y-6">
              {/* Member Since */}
              <Card className="card-elevated">
                <CardContent className="pt-6">
                  <h3 className="font-semibold mb-2">Member Since</h3>
                  <p className="text-muted-foreground">{user.joinedDate}</p>
                </CardContent>
              </Card>

              {/* Reviews */}
              <Card className="card-elevated">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Star className="h-5 w-5 text-warning" />
                    Reviews ({user.reviews.length})
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {user.reviews.map((review: any) => (
                    <div key={review.id} className="border-l-2 border-primary/20 pl-4">
                      <div className="flex items-center gap-2 mb-2">
                        <div className="flex">
                          {Array.from({ length: 5 }, (_, i) => (
                            <Star
                              key={i}
                              className={`h-3 w-3 ${
                                i < review.rating 
                                  ? 'text-warning fill-current' 
                                  : 'text-muted-foreground'
                              }`}
                            />
                          ))}
                        </div>
                        <span className="text-sm text-muted-foreground">{review.date}</span>
                      </div>
                      <p className="text-sm mb-2">{review.comment}</p>
                      <p className="text-xs text-muted-foreground">— {review.reviewer}</p>
                    </div>
                  ))}
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>

      {/* Request Modal */}
      {currentUser && (
        <RequestModal
          isOpen={requestModalOpen}
          onClose={() => setRequestModalOpen(false)}
          targetUser={user}
          currentUser={currentUser}
        />
      )}
    </div>
  );
}