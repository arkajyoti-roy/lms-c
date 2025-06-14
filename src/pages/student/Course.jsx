import { BASE_URL, COURSES_URL } from "@/Components/url";
import axios from "axios";
import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Star, Clock, Users, BookOpen, User, TrendingUp, Search, Filter, ChevronDown } from "lucide-react";

import { useUserDetails } from "@/utils/useUserDetails";

const Course = () => {
  const [courses, setCourses] = useState([]);
  const [filteredCourses, setFilteredCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedLevel, setSelectedLevel] = useState("all");
  const [sortBy, setSortBy] = useState("newest");
  const { user, isLoading } = useUserDetails();
  const navigate = useNavigate();

  // Fisher-Yates shuffle algorithm to randomize array
  const shuffleArray = (array) => {
    const shuffled = [...array];
    for (let i = shuffled.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    return shuffled;
  };

  useEffect(() => {
    const fetchCourses = async () => {
      try {
        setLoading(true);
        const response = await axios.get(`${COURSES_URL}/publichedCourses`);
        // Randomize courses immediately after fetching
        const randomizedCourses = shuffleArray(response.data.courses);
        setCourses(randomizedCourses);
        setFilteredCourses(randomizedCourses);
        console.log(response.data.courses);
      } catch (error) {
        console.error("Error fetching courses:", error);
        setError("Failed to load courses. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    fetchCourses();
  }, []);

  // Filter and search courses
  useEffect(() => {
    let filtered = courses;

    // Apply search filter
    if (searchQuery.trim()) {
      filtered = filtered.filter(course =>
        course.courseTitle.toLowerCase().includes(searchQuery.toLowerCase()) ||
        course.creator?.name?.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    // Apply level filter
    if (selectedLevel !== "all") {
      filtered = filtered.filter(course =>
        course.courseLevel?.toLowerCase() === selectedLevel.toLowerCase()
      );
    }

    // Apply sorting
    switch (sortBy) {
      case "price-low":
        filtered = [...filtered].sort((a, b) => a.coursePrice - b.coursePrice);
        break;
      case "price-high":
        filtered = [...filtered].sort((a, b) => b.coursePrice - a.coursePrice);
        break;
      case "title":
        filtered = [...filtered].sort((a, b) => a.courseTitle.localeCompare(b.courseTitle));
        break;
      default:
        // Keep original randomized order for "newest"
        break;
    }

    setFilteredCourses(filtered);
  }, [courses, searchQuery, selectedLevel, sortBy]);

  // Handle course click - redirect to login if not authenticated
  const handleCourseClick = (e, courseId) => {
    if (!user && !isLoading) {
      e.preventDefault();
      // Redirect to login page
      navigate('/login');
      // Optional: You can also store the intended course URL to redirect back after login
      // localStorage.setItem('intendedRoute', `/course-detail/${courseId}`);
    }
  };

  const getLevelColor = (level) => {
    switch (level?.toLowerCase()) {
      case 'beginner':
        return 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400';
      case 'intermediate':
        return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400';
      case 'advanced':
        return 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400';
      default:
        return 'bg-gray-100 text-gray-800 dark:bg-gray-900/30 dark:text-gray-400';
    }
  };

  const getLevelIcon = (level) => {
    switch (level?.toLowerCase()) {
      case 'beginner':
        return <BookOpen className="w-3 h-3" />;
      case 'intermediate':
        return <TrendingUp className="w-3 h-3" />;
      case 'advanced':
        return <Star className="w-3 h-3" />;
      default:
        return <BookOpen className="w-3 h-3" />;
    }
  };

  if (loading || isLoading) {
    return (
      <div className="bg-gradient-to-br from-gray-50 to-blue-50 dark:from-slate-900 dark:to-slate-800 min-h-screen">
        <div className="container mx-auto px-4 py-16">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {[...Array(8)].map((_, index) => (
              <div key={index} className="bg-white dark:bg-slate-800 rounded-2xl shadow-lg overflow-hidden animate-pulse">
                <div className="h-48 bg-gray-300 dark:bg-slate-700"></div>
                <div className="p-6 space-y-4">
                  <div className="h-6 bg-gray-300 dark:bg-slate-700 rounded"></div>
                  <div className="h-4 bg-gray-300 dark:bg-slate-700 rounded w-3/4"></div>
                  <div className="h-4 bg-gray-300 dark:bg-slate-700 rounded w-1/2"></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-gradient-to-br from-gray-50 to-blue-50 dark:from-slate-900 dark:to-slate-800 min-h-screen flex items-center justify-center">
        <div className="text-center p-8 bg-white dark:bg-slate-800 rounded-2xl shadow-xl max-w-md mx-4">
          <div className="w-16 h-16 bg-red-100 dark:bg-red-900/30 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-8 h-8 text-red-600 dark:text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
            </svg>
          </div>
          <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-2">Oops! Something went wrong</h3>
          <p className="text-gray-600 dark:text-gray-400 mb-6">{error}</p>
          <button 
            onClick={() => window.location.reload()}
            className="bg-blue-600 hover:bg-blue-700 text-white font-medium px-6 py-2 rounded-lg transition-colors duration-200"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  if (courses.length === 0) {
    return (
      <div className="bg-gradient-to-br from-gray-50 to-blue-50 dark:from-slate-900 dark:to-slate-800 min-h-screen flex items-center justify-center">
        <div className="text-center p-8 bg-white dark:bg-slate-800 rounded-2xl shadow-xl max-w-md mx-4">
          <div className="w-16 h-16 bg-blue-100 dark:bg-blue-900/30 rounded-full flex items-center justify-center mx-auto mb-4">
            <BookOpen className="w-8 h-8 text-blue-600 dark:text-blue-400" />
          </div>
          <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-2">No Courses Available</h3>
          <p className="text-gray-600 dark:text-gray-400">Check back later for new courses!</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-gradient-to-br from-gray-50 to-blue-50 dark:from-slate-900 dark:to-slate-800 min-h-screen">
      {/* Hero Section */}
      <div className="relative bg-gradient-to-br from-white via-blue-50/30 to-purple-50/30 dark:from-slate-900 dark:via-slate-800/50 dark:to-slate-700/30 border-b border-gray-200/50 dark:border-slate-700/50">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(59,130,246,0.1),transparent_50%)] dark:bg-[radial-gradient(circle_at_top_right,rgba(59,130,246,0.05),transparent_50%)]"></div>
        <div className="relative container mx-auto px-4 py-20">
          <div className="text-center max-w-4xl mx-auto">
            <div className="inline-flex items-center space-x-2 bg-blue-100/50 dark:bg-blue-900/20 px-4 py-2 rounded-full text-sm font-medium text-blue-700 dark:text-blue-300 mb-6 backdrop-blur-sm">
              <Star className="w-4 h-4" />
              <span>Premium Learning Experience</span>
            </div>
            <h1 className="text-4xl md:text-6xl font-bold bg-gradient-to-r from-gray-900 via-blue-800 to-purple-800 dark:from-gray-100 dark:via-blue-200 dark:to-purple-200 bg-clip-text text-transparent mb-6 leading-tight">
              Discover Amazing Courses
            </h1>
            <p className="text-xl text-gray-600 dark:text-gray-300 mb-8 max-w-2xl mx-auto leading-relaxed">
              Learn new skills and advance your career with our expert-led courses designed for modern learners
            </p>
            <div className="flex flex-wrap items-center justify-center gap-6 text-sm">
              <div className="flex items-center space-x-2 bg-white/60 dark:bg-slate-800/60 backdrop-blur-sm px-4 py-2 rounded-full shadow-sm border border-gray-200/50 dark:border-slate-700/50">
                <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                <BookOpen className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                <span className="font-medium text-gray-700 dark:text-gray-300">{courses.length} Courses</span>
              </div>
              <div className="flex items-center space-x-2 bg-white/60 dark:bg-slate-800/60 backdrop-blur-sm px-4 py-2 rounded-full shadow-sm border border-gray-200/50 dark:border-slate-700/50">
                <Users className="w-4 h-4 text-purple-600 dark:text-purple-400" />
                <span className="font-medium text-gray-700 dark:text-gray-300">Expert Instructors</span>
              </div>
              <div className="flex items-center space-x-2 bg-white/60 dark:bg-slate-800/60 backdrop-blur-sm px-4 py-2 rounded-full shadow-sm border border-gray-200/50 dark:border-slate-700/50">
                <Star className="w-4 h-4 text-yellow-500" />
                <span className="font-medium text-gray-700 dark:text-gray-300">Quality Content</span>
              </div>
            </div>
          </div>
        </div>
        {/* Subtle decorative elements */}
        <div className="absolute top-20 left-20 w-32 h-32 bg-gradient-to-br from-blue-400/10 to-purple-400/10 rounded-full blur-3xl"></div>
        <div className="absolute bottom-20 right-20 w-40 h-40 bg-gradient-to-br from-purple-400/10 to-pink-400/10 rounded-full blur-3xl"></div>
      </div>

      <div className="container mx-auto px-4 py-8">
        {/* Search and Filter Section */}
        <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-lg p-6 mb-8 border border-gray-200/50 dark:border-slate-700/50">
          <div className="flex flex-col lg:flex-row gap-4 items-center">
            {/* Search Bar */}
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                placeholder="Search courses or instructors..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-3 border border-gray-300 dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-slate-700 text-gray-900 dark:text-gray-100 placeholder-gray-500 dark:placeholder-gray-400"
              />
            </div>

            {/* Filters */}
            <div className="flex flex-wrap gap-3 items-center">
              {/* Level Filter */}
              <div className="relative">
                <select
                  value={selectedLevel}
                  onChange={(e) => setSelectedLevel(e.target.value)}
                  className="appearance-none bg-white dark:bg-slate-700 border border-gray-300 dark:border-slate-600 rounded-lg px-4 py-3 pr-8 text-gray-700 dark:text-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent cursor-pointer"
                >
                  <option value="all">All Levels</option>
                  <option value="beginner">Beginner</option>
                  <option value="intermediate">Intermediate</option>
                  <option value="advanced">Advanced</option>
                </select>
                <ChevronDown className="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4 pointer-events-none" />
              </div>

              {/* Sort Filter */}
              <div className="relative">
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="appearance-none bg-white dark:bg-slate-700 border border-gray-300 dark:border-slate-600 rounded-lg px-4 py-3 pr-8 text-gray-700 dark:text-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent cursor-pointer"
                >
                  <option value="newest">Newest First</option>
                  <option value="title">Title A-Z</option>
                  <option value="price-low">Price: Low to High</option>
                  <option value="price-high">Price: High to Low</option>
                </select>
                <ChevronDown className="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4 pointer-events-none" />
              </div>

              {/* Clear Filters */}
              {(searchQuery || selectedLevel !== "all" || sortBy !== "newest") && (
                <button
                  onClick={() => {
                    setSearchQuery("");
                    setSelectedLevel("all");
                    setSortBy("newest");
                  }}
                  className="px-4 py-2 text-sm text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200 underline"
                >
                  Clear Filters
                </button>
              )}
            </div>
          </div>

          {/* Results Summary */}
          <div className="mt-4 flex items-center justify-between text-sm text-gray-600 dark:text-gray-400">
            <span>
              Showing {filteredCourses.length} of {courses.length} courses
              {searchQuery && (
                <span> for "{searchQuery}"</span>
              )}
            </span>
            {filteredCourses.length === 0 && searchQuery && (
              <span className="text-red-500 dark:text-red-400">No courses found</span>
            )}
          </div>
        </div>

        {/* Login prompt for non-authenticated users */}
        {!user && !isLoading && (
          <div className="mb-8 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4">
    
          </div>
        )}

        {/* Show message when no filtered results */}
        {filteredCourses.length === 0 && searchQuery && (
          <div className="text-center py-12">
            <div className="w-16 h-16 bg-gray-100 dark:bg-gray-800 rounded-full flex items-center justify-center mx-auto mb-4">
              <Search className="w-8 h-8 text-gray-400" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-2">No courses found</h3>
            <p className="text-gray-600 dark:text-gray-400 mb-4">
              Try adjusting your search terms or filters
            </p>
            <button
              onClick={() => {
                setSearchQuery("");
                setSelectedLevel("all");
                setSortBy("newest");
              }}
              className="bg-blue-600 hover:bg-blue-700 text-white font-medium px-6 py-2 rounded-lg transition-colors duration-200"
            >
              Show All Courses
            </button>
          </div>
        )}

        {/* Courses Grid */}
        {filteredCourses.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredCourses.map((course) => (
              <Link 
                to={user ? `course-detail/${course._id}` : '#'} 
                key={course._id}
                onClick={(e) => handleCourseClick(e, course._id)}
                className={`group block transform transition-all duration-300 hover:scale-105 hover:shadow-2xl ${
                  !user ? 'cursor-pointer' : ''
                }`}
              >
                <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-lg overflow-hidden border border-gray-200/50 dark:border-slate-700/50 group-hover:border-blue-300 dark:group-hover:border-blue-600 transition-all duration-300">
                  {/* Course Thumbnail */}
                  <div className="relative h-48 overflow-hidden">
                    <img
                      alt={`${course.courseTitle} thumbnail`}
                      className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
                      src={course.courseThumbnail || "https://via.placeholder.com/400x200?text=Course+Image"}
                      onError={(e) => {
                        e.target.src = "https://via.placeholder.com/400x200?text=Course+Image";
                      }}
                    />
                    
                    {/* Level Badge */}
                    <div className="absolute top-3 right-3">
                      <span className={`inline-flex items-center space-x-1 px-2 py-1 rounded-full text-xs font-medium ${getLevelColor(course.courseLevel)}`}>
                        {getLevelIcon(course.courseLevel)}
                        <span className="capitalize">{course.courseLevel || 'Beginner'}</span>
                      </span>
                    </div>

                    {/* Login required overlay for non-authenticated users */}
                    {!user && !isLoading && (
                      <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                        <div className="bg-white/95 dark:bg-slate-800/95 backdrop-blur-sm rounded-lg px-4 py-2 transform translate-y-4 group-hover:translate-y-0 transition-transform duration-300">
                          <span className="text-sm font-medium text-gray-900 dark:text-gray-100">Login Required</span>
                        </div>
                      </div>
                    )}

                    {/* Overlay on hover for authenticated users */}
                    {user && (
                      <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                        <div className="bg-white/90 dark:bg-slate-800/90 backdrop-blur-sm rounded-lg px-4 py-2 transform translate-y-4 group-hover:translate-y-0 transition-transform duration-300">
                          <span className="text-sm font-medium text-gray-900 dark:text-gray-100">View Course</span>
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Course Content */}
                  <div className="p-6">
                    {/* Course Title */}
                    <h2 className="text-lg font-bold text-gray-900 dark:text-gray-100 mb-3 line-clamp-2 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors duration-200">
                      {course.courseTitle}
                    </h2>

                    {/* Instructor Info */}
                    <div className="flex items-center space-x-2 mb-4">
                      <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-500 rounded-full flex items-center justify-center">
                        <User className="w-4 h-4 text-white" />
                      </div>
                      <div>
                        <p className="text-sm font-medium text-gray-700 dark:text-gray-300">
                          {course.creator?.name || 'Unknown Instructor'}
                        </p>
                        <p className="text-xs text-gray-500 dark:text-gray-400">Instructor</p>
                      </div>
                    </div>

                    {/* Course Stats */}
                    <div className="grid grid-cols-2 gap-4 mb-4 text-xs text-gray-500 dark:text-gray-400">
                      <div className="flex items-center space-x-1">
                        <Star className="w-3 h-3 text-yellow-500" />
                        <span>4.8 (120)</span>
                      </div>
                      <div className="flex items-center space-x-1">
                        <Users className="w-3 h-3" />
                        <span>1.2k students</span>
                      </div>
                    </div>

                    {/* Price */}
                    <div className="flex items-center justify-between">
                      <div className="flex items-baseline space-x-2">
                        <span className="text-2xl font-bold text-gray-900 dark:text-gray-100">
                          ₹{course.coursePrice}
                        </span>
                        {course.originalPrice && course.originalPrice > course.coursePrice && (
                          <span className="text-sm text-gray-500 dark:text-gray-400 line-through">
                            ₹{course.originalPrice}
                          </span>
                        )}
                      </div>
                      
                      {/* Action Button */}
                      <button 
                        className={`bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white text-sm font-medium px-4 py-2 rounded-lg transition-all duration-200 shadow-md hover:shadow-lg ${
                          !user ? 'opacity-75' : ''
                        }`}
                        onClick={(e) => {
                          if (!user) {
                            e.preventDefault();
                            e.stopPropagation();
                            navigate('/login');
                          }
                        }}
                      >
                        {user ? 'Enroll Now' : 'Login to Enroll'}
                      </button>
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}

        {/* Load More Button (if needed) */}
        {filteredCourses.length > 0 && (
          <div className="text-center mt-12">
            <button className="bg-white dark:bg-slate-800 hover:bg-gray-50 dark:hover:bg-slate-700 text-gray-700 dark:text-gray-300 font-medium px-8 py-3 rounded-xl border border-gray-200 dark:border-slate-700 transition-all duration-200 shadow-md hover:shadow-lg">
              Load More Courses
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default Course;