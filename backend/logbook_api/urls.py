from django.urls import path, include
from rest_framework.routers import DefaultRouter
from . import views

router = DefaultRouter()
router.register(r'trips', views.TripViewSet, basename='trip')

urlpatterns = [
    path('calculate-trip/', views.calculate_trip, name='calculate_trip'),
    path('', include(router.urls)),
]