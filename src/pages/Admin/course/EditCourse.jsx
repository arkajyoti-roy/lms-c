import { Link } from "react-router-dom";
import { Button } from "@/Components/ui/button";
import CourseTab from "./CourseTab";

const EditCourse = () => {
  // const navigate = useNavigate();
  return (
    <div className="flex-1 ">
      <div className="flex items-center justify-between mb-5">
        <h1 className="font-bold text-xl">Add details of course</h1>
        <Link to="lecture">
          <Button  variant="link" className="hover:text-blue-600">Go to lecture page</Button>
        </Link>
      </div>
      <CourseTab/> 
    </div>
  );
};

export default EditCourse;
