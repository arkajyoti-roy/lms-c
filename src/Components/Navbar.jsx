import { CropIcon, MenuIcon } from "lucide-react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { useUniversalLogout } from "@/utils/authUtils";
import { useUserDetails } from "@/utils/useUserDetails";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useNavigate } from "react-router-dom";

const Navbar = () => {
  const { user, isLoading } = useUserDetails();
  const handleLogout = useUniversalLogout();
  const navigate = useNavigate();

  if (isLoading) {
    return (
      <div className="h-16 dark:bg-gradient-to-r dark:from-slate-900 dark:to-slate-800 bg-gradient-to-r from-white to-gray-50 flex items-center justify-center px-4 shadow-lg backdrop-blur-md fixed top-0 left-0 right-0 z-40 border-b border-gray-200/20">
        <div className="animate-pulse flex items-center space-x-2">
          <div className="w-8 h-8 bg-gray-300 rounded-full"></div>
          <div className="w-16 h-6 bg-gray-300 rounded"></div>
        </div>
      </div>
    );
  }

  const handleLoginClick = () => {
    navigate("/login", { state: { tab: "login" } });
  };

  const handleSignupClick = () => {
    navigate("/login", { state: { tab: "signup" } });
  };

  return (
    <div className="h-16 dark:bg-gradient-to-r dark:from-slate-900 dark:to-slate-800 bg-gradient-to-r from-white to-gray-50 flex items-center md:justify-around md:gap-96 px-6 shadow-lg backdrop-blur-md fixed top-0 left-0 right-0 duration-300 justify-between z-40 border-b border-gray-200/20">
      {/* Logo Section */}
      <Link to="/" className="group">
        <div className="flex items-center space-x-3 transition-all duration-300 group-hover:scale-105">
          <div className="relative">
            <CropIcon 
              size={32} 
              className="text-blue-600 dark:text-blue-400 transition-colors duration-300 group-hover:text-blue-700 dark:group-hover:text-blue-300" 
            />
            <div className="absolute -inset-1 bg-blue-600/20 rounded-full blur opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
          </div>
          <h1 className="font-bold text-2xl bg-gradient-to-r from-blue-600 to-purple-600 dark:from-blue-400 dark:to-purple-400 bg-clip-text text-transparent">
            XYZ
          </h1>
        </div>
      </Link>

      {/* Mobile Menu */}
      <div className="block md:hidden">
        <Sheet>
          <SheetTrigger className="relative group">
            {user ? (
              <div className="relative">
                <Avatar className="ring-2 ring-blue-500/30 hover:ring-blue-500/60 transition-all duration-300">
                  <AvatarImage src={user.photoUrl || ""} />
                  <AvatarFallback className="bg-gradient-to-br from-blue-500 to-purple-500 text-white font-semibold">
                    {user.name ? user.name.charAt(0).toUpperCase() : "U"}
                  </AvatarFallback>
                </Avatar>
                <div className="absolute -top-1 -right-1 w-4 h-4 bg-green-500 rounded-full border-2 border-white dark:border-slate-900 animate-pulse"></div>
              </div>
            ) : (
              <div className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-slate-800 transition-colors duration-200">
                <MenuIcon size={28} className="text-gray-700 dark:text-gray-300" />
              </div>
            )}
          </SheetTrigger>
          <SheetContent className="dark:bg-slate-900 bg-white border-l border-gray-200/20">
            {user ? (
              <>
                <SheetHeader className="space-y-4">
                  <div className="flex justify-center items-center">
                    <Avatar className="w-16 h-16 ring-4 ring-blue-500/30">
                      <AvatarImage src={user.photoUrl || ""} />
                      <AvatarFallback className="bg-gradient-to-br from-blue-500 to-purple-500 text-white font-bold text-xl">
                        {user.name ? user.name.charAt(0).toUpperCase() : "U"}
                      </AvatarFallback>
                    </Avatar>
                  </div>
                  <SheetTitle className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 dark:from-blue-400 dark:to-purple-400 bg-clip-text text-transparent">
                    My Account
                  </SheetTitle>
                  <div className="flex flex-col space-y-3 justify-start items-start">
                    {user?.role === "student" ? (
                      <>
                        <Link to="profile" className="w-full">
                          <button className="w-full text-left p-3 rounded-lg text-lg font-semibold hover:bg-blue-50 dark:hover:bg-slate-800 transition-colors duration-200 text-gray-700 dark:text-gray-300">
                            👤 Profile
                          </button>
                        </Link>
                        <Link to="my-learning" className="w-full">
                          <button className="w-full text-left p-3 rounded-lg text-lg font-semibold hover:bg-blue-50 dark:hover:bg-slate-800 transition-colors duration-200 text-gray-700 dark:text-gray-300">
                            📚 My Learning
                          </button>
                        </Link>
                      </>
                    ) : (
                      <>
                        <Link to="admin/ins-profile" className="w-full">
                          <button className="w-full text-left p-3 rounded-lg text-lg font-semibold hover:bg-blue-50 dark:hover:bg-slate-800 transition-colors duration-200 text-gray-700 dark:text-gray-300">
                            👤 Profile
                          </button>
                        </Link>
                        <Link to="admin/dashboard" className="w-full">
                          <button className="w-full text-left p-3 rounded-lg text-lg font-semibold hover:bg-blue-50 dark:hover:bg-slate-800 transition-colors duration-200 text-gray-700 dark:text-gray-300">
                            📊 Dashboard
                          </button>
                        </Link>
                        <Link to="admin/course" className="w-full">
                          <button className="w-full text-left p-3 rounded-lg text-lg font-semibold hover:bg-blue-50 dark:hover:bg-slate-800 transition-colors duration-200 text-gray-700 dark:text-gray-300">
                            📖 Course
                          </button>
                        </Link>
                      </>
                    )}
                  </div>
                  <Button 
                    onClick={handleLogout}
                    className="w-full bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white font-semibold py-3 rounded-lg transition-all duration-300 shadow-lg hover:shadow-xl"
                  >
                    🚪 Logout
                  </Button>
                </SheetHeader>
              </>
            ) : (
              <div className="flex flex-col space-y-4 mt-8">
                <Button 
                  onClick={handleLoginClick}
                  className="w-full bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white font-semibold py-3 rounded-lg transition-all duration-300 shadow-lg hover:shadow-xl"
                >
                  🔑 Login
                </Button>
                <Button 
                  onClick={handleSignupClick}
                  className="w-full bg-gradient-to-r from-purple-500 to-purple-600 hover:from-purple-600 hover:to-purple-700 text-white font-semibold py-3 rounded-lg transition-all duration-300 shadow-lg hover:shadow-xl"
                >
                  ✨ Sign Up
                </Button>
              </div>
            )}
          </SheetContent>
        </Sheet>
      </div>

      {/* Desktop Menu */}
      <div className="hidden md:flex items-center space-x-6">
        {user ? (
          <>
            <div className="flex items-center space-x-3">
              <span className="text-sm font-medium text-gray-600 dark:text-gray-400">
                Welcome back,
              </span>
              <span className="font-semibold text-gray-800 dark:text-gray-200 max-w-[150px] truncate">
                {user.name}
              </span>
            </div>
            <DropdownMenu>
              <DropdownMenuTrigger className="focus:outline-none">
                <div className="relative group">
                  <Avatar className="ring-2 ring-blue-500/30 hover:ring-blue-500/60 transition-all duration-300 cursor-pointer">
                    <AvatarImage src={user.photoUrl || ""} />
                    <AvatarFallback className="bg-gradient-to-br from-blue-500 to-purple-500 text-white font-semibold">
                      {user.name ? user.name.charAt(0).toUpperCase() : "U"}
                    </AvatarFallback>
                  </Avatar>
                  <div className="absolute -top-1 -right-1 w-4 h-4 bg-green-500 rounded-full border-2 border-white dark:border-slate-900 animate-pulse"></div>
                </div>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-56 dark:bg-slate-900 bg-white border border-gray-200/20 shadow-xl">
                <DropdownMenuLabel className="text-center py-3">
                  <div className="font-semibold text-gray-800 dark:text-gray-200">My Account</div>
                  <div className="text-xs text-gray-500 dark:text-gray-400 mt-1">{user.email}</div>
                </DropdownMenuLabel>
                <DropdownMenuSeparator className="bg-gray-200/20" />
                {user?.role === "student" ? (
                  <>
                    <DropdownMenuItem className="hover:bg-blue-50 dark:hover:bg-slate-800 transition-colors duration-200">
                      <Link to="profile" className="w-full">
                        <button className="w-full text-left flex items-center space-x-2 py-2">
                          <span>👤</span>
                          <span>Profile</span>
                        </button>
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem className="hover:bg-blue-50 dark:hover:bg-slate-800 transition-colors duration-200">
                      <Link to="my-learning" className="w-full">
                        <button className="w-full text-left flex items-center space-x-2 py-2">
                          <span>📚</span>
                          <span>My Learning</span>
                        </button>
                      </Link>
                    </DropdownMenuItem>
                  </>
                ) : (
                  <>
                    <DropdownMenuItem className="hover:bg-blue-50 dark:hover:bg-slate-800 transition-colors duration-200">
                      <Link to="admin/ins-profile" className="w-full">
                        <button className="w-full text-left flex items-center space-x-2 py-2">
                          <span>👤</span>
                          <span>Profile</span>
                        </button>
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem className="hover:bg-blue-50 dark:hover:bg-slate-800 transition-colors duration-200">
                      <Link to="admin/dashboard" className="w-full">
                        <button className="w-full text-left flex items-center space-x-2 py-2">
                          <span>📊</span>
                          <span>Dashboard</span>
                        </button>
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem className="hover:bg-blue-50 dark:hover:bg-slate-800 transition-colors duration-200">
                      <Link to="admin/course" className="w-full">
                        <button className="w-full text-left flex items-center space-x-2 py-2">
                          <span>📖</span>
                          <span>Course</span>
                        </button>
                      </Link>
                    </DropdownMenuItem>
                  </>
                )}
                <DropdownMenuSeparator className="bg-gray-200/20" />
                <DropdownMenuItem className="hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors duration-200">
                  <Button 
                    onClick={handleLogout}
                    className="w-full bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white font-medium py-2 rounded-md transition-all duration-200 flex items-center justify-center space-x-2"
                  >
                    <span>🚪</span>
                    <span>Logout</span>
                  </Button>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </>
        ) : (
          <div className="flex space-x-3">
            <Button 
              onClick={handleLoginClick}
              className="bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white font-semibold px-6 py-2 rounded-lg transition-all duration-300 shadow-lg hover:shadow-xl hover:scale-105"
            >
              🔑 Login
            </Button>
            <Button 
              onClick={handleSignupClick}
              className="bg-gradient-to-r from-purple-500 to-purple-600 hover:from-purple-600 hover:to-purple-700 text-white font-semibold px-6 py-2 rounded-lg transition-all duration-300 shadow-lg hover:shadow-xl hover:scale-105"
            >
              ✨ Sign Up
            </Button>
          </div>
        )}
      </div>
    </div>
  );
};

export default Navbar;