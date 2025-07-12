from django.contrib import admin

# Register your models here.
from django.contrib import admin
from .models import Profile, Skill, UserSkill, SwapRequest, Feedback

admin.site.register(Profile)
admin.site.register(Skill)
admin.site.register(UserSkill)
admin.site.register(SwapRequest)
admin.site.register(Feedback)
