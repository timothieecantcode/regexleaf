from django.urls import path
from . import views

urlpatterns = [
    path("transform/", views.transform, name="transform"),
]
