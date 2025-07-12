import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Navbar } from "@/components/Navbar";
import { ConnectionsModal } from "@/components/ConnectionsModal";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { toast } from "@/hooks/use-toast";
import { User, MapPin, Eye, EyeOff, Plus, X, Upload, Save, RotateCcw, Users } from "lucide-react";

interface UserProfile {
  id: string;
  name: string;
  email: string;
  location: string;
  avatar?: string;
  skillsOffered: string[];
  skillsWanted: string[];
  availability: string;
  isPublic: boolean;
}

const availabilityOptions = [
  "Weekends",
  "Evenings", 
  "Weekdays",
  "Flexible",
  "Mornings",
  "Afternoons"
];

export default function Profile() {
  const navigate = useNavigate();
  const [user, setUser] = useState<UserProfile | null>(null);
  const [formData, setFormData] = useState<UserProfile | null>(null);
  const [newSkillOffered, setNewSkillOffered] = useState("");
  const [newSkillWanted, setNewSkillWanted] = useState("");
  const [hasChanges, setHasChanges] = useState(false);
  const [connectionsModalOpen, setConnectionsModalOpen] = useState(false);
  const [connectionCount] = useState(4); // Mock connection count

  useEffect(() => {
    const savedUser = localStorage.getItem('currentUser');
    if (!savedUser) {
      navigate('/login');
      return;
    }

    const userData = JSON.parse(savedUser);
    const fullUserData: UserProfile = {
      ...userData,
      location: userData.location || "San Francisco, CA",
      skillsOffered: userData.skillsOffered || ["React", "JavaScript", "Node.js"],
      skillsWanted: userData.skillsWanted || ["Python", "Data Science"],
      availability: userData.availability || "Evenings",
      isPublic: userData.isPublic !== undefined ? userData.isPublic : true
    };
    
    setUser(fullUserData);
    setFormData(fullUserData);
  }, [navigate]);

  useEffect(() => {
    if (user && formData) {
      const changes = JSON.stringify(user) !== JSON.stringify(formData);
      setHasChanges(changes);
    }
  }, [user, formData]);

  const handleInputChange = (field: keyof UserProfile, value: any) => {
    if (formData) {
      setFormData({ ...formData, [field]: value });
    }
  };

  const addSkill = (type: 'offered' | 'wanted') => {
    const skill = type === 'offered' ? newSkillOffered : newSkillWanted;
    if (!skill.trim() || !formData) return;

    const field = type === 'offered' ? 'skillsOffered' : 'skillsWanted';
    const currentSkills = formData[field];
    
    if (!currentSkills.includes(skill)) {
      handleInputChange(field, [...currentSkills, skill]);
    }
    
    if (type === 'offered') {
      setNewSkillOffered("");
    } else {
      setNewSkillWanted("");
    }
  };

  const removeSkill = (type: 'offered' | 'wanted', skillToRemove: string) => {
    if (!formData) return;
    
    const field = type === 'offered' ? 'skillsOffered' : 'skillsWanted';
    const currentSkills = formData[field];
    handleInputChange(field, currentSkills.filter(skill => skill !== skillToRemove));
  };

  const handleSave = () => {
    if (!formData) return;
    
    localStorage.setItem('currentUser', JSON.stringify(formData));
    setUser(formData);
    setHasChanges(false);
    
    toast({
      title: "Profile Updated",
      description: "Your profile has been saved successfully.",
    });
  };

  const handleDiscard = () => {
    if (user) {
      setFormData(user);
      setHasChanges(false);
      toast({
        title: "Changes Discarded",
        description: "All unsaved changes have been reverted.",
      });
    }
  };

  const handleChatClick = (userId: string) => {
    navigate('/chat');
  };

  if (!formData) {
    return null;
  }

  return (
    <div className="min-h-screen bg-background">
      <Navbar user={user} onProfileClick={() => {}} />
      
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-3xl mx-auto">
          <Card className="card-elevated">
            <CardHeader>
              <CardTitle className="flex items-center gap-3">
                <User className="h-6 w-6 text-primary" />
                Edit Profile
              </CardTitle>
              <p className="text-muted-foreground">
                Update your information and skills to connect with other professionals
              </p>
            </CardHeader>
            
            <CardContent className="space-y-8">
              {/* Connections Section */}
              <div className="flex items-center justify-between p-4 border border-border rounded-lg bg-muted/30">
                <div className="flex items-center gap-3">
                  <Users className="h-5 w-5 text-primary" />
                  <div>
                    <p className="font-medium">Connections</p>
                    <p className="text-sm text-muted-foreground">
                      People you're skill swapping with
                    </p>
                  </div>
                </div>
                <Button
                  variant="outline"
                  onClick={() => setConnectionsModalOpen(true)}
                  className="flex items-center gap-2"
                >
                  <span className="font-medium">{connectionCount}</span>
                  <span className="text-sm">View All</span>
                </Button>
              </div>

              {/* Profile Photo */}
              <div className="flex items-center gap-6">
                <Avatar className="h-24 w-24 avatar-professional">
                  <AvatarImage src={formData.avatar} alt={formData.name} />
                  <AvatarFallback className="bg-gradient-to-r from-primary to-primary-glow text-primary-foreground text-2xl">
                    {formData.name.split(' ').map(n => n[0]).join('').toUpperCase()}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <Button variant="outline" size="sm" className="mb-2">
                    <Upload className="h-4 w-4 mr-2" />
                    Upload Photo
                  </Button>
                  <p className="text-sm text-muted-foreground">
                    JPG, PNG up to 2MB
                  </p>
                </div>
              </div>

              {/* Basic Information */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="name">Full Name</Label>
                  <Input
                    id="name"
                    value={formData.name}
                    onChange={(e) => handleInputChange('name', e.target.value)}
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="location">Location (Optional)</Label>
                  <div className="relative">
                    <MapPin className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                    <Input
                      id="location"
                      placeholder="City, State"
                      value={formData.location}
                      onChange={(e) => handleInputChange('location', e.target.value)}
                      className="pl-10"
                    />
                  </div>
                </div>
              </div>

              {/* Skills Offered */}
              <div className="space-y-4">
                <Label>Skills I Can Offer</Label>
                <div className="flex flex-wrap gap-2 p-4 border border-border rounded-lg bg-muted/30">
                  {formData.skillsOffered.map((skill) => (
                    <Badge key={skill} className="skill-badge-offered group">
                      {skill}
                      <button
                        onClick={() => removeSkill('offered', skill)}
                        className="ml-2 opacity-0 group-hover:opacity-100 transition-opacity"
                      >
                        <X className="h-3 w-3" />
                      </button>
                    </Badge>
                  ))}
                </div>
                <div className="flex gap-2">
                  <Input
                    placeholder="Add a skill you can teach..."
                    value={newSkillOffered}
                    onChange={(e) => setNewSkillOffered(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && addSkill('offered')}
                  />
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => addSkill('offered')}
                  >
                    <Plus className="h-4 w-4" />
                  </Button>
                </div>
              </div>

              {/* Skills Wanted */}
              <div className="space-y-4">
                <Label>Skills I Want to Learn</Label>
                <div className="flex flex-wrap gap-2 p-4 border border-border rounded-lg bg-muted/30">
                  {formData.skillsWanted.map((skill) => (
                    <Badge key={skill} variant="outline" className="skill-badge-wanted group">
                      {skill}
                      <button
                        onClick={() => removeSkill('wanted', skill)}
                        className="ml-2 opacity-0 group-hover:opacity-100 transition-opacity"
                      >
                        <X className="h-3 w-3" />
                      </button>
                    </Badge>
                  ))}
                </div>
                <div className="flex gap-2">
                  <Input
                    placeholder="Add a skill you want to learn..."
                    value={newSkillWanted}
                    onChange={(e) => setNewSkillWanted(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && addSkill('wanted')}
                  />
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => addSkill('wanted')}
                  >
                    <Plus className="h-4 w-4" />
                  </Button>
                </div>
              </div>

              {/* Availability */}
              <div className="space-y-2">
                <Label htmlFor="availability">Availability</Label>
                <Select
                  value={formData.availability}
                  onValueChange={(value) => handleInputChange('availability', value)}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {availabilityOptions.map((option) => (
                      <SelectItem key={option} value={option}>
                        {option}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Profile Visibility */}
              <div className="flex items-center justify-between p-4 border border-border rounded-lg">
                <div className="flex items-center gap-3">
                  {formData.isPublic ? (
                    <Eye className="h-5 w-5 text-primary" />
                  ) : (
                    <EyeOff className="h-5 w-5 text-muted-foreground" />
                  )}
                  <div>
                    <p className="font-medium">Public Profile</p>
                    <p className="text-sm text-muted-foreground">
                      Allow others to discover and contact you
                    </p>
                  </div>
                </div>
                <Switch
                  checked={formData.isPublic}
                  onCheckedChange={(checked) => handleInputChange('isPublic', checked)}
                />
              </div>

              {/* Action Buttons */}
              <div className="flex gap-4 pt-6 border-t border-border">
                <Button
                  onClick={handleSave}
                  disabled={!hasChanges}
                  className="flex-1 btn-gradient"
                >
                  <Save className="h-4 w-4 mr-2" />
                  Save Changes
                </Button>
                <Button
                  variant="outline"
                  onClick={handleDiscard}
                  disabled={!hasChanges}
                  className="flex-1"
                >
                  <RotateCcw className="h-4 w-4 mr-2" />
                  Discard Changes
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Connections Modal */}
      <ConnectionsModal
        isOpen={connectionsModalOpen}
        onClose={() => setConnectionsModalOpen(false)}
        connections={[]}
        onChatClick={handleChatClick}
      />
    </div>
  );
}