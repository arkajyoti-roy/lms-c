import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Progress } from "@/components/ui/progress";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Loader2, Upload, Image, Save, ArrowLeft, Trash2, Eye, EyeOff } from "lucide-react";
import axios from "axios";
import { toast } from "react-toastify";
import { COURSES_URL, MEDIA_URL } from "@/Components/url";
import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import RichTextEditor from "@/components/RichTextEditor";

const CourseTab = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [input, setInput] = useState({
    courseTitle: "",
    subTitle: "",
    description: "",
    category: "",
    courseLevel: "",
    coursePrice: "",
    courseThumbnail: "",
    isPublished: false,
    lectures: [],
  });
  const [previewThumbnail, setPreviewThumbnail] = useState("");
  const [mediaProgress, setMediaProgress] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  
  const params = useParams();
  const courseId = params.courseId;
  const navigate = useNavigate();

  const fetchCourseData = async () => {
    setIsLoading(true);
    try {
      const response = await axios.get(`${COURSES_URL}/${courseId}`, {
        withCredentials: true,
      });
      const courseData = response.data.course;
      console.log("Fetched course data:", courseData);
  
      if (courseData) {
        setInput({
          courseTitle: courseData.courseTitle || "",
          subTitle: courseData.subTitle || "",
          description: courseData.description || "",
          category: courseData.category || "",
          courseLevel: courseData.courseLevel || "",
          coursePrice: courseData.coursePrice || "",
          courseThumbnail: courseData.courseThumbnail || "",
          isPublished: courseData.isPublished || false,
          lectures: courseData.lectures || [],
        });
        setPreviewThumbnail(courseData.courseThumbnail || "");
      }
    } catch (error) {
      console.error("Error fetching course data!", error);
      toast.error(error.response.data.message || "Error fetching course data!");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchCourseData();
  }, [courseId]);

  const changeEventHandler = (e) => {
    const { name, value } = e.target;
    setInput({ ...input, [name]: value });
  };

  const selectCategory = (value) => {
    setInput({ ...input, category: value });
  };

  const selectCourseLevel = (value) => {
    setInput({ ...input, courseLevel: value });
  };

  const selectThumbnail = async (e) => {
    const file = e.target.files?.[0];
    if (file) {
      setInput({ ...input, courseThumbnail: file });
      const fileReader = new FileReader();
      fileReader.onloadend = () => {
        setPreviewThumbnail(fileReader.result);
      };
      fileReader.readAsDataURL(file);
  
      const formData = new FormData();
      formData.append("file", file);
  
      setMediaProgress(true);
      try {
        console.log('Uploading file...');
        const res = await axios.post(`${MEDIA_URL}/upload-video`, formData, {
          withCredentials: true,
          onUploadProgress: ({ loaded, total }) => {
            setUploadProgress(Math.round((loaded * 100) / total));
          },
        });
        console.log(res.data);
        toast.success("File uploaded successfully!");
        setMediaProgress(false);
      } catch (error) {
        console.error("Error uploading file!", error);
        toast.error(error.response.data.message || "Error uploading file!");
        setMediaProgress(false);
      }
    }
  };

  const updateCourseHandler = async () => {
    setIsLoading(true);
    const formData = new FormData();
  
    formData.append("courseTitle", input.courseTitle);
    formData.append("subTitle", input.subTitle);
    formData.append("description", input.description);
    formData.append("category", input.category);
    formData.append("courseLevel", input.courseLevel);
    formData.append("coursePrice", input.coursePrice);
    
    if (input.courseThumbnail instanceof File) {
      formData.append("courseThumbnail", input.courseThumbnail);
    }
  
    try {
      const response = await axios.put(`${COURSES_URL}/${courseId}`, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
        withCredentials: true,
      });
      console.log(response.data);
      toast.success(response.data.message || "Edit Success!");
      toast.success("Edit Success!");
      navigate("/admin/course");
    } catch (error) {
      console.error("Error updating course!", error);
      toast.error(error.response.data.message || "Error updating course!");
    } finally {
      setIsLoading(false);
    }
  };

  const publishStatusHandler = async (publish) => {
    try {
      const res = await axios.patch(
        `${COURSES_URL}/${courseId}?publish=${publish}`,
        {},
        {
          withCredentials: true,
        }
      );
      console.log("Response from publishStatusHandler:", res.data);
      toast.success(res.data.message);
      setInput((prevState) => ({
        ...prevState,
        isPublished: publish === "true",
      }));
      console.log("Updated isPublished state:", publish);
    } catch (error) {
      console.error("Error in publishStatusHandler:", error);
      toast.error(error.response.data.message || 'Failed to update course status.');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 p-6">
      <div className="max-w-7xl mx-auto space-y-8">
        
        {/* Header Section */}
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={() => navigate("/admin/course")}
              className="hover:bg-slate-200 transition-colors"
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Courses
            </Button>
            <div className="h-8 w-px bg-slate-300" />
            <div>
              <h1 className="text-3xl font-bold text-slate-900">Course Editor</h1>
              <p className="text-slate-600 mt-1">Create and manage your course content</p>
            </div>
          </div>
          
          {/* Status Badge */}
          <div className="flex items-center space-x-3">
            <div className={`px-3 py-1 rounded-full text-sm font-medium ${
              input.isPublished 
                ? 'bg-green-100 text-green-800 border border-green-200' 
                : 'bg-yellow-100 text-yellow-800 border border-yellow-200'
            }`}>
              {input.isPublished ? 'Published' : 'Draft'}
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            
            {/* Basic Information Card */}
            <Card className="shadow-lg border-0 bg-white">
              <CardHeader className="bg-gradient-to-r from-blue-50 to-indigo-50 border-b">
                <CardTitle className="text-xl text-slate-800">Basic Information</CardTitle>
                <CardDescription className="text-slate-600">
                  Essential details about your course
                </CardDescription>
              </CardHeader>
              <CardContent className="p-6 space-y-6">
                <div className="space-y-2">
                  <Label className="text-sm font-semibold text-slate-700">Course Title</Label>
                  <Input
                    name="courseTitle"
                    type="text"
                    value={input.courseTitle}
                    onChange={changeEventHandler}
                    placeholder="e.g., Complete Web Development Bootcamp"
                    className="border-slate-200 focus:border-blue-500 focus:ring-blue-500 transition-colors"
                  />
                </div>
                
                <div className="space-y-2">
                  <Label className="text-sm font-semibold text-slate-700">Subtitle</Label>
                  <Input
                    name="subTitle"
                    type="text"
                    value={input.subTitle}
                    onChange={changeEventHandler}
                    placeholder="e.g., Become a fullstack developer from zero to hero"
                    className="border-slate-200 focus:border-blue-500 focus:ring-blue-500 transition-colors"
                  />
                </div>
                
                <div className="space-y-2">
                  <Label className="text-sm font-semibold text-slate-700">Description</Label>
                  <div className="border border-slate-200 rounded-md">
                    <RichTextEditor input={input} setInput={setInput} />
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Category & Pricing Card */}
            <Card className="shadow-lg border-0 bg-white">
              <CardHeader className="bg-gradient-to-r from-purple-50 to-pink-50 border-b">
                <CardTitle className="text-xl text-slate-800">Category & Pricing</CardTitle>
                <CardDescription className="text-slate-600">
                  Set course category, level, and pricing
                </CardDescription>
              </CardHeader>
              <CardContent className="p-6">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="space-y-2">
                    <Label className="text-sm font-semibold text-slate-700">Category</Label>
                    <Select value={input.category} onValueChange={selectCategory}>
                      <SelectTrigger className="border-slate-200 focus:border-purple-500 focus:ring-purple-500">
                        <SelectValue placeholder="Select category" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Web Development">🌐 Web Development</SelectItem>
                        <SelectItem value="DSA">🧮 Data Structures & Algorithms</SelectItem>
                        <SelectItem value="Cloud">☁️ Cloud Computing</SelectItem>
                        <SelectItem value="Networking">🔗 Networking</SelectItem>
                        <SelectItem value="DBMS">🗄️ Database Management</SelectItem>
                        <SelectItem value="Other">📚 Other</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div className="space-y-2">
                    <Label className="text-sm font-semibold text-slate-700">Course Level</Label>
                    <Select value={input.courseLevel} onValueChange={selectCourseLevel}>
                      <SelectTrigger className="border-slate-200 focus:border-purple-500 focus:ring-purple-500">
                        <SelectValue placeholder="Select level" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Beginner">🌱 Beginner</SelectItem>
                        <SelectItem value="Medium">📈 Intermediate</SelectItem>
                        <SelectItem value="Advance">🚀 Advanced</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div className="space-y-2">
                    <Label className="text-sm font-semibold text-slate-700">Price (INR)</Label>
                    <div className="relative">
                      <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-500">₹</span>
                      <Input
                        type="number"
                        name="coursePrice"
                        value={input.coursePrice}
                        onChange={changeEventHandler}
                        placeholder="999"
                        className="pl-8 border-slate-200 focus:border-purple-500 focus:ring-purple-500 transition-colors"
                      />
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            
            {/* Thumbnail Card */}
            <Card className="shadow-lg border-0 bg-white">
              <CardHeader className="bg-gradient-to-r from-green-50 to-emerald-50 border-b">
                <CardTitle className="text-lg text-slate-800 flex items-center">
                  <Image className="h-5 w-5 mr-2" />
                  Course Thumbnail
                </CardTitle>
              </CardHeader>
              <CardContent className="p-6 space-y-4">
                <div className="space-y-3">
                  <Label className="relative cursor-pointer">
                    <div className="border-2 border-dashed border-slate-300 rounded-lg p-6 text-center hover:border-green-400 hover:bg-green-50 transition-colors">
                      <Upload className="h-8 w-8 mx-auto text-slate-400 mb-2" />
                      <p className="text-sm text-slate-600">Click to upload image</p>
                      <p className="text-xs text-slate-400 mt-1">PNG, JPG, GIF up to 10MB</p>
                    </div>
                    <Input
                      type="file"
                      accept="image/*"
                      onChange={selectThumbnail}
                      className="hidden"
                    />
                  </Label>
                  
                  {previewThumbnail && (
                    <div className="relative">
                      <img
                        src={previewThumbnail}
                        className="w-full h-48 object-cover rounded-lg border border-slate-200"
                        alt="Course thumbnail preview"
                      />
                      <div className="absolute inset-0 bg-black bg-opacity-0 hover:bg-opacity-20 rounded-lg transition-all flex items-center justify-center opacity-0 hover:opacity-100">
                        <p className="text-white text-sm font-medium">Change Image</p>
                      </div>
                    </div>
                  )}
                </div>
                
                {mediaProgress && (
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="text-slate-600">Uploading...</span>
                      <span className="text-slate-800 font-medium">{uploadProgress}%</span>
                    </div>
                    <Progress value={uploadProgress} className="h-2" />
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Actions Card */}
            <Card className="shadow-lg border-0 bg-white">
              <CardHeader className="bg-gradient-to-r from-orange-50 to-red-50 border-b">
                <CardTitle className="text-lg text-slate-800">Actions</CardTitle>
              </CardHeader>
              <CardContent className="p-6 space-y-4">
                <Button 
                  disabled={input.lectures.length === 0} 
                  variant={input.isPublished ? "destructive" : "default"}
                  onClick={() => publishStatusHandler(input.isPublished ? "false" : "true")}
                  className="w-full transition-all"
                >
                  {input.isPublished ? (
                    <>
                      <EyeOff className="h-4 w-4 mr-2" />
                      Unpublish Course
                    </>
                  ) : (
                    <>
                      <Eye className="h-4 w-4 mr-2" />
                      Publish Course
                    </>
                  )}
                </Button>
                
                <Button variant="outline" className="w-full hover:bg-red-50 hover:text-red-700 hover:border-red-200 transition-colors">
                  <Trash2 className="h-4 w-4 mr-2" />
                  Remove Course
                </Button>
                
                <div className="border-t pt-4 mt-6">
                  <div className="flex space-x-2">
                    <Button 
                      onClick={() => navigate("/admin/course")} 
                      variant="outline" 
                      className="flex-1"
                    >
                      Cancel
                    </Button>
                    <Button 
                      onClick={updateCourseHandler} 
                      disabled={isLoading}
                      className="flex-1 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
                    >
                      {isLoading ? (
                        <>
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                          Saving...
                        </>
                      ) : (
                        <>
                          <Save className="mr-2 h-4 w-4" />
                          Save Changes
                        </>
                      )}
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CourseTab;