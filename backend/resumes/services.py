class ResumeService:
    ALLOWED_EXTENSIONS = ["pdf", "docx"]

    @staticmethod
    def upload_resume(request):
        file = request.FILES.get("file")
        if not file:
            raise ValueError("No file uploaded.")
        
        ext = file.name.split(",")[-1].lower()
        if ext not in ResumeService.ALLOWED_EXTENSIONS:
            raise ValueError("Invalid file type. Only PDF or DOCX allowed")
        
        #Create resume linked to authenticated user
        from .models import Resume
        resume = Resume.objects.create(applicant=request.user, file=file)
        return resume