from django.db import models
from django.contrib.auth.models import User

class Profile(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE)
    location = models.CharField(max_length=100, blank=True)
    profile_photo = models.ImageField(upload_to='profile_photos/', blank=True, null=True)
    availability = models.CharField(max_length=100, blank=True)
    is_public = models.BooleanField(default=True)

    def __str__(self):
        return self.user.username

class Skill(models.Model):
    name = models.CharField(max_length=100, unique=True)

    def __str__(self):
        return self.name

class UserSkill(models.Model):
    SKILL_TYPE_CHOICES = [
        ('OFFERED', 'Offered'),
        ('WANTED', 'Wanted'),
    ]
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    skill = models.ForeignKey(Skill, on_delete=models.CASCADE)
    skill_type = models.CharField(max_length=7, choices=SKILL_TYPE_CHOICES)

    class Meta:
        unique_together = ('user', 'skill', 'skill_type')

    def __str__(self):
        return f"{self.user.username} - {self.get_skill_type_display()} - {self.skill.name}"

class SwapRequest(models.Model):
    STATUS_CHOICES = [
        ('PENDING', 'Pending'),
        ('ACCEPTED', 'Accepted'),
        ('REJECTED', 'Rejected'),
        ('CANCELLED', 'Cancelled'),
    ]
    requester = models.ForeignKey(User, related_name='sent_requests', on_delete=models.CASCADE)
    receiver = models.ForeignKey(User, related_name='received_requests', on_delete=models.CASCADE)
    offered_skill = models.ForeignKey(Skill, related_name='offered_swaps', on_delete=models.CASCADE)
    requested_skill = models.ForeignKey(Skill, related_name='requested_swaps', on_delete=models.CASCADE)
    status = models.CharField(max_length=10, choices=STATUS_CHOICES, default='PENDING')
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.requester.username} → {self.receiver.username} ({self.status})"

class Feedback(models.Model):
    swap_request = models.OneToOneField(SwapRequest, on_delete=models.CASCADE)
    rating = models.PositiveSmallIntegerField()
    comment = models.TextField(blank=True)

    def __str__(self):
        return f"Feedback for {self.swap_request}"
