import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { Navbar } from "@/components/Navbar";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Send, MessageSquare } from "lucide-react";

interface Message {
  id: string;
  senderId: string;
  text: string;
  timestamp: Date;
}

interface ChatUser {
  id: string;
  name: string;
  avatar?: string;
  lastMessage?: string;
  lastMessageTime?: Date;
  isOnline?: boolean;
}

// Mock data for connected users
const mockConnectedUsers: ChatUser[] = [
  {
    id: "2",
    name: "Michael Chen",
    avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150",
    lastMessage: "Great! Looking forward to our React session.",
    lastMessageTime: new Date(Date.now() - 2 * 60 * 1000), // 2 minutes ago
    isOnline: true
  },
  {
    id: "3",
    name: "Emily Rodriguez",
    avatar: "https://images.unsplash.com/photo-1494790108755-2616b612b47c?w=150",
    lastMessage: "Thanks for the design tips!",
    lastMessageTime: new Date(Date.now() - 30 * 60 * 1000), // 30 minutes ago
    isOnline: false
  },
  {
    id: "5",
    name: "Lisa Zhang",
    avatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150",
    lastMessage: "The marketing strategy looks good.",
    lastMessageTime: new Date(Date.now() - 2 * 60 * 60 * 1000), // 2 hours ago
    isOnline: true
  }
];

// Mock messages for demo
const mockMessages: Record<string, Message[]> = {
  "2": [
    {
      id: "1",
      senderId: "current",
      text: "Hi Michael! I'm ready to help you with React. When would be a good time to start?",
      timestamp: new Date(Date.now() - 10 * 60 * 1000)
    },
    {
      id: "2",
      senderId: "2",
      text: "Perfect! How about we start with components and props? I have some time this evening.",
      timestamp: new Date(Date.now() - 8 * 60 * 1000)
    },
    {
      id: "3",
      senderId: "current",
      text: "That sounds great! I'll prepare some examples. Are you free around 7 PM?",
      timestamp: new Date(Date.now() - 5 * 60 * 1000)
    },
    {
      id: "4",
      senderId: "2",
      text: "Great! Looking forward to our React session.",
      timestamp: new Date(Date.now() - 2 * 60 * 1000)
    }
  ],
  "3": [
    {
      id: "1",
      senderId: "3",
      text: "Hi! I saw your portfolio and I love your design work. Could you give me some feedback on my current project?",
      timestamp: new Date(Date.now() - 60 * 60 * 1000)
    },
    {
      id: "2",
      senderId: "current",
      text: "Of course! I'd be happy to help. Can you share some screenshots or a link?",
      timestamp: new Date(Date.now() - 45 * 60 * 1000)
    },
    {
      id: "3",
      senderId: "3",
      text: "Thanks for the design tips!",
      timestamp: new Date(Date.now() - 30 * 60 * 1000)
    }
  ]
};

export default function Chat() {
  const navigate = useNavigate();
  const [currentUser, setCurrentUser] = useState<any>(null);
  const [selectedUser, setSelectedUser] = useState<ChatUser | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState("");
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const savedUser = localStorage.getItem('currentUser');
    if (!savedUser) {
      navigate('/login');
      return;
    }
    setCurrentUser(JSON.parse(savedUser));
    
    // Select first user by default
    if (mockConnectedUsers.length > 0) {
      handleUserSelect(mockConnectedUsers[0]);
    }
  }, [navigate]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleUserSelect = (user: ChatUser) => {
    setSelectedUser(user);
    setMessages(mockMessages[user.id] || []);
  };

  const handleSendMessage = () => {
    if (!newMessage.trim() || !selectedUser) return;

    const message: Message = {
      id: Date.now().toString(),
      senderId: "current",
      text: newMessage,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, message]);
    setNewMessage("");
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  const formatLastMessageTime = (date: Date) => {
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMins / 60);
    const diffDays = Math.floor(diffHours / 24);

    if (diffMins < 1) return "now";
    if (diffMins < 60) return `${diffMins}m`;
    if (diffHours < 24) return `${diffHours}h`;
    return `${diffDays}d`;
  };

  if (!currentUser) {
    return null;
  }

  return (
    <div className="min-h-screen bg-background">
      <Navbar user={currentUser} onProfileClick={() => navigate('/profile')} />
      
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-7xl mx-auto">
          <div className="mb-6">
            <h1 className="text-3xl font-bold mb-2">
              <span className="bg-gradient-to-r from-primary to-primary-glow bg-clip-text text-transparent">
                Chat with Connections
              </span>
            </h1>
            <p className="text-muted-foreground">
              Communicate with your skill swap partners
            </p>
          </div>

          <div className="grid lg:grid-cols-4 gap-6 h-[600px]">
            {/* User List Sidebar */}
            <Card className="lg:col-span-1 card-elevated">
              <CardHeader className="pb-3">
                <h3 className="font-semibold flex items-center gap-2">
                  <MessageSquare className="h-5 w-5 text-primary" />
                  Connections ({mockConnectedUsers.length})
                </h3>
              </CardHeader>
              <CardContent className="p-0">
                <ScrollArea className="h-[500px]">
                  {mockConnectedUsers.map((user) => (
                    <div
                      key={user.id}
                      onClick={() => handleUserSelect(user)}
                      className={`p-4 cursor-pointer border-b border-border hover:bg-muted/50 transition-colors ${
                        selectedUser?.id === user.id ? 'bg-primary/10 border-primary/20' : ''
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <div className="relative">
                          <Avatar className="h-12 w-12 avatar-professional">
                            <AvatarImage src={user.avatar} alt={user.name} />
                            <AvatarFallback className="bg-gradient-to-r from-primary to-primary-glow text-primary-foreground">
                              {user.name.split(' ').map(n => n[0]).join('').toUpperCase()}
                            </AvatarFallback>
                          </Avatar>
                          {user.isOnline && (
                            <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-green-500 rounded-full border-2 border-background"></div>
                          )}
                        </div>
                        
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center justify-between">
                            <h4 className="font-medium text-sm truncate">{user.name}</h4>
                            {user.lastMessageTime && (
                              <span className="text-xs text-muted-foreground">
                                {formatLastMessageTime(user.lastMessageTime)}
                              </span>
                            )}
                          </div>
                          {user.lastMessage && (
                            <p className="text-xs text-muted-foreground truncate mt-1">
                              {user.lastMessage}
                            </p>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </ScrollArea>
              </CardContent>
            </Card>

            {/* Chat Area */}
            <Card className="lg:col-span-3 card-elevated flex flex-col">
              {selectedUser ? (
                <>
                  {/* Chat Header */}
                  <CardHeader className="border-b border-border">
                    <div className="flex items-center gap-3">
                      <div className="relative">
                        <Avatar className="h-12 w-12 avatar-professional">
                          <AvatarImage src={selectedUser.avatar} alt={selectedUser.name} />
                          <AvatarFallback className="bg-gradient-to-r from-primary to-primary-glow text-primary-foreground">
                            {selectedUser.name.split(' ').map(n => n[0]).join('').toUpperCase()}
                          </AvatarFallback>
                        </Avatar>
                        {selectedUser.isOnline && (
                          <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-green-500 rounded-full border-2 border-background"></div>
                        )}
                      </div>
                      <div>
                        <h3 className="font-semibold">{selectedUser.name}</h3>
                        <p className="text-sm text-muted-foreground">
                          {selectedUser.isOnline ? 'Online' : 'Offline'}
                        </p>
                      </div>
                    </div>
                  </CardHeader>

                  {/* Messages */}
                  <CardContent className="flex-1 p-0">
                    <ScrollArea className="h-[400px] p-4">
                      <div className="space-y-4">
                        {messages.map((message) => (
                          <div
                            key={message.id}
                            className={`flex ${message.senderId === 'current' ? 'justify-end' : 'justify-start'}`}
                          >
                            <div
                              className={`max-w-[70%] p-3 rounded-lg ${
                                message.senderId === 'current'
                                  ? 'bg-primary text-primary-foreground'
                                  : 'bg-muted'
                              }`}
                            >
                              <p className="text-sm">{message.text}</p>
                              <p className={`text-xs mt-1 ${
                                message.senderId === 'current' 
                                  ? 'text-primary-foreground/70' 
                                  : 'text-muted-foreground'
                              }`}>
                                {formatTime(message.timestamp)}
                              </p>
                            </div>
                          </div>
                        ))}
                        <div ref={messagesEndRef} />
                      </div>
                    </ScrollArea>
                  </CardContent>

                  {/* Message Input */}
                  <div className="p-4 border-t border-border">
                    <div className="flex gap-2">
                      <Input
                        placeholder="Type your message..."
                        value={newMessage}
                        onChange={(e) => setNewMessage(e.target.value)}
                        onKeyPress={handleKeyPress}
                        className="flex-1"
                      />
                      <Button
                        onClick={handleSendMessage}
                        disabled={!newMessage.trim()}
                        className="btn-gradient"
                      >
                        <Send className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </>
              ) : (
                <CardContent className="flex-1 flex items-center justify-center">
                  <div className="text-center">
                    <MessageSquare className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                    <h3 className="font-semibold mb-2">Select a conversation</h3>
                    <p className="text-muted-foreground">
                      Choose a connection from the sidebar to start chatting
                    </p>
                  </div>
                </CardContent>
              )}
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}