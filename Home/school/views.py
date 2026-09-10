from django.shortcuts import render
from django.http import HttpResponse


# Create your views here.
def index(request):
    return render(request, 'Home/index.html')
def add_student(request):
    return render(request, 'students/add-student.html')
def student_dashboard(request):
    return render(request, 'students/student-dashboard.html')
def edit_student(request):
    return render(request, 'students/edit-student.html')    
def students(request):
    return render(request, 'students/students.html')
def student_details(request):
    return render(request, 'students/student-details.html')
