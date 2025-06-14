import Courses from "@/pages/student/Courses";
// import { Search, BookOpen, TrendingUp, Users, Award } from "lucide-react";
import { useState } from "react";

const Home = () => {
  // const [searchQuery, setSearchQuery] = useState("");

  // const handleSearch = () => {
  //   // Add your search logic here
  //   console.log("Searching for:", searchQuery);
  // };

  // const handleKeyPress = (e) => {
  //   if (e.key === 'Enter') {
  //     handleSearch();
  //   }
  // };

 
  return (
    <>
     <div className="relative z-10">
          <Courses />
        </div>
    </>
  );
};

export default Home;