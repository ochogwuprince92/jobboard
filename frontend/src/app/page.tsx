"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { 
  FiSearch, FiMapPin, FiBriefcase, FiClock, 
  FiDollarSign, FiArrowRight, FiTrendingUp,
  FiUsers, FiAward, FiGithub, FiTwitter, FiLinkedin
} from "react-icons/fi";

// Animation variants
const fadeInUp = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 }
};

const staggerContainer = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1
    }
  }
};

// Sample job data
const featuredJobs = [
  {
    id: 1,
    title: "Senior Frontend Developer",
    company: "TechCorp Inc.",
    location: "Remote",
    type: "Full-time",
    salary: "$120k - $150k",
    tags: ["React", "TypeScript", "Next.js"],
    logo: "💻",
    posted: "2 days ago"
  },
  {
    id: 2,
    title: "Product Designer",
    company: "Design Studio",
    location: "New York, NY",
    type: "Full-time",
    salary: "$90k - $120k",
    tags: ["Figma", "UI/UX", "Prototyping"],
    logo: "🎨",
    posted: "1 week ago"
  },
  {
    id: 3,
    title: "Backend Engineer",
    company: "CloudTech Solutions",
    location: "San Francisco, CA",
    type: "Remote",
    salary: "$130k - $170k",
    tags: ["Python", "Django", "AWS"],
    logo: "☁️",
    posted: "3 days ago"
  },
  {
    id: 4,
    title: "Data Scientist",
    company: "AI Innovations",
    location: "Boston, MA",
    type: "Full-time",
    salary: "$110k - $140k",
    tags: ["Python", "ML", "TensorFlow"],
    logo: "🤖",
    posted: "5 days ago"
  },
  {
    id: 5,
    title: "DevOps Engineer",
    company: "Infrastructure Co.",
    location: "Remote",
    type: "Contract",
    salary: "$100k - $130k",
    tags: ["Kubernetes", "Docker", "CI/CD"],
    logo: "⚙️",
    posted: "1 day ago"
  },
  {
    id: 6,
    title: "Mobile Developer",
    company: "AppMakers Ltd.",
    location: "Austin, TX",
    type: "Full-time",
    salary: "$95k - $125k",
    tags: ["React Native", "iOS", "Android"],
    logo: "📱",
    posted: "4 days ago"
  }
];

export default function HomePage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [location, setLocation] = useState("");

  return (
    <div className="min-h-screen">
      {/* Navigation */}
      <nav className="sticky top-0 z-50 bg-white/80 backdrop-blur-lg border-b border-grass-200 shadow-soft">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            {/* Logo */}
            <motion.div 
              className="flex items-center space-x-2"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5 }}
            >
              <div className="w-10 h-10 bg-gradient-to-br from-grass-400 to-mint-500 rounded-xl flex items-center justify-center text-white font-bold text-xl shadow-grass">
                🌱
              </div>
              <span className="text-2xl font-display font-bold bg-gradient-to-r from-grass-600 to-mint-600 bg-clip-text text-transparent">
                GreenJobs
              </span>
            </motion.div>

            {/* Nav Links */}
            <div className="hidden md:flex items-center space-x-8">
              <a href="#jobs" className="text-gray-700 hover:text-grass-600 font-medium transition-colors duration-200">
                Jobs
              </a>
              <a href="#companies" className="text-gray-700 hover:text-grass-600 font-medium transition-colors duration-200">
                Companies
              </a>
              <a href="#about" className="text-gray-700 hover:text-grass-600 font-medium transition-colors duration-200">
                About
              </a>
              <button className="px-6 py-2 text-grass-700 border-2 border-grass-500 rounded-full font-semibold hover:bg-grass-50 transition-all duration-200">
                Login
              </button>
              <button className="px-6 py-2 bg-gradient-to-r from-grass-500 to-mint-500 text-white rounded-full font-semibold hover:shadow-grass-lg transform hover:-translate-y-0.5 transition-all duration-200">
                Sign Up
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-hybrid py-20 px-4">
        {/* Decorative elements */}
        <div className="absolute top-20 left-10 w-72 h-72 bg-grass-200 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-float"></div>
        <div className="absolute top-40 right-10 w-72 h-72 bg-mint-200 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-float" style={{ animationDelay: '1s' }}></div>
        <div className="absolute -bottom-8 left-1/2 w-72 h-72 bg-lime-200 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-float" style={{ animationDelay: '2s' }}></div>

        <div className="relative max-w-6xl mx-auto text-center">
          <motion.div
            initial="hidden"
            animate="visible"
            variants={staggerContainer}
          >
            <motion.h1 
              variants={fadeInUp}
              className="text-5xl md:text-7xl font-display font-bold text-gray-900 mb-6"
            >
              Find Your Dream Job
              <span className="block mt-2 bg-gradient-to-r from-grass-600 via-mint-600 to-lime-600 bg-clip-text text-transparent">
                In Nature's Way
              </span>
            </motion.h1>

            <motion.p 
              variants={fadeInUp}
              className="text-xl md:text-2xl text-gray-600 mb-12 max-w-3xl mx-auto"
            >
              Discover opportunities that grow with you. Fresh jobs, green careers, sustainable future.
            </motion.p>

            {/* Search Bar */}
            <motion.div 
              variants={fadeInUp}
              className="max-w-4xl mx-auto"
            >
              <div className="bg-white rounded-2xl shadow-grass-lg p-3 flex flex-col md:flex-row gap-3">
                {/* Job Search Input */}
                <div className="flex-1 flex items-center px-4 py-3 bg-grass-50 rounded-xl border-2 border-transparent focus-within:border-grass-400 transition-colors">
                  <FiSearch className="text-grass-600 text-xl mr-3" />
                  <input
                    type="text"
                    placeholder="Search jobs by company, industry, title..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="flex-1 bg-transparent outline-none text-gray-700 placeholder-gray-400"
                  />
                </div>

                {/* Location Input */}
                <div className="flex-1 flex items-center px-4 py-3 bg-grass-50 rounded-xl border-2 border-transparent focus-within:border-grass-400 transition-colors">
                  <FiMapPin className="text-grass-600 text-xl mr-3" />
                  <input
                    type="text"
                    placeholder="Location"
                    value={location}
                    onChange={(e) => setLocation(e.target.value)}
                    className="flex-1 bg-transparent outline-none text-gray-700 placeholder-gray-400"
                  />
                </div>

                {/* Search Button */}
                <button className="px-8 py-4 bg-gradient-to-r from-grass-500 to-mint-500 text-white rounded-xl font-semibold hover:shadow-grass-lg transform hover:-translate-y-0.5 transition-all duration-200 flex items-center justify-center gap-2">
                  <span>Find Jobs</span>
                  <FiArrowRight className="text-xl" />
                </button>
              </div>

              {/* Popular Searches */}
              <div className="mt-6 flex flex-wrap justify-center gap-2">
                <span className="text-gray-600 text-sm">Popular:</span>
                {["Remote", "Full-time", "Design", "Engineering", "Marketing"].map((tag) => (
                  <button
                    key={tag}
                    className="px-4 py-1.5 bg-white text-grass-700 rounded-full text-sm font-medium hover:bg-grass-50 hover:shadow-soft transition-all duration-200"
                  >
                    {tag}
                  </button>
                ))}
              </div>
            </motion.div>

            {/* Stats */}
            <motion.div 
              variants={fadeInUp}
              className="mt-16 grid grid-cols-2 md:grid-cols-4 gap-8 max-w-4xl mx-auto"
            >
              {[
                { icon: FiBriefcase, label: "Active Jobs", value: "12,000+" },
                { icon: FiUsers, label: "Companies", value: "5,000+" },
                { icon: FiTrendingUp, label: "Success Rate", value: "95%" },
                { icon: FiAward, label: "Happy Users", value: "50,000+" }
              ].map((stat, index) => (
                <div key={index} className="text-center">
                  <div className="inline-flex items-center justify-center w-12 h-12 bg-white rounded-xl shadow-soft mb-3">
                    <stat.icon className="text-grass-600 text-2xl" />
                  </div>
                  <div className="text-2xl md:text-3xl font-bold text-gray-900">{stat.value}</div>
                  <div className="text-gray-600 text-sm">{stat.label}</div>
                </div>
              ))}
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Featured Jobs Section */}
      <section id="jobs" className="py-20 px-4 bg-white">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center mb-12"
          >
            <h2 className="text-4xl md:text-5xl font-display font-bold text-gray-900 mb-4">
              Featured <span className="bg-gradient-to-r from-grass-600 to-mint-600 bg-clip-text text-transparent">Opportunities</span>
            </h2>
            <p className="text-xl text-gray-600">
              Hand-picked jobs from top companies
            </p>
          </motion.div>

          {/* Job Cards Grid */}
          <motion.div 
            variants={staggerContainer}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
          >
            {featuredJobs.map((job, index) => (
              <motion.div
                key={job.id}
                variants={fadeInUp}
                whileHover={{ y: -8, transition: { duration: 0.2 } }}
                className="group bg-gradient-to-br from-white to-grass-50 rounded-2xl p-6 border-2 border-grass-100 hover:border-grass-300 hover:shadow-grass-lg transition-all duration-300 cursor-pointer"
              >
                {/* Company Logo & Posted Time */}
                <div className="flex justify-between items-start mb-4">
                  <div className="w-14 h-14 bg-gradient-to-br from-grass-400 to-mint-500 rounded-xl flex items-center justify-center text-3xl shadow-grass">
                    {job.logo}
                  </div>
                  <span className="text-xs text-gray-500 bg-white px-3 py-1 rounded-full">
                    {job.posted}
                  </span>
                </div>

                {/* Job Title */}
                <h3 className="text-xl font-bold text-gray-900 mb-2 group-hover:text-grass-700 transition-colors">
                  {job.title}
                </h3>

                {/* Company Name */}
                <p className="text-gray-600 mb-4 flex items-center gap-2">
                  <FiBriefcase className="text-grass-500" />
                  {job.company}
                </p>

                {/* Job Details */}
                <div className="space-y-2 mb-4">
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <FiMapPin className="text-grass-500" />
                    {job.location}
                  </div>
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <FiClock className="text-grass-500" />
                    {job.type}
                  </div>
                  <div className="flex items-center gap-2 text-sm font-semibold text-grass-700">
                    <FiDollarSign className="text-grass-500" />
                    {job.salary}
                  </div>
                </div>

                {/* Tags */}
                <div className="flex flex-wrap gap-2 mb-4">
                  {job.tags.map((tag, i) => (
                    <span
                      key={i}
                      className="px-3 py-1 bg-grass-100 text-grass-700 rounded-full text-xs font-medium"
                    >
                      {tag}
                    </span>
                  ))}
                </div>

                {/* Apply Button */}
                <button className="w-full py-3 bg-gradient-to-r from-grass-500 to-mint-500 text-white rounded-xl font-semibold hover:shadow-grass transform group-hover:-translate-y-1 transition-all duration-200 flex items-center justify-center gap-2">
                  <span>Apply Now</span>
                  <FiArrowRight className="text-lg group-hover:translate-x-1 transition-transform" />
                </button>
              </motion.div>
            ))}
          </motion.div>

          {/* View All Jobs Button */}
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="text-center mt-12"
          >
            <button className="px-8 py-4 bg-white text-grass-700 border-2 border-grass-500 rounded-full font-semibold hover:bg-grass-50 hover:shadow-grass transition-all duration-200">
              View All Jobs
            </button>
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gradient-to-br from-grass-900 to-mint-900 text-white py-12 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
            {/* Brand */}
            <div className="col-span-1 md:col-span-2">
              <div className="flex items-center space-x-2 mb-4">
                <div className="w-10 h-10 bg-gradient-to-br from-grass-400 to-mint-500 rounded-xl flex items-center justify-center text-white font-bold text-xl">
                  🌱
                </div>
                <span className="text-2xl font-display font-bold">GreenJobs</span>
              </div>
              <p className="text-grass-200 mb-4 max-w-md">
                Connecting talented professionals with opportunities that matter. 
                Building careers, one green step at a time.
              </p>
              <div className="flex gap-4">
                <a href="#" className="w-10 h-10 bg-grass-800 hover:bg-grass-700 rounded-full flex items-center justify-center transition-colors">
                  <FiGithub className="text-xl" />
                </a>
                <a href="#" className="w-10 h-10 bg-grass-800 hover:bg-grass-700 rounded-full flex items-center justify-center transition-colors">
                  <FiTwitter className="text-xl" />
                </a>
                <a href="#" className="w-10 h-10 bg-grass-800 hover:bg-grass-700 rounded-full flex items-center justify-center transition-colors">
                  <FiLinkedin className="text-xl" />
                </a>
              </div>
            </div>

            {/* Quick Links */}
            <div>
              <h4 className="font-semibold text-lg mb-4">Quick Links</h4>
              <ul className="space-y-2">
                <li><a href="#" className="text-grass-200 hover:text-white transition-colors">Browse Jobs</a></li>
                <li><a href="#" className="text-grass-200 hover:text-white transition-colors">Companies</a></li>
                <li><a href="#" className="text-grass-200 hover:text-white transition-colors">About Us</a></li>
                <li><a href="#" className="text-grass-200 hover:text-white transition-colors">Contact</a></li>
              </ul>
            </div>

            {/* Resources */}
            <div>
              <h4 className="font-semibold text-lg mb-4">Resources</h4>
              <ul className="space-y-2">
                <li><a href="#" className="text-grass-200 hover:text-white transition-colors">Help Center</a></li>
                <li><a href="#" className="text-grass-200 hover:text-white transition-colors">Privacy Policy</a></li>
                <li><a href="#" className="text-grass-200 hover:text-white transition-colors">Terms of Service</a></li>
                <li><a href="#" className="text-grass-200 hover:text-white transition-colors">Blog</a></li>
              </ul>
            </div>
          </div>

          {/* Copyright */}
          <div className="border-t border-grass-800 pt-8 text-center text-grass-300">
            <p>&copy; 2025 GreenJobs. All rights reserved. Built with 💚 for a sustainable future.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
