from django.contrib import admin
from django.urls import path
from . import views

urlpatterns = [
    path('add-student/', views.add_student, name='add-student'),
    path('student-dashboard/', views.student_dashboard, name='student-dashboard'),
    path('edit-student/', views.edit_student, name='edit-student'),
    path('students/', views.student_list, name='students'),
    path('student-details/', views.student_details, name='student-details'),
]