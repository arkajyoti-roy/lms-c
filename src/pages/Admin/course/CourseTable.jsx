import { Button } from "@/components/ui/button";
import { Edit, Plus, BookOpen, Clock } from "lucide-react";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import axios from "axios";
import { Outlet } from "react-router-dom";
import { COURSES_URL } from "@/Components/url";

const CourseTable = () => { 
  const navigate = useNavigate();
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchCourses = async () => {
      const url = `${COURSES_URL}/getCourses`;
      if (!url) {
        setError(new Error("URL is empty or invalid"));
        setLoading(false);
        return;
      }

      try {
        const response = await axios.get(url, {
          withCredentials: true, // If your API requires credentials
        });

        if (!response.data || !Array.isArray(response.data.courses)) {
          setError(new Error("Invalid response format"));
          setLoading(false);
          return;
        }

        const courseData = response.data.courses;
        setCourses(courseData);
        setLoading(false);
      } catch (err) {
        setError(err);
        setLoading(false);
      }
    };

    fetchCourses();
  }, []);

  if (loading) return (
    <div className="flex items-center justify-center min-h-64">
      <div className="flex items-center space-x-2">
        <Clock className="animate-spin h-5 w-5 text-blue-600" />
        <p className="text-gray-600">Loading courses...</p>
      </div>
    </div>
  );

  if (courses.length === 0) return (
    <div className="text-center py-12">
      <div className="mb-6">
        <BookOpen className="mx-auto h-12 w-12 text-gray-400 mb-4" />
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">No courses yet</h3>
        <p className="text-gray-600 dark:text-gray-400">Get started by creating your first course</p>
      </div>
      <Button 
        onClick={() => navigate(`create`)}
        className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2"
      >
        <Plus className="h-4 w-4 mr-2" />
        Create Your First Course
      </Button>
    </div>
  );

  return (
    <div className="space-y-6">
      {/* Header Section */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">My Courses</h1>
          <p className="text-gray-600 dark:text-gray-400">Manage and edit your courses</p>
        </div>
        <Button 
          onClick={() => navigate(`create`)}
          className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2"
        >
          <Plus className="h-4 w-4 mr-2" />
          Create New Course
        </Button>
      </div>

      {/* Table Section */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700">
        <Table>
          <TableCaption className="text-gray-500 dark:text-gray-400">
            A list of your recent courses ({courses.length} total)
          </TableCaption>
          <TableHeader>
            <TableRow className="hover:bg-transparent">
              <TableHead className="w-[120px] font-semibold">Price</TableHead>
              <TableHead className="font-semibold">Status</TableHead>
              <TableHead className="font-semibold">Title</TableHead>
              <TableHead className="font-semibold">Description</TableHead>
              <TableHead className="text-right font-semibold">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {courses.map((course) => (
              <TableRow 
                key={course._id}
                className="hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors"
              >
                <TableCell className="font-semibold text-green-600 dark:text-green-400">
                  {course.coursePrice ? `₹${course.coursePrice}` : "Free"}
                </TableCell>
                <TableCell>
                  <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                    course.isPublished 
                      ? 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400' 
                      : 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-400'
                  }`}>
                    {course.isPublished ? "Published" : "Draft"}
                  </span>
                </TableCell>
                <TableCell className="font-medium text-gray-900 dark:text-white">
                  {course.courseTitle}
                </TableCell>
                <TableCell className="text-gray-600 dark:text-gray-400 max-w-xs truncate">
                  {course.courseDescription}
                </TableCell>
                <TableCell className="text-right">
                  <Button 
                    onClick={() => navigate(`${course._id}`)}
                    variant="outline"
                    size="sm"
                    className="hover:bg-blue-50 hover:text-blue-600 hover:border-blue-300"
                  >
                    <Edit className="h-4 w-4 mr-1" />
                    Edit
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      <div>
        <Outlet />
      </div>
    </div>
  );
};

export default CourseTable;