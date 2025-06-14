import { Input } from "@/Components/ui/input";
import { Label } from "@/Components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/Components/ui/button";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import { Loader2, ArrowLeft, Plus, BookOpen } from "lucide-react";
import { toast } from "react-toastify";
import axios from "axios";
import { COURSES_URL } from "@/Components/url";

const AddCourse = () => {
  const navigate = useNavigate();
  const [courseTitle, setCourseTitle] = useState("");
  const [category, setCategory] = useState("");
  const [isLoading, setIsLoading] = useState(false); // Define a local state for isLoading

  const getSelectedCategory = (value) => {
    setCategory(value);
  };

  const createCourseHandler = async () => {
    const cous = { courseTitle, category };
    setIsLoading(true); // Set loading to true when the request starts
    try {
      const response = await axios.post(
        `${COURSES_URL}`,
        cous,
        {
          headers: {
            "Content-Type": "application/json",
          },
          withCredentials: true, // Include credentials with the request
        }
      );
      // Handle the response as needed
      console.log(response.data);
      toast.success(response.data.message || "Course created successfully!");
    
    navigate("/admin/course");
    } catch (error) {
      // Handle the error as needed
      console.error(error);
      toast.error("Failed to create course");
    } finally {
      setIsLoading(false); // Set loading to false when the request ends
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-8">
      <div className="max-w-2xl mx-auto px-6">
        {/* Header Section */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-2 bg-blue-100 dark:bg-blue-900/20 rounded-lg">
              <BookOpen className="h-6 w-6 text-blue-600 dark:text-blue-400" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Create New Course</h1>
              <p className="text-gray-600 dark:text-gray-400 mt-1">Add a new course with basic details to get started</p>
            </div>
          </div>
        </div>

        {/* Form Card */}
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-8">
          <div className="space-y-6">
            {/* Course Title */}
            <div className="space-y-2">
              <Label className="text-sm font-semibold text-gray-700 dark:text-gray-300">
                Course Title <span className="text-red-500">*</span>
              </Label>
              <Input
                type="text"
                value={courseTitle}
                onChange={(e) => {
                  setCourseTitle(e.target.value);
                }}
                placeholder="Enter your course title (e.g., Complete React Development)"
                className="h-12 text-base border-gray-300 dark:border-gray-600 focus:border-blue-500 focus:ring-blue-500"
              />
              <p className="text-xs text-gray-500 dark:text-gray-400">
                Choose a clear and descriptive title for your course
              </p>
            </div>

            {/* Category */}
            <div className="space-y-2">
              <Label className="text-sm font-semibold text-gray-700 dark:text-gray-300">
                Category <span className="text-red-500">*</span>
              </Label>
              <Select onValueChange={getSelectedCategory}>
                <SelectTrigger className="h-12 text-base border-gray-300 dark:border-gray-600 focus:border-blue-500 focus:ring-blue-500">
                  <SelectValue placeholder="Select a category for your course" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Web Development">
                    <div className="flex items-center gap-2">
                      <span>🌐</span>
                      Web Development
                    </div>
                  </SelectItem>
                  <SelectItem value="DSA">
                    <div className="flex items-center gap-2">
                      <span>🧮</span>
                      Data Structures & Algorithms
                    </div>
                  </SelectItem>
                  <SelectItem value="Cloud">
                    <div className="flex items-center gap-2">
                      <span>☁️</span>
                      Cloud Computing
                    </div>
                  </SelectItem>
                  <SelectItem value="Networking">
                    <div className="flex items-center gap-2">
                      <span>🔗</span>
                      Networking
                    </div>
                  </SelectItem>
                  <SelectItem value="DBMS">
                    <div className="flex items-center gap-2">
                      <span>🗄️</span>
                      Database Management
                    </div>
                  </SelectItem>
                  <SelectItem value="Other">
                    <div className="flex items-center gap-2">
                      <span>📚</span>
                      Other
                    </div>
                  </SelectItem>
                </SelectContent>
              </Select>
              <p className="text-xs text-gray-500 dark:text-gray-400">
                This helps students find your course more easily
              </p>
            </div>

            {/* Action Buttons */}
            <div className="flex gap-4 pt-6 border-t border-gray-200 dark:border-gray-700">
              <Button 
                onClick={() => navigate(`/admin/course`)} 
                variant="outline"
                className="flex-1 h-12 text-base hover:bg-gray-50 dark:hover:bg-gray-700"
              >
                <ArrowLeft className="mr-2 h-4 w-4" />
                Back to Courses
              </Button>
              <Button 
                disabled={isLoading || !courseTitle.trim() || !category} 
                onClick={createCourseHandler}
                className="flex-1 h-12 text-base bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400"
              >
                {isLoading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Creating Course...
                  </>
                ) : (
                  <>
                    <Plus className="mr-2 h-4 w-4" />
                    Create Course
                  </>
                )}
              </Button>
            </div>
          </div>
        </div>

        {/* Help Text */}
        <div className="mt-6 p-4 bg-blue-50 dark:bg-blue-900/10 rounded-lg border border-blue-200 dark:border-blue-800">
          <p className="text-sm text-blue-700 dark:text-blue-300">
            💡 <strong>Tip:</strong> After creating your course, you'll be able to add lessons, assignments, pricing, and other details from the course editor.
          </p>
        </div>
      </div>
    </div>
  );
};

export default AddCourse;