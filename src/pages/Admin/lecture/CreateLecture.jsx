import { Button } from "@/Components/ui/button";
import { Input } from "@/Components/ui/input";
import { Label } from "@/Components/ui/label";
import { Loader2, Plus, BookOpen, ArrowLeft, GraduationCap, Video, FileText, Sparkles } from "lucide-react";
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import { COURSES_URL } from "@/Components/url";
import { toast } from "react-toastify";
import Lecture from "./Lecture";

const CreateLecture = () => {
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const [lectureTitle, setLectureTitle] = useState("");
  const [lectures, setLectures] = useState([]); // Initialize as an empty array
  const params = useParams();
  const courseId = params.courseId;

  const createLectureHandler = async () => {
    setIsLoading(true);
    try {
      const response = await axios.post(
        `${COURSES_URL}/${courseId}/lecture`,
        { lectureTitle: lectureTitle },
        {
          withCredentials: true, // If your API requires credentials
        }
      );
      console.log("Lecture created:", response.data);
      toast.success("Lecture created successfully!");
      const newLectureId = response.data.lecture._id;
      setTimeout(() => {
        navigate(`/admin/course/${courseId}/lecture/${newLectureId}`);
      }, 300);
      // Optionally, fetch the updated list of lectures
      getLectures();
    } catch (error) {
      console.error("Error creating lecture!", error);
      toast.error(error.response?.data?.message || "Error creating lecture!");
    } finally {
      setIsLoading(false);
    }
  };

  const getLectures = async () => {
    setIsLoading(true);
    try {
      const response = await axios.get(`${COURSES_URL}/${courseId}/lecture`, {
        withCredentials: true, // If your API requires credentials
      });
      setLectures(response.data.lectures);
      console.log("Lectures fetched:", response.data);
    } catch (error) {
      console.error("Error fetching lecture data!", error);
      toast.error(
        error.response?.data?.message || "Error fetching lecture data!"
      );
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    getLectures();
  }, [courseId]);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header Section */}
      <div className="bg-white border-b border-gray-200 shadow-sm">
        <div className="max-w-7xl mx-auto px-6 py-8">
          <div className="flex items-center gap-4 mb-6">
            <div className="p-3 bg-gray-100 rounded-lg">
              <GraduationCap className="h-8 w-8 text-gray-700" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Lecture Management</h1>
              <p className="text-gray-600 mt-1">Create and manage your course lectures</p>
            </div>
          </div>
          
          {/* Breadcrumb */}
          <div className="flex items-center gap-2 text-gray-500">
            <BookOpen className="h-4 w-4" />
            <span>Course ID: {courseId}</span>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-8">
        {/* Create Lecture Card */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 mb-8 overflow-hidden">
          <div className="bg-gray-50 border-b border-gray-200 p-6">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-white rounded-lg border border-gray-200">
                <Plus className="h-6 w-6 text-gray-700" />
              </div>
              <div>
                <h2 className="text-xl font-bold text-gray-900">Create New Lecture</h2>
                <p className="text-gray-600">Add engaging content to your course</p>
              </div>
            </div>
          </div>
          
          <div className="p-8">
            <div className="max-w-2xl">
              <div className="space-y-6">
                <div className="space-y-3">
                  <div className="flex items-center gap-2">
                    <FileText className="h-5 w-5 text-gray-600" />
                    <Label className="text-lg font-semibold text-gray-700">Lecture Title</Label>
                    <span className="text-red-500">*</span>
                  </div>
                  <Input
                    type="text"
                    value={lectureTitle}
                    onChange={(e) => {
                      setLectureTitle(e.target.value);
                    }}
                    placeholder="Enter an engaging lecture title..."
                    className="h-12 text-lg border-2 border-gray-200 focus:border-gray-400 rounded-lg transition-all duration-200"
                  />
                </div>

                <div className="flex gap-4 pt-4">
                  <Button
                    onClick={() => navigate(`/admin/course/${courseId}`)}
                    variant="outline"
                    className="px-6 py-3 rounded-lg border-2 hover:bg-gray-50 transition-all duration-200 flex items-center gap-2"
                  >
                    <ArrowLeft className="h-4 w-4" />
                    Back to Course
                  </Button>
                  <Button 
                    disabled={isLoading || !lectureTitle.trim()} 
                    onClick={createLectureHandler}
                    className="px-8 py-3 bg-gray-900 hover:bg-gray-800 text-white rounded-lg shadow-sm hover:shadow-md transition-all duration-200 flex items-center gap-2"
                  >
                    {isLoading ? (
                      <>
                        <Loader2 className="h-4 w-4 animate-spin" />
                        Creating...
                      </>
                    ) : (
                      <>
                        <Sparkles className="h-4 w-4" />
                        Create Lecture
                      </>
                    )}
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Lectures List Section */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
          <div className="bg-gray-50 border-b border-gray-200 p-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-white rounded-lg border border-gray-200">
                  <Video className="h-6 w-6 text-gray-700" />
                </div>
                <div>
                  <h2 className="text-xl font-bold text-gray-900">Course Lectures</h2>
                  <p className="text-gray-600">Manage your existing lectures</p>
                </div>
              </div>
              <div className="bg-white border border-gray-200 rounded-lg px-4 py-2">
                <span className="text-gray-700 font-semibold">
                  {lectures.length} {lectures.length === 1 ? 'Lecture' : 'Lectures'}
                </span>
              </div>
            </div>
          </div>
          
          <div className="p-8">
            {isLoading ? (
              <div className="flex flex-col items-center justify-center py-16">
                <div className="bg-gray-100 p-6 rounded-full mb-4">
                  <Loader2 className="h-8 w-8 animate-spin text-gray-600" />
                </div>
                <p className="text-lg font-medium text-gray-600">Loading lectures...</p>
                <p className="text-gray-400 mt-1">Please wait while we fetch your content</p>
              </div>
            ) : lectures.length === 0 ? (
              <div className="text-center py-16">
                <div className="bg-gray-50 p-6 rounded-full w-24 h-24 flex items-center justify-center mx-auto mb-6">
                  <Video className="h-10 w-10 text-gray-400" />
                </div>
                <h3 className="text-xl font-semibold text-gray-600 mb-2">No lectures yet</h3>
                <p className="text-gray-400 mb-6 max-w-md mx-auto">
                  Start building your course by creating your first lecture. Add engaging content to help your students learn effectively.
                </p>
                <div className="flex items-center justify-center gap-2 text-gray-600">
                  <ArrowLeft className="h-4 w-4 rotate-90" />
                  <span className="text-sm font-medium">Create your first lecture above</span>
                </div>
              </div>
            ) : (
              <div className="space-y-4">
                <div className="flex items-center gap-2 mb-6">
                  <div className="h-1 w-8 bg-gray-300 rounded"></div>
                  <span className="text-lg font-semibold text-gray-700">Your Lectures</span>
                </div>
                <div className="grid gap-4">
                  {lectures.map((lecture, index) => (
                    <div key={lecture._id} className="transform hover:scale-[1.01] transition-all duration-200">
                      <Lecture courseId={courseId} lecture={lecture} index={index} />
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default CreateLecture;