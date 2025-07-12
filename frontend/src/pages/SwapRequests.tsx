import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Navbar } from "@/components/Navbar";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { toast } from "@/hooks/use-toast";
import { Check, X, Trash2, Clock, Star, Filter, MessageSquare } from "lucide-react";

interface SwapRequest {
  id: string;
  type: 'sent' | 'received';
  otherUser: {
    id: string;
    name: string;
    avatar?: string;
    rating: number;
  };
  mySkill: string;
  theirSkill: string;
  message: string;
  status: 'pending' | 'accepted' | 'rejected';
  createdAt: string;
}

const mockRequests: SwapRequest[] = [
  {
    id: "1",
    type: "received",
    otherUser: {
      id: "2",
      name: "Michael Chen",
      avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150",
      rating: 4.9
    },
    mySkill: "React",
    theirSkill: "Python",
    message: "Hi! I'd love to learn React from you. I have 3+ years of Python experience and can help you with data analysis, web scraping, or machine learning projects. Would you be interested in a skill exchange?",
    status: "pending",
    createdAt: "2 hours ago"
  },
  {
    id: "2", 
    type: "sent",
    otherUser: {
      id: "1",
      name: "Sarah Johnson",
      avatar: "https://images.unsplash.com/photo-1494790108755-2616b612b47c?w=150",
      rating: 4.8
    },
    mySkill: "Node.js",
    theirSkill: "UI/UX Design",
    message: "Hello Sarah! I'm looking to improve my design skills and saw you're interested in backend development. I can teach you Node.js and API development in exchange for UX design guidance.",
    status: "accepted",
    createdAt: "1 day ago"
  },
  {
    id: "3",
    type: "sent", 
    otherUser: {
      id: "3",
      name: "Emily Rodriguez",
      avatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150",
      rating: 4.7
    },
    mySkill: "JavaScript",
    theirSkill: "Graphic Design",
    message: "Hi Emily! I can help you with JavaScript and web development fundamentals. Would you be willing to teach me Photoshop and graphic design basics?",
    status: "rejected",
    createdAt: "3 days ago"
  },
  {
    id: "4",
    type: "received",
    otherUser: {
      id: "4", 
      name: "David Kumar",
      avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150",
      rating: 4.6
    },
    mySkill: "Project Management",
    theirSkill: "Database Design",
    message: "I see you have project management experience! I'm working on a startup and could use guidance on project planning and team coordination. In return, I can teach you database design and SQL optimization.",
    status: "pending",
    createdAt: "5 hours ago"
  }
];

export default function SwapRequests() {
  const navigate = useNavigate();
  const [currentUser, setCurrentUser] = useState<any>(null);
  const [requests, setRequests] = useState<SwapRequest[]>(mockRequests);
  const [statusFilter, setStatusFilter] = useState<string>("all");

  useEffect(() => {
    const savedUser = localStorage.getItem('currentUser');
    if (!savedUser) {
      navigate('/login');
      return;
    }
    setCurrentUser(JSON.parse(savedUser));
  }, [navigate]);

  const filteredRequests = requests.filter(request => {
    if (statusFilter === "all") return true;
    return request.status === statusFilter;
  });

  const handleAccept = (requestId: string) => {
    setRequests(prev => prev.map(req => 
      req.id === requestId ? { ...req, status: 'accepted' as const } : req
    ));
    
    const request = requests.find(r => r.id === requestId);
    toast({
      title: "Request Accepted!",
      description: `You've accepted the skill swap with ${request?.otherUser.name}.`,
    });
  };

  const handleReject = (requestId: string) => {
    setRequests(prev => prev.map(req => 
      req.id === requestId ? { ...req, status: 'rejected' as const } : req
    ));
    
    const request = requests.find(r => r.id === requestId);
    toast({
      title: "Request Rejected",
      description: `You've declined the skill swap with ${request?.otherUser.name}.`,
    });
  };

  const handleDelete = (requestId: string) => {
    setRequests(prev => prev.filter(req => req.id !== requestId));
    toast({
      title: "Request Deleted",
      description: "The request has been removed.",
    });
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'accepted': return 'bg-success/10 text-success border-success/20';
      case 'rejected': return 'bg-destructive/10 text-destructive border-destructive/20';
      default: return 'bg-warning/10 text-warning-foreground border-warning/20';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'accepted': return <Check className="h-3 w-3" />;
      case 'rejected': return <X className="h-3 w-3" />;
      default: return <Clock className="h-3 w-3" />;
    }
  };

  if (!currentUser) return null;

  return (
    <div className="min-h-screen bg-background">
      <Navbar user={currentUser} />
      
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold mb-2">Swap Requests</h1>
            <p className="text-muted-foreground">
              Manage your skill exchange requests and connect with other professionals
            </p>
          </div>

          {/* Filter Bar */}
          <div className="flex items-center gap-4 mb-6">
            <div className="flex items-center gap-2">
              <Filter className="h-4 w-4 text-muted-foreground" />
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-48">
                  <SelectValue placeholder="Filter by status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Requests</SelectItem>
                  <SelectItem value="pending">Pending</SelectItem>
                  <SelectItem value="accepted">Accepted</SelectItem>
                  <SelectItem value="rejected">Rejected</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div className="text-sm text-muted-foreground">
              {filteredRequests.length} of {requests.length} requests
            </div>
          </div>

          {/* Requests List */}
          <div className="space-y-4">
            {filteredRequests.length === 0 ? (
              <Card className="card-elevated">
                <CardContent className="py-12 text-center">
                  <MessageSquare className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                  <h3 className="font-semibold mb-2">No requests found</h3>
                  <p className="text-muted-foreground mb-4">
                    {statusFilter === "all" 
                      ? "You don't have any skill swap requests yet."
                      : `No ${statusFilter} requests found.`
                    }
                  </p>
                  <Button onClick={() => navigate('/')} className="btn-gradient">
                    Explore Professionals
                  </Button>
                </CardContent>
              </Card>
            ) : (
              filteredRequests.map((request) => (
                <Card key={request.id} className="card-elevated">
                  <CardHeader className="pb-4">
                    <div className="flex items-start justify-between">
                      <div className="flex items-center gap-4">
                        <Avatar className="h-12 w-12 avatar-professional">
                          <AvatarImage src={request.otherUser.avatar} alt={request.otherUser.name} />
                          <AvatarFallback className="bg-gradient-to-r from-primary to-primary-glow text-primary-foreground">
                            {request.otherUser.name.split(' ').map(n => n[0]).join('').toUpperCase()}
                          </AvatarFallback>
                        </Avatar>
                        
                        <div>
                          <CardTitle className="text-lg">{request.otherUser.name}</CardTitle>
                          <div className="flex items-center gap-2">
                            <div className="rating-display">
                              <Star className="h-3 w-3 rating-star" />
                              <span className="text-sm">{request.otherUser.rating}</span>
                            </div>
                            <span className="text-sm text-muted-foreground">•</span>
                            <span className="text-sm text-muted-foreground">{request.createdAt}</span>
                          </div>
                        </div>
                      </div>
                      
                      <div className="flex items-center gap-2">
                        <Badge className={`${getStatusColor(request.status)} flex items-center gap-1`}>
                          {getStatusIcon(request.status)}
                          {request.status.charAt(0).toUpperCase() + request.status.slice(1)}
                        </Badge>
                        <Badge variant="secondary" className="text-xs">
                          {request.type === 'sent' ? 'Sent' : 'Received'}
                        </Badge>
                      </div>
                    </div>
                  </CardHeader>
                  
                  <CardContent className="space-y-4">
                    {/* Skills Exchange */}
                    <div className="flex items-center gap-4 p-4 bg-muted/30 rounded-lg">
                      <div className="flex-1 text-center">
                        <p className="text-sm text-muted-foreground mb-1">
                          {request.type === 'sent' ? 'You offer' : 'They want'}
                        </p>
                        <Badge className="skill-badge-offered">{request.mySkill}</Badge>
                      </div>
                      
                      <div className="text-muted-foreground">⇄</div>
                      
                      <div className="flex-1 text-center">
                        <p className="text-sm text-muted-foreground mb-1">
                          {request.type === 'sent' ? 'You want' : 'They offer'}
                        </p>
                        <Badge className="skill-badge-wanted">{request.theirSkill}</Badge>
                      </div>
                    </div>

                    <Separator />

                    {/* Message */}
                    <div>
                      <p className="text-sm font-medium mb-2">Message:</p>
                      <p className="text-sm text-muted-foreground">{request.message}</p>
                    </div>

                    {/* Actions */}
                    {request.status === 'pending' && (
                      <div className="flex gap-3 pt-4">
                        {request.type === 'received' ? (
                          <>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => handleReject(request.id)}
                              className="flex-1"
                            >
                              <X className="h-4 w-4 mr-2" />
                              Reject
                            </Button>
                            <Button
                              size="sm"
                              onClick={() => handleAccept(request.id)}
                              className="flex-1 btn-gradient"
                            >
                              <Check className="h-4 w-4 mr-2" />
                              Accept
                            </Button>
                          </>
                        ) : (
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleDelete(request.id)}
                            className="text-destructive hover:text-destructive"
                          >
                            <Trash2 className="h-4 w-4 mr-2" />
                            Delete
                          </Button>
                        )}
                      </div>
                    )}

                    {request.status !== 'pending' && (
                      <div className="pt-4">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleDelete(request.id)}
                          className="text-destructive hover:text-destructive"
                        >
                          <Trash2 className="h-4 w-4 mr-2" />
                          Delete
                        </Button>
                      </div>
                    )}
                  </CardContent>
                </Card>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
}