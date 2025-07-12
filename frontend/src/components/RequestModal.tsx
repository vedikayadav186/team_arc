import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { toast } from "@/hooks/use-toast";

interface RequestModalProps {
  isOpen: boolean;
  onClose: () => void;
  targetUser: {
    id: string;
    name: string;
    avatar?: string;
    skillsWanted: string[];
  };
  currentUser: {
    skillsOffered: string[];
  };
}

export function RequestModal({ isOpen, onClose, targetUser, currentUser }: RequestModalProps) {
  const [mySkill, setMySkill] = useState("");
  const [theirSkill, setTheirSkill] = useState("");
  const [message, setMessage] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async () => {
    if (!mySkill || !theirSkill || !message.trim()) {
      toast({
        title: "Missing Information",
        description: "Please fill in all fields before submitting.",
        variant: "destructive",
      });
      return;
    }

    setIsSubmitting(true);
    
    // Simulate API call
    setTimeout(() => {
      toast({
        title: "Request Sent!",
        description: `Your skill swap request has been sent to ${targetUser.name}.`,
      });
      
      setMySkill("");
      setTheirSkill("");
      setMessage("");
      setIsSubmitting(false);
      onClose();
    }, 1000);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-3">
            <Avatar className="h-10 w-10 avatar-professional">
              <AvatarImage src={targetUser.avatar} alt={targetUser.name} />
              <AvatarFallback className="bg-gradient-to-r from-primary to-primary-glow text-primary-foreground">
                {targetUser.name.split(' ').map(n => n[0]).join('').toUpperCase()}
              </AvatarFallback>
            </Avatar>
            <span>Request Skill Swap with {targetUser.name}</span>
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6 py-4">
          <div className="space-y-2">
            <Label htmlFor="my-skill">Your Skill to Offer</Label>
            <Select value={mySkill} onValueChange={setMySkill}>
              <SelectTrigger>
                <SelectValue placeholder="Choose one of your skills" />
              </SelectTrigger>
              <SelectContent>
                {currentUser.skillsOffered.map((skill) => (
                  <SelectItem key={skill} value={skill}>
                    <Badge className="skill-badge-offered">{skill}</Badge>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="their-skill">Skill You Want</Label>
            <Select value={theirSkill} onValueChange={setTheirSkill}>
              <SelectTrigger>
                <SelectValue placeholder="Choose their skill you want" />
              </SelectTrigger>
              <SelectContent>
                {targetUser.skillsWanted.map((skill) => (
                  <SelectItem key={skill} value={skill}>
                    <Badge className="skill-badge-wanted">{skill}</Badge>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="message">Message</Label>
            <Textarea
              id="message"
              placeholder="Tell them why you'd like to swap skills and suggest how you could help each other..."
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              className="min-h-[100px] resize-none"
            />
          </div>

          <div className="flex gap-3 pt-4">
            <Button
              variant="outline"
              onClick={onClose}
              className="flex-1"
              disabled={isSubmitting}
            >
              Cancel
            </Button>
            <Button
              onClick={handleSubmit}
              className="flex-1 btn-gradient"
              disabled={isSubmitting}
            >
              {isSubmitting ? "Sending..." : "Send Request"}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}