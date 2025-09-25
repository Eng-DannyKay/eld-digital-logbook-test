from django.urls import path
from .views import hello_world   # import your view

urlpatterns = [
    path("hello/", hello_world, name="hello"),
]
