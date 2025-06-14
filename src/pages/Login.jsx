import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  useRegisterUserMutation,
  useLoginUserMutation,
} from "../features/api/authApi";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import { Loader2 } from "lucide-react";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const Login = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const initialTab = location.state?.tab || "signup";
  const [signup, setSignup] = useState({
    name: "",
    email: "",
    phone: "",
    password: "",
    role: "student",
  });
  const [login, setLogin] = useState({
    identifier: "",
    password: "",
  });

  const [
    registerUser,
    {
      data: registerData,
      error: registerError,
      isLoading: registerIsLoading,
      isSuccess: registerIsSuccess,
    },
  ] = useRegisterUserMutation();
  const [
    loginUser,
    {
      data: loginData,
      error: loginError,
      isLoading: loginIsLoading,
      isSuccess: loginIsSuccess,
    },
  ] = useLoginUserMutation();

  const [activeTab, setActiveTab] = useState(initialTab);

  const handleInputChange = (e, type) => {
    const { name, value } = e.target;
    if (type === "signup") {
      setSignup((prevState) => ({ ...prevState, [name]: value }));
    } else {
      setLogin((prevState) => ({ ...prevState, [name]: value }));
    }
  };

  const handleSelectChange = (value) => {
    setSignup((prevState) => ({ ...prevState, role: value }));
  };

  const handleSubmit = async (type) => {
    const inputData = type === "signup" ? signup : login;
    const action = type === "signup" ? registerUser : loginUser;

    try {
      const result = await action(inputData).unwrap();
      console.log("Submit result:", result);
      
      // Alternative: Handle navigation immediately after successful API call
      if (type === "signup") {
        toast.success(result.message || "Signup Successful!");
        setTimeout(() => {
          if (signup.role === "instructor") {
            console.log("Attempting navigation to /admin/dashboard");
            navigate("/admin/dashboard", { replace: true });
            // Alternative: Force navigation with window.location if navigate fails
            // window.location.href = "/admin/dashboard";
          } else {
            console.log("Attempting navigation to /");
            navigate("/", { replace: true });
            // window.location.href = "/";
          }
        }, 1000);
      } else {
        toast.success(result.message || "Login Successful!");
        setTimeout(() => {
          if (result.user?.role === "instructor") {
            console.log("Attempting navigation to /admin/dashboard");
            navigate("/admin/dashboard", { replace: true });
            // Alternative: Force navigation with window.location if navigate fails
            // window.location.href = "/admin/dashboard";
          } else {
            console.log("Attempting navigation to /");
            navigate("/", { replace: true });
            // window.location.href = "/";
          }
        }, 1000);
      }
    } catch (err) {
      console.error("Submit error:", err);
      if (err.data) {
        console.error("Server response data:", err.data);
        toast.error(err.data.message || "Operation failed!");
      } else {
        toast.error("Operation failed!");
      }
    }
  };

  useEffect(() => {
    if (registerIsSuccess && registerData) {
      console.log("Register success:", registerData);
      console.log("Signup role:", signup.role);
      toast.success(registerData.message || "Signup Successful!");
      setTimeout(() => {
        if (signup.role === "instructor") {
          console.log("Navigating to /admin/dashboard");
          navigate("/admin/dashboard");
        } else {
          console.log("Navigating to /");
          navigate("/");
        }
      }, 1000);
    }
    if (loginIsSuccess && loginData) {
      console.log("Login success:", loginData);
      console.log("User role:", loginData.user?.role);
      toast.success(loginData.message || "Login Successful!");
      setTimeout(() => {
        if (loginData.user?.role === "instructor") {
          console.log("Navigating to /admin/dashboard");
          navigate("/admin/dashboard");
        } else {
          console.log("Navigating to /");
          navigate("/");
        }
      }, 1000);
    }
    if (registerError) {
      console.log("Register error:", registerError);
      const errorMessage =
        registerError.data?.message ||
        registerError.message ||
        "Signup Failed!";
      toast.error(errorMessage);
    }
    if (loginError) {
      console.log("Login error:", loginError);
      const errorMessage =
        loginError.data?.message || loginError.message || "Login Failed!";
      toast.error(errorMessage);
    }
  }, [
    loginIsSuccess,
    registerIsSuccess,
    loginData,
    registerData,
    loginError,
    registerError,
    navigate,
    signup.role,
  ]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 flex items-center justify-center px-4 py-8">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Welcome</h1>
          <p className="text-gray-600">Join our learning community today</p>
        </div>
        
        <Tabs
          value={activeTab}
          onValueChange={setActiveTab}
          className="w-full"
        >
          <TabsList className="grid w-full grid-cols-2 mb-6 h-12 p-1 bg-gray-100 rounded-lg">
            <TabsTrigger 
              value="signup" 
              className="text-sm font-medium data-[state=active]:bg-white data-[state=active]:shadow-sm transition-all"
            >
              Create Account
            </TabsTrigger>
            <TabsTrigger 
              value="login"
              className="text-sm font-medium data-[state=active]:bg-white data-[state=active]:shadow-sm transition-all"
            >
              Sign In
            </TabsTrigger>
          </TabsList>

          <TabsContent value="signup" className="mt-0">
            <Card className="border-0 shadow-lg bg-white/80 backdrop-blur-sm">
              <CardHeader className="space-y-1 pb-6">
                <CardTitle className="text-2xl font-semibold text-center">Create Account</CardTitle>
                <CardDescription className="text-center text-gray-600">
                  Enter your details to get started with your learning journey
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4 px-6">
                <div className="space-y-2">
                  <Label htmlFor="name" className="text-sm font-medium text-gray-700">
                    Full Name
                  </Label>
                  <Input
                    type="text"
                    name="name"
                    onChange={(e) => handleInputChange(e, "signup")}
                    placeholder="Enter your full name"
                    className="h-11 border-gray-200 focus:border-blue-500 focus:ring-blue-500"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email" className="text-sm font-medium text-gray-700">
                    Email Address
                  </Label>
                  <Input
                    type="email"
                    name="email"
                    onChange={(e) => handleInputChange(e, "signup")}
                    placeholder="Enter your email address"
                    className="h-11 border-gray-200 focus:border-blue-500 focus:ring-blue-500"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="phone" className="text-sm font-medium text-gray-700">
                    Phone Number
                  </Label>
                  <Input
                    type="text"
                    name="phone"
                    onChange={(e) => handleInputChange(e, "signup")}
                    placeholder="Enter your phone number"
                    className="h-11 border-gray-200 focus:border-blue-500 focus:ring-blue-500"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="password" className="text-sm font-medium text-gray-700">
                    Password
                  </Label>
                  <Input
                    type="password"
                    name="password"
                    onChange={(e) => handleInputChange(e, "signup")}
                    placeholder="Create a strong password"
                    className="h-11 border-gray-200 focus:border-blue-500 focus:ring-blue-500"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="role" className="text-sm font-medium text-gray-700">
                    I am a
                  </Label>
                  <Select
                    name="role"
                    value={signup.role}
                    onValueChange={handleSelectChange}
                    required
                  >
                    <SelectTrigger className="h-11 border-gray-200 focus:border-blue-500 focus:ring-blue-500">
                      <SelectValue placeholder="Select your role" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="student">Student</SelectItem>
                      <SelectItem value="instructor">Instructor</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </CardContent>
              <CardFooter className="px-6 pt-4 pb-6">
                <Button
                  disabled={registerIsLoading}
                  onClick={() => handleSubmit("signup")}
                  className="w-full h-11 bg-blue-600 hover:bg-blue-700 text-white font-medium transition-colors"
                >
                  {registerIsLoading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Creating account...
                    </>
                  ) : (
                    "Create Account"
                  )}
                </Button>
              </CardFooter>
            </Card>
          </TabsContent>

          <TabsContent value="login" className="mt-0">
            <Card className="border-0 shadow-lg bg-white/80 backdrop-blur-sm">
              <CardHeader className="space-y-1 pb-6">
                <CardTitle className="text-2xl font-semibold text-center">Welcome Back</CardTitle>
                <CardDescription className="text-center text-gray-600">
                  Sign in to continue your learning journey
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4 px-6">
                <div className="space-y-2">
                  <Label htmlFor="identifier" className="text-sm font-medium text-gray-700">
                    Email or Phone
                  </Label>
                  <Input
                    type="text"
                    name="identifier"
                    onChange={(e) => handleInputChange(e, "login")}
                    placeholder="Enter your email or phone number"
                    className="h-11 border-gray-200 focus:border-blue-500 focus:ring-blue-500"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="password" className="text-sm font-medium text-gray-700">
                    Password
                  </Label>
                  <Input
                    type="password"
                    name="password"
                    onChange={(e) => handleInputChange(e, "login")}
                    placeholder="Enter your password"
                    className="h-11 border-gray-200 focus:border-blue-500 focus:ring-blue-500"
                    required
                  />
                </div>
              </CardContent>
              <CardFooter className="px-6 pt-4 pb-6">
                <Button
                  disabled={loginIsLoading}
                  onClick={() => handleSubmit("login")}
                  className="w-full h-11 bg-blue-600 hover:bg-blue-700 text-white font-medium transition-colors"
                >
                  {loginIsLoading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Signing in...
                    </>
                  ) : (
                    "Sign In"
                  )}
                </Button>
              </CardFooter>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default Login;