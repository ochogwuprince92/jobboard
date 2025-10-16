# 🚀 START HERE - Job Board Quick Start

## ✅ Current Status

**Both servers are running and ready!**

- 🟢 **Backend**: http://localhost:8000
- 🟢 **Frontend**: http://localhost:3000

---

## 🎯 What to Do Right Now

### 1. Open the Application
```
👉 Open your browser and go to: http://localhost:3000
```

### 2. Create Your First Account
1. Click **"Sign Up"** in the top right
2. Fill in your details:
   - First Name: Your name
   - Last Name: Your last name
   - Email: your@email.com
   - Phone: +1234567890
   - Password: (min 8 characters)
   - ☐ Check "I'm an employer" if you want to post jobs
3. Click **"Create Account"**

### 3. Login
1. Click **"Login"**
2. Enter your email and password
3. Click **"Login"**
4. You'll be redirected to the dashboard

### 4. Explore the Features

#### For Job Seekers:
- 📋 **Browse Jobs**: Click "Browse Jobs" in navigation
- 🤖 **AI Tools**: Click "AI Tools" to test resume parsing
- 📄 **Upload Resume**: Go to "My Resumes"
- 🔔 **Notifications**: Check your notifications

#### For Employers:
- ➕ **Post a Job**: Click "Post Job" in navigation
- 📊 **Dashboard**: View your posted jobs
- 👥 **Applicants**: See who applied

---

## 🔧 Quick Commands

### If Servers Stop

**Restart Backend**:
```bash
cd backend
source venv/bin/activate
python manage.py runserver
```

**Restart Frontend**:
```bash
cd frontend
npm run dev
```

### Create Admin User
```bash
cd backend
source venv/bin/activate
python manage.py createsuperuser
```
Then access admin at: http://localhost:8000/admin/

---

## 🎨 Try These Features

### 1. Test AI Resume Parser
1. Go to: http://localhost:3000/ai-tools
2. Paste this sample resume:
```
John Doe
john.doe@email.com
+1-555-0123

Senior Software Engineer with 7 years of experience.

Skills:
- Python, Django, Flask
- JavaScript, React, Node.js
- PostgreSQL, MongoDB
- AWS, Docker, Kubernetes

Education:
Bachelor of Science in Computer Science
Stanford University
```
3. Click "Parse Resume"
4. See the AI extract all information!

### 2. Explore Swagger API
1. Go to: http://localhost:8000/api/docs/
2. Browse all 50+ API endpoints
3. Click "Try it out" on any endpoint
4. Test the API interactively

### 3. Create a Job (Employer)
1. Register as an employer (check the box)
2. Login
3. Click "Post Job"
4. Fill in job details
5. Submit
6. View your job in the listings!

---

## 📚 Documentation

Quick links to all documentation:

1. **QUICKSTART.md** - 5-minute guide
2. **SWAGGER_GUIDE.md** - API documentation guide
3. **FEATURES.md** - All features explained
4. **TEST_REPORT.md** - Test results
5. **INTEGRATION_COMPLETE.md** - Technical details

---

## 🆘 Troubleshooting

### Frontend won't load?
```bash
cd frontend
rm -rf .next
npm run dev
```

### Backend errors?
```bash
cd backend
source venv/bin/activate
python manage.py migrate
python manage.py runserver
```

### Port already in use?
```bash
# Kill existing processes
pkill -f "python.*runserver"
pkill -f "next dev"

# Then restart
```

---

## 🎯 Key URLs

### Frontend
- **Home**: http://localhost:3000
- **Login**: http://localhost:3000/login
- **Register**: http://localhost:3000/register
- **Jobs**: http://localhost:3000/jobs
- **AI Tools**: http://localhost:3000/ai-tools
- **Dashboard**: http://localhost:3000/dashboard

### Backend
- **API Root**: http://localhost:8000/api/
- **Swagger UI**: http://localhost:8000/api/docs/
- **Admin Panel**: http://localhost:8000/admin/

---

## 💡 Pro Tips

1. **Use Swagger** for API testing - it's interactive!
2. **Check the console** if something doesn't work
3. **Use the AI tools** - they're really cool!
4. **Create multiple accounts** to test different roles
5. **Check the documentation** for detailed guides

---

## 🎉 You're All Set!

The application is **fully functional** and ready to use.

**Next Steps**:
1. ✅ Register an account
2. ✅ Explore the features
3. ✅ Test the AI tools
4. ✅ Create some jobs
5. ✅ Have fun!

---

**Need help?** Check the documentation files or the TEST_REPORT.md

**Happy coding!** 🚀
