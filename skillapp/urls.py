from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import *

router = DefaultRouter()
router.register('profiles', ProfileViewSet)
router.register('skills', SkillViewSet)
router.register('user-skills', UserSkillViewSet)
router.register('swap-requests', SwapRequestViewSet)
router.register('feedbacks', FeedbackViewSet)

urlpatterns = [
    path('', include(router.urls)),
]
