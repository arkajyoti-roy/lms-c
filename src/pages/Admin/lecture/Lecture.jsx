import { Edit } from "lucide-react";
import { useNavigate } from "react-router-dom";

const Lecture = ({ lecture, courseId, index }) => {
  const navigate = useNavigate();

  const goToUpdateLecture = () => {
    navigate(`${lecture._id}`);
  };

  return (
    <div className="group flex items-center justify-between bg-white border border-gray-200 hover:border-blue-300 hover:shadow-md transition-all duration-200 my-3 px-6 py-5 rounded-lg">
      <div className="flex items-center space-x-4">
        <div className="flex-shrink-0 w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
          <span className="text-blue-600 font-semibold text-sm">{index + 1}</span>
        </div>
        <div>
          <h1 className="font-semibold text-gray-900 text-lg leading-tight">
            {lecture.lectureTitle}
          </h1>
          <p className="text-gray-500 text-sm mt-1">Lecture {index + 1}</p>
        </div>
      </div>

      <button
        onClick={goToUpdateLecture}
        className="flex items-center justify-center w-10 h-10 rounded-full bg-gray-50 hover:bg-blue-50 text-gray-400 hover:text-blue-600 transition-all duration-200 group-hover:bg-blue-50"
        aria-label="Edit lecture"
      >
        <Edit size={18} />
      </button>
    </div>
  );
};

export default Lecture;