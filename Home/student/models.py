from django.db import models

# Create your models here.
class Parent(models.Model):
    father_name = models.CharField(max_length=100)
    father_occupation = models.CharField(max_length=100)
    father_mobile = models.CharField(max_length=15)
    father_email = models.EmailField(max_length=100)
    mother_name = models.CharField(max_length=100)
    mother_occupation = models.CharField(max_length=100)
    mother_mobile = models.CharField(max_length=15)
    mother_email = models.EmailField(max_length=100)
    present_address = models.TextField()
    permanent_address = models.TextField()

    def __str__(self):
        return f"{self.father_name} & {self.mother_name}"

class Student(models.Model):
    first_name = models.CharField(max_length=100)
    last_name = models.CharField(max_length=100)
    student_id = models.CharField(max_length=20, unique=True)
    date_of_birth = models.DateField()
    gender = models.CharField(max_length=10, choices=[('Male', 'Male'), ('Female', 'Female'), ('Other', 'Other')])
    email = models.EmailField(max_length=100)   
    student_class = models.CharField(max_length=20)
    religion = models.CharField(max_length=50)
    joining_date = models.DateField()
    mobile_number = models.CharField(max_length=15)
    admission_number = models.CharField(max_length=20, unique=True)
    section = models.CharField(max_length=10)
    student_image = models.ImageField(upload_to='student/', null=True, blank=True)
    parent = models.OneToOneField(Parent, on_delete=models.CASCADE)
    slug = models.SlugField(unique=True, null=True, blank=True)
    
    
    def save(self, *args, **kwargs):
        if not self.slug:
            self.slug = f"{self.first_name.lower()}-{self.last_name.lower()}-{self.student_id}" 
        super(Student, self).save(*args, **kwargs)  


    def __str__(self):
        return f"{self.first_name} {self.last_name} ({self.student_id})"