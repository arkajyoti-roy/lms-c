import { useEffect, useState } from "react";
import axios from "axios";
import CourseSkeleton from "./CourseSkeleton";
import { Link } from "react-router-dom";
import { BookOpen, Clock, Play, User, Star, Calendar, TrendingUp } from "lucide-react";
// import { BASE_URL } from "@/src/urls";
import { BASE_URL } from "@/Components/url";


const MyLearning = () => {
  const [purchasedCourses, setPurchasedCourses] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchPurchasedCourses = async () => {
      try {
        setIsLoading(true);
        setError(null);
        const response = await axios.get(`${BASE_URL}/purchase/getPurchased-courses`, {
          withCredentials: true, // Ensures cookies are included
        });
        setPurchasedCourses(response.data.purchasedCourse || []); // Update state with fetched courses
      } catch (error) {
        console.error("Error fetching purchased courses:", error);
        setError({
          message: error.response?.data?.message || error.message || 'There was an error fetching your courses. Please try again later.'
        });
      } finally {
        setIsLoading(false);
      }
    };

    fetchPurchasedCourses();
  }, []);

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

  const formatDate = (dateString) => {
    if (!dateString) return 'Recently';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      month: 'short', 
      day: 'numeric', 
      year: 'numeric' 
    });
  };

  const retryFetch = () => {
    const fetchPurchasedCourses = async () => {
      try {
        setIsLoading(true);
        setError(null);
        const response = await axios.get(`${BASE_URL}/purchase/getPurchased-courses`, {
          withCredentials: true,
        });
        setPurchasedCourses(response.data.purchasedCourse || []);
      } catch (error) {
        console.error("Error fetching purchased courses:", error);
        setError({
          message: error.response?.data?.message || error.message || 'There was an error fetching your courses. Please try again later.'
        });
      } finally {
        setIsLoading(false);
      }
    };

    fetchPurchasedCourses();
  };

  // Handle loading state
  if (isLoading) {
    return (
      <div className="bg-gradient-to-br from-gray-50 to-blue-50 dark:from-slate-900 dark:to-slate-800 min-h-screen">
        <br />
        <div className="container mx-auto px-4 py-8">
          <CourseSkeleton />
        </div>
      </div>
    );
  }

  // Handle error state
  if (error) {
    return (
      <div className="bg-gradient-to-br from-gray-50 to-blue-50 dark:from-slate-900 dark:to-slate-800 min-h-screen">
        <br />
        <div className="container mx-auto px-4 py-8">
          <div className="text-center py-16">
            <div className="w-24 h-24 bg-red-100 dark:bg-red-800 rounded-full flex items-center justify-center mx-auto mb-6">
              <BookOpen className="w-12 h-12 text-red-400" />
            </div>
            <h3 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-2">
              Error Loading Courses
            </h3>
            <p className="text-gray-600 dark:text-gray-400 mb-6 max-w-md mx-auto">
              {error.message}
            </p>
            <button 
              onClick={retryFetch}
              className="inline-flex items-center space-x-2 bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white font-medium px-6 py-3 rounded-lg transition-all duration-200 shadow-md hover:shadow-lg"
            >
              <span>Try Again</span>
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-gradient-to-br mt-2 from-gray-50 to-blue-50 dark:from-slate-900 dark:to-slate-800 min-h-screen">
     <br />
      <div className="container mx-auto px-4 py-8">
        {/* Header Section */}
        <div className="mb-8">
          <div className="flex items-center space-x-3 mb-4">
            <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
              <BookOpen className="w-5 h-5 text-white" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-gray-900 dark:text-white">My Learning</h1>
              <p className="text-gray-600 dark:text-gray-400">Continue your learning journey</p>
            </div>
          </div>
          
          {purchasedCourses.length > 0 && (
            <div className="flex items-center space-x-6 text-sm text-gray-600 dark:text-gray-400">
              <div className="flex items-center space-x-2">
                <BookOpen className="w-4 h-4" />
                <span>{purchasedCourses.length} Enrolled Course{purchasedCourses.length !== 1 ? 's' : ''}</span>
              </div>
              <div className="flex items-center space-x-2">
                <Play className="w-4 h-4" />
                <span>Ready to Continue</span>
              </div>
            </div>
          )}
        </div>

        {/* Content */}
        {!purchasedCourses.length ? (
          /* Empty State */
          <div className="text-center py-16">
            <div className="w-24 h-24 bg-gray-100 dark:bg-gray-800 rounded-full flex items-center justify-center mx-auto mb-6">
              <BookOpen className="w-12 h-12 text-gray-400" />
            </div>
            <h3 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-2">
              No Courses Yet
            </h3>
            <p className="text-gray-600 dark:text-gray-400 mb-6 max-w-md mx-auto">
              You haven't enrolled in any courses yet. Start your learning journey by exploring our course catalog.
            </p>
            <Link
              to="/courses"
              className="inline-flex items-center space-x-2 bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white font-medium px-6 py-3 rounded-lg transition-all duration-200 shadow-md hover:shadow-lg"
            >
              <BookOpen className="w-4 h-4" />
              <span>Browse Courses</span>
            </Link>
          </div>
        ) : (
          /* Courses Grid */
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {purchasedCourses.map((purchase) => (
              purchase.courseId && (
                <Link 
                  to={`course-detail/${purchase.courseId._id}`} 
                  key={purchase.courseId._id}
                  className="group block"
                >
                  <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-lg overflow-hidden border border-gray-200/50 dark:border-slate-700/50 group-hover:border-blue-300 dark:group-hover:border-blue-600 transition-all duration-300 group-hover:shadow-xl group-hover:scale-[1.02]">
                    {/* Course Thumbnail */}
                    <div className="relative h-48 overflow-hidden">
                      <img
                        alt={`${purchase.courseId.courseTitle} thumbnail`}
                        className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
                        src={purchase.courseId.courseThumbnail || "https://via.placeholder.com/400x200?text=Course+Image"}
                        onError={(e) => {
                          e.target.src = "https://via.placeholder.com/400x200?text=Course+Image";
                        }}
                      />
                      
                      {/* Level Badge */}
                      <div className="absolute top-3 right-3">
                        <span className={`inline-flex items-center space-x-1 px-2 py-1 rounded-full text-xs font-medium ${getLevelColor(purchase.courseId.courseLevel)}`}>
                          {getLevelIcon(purchase.courseId.courseLevel)}
                          <span className="capitalize">{purchase.courseId.courseLevel || 'Beginner'}</span>
                        </span>
                      </div>

                      {/* Enrolled Badge */}
                      <div className="absolute top-3 left-3">
                        <span className="inline-flex items-center space-x-1 px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400">
                          <Play className="w-3 h-3" />
                          <span>Enrolled</span>
                        </span>
                      </div>

                      {/* Hover Overlay */}
                      <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                        <div className="bg-white/90 dark:bg-slate-800/90 backdrop-blur-sm rounded-lg px-4 py-2 transform translate-y-4 group-hover:translate-y-0 transition-transform duration-300">
                          <span className="text-sm font-medium text-gray-900 dark:text-gray-100 flex items-center space-x-1">
                            <Play className="w-4 h-4" />
                            <span>Continue Learning</span>
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Course Content */}
                    <div className="p-6">
                      {/* Course Title */}
                      <h2 className="text-lg font-bold text-gray-900 dark:text-gray-100 mb-3 line-clamp-2 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors duration-200">
                        {purchase.courseId.courseTitle}
                      </h2>

                      {/* Instructor Info */}
                      <div className="flex items-center space-x-2 mb-4">
                        <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-500 rounded-full flex items-center justify-center">
                          <User className="w-4 h-4 text-white" />
                        </div>
                        <div>
                          <p className="text-sm font-medium text-gray-700 dark:text-gray-300">
                            {purchase.courseId.creator?.name || 'Unknown Instructor'}
                          </p>
                          <p className="text-xs text-gray-500 dark:text-gray-400">Instructor</p>
                        </div>
                      </div>

                      {/* Course Info */}
                      <div className="space-y-2 mb-4">
                        <div className="flex items-center justify-between text-xs text-gray-500 dark:text-gray-400">
                          <div className="flex items-center space-x-1">
                            <Calendar className="w-3 h-3" />
                            <span>Purchased {formatDate(purchase.purchaseDate)}</span>
                          </div>
                          <div className="flex items-center space-x-1">
                            <Star className="w-3 h-3 text-yellow-500" />
                            <span>4.8</span>
                          </div>
                        </div>
                        <div className="text-xs text-gray-500 dark:text-gray-400">
                          <span>Category: {purchase.courseId.category}</span>
                        </div>
                      </div>

                      {/* Price and Action */}
                      <div className="flex items-center justify-between">
                        <div className="flex items-baseline space-x-2">
                          <span className="text-lg font-bold text-gray-900 dark:text-gray-100">
                            ₹{purchase.courseId.coursePrice}
                          </span>
                          <span className="text-xs text-green-600 dark:text-green-400 font-medium">
                            Owned
                          </span>
                        </div>
                        
                        <button className="bg-gradient-to-r from-green-500 to-blue-600 hover:from-green-600 hover:to-blue-700 text-white text-sm font-medium px-4 py-2 rounded-lg transition-all duration-200 shadow-md hover:shadow-lg flex items-center space-x-1">
                          <Play className="w-3 h-3" />
                          <span>Continue</span>
                        </button>
                      </div>

                      {/* Progress Bar (placeholder - you can connect to actual progress data) */}
                      <div className="mt-4">
                        <div className="flex items-center justify-between text-xs text-gray-500 dark:text-gray-400 mb-1">
                          <span>Progress</span>
                          <span>0%</span>
                        </div>
                        <div className="w-full bg-gray-200 dark:bg-slate-700 rounded-full h-2">
                          <div className="bg-gradient-to-r from-green-500 to-blue-500 h-2 rounded-full" style={{ width: '0%' }}></div>
                        </div>
                      </div>
                    </div>
                  </div>
                </Link>
              )
            ))}
          </div>
        )}

        {/* Additional Actions */}
        {purchasedCourses.length > 0 && (
          <div className="mt-12 text-center">
            <Link
              to="/courses"
              className="inline-flex items-center space-x-2 bg-white dark:bg-slate-800 hover:bg-gray-50 dark:hover:bg-slate-700 text-gray-700 dark:text-gray-300 font-medium px-6 py-3 rounded-xl border border-gray-200 dark:border-slate-700 transition-all duration-200 shadow-md hover:shadow-lg"
            >
              <BookOpen className="w-4 h-4" />
              <span>Explore More Courses</span>
            </Link>
          </div>
        )}
      </div>
    </div>
  );
};

export default MyLearning;