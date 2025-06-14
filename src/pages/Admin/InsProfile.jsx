import { Avatar, AvatarImage, AvatarFallback } from "@/Components/ui/avatar";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { useUniversalLogout } from "@/utils/authUtils";
import { useUserDetails } from "@/utils/useUserDetails";
import { useLoadUserQuery } from "@/features/api/authApi";
import { useState } from "react";
import { toast } from "react-toastify";
import axios from "axios";
import { 
  Loader2, 
  Edit, 
  LogOut, 
  User, 
  Mail, 
  Phone, 
  GraduationCap,
  BookOpen,
  Users,
  Award
} from "lucide-react";
import { BASE_URL } from "@/Components/url";

const InsProfile = () => {
  const { user, isLoading, isError, error } = useUserDetails();

  const [name, setName] = useState(user?.name || "");
  const [profilePhoto, setProfilePhoto] = useState(null);

  const { refetch: refetchUserData } = useLoadUserQuery();

  const onChangeHandler = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 10485760) {
        alert("File size exceeds 10MB. Please upload a smaller file.");
        return;
      }
      setProfilePhoto(file);
    }
  };

  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isLD, setIsLD] = useState(false);

  const updateUserHandle = async (e) => {
    e.preventDefault();
    setIsLD(true);
    const formData = new FormData();
    formData.append("name", name);
    formData.append("profilePhoto", profilePhoto);

    try {
      const response = await axios.put(
        `${BASE_URL}/profile/update`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
          withCredentials: true,
        }
      );
      setIsDialogOpen(false);
      console.log("Success:", response.data);
      toast.success("Profile updated successfully!");
    } catch (error) {
      setIsDialogOpen(true);
      console.error("Upload Error:", error);
      toast.error("Upload failed!");
    } finally {
      refetchUserData();
      setIsLD(false);
    }
  };

  const openDialog = () => {
    setIsDialogOpen(true);
  };

  const handleLogout = useUniversalLogout();

  if (isLoading) return (
    <div className="flex items-center justify-center min-h-screen">
      <div className="text-xl">Loading...</div>
    </div>
  );
  
  if (isError) return (
    <div className="flex items-center justify-center min-h-screen">
      <div className="text-xl text-red-500">Error: {error.message}</div>
    </div>
  );
  
  if (!user) return (
    <div className="flex items-center justify-center min-h-screen">
      <div className="text-xl">No user data found</div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      {/* Header Section */}
      <div className="bg-gradient-to-r from-blue-600 to-indigo-700 text-white">
        <div className="max-w-6xl mx-auto px-4 py-8">
          <div className="text-center">
            <h1 className="text-3xl font-bold mb-2">Instructor Dashboard</h1>
            <p className="text-blue-100">Manage your teaching profile and courses</p>
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 py-8">
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Profile Card */}
          <div className="lg:col-span-1">
            <Card className="shadow-xl border-0 bg-white/80 backdrop-blur-sm">
              <CardContent className="p-8 text-center">
                <div className="relative inline-block mb-6">
                  <Avatar className="h-32 w-32 mx-auto border-4 border-white shadow-xl">
                    <AvatarImage src={user.photoUrl || ""} className="object-cover" />
                    <AvatarFallback className="text-2xl font-semibold bg-gradient-to-br from-blue-500 to-indigo-600 text-white">
                      {user.name ? user.name.charAt(0).toUpperCase() : "I"}
                    </AvatarFallback>
                  </Avatar>
                  <div className="absolute -bottom-2 -right-2">
                    <Badge className="bg-gradient-to-r from-blue-500 to-indigo-600 text-white border-0">
                      <GraduationCap className="h-3 w-3 mr-1" />
                      Instructor
                    </Badge>
                  </div>
                </div>
                
                <h2 className="text-2xl font-bold text-gray-900 mb-2">{user.name}</h2>
                <p className="text-gray-600 mb-6">{user.email}</p>
                
                {/* Quick Stats */}
                <div className="grid grid-cols-2 gap-4 mb-6">
                  <div className="text-center p-3 bg-gradient-to-br from-blue-50 to-indigo-50 rounded-lg">
                    <BookOpen className="h-6 w-6 mx-auto mb-1 text-blue-600" />
                    <div className="text-2xl font-bold text-gray-900">12</div>
                    <div className="text-xs text-gray-600">Courses</div>
                  </div>
                  <div className="text-center p-3 bg-gradient-to-br from-green-50 to-emerald-50 rounded-lg">
                    <Users className="h-6 w-6 mx-auto mb-1 text-green-600" />
                    <div className="text-2xl font-bold text-gray-900">1.2K</div>
                    <div className="text-xs text-gray-600">Students</div>
                  </div>
                </div>
                
                <div className="space-y-3">
                  <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                    <DialogTrigger asChild>
                      <Button 
                        variant="default" 
                        onClick={openDialog} 
                        className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 border-0 shadow-lg"
                      >
                        <Edit className="mr-2 h-4 w-4" />
                        Edit Profile
                      </Button>
                    </DialogTrigger>
                    <DialogContent className="sm:max-w-[425px]">
                      <DialogHeader>
                        <DialogTitle>Edit Profile</DialogTitle>
                        <DialogDescription>
                          Make changes to your profile here. Click save when you're done.
                        </DialogDescription>
                      </DialogHeader>
                      <div className="grid gap-4 py-4">
                        <div className="grid grid-cols-4 items-center gap-4">
                          <Label htmlFor="name" className="text-right font-medium">
                            Name
                          </Label>
                          <Input
                            type="text"
                            id="name"
                            value={name || user.name}
                            onChange={(e) => setName(e.target.value)}
                            className="col-span-3"
                            placeholder="Enter your name"
                          />
                        </div>
                        
                        <div className="grid grid-cols-4 items-center gap-4">
                          <Label htmlFor="photoUrl" className="text-right font-medium">
                            Photo
                          </Label>
                          <Input
                            type="file"
                            id="photoUrl"
                            onChange={onChangeHandler}
                            accept="image/*"
                            className="col-span-3"
                          />
                        </div>
                        {profilePhoto && (
                          <p className="text-sm text-gray-500 text-center">
                            Selected: {profilePhoto.name}
                          </p>
                        )}
                      </div>
                      <DialogFooter>
                        <Button 
                          onClick={updateUserHandle} 
                          disabled={isLD}
                          className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700"
                        >
                          {isLD ? (
                            <>
                              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                              Saving...
                            </>
                          ) : (
                            "Save Changes"
                          )}
                        </Button>
                      </DialogFooter>
                    </DialogContent>
                  </Dialog>
                  
                  <Button 
                    variant="outline" 
                    onClick={handleLogout}
                    className="w-full border-red-200 text-red-600 hover:bg-red-50 hover:border-red-300"
                  >
                    <LogOut className="mr-2 h-4 w-4" />
                    Logout
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Personal Information */}
            <Card className="shadow-xl border-0 bg-white/80 backdrop-blur-sm">
              <CardHeader className="bg-gradient-to-r from-blue-500 to-indigo-600 text-white rounded-t-lg">
                <CardTitle className="text-xl flex items-center gap-2">
                  <User className="h-5 w-5" />
                  Personal Information
                </CardTitle>
              </CardHeader>
              <CardContent className="p-6">
                <div className="grid md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <div className="flex items-center gap-2 text-sm font-medium text-gray-500 uppercase tracking-wide">
                      <User className="h-4 w-4" />
                      Full Name
                    </div>
                    <p className="text-lg font-semibold text-gray-900">{user.name}</p>
                  </div>
                  
                  <div className="space-y-2">
                    <div className="flex items-center gap-2 text-sm font-medium text-gray-500 uppercase tracking-wide">
                      <Mail className="h-4 w-4" />
                      Email Address
                    </div>
                    <p className="text-lg font-semibold text-gray-900">{user.email}</p>
                  </div>
                  
                  <div className="space-y-2">
                    <div className="flex items-center gap-2 text-sm font-medium text-gray-500 uppercase tracking-wide">
                      <Phone className="h-4 w-4" />
                      Phone Number
                    </div>
                    <p className="text-lg font-semibold text-gray-900">{user.phone || "Not provided"}</p>
                  </div>
                  
                  <div className="space-y-2">
                    <div className="flex items-center gap-2 text-sm font-medium text-gray-500 uppercase tracking-wide">
                      <GraduationCap className="h-4 w-4" />
                      Account Role
                    </div>
                    <Badge className="bg-gradient-to-r from-blue-500 to-indigo-600 text-white border-0">
                      <Award className="h-3 w-3 mr-1" />
                      {user.role.toUpperCase()}
                    </Badge>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Teaching Statistics */}
            <Card className="shadow-xl border-0 bg-white/80 backdrop-blur-sm">
              <CardHeader className="bg-gradient-to-r from-green-500 to-emerald-600 text-white rounded-t-lg">
                <CardTitle className="text-xl flex items-center gap-2">
                  <BookOpen className="h-5 w-5" />
                  Teaching Overview
                </CardTitle>
              </CardHeader>
              <CardContent className="p-6">
                <div className="grid md:grid-cols-3 gap-6">
                  <div className="text-center p-4 bg-gradient-to-br from-blue-50 to-indigo-50 rounded-lg">
                    <BookOpen className="h-8 w-8 mx-auto mb-2 text-blue-600" />
                    <div className="text-3xl font-bold text-gray-900 mb-1">12</div>
                    <div className="text-sm text-gray-600">Total Courses</div>
                  </div>
                  
                  <div className="text-center p-4 bg-gradient-to-br from-green-50 to-emerald-50 rounded-lg">
                    <Users className="h-8 w-8 mx-auto mb-2 text-green-600" />
                    <div className="text-3xl font-bold text-gray-900 mb-1">1,234</div>
                    <div className="text-sm text-gray-600">Total Students</div>
                  </div>
                  
                  <div className="text-center p-4 bg-gradient-to-br from-purple-50 to-violet-50 rounded-lg">
                    <Award className="h-8 w-8 mx-auto mb-2 text-purple-600" />
                    <div className="text-3xl font-bold text-gray-900 mb-1">4.8</div>
                    <div className="text-sm text-gray-600">Average Rating</div>
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

export default InsProfile;