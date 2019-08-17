from django.urls import path
from . import views


urlpatterns = [
    path('user_messages/', views.UserMessageList.as_view()),
    path('user_messages/<uuid:pk>/', views.UserMessageDetail.as_view()),
]
