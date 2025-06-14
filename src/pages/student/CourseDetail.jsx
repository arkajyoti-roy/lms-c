import BuyCourseButton from "@/components/BuyCourseButton";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { useGetCourseDetailWithStatusQuery } from "@/features/api/purchaseApi";
import { BadgeInfo, Lock, PlayCircle } from "lucide-react";
import ReactPlayer from "react-player";
import { useNavigate, useParams } from "react-router-dom";

const CourseDetail = () => {
  const params = useParams();
  const courseId = params.courseId;
  const navigate = useNavigate();
  const { data, isLoading, isError } = useGetCourseDetailWithStatusQuery(courseId);

  if (isLoading) return <div className="flex items-center justify-center min-h-screen"><div className="text-xl">Loading...</div></div>;
  if (isError) return <div className="flex items-center justify-center min-h-screen"><div className="text-xl text-red-500">Failed to load course details</div></div>;

  const { course, purchased } = data;

  const handleContinueCourse = () => {
    if (purchased) {
      navigate(`/course-progress/${courseId}`);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <br />
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-[#2D2F31] to-[#1a1c1e] text-white">
        <div className="max-w-7xl mx-auto py-12 px-4 md:px-8">
          <h1 className="font-bold text-3xl md:text-4xl mb-4">{course?.courseTitle}</h1>
          <p className="text-lg md:text-xl mb-4 text-gray-200">Course Sub-title</p>
          <p className="mb-3">
            Created By{" "}
            <span className="text-[#C0C4FC] underline text-xl">{course?.creator.name}</span>
          </p>
          <div className="flex items-center gap-2 text-sm mb-2">
            <BadgeInfo size={16} />
            <p>Last updated {course?.createdAt.split("T")[0]}</p>
          </div>
          <p>Students enrolled: {course?.enrolledStudents.length}</p>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto my-8 px-4 md:px-8 flex flex-col lg:flex-row justify-between gap-10">
        {/* Left Column */}
        <div className="w-full lg:w-1/2 space-y-6">
          <div>
            <h1 className="font-bold text-2xl md:text-3xl mb-4">Description</h1>
            <div className="text-sm text-gray-700 leading-relaxed" dangerouslySetInnerHTML={{ __html: course.description }} />
          </div>
          
          <Card className="shadow-md">
            <CardHeader>
              <CardTitle className="text-xl">Course Content</CardTitle>
              <CardDescription>{course.lectures.length} lectures</CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              {course.lectures.map((lecture, idx) => (
                <div key={idx} className="flex items-center gap-3 text-sm p-2 rounded hover:bg-gray-50 transition-colors">
                  <span className="flex-shrink-0">
                    {purchased ? <PlayCircle size={16} className="text-green-600" /> : <Lock size={16} className="text-gray-400" />}
                  </span>
                  <p className="text-gray-800">{lecture.lectureTitle}</p>
                </div>
              ))}
            </CardContent>
          </Card>
        </div>

        {/* Right Column */}
        <div className="w-full lg:w-1/3">
          <Card className="shadow-lg sticky top-8">
            <CardContent className="p-6">
              <div className="w-full aspect-video mb-6 bg-black rounded-lg overflow-hidden">
                <ReactPlayer
                  width="100%"
                  height="100%"
                  url={course.lectures[0].videoUrl}
                  controls={true}
                />
              </div>
              <h2 className="text-lg font-semibold mb-4">Lecture title</h2>
              <Separator className="my-4" />
              <h3 className="text-xl md:text-2xl font-bold mb-2">Course Price</h3>
            </CardContent>
            <CardFooter className="flex justify-center p-6">
              {purchased ? (
                <Button onClick={handleContinueCourse} className="w-full py-3 text-lg font-semibold bg-green-600 hover:bg-green-700">
                  Continue Course
                </Button>
              ) : (
                <BuyCourseButton courseId={courseId} />
              )}
            </CardFooter>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default CourseDetail;