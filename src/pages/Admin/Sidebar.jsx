import { Link, Outlet } from "react-router-dom";
import { ChartNoAxesColumn, SquareLibrary, User } from "lucide-react";

const Sidebar = () => {
  return (
    <>
      <div className="flex mt-12 top-0">
        <div className="hidden lg:block w-[250px] sm:w-[300px] space-y-8 border-r border-gray-300 dark:border-gray-700 p-5 h-screen bg-white dark:bg-gray-800">
          <div className="space-y-4">
            <Link 
              to="dashboard" 
              className="flex items-center gap-2 p-3 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors duration-200 text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white"
            >
              <ChartNoAxesColumn size={22} />
              <h1 className="font-medium">Dashboard</h1>
            </Link>
            <Link 
              to="course" 
              className="flex items-center gap-2 p-3 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors duration-200 text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white"
            >
              <SquareLibrary size={22} />
              <h1 className="font-medium">Courses</h1>
            </Link>
            <Link 
              to="ins-profile" 
              className="flex items-center gap-2 p-3 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors duration-200 text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white"
            >
              <User size={22} />
              <h1 className="font-medium">Profile</h1>
            </Link>
          </div>
        </div>
        <div className="flex-1 p-10">
          <Outlet/>
        </div>
      </div>
    </>
  );
};

export default Sidebar;