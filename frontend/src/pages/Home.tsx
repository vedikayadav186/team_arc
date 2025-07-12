import { useState, useMemo } from "react";
import { Navbar } from "@/components/Navbar";
import { UserCard } from "@/components/UserCard";
import { RequestModal } from "@/components/RequestModal";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Search, Filter } from "lucide-react";
import { useNavigate } from "react-router-dom";

// Mock data
const mockUsers = [
  {
    id: "1",
    name: "Sarah Johnson",
    location: "San Francisco, CA",
    avatar: "https://images.unsplash.com/photo-1494790108755-2616b612b47c?w=150",
    skillsOffered: ["React", "TypeScript", "UI/UX Design"],
    skillsWanted: ["Python", "Data Analysis"],
    availability: "Weekends",
    rating: 4.8,
    reviewCount: 24
  },
  {
    id: "2", 
    name: "Michael Chen",
    location: "New York, NY",
    skillsOffered: ["Python", "Machine Learning", "Data Science"],
    skillsWanted: ["React", "Frontend Development"],
    availability: "Evenings",
    rating: 4.9,
    reviewCount: 31
  },
  {
    id: "3",
    name: "Emily Rodriguez",
    location: "Austin, TX",
    skillsOffered: ["Graphic Design", "Photoshop", "Illustrator"],
    skillsWanted: ["Web Development", "CSS"],
    availability: "Flexible",
    rating: 4.7,
    reviewCount: 18
  },
  {
    id: "4",
    name: "David Kumar",
    location: "Seattle, WA", 
    skillsOffered: ["Node.js", "Database Design", "DevOps"],
    skillsWanted: ["Mobile Development", "Swift"],
    availability: "Weekends",
    rating: 4.6,
    reviewCount: 22
  },
  {
    id: "5",
    name: "Lisa Zhang",
    location: "Los Angeles, CA",
    skillsOffered: ["Digital Marketing", "SEO", "Content Strategy"],
    skillsWanted: ["Video Editing", "Animation"],
    availability: "Evenings",
    rating: 4.9,
    reviewCount: 35
  },
  {
    id: "6",
    name: "Alex Thompson",
    location: "Chicago, IL",
    skillsOffered: ["Photography", "Video Production", "Adobe Premiere"],
    skillsWanted: ["Business Strategy", "Project Management"],
    availability: "Flexible",
    rating: 4.5,
    reviewCount: 27
  }
];

const mockCurrentUser = {
  id: "current",
  name: "John Doe",
  avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150",
  skillsOffered: ["React", "JavaScript", "Node.js", "Project Management"]
};

export default function Home() {
  const navigate = useNavigate();
  const [currentUser, setCurrentUser] = useState<typeof mockCurrentUser | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [availabilityFilter, setAvailabilityFilter] = useState("all");
  const [currentPage, setCurrentPage] = useState(1);
  const [requestModalOpen, setRequestModalOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState<typeof mockUsers[0] | null>(null);
  
  const itemsPerPage = 6;

  // Load user from localStorage on component mount
  useState(() => {
    const savedUser = localStorage.getItem('currentUser');
    if (savedUser) {
      setCurrentUser(JSON.parse(savedUser));
    }
  });

  const filteredUsers = useMemo(() => {
    return mockUsers.filter(user => {
      const matchesSearch = searchTerm === "" || 
        user.skillsOffered.some(skill => skill.toLowerCase().includes(searchTerm.toLowerCase())) ||
        user.skillsWanted.some(skill => skill.toLowerCase().includes(searchTerm.toLowerCase())) ||
        user.name.toLowerCase().includes(searchTerm.toLowerCase());
      
      const matchesAvailability = availabilityFilter === "all" || user.availability.toLowerCase() === availabilityFilter.toLowerCase();
      
      return matchesSearch && matchesAvailability;
    });
  }, [searchTerm, availabilityFilter]);

  const totalPages = Math.ceil(filteredUsers.length / itemsPerPage);
  const paginatedUsers = filteredUsers.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

  const handleRequestClick = (userId: string) => {
    const user = mockUsers.find(u => u.id === userId);
    if (user && currentUser) {
      setSelectedUser(user);
      setRequestModalOpen(true);
    }
  };

  const handleProfileClick = (userId: string) => {
    navigate(`/profile/${userId}`);
  };

  const handleUserProfileClick = () => {
    if (currentUser) {
      navigate('/profile');
    } else {
      navigate('/login');
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar user={currentUser} onProfileClick={handleUserProfileClick} />
      
      <div className="container mx-auto px-4 py-8">
        {/* Hero Section */}
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">
            <span className="bg-gradient-to-r from-primary to-primary-glow bg-clip-text text-transparent">
              Exchange Skills,
            </span>
            <br />
            <span className="text-foreground">Grow Together</span>
          </h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Connect with professionals in your area and trade skills. Learn something new while sharing your expertise.
          </p>
        </div>

        {/* Filters */}
        <div className="flex flex-col md:flex-row gap-4 mb-8">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search by skill or name..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
          
          <div className="flex items-center gap-2">
            <Filter className="h-4 w-4 text-muted-foreground" />
            <Select value={availabilityFilter} onValueChange={setAvailabilityFilter}>
              <SelectTrigger className="w-48">
                <SelectValue placeholder="Filter by availability" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Availability</SelectItem>
                <SelectItem value="weekends">Weekends</SelectItem>
                <SelectItem value="evenings">Evenings</SelectItem>
                <SelectItem value="flexible">Flexible</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Results count */}
        <div className="mb-6">
          <p className="text-muted-foreground">
            Showing {paginatedUsers.length} of {filteredUsers.length} professionals
          </p>
        </div>

        {/* User Cards List */}
        <div className="space-y-4 mb-8">
          {paginatedUsers.map((user) => (
            <UserCard
              key={user.id}
              user={user}
              isLoggedIn={!!currentUser}
              onRequestClick={handleRequestClick}
              onProfileClick={handleProfileClick}
              layout="list"
            />
          ))}
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex justify-center gap-2">
            <Button
              variant="outline"
              onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
              disabled={currentPage === 1}
            >
              Previous
            </Button>
            
            {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
              <Button
                key={page}
                variant={currentPage === page ? "default" : "outline"}
                onClick={() => setCurrentPage(page)}
                className={currentPage === page ? "btn-gradient" : ""}
              >
                {page}
              </Button>
            ))}
            
            <Button
              variant="outline"
              onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
              disabled={currentPage === totalPages}
            >
              Next
            </Button>
          </div>
        )}
      </div>

      {/* Request Modal */}
      {selectedUser && currentUser && (
        <RequestModal
          isOpen={requestModalOpen}
          onClose={() => setRequestModalOpen(false)}
          targetUser={selectedUser}
          currentUser={currentUser}
        />
      )}
    </div>
  );
}