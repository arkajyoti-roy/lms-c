import "../../App.css";
import Course from "./Course";
import CourseSkeleton from "./CourseSkeleton";
import { useLoadUserQuery } from "@/features/api/authApi";

const Courses = () => {
  const { data, isLoading } = useLoadUserQuery();
  
  if (isLoading) return <div>Loading...</div>;

  // const user = data?.user;
  return (
    <div>
      <h1 className="text-3xl font-bold text-center mb-3">Our Courses</h1>

      {isLoading ? (
  
        <CourseSkeleton />
      ) : (
    
        <div>
          <Course />
        </div>
      )}
    </div>
  );
};

export default Courses;
