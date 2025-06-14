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
import { Separator } from "@/components/ui/separator";
import MyLearning from "./MyLearning";
import { useUniversalLogout } from "@/utils/authUtils";
import { useUserDetails } from "@/utils/useUserDetails";
import { useLoadUserQuery } from "@/features/api/authApi";
import { useState } from "react";
import { toast } from "react-toastify";
import axios from "axios";
import { Loader2, Edit, LogOut, User, Mail, Phone, Shield } from "lucide-react";
import { BASE_URL } from "@/Components/url";

const Profile = () => {
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
        `${BASE_URL}/user/profile/update`,
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
    <div className="min-h-screen bg-gray-50">
      <br />
      {/* Profile Section */}
      <div className="max-w-6xl mx-auto px-4 py-12">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">My Profile</h1>
          <p className="text-gray-600">Manage your account settings and preferences</p>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Profile Card */}
          <div className="lg:col-span-1">
            <Card className="shadow-lg">
              <CardContent className="p-8 text-center">
                <Avatar className="h-32 w-32 mx-auto mb-6 border-4 border-white shadow-lg">
                  <AvatarImage src={user.photoUrl || ""} className="object-cover" />
                  <AvatarFallback className="text-2xl font-semibold bg-gradient-to-br from-blue-500 to-purple-600 text-white">
                    {user.name ? user.name.charAt(0).toUpperCase() : "U"}
                  </AvatarFallback>
                </Avatar>
                
                <h2 className="text-2xl font-bold text-gray-900 mb-2">{user.name}</h2>
                <p className="text-gray-600 mb-6">{user.email}</p>
                
                <div className="space-y-3">
                  <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                    <DialogTrigger asChild>
                      <Button 
                        variant="default" 
                        onClick={openDialog} 
                        className="w-full bg-blue-600 hover:bg-blue-700"
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
                          className="bg-blue-600 hover:bg-blue-700"
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

          {/* Profile Details */}
          <div className="lg:col-span-2">
            <Card className="shadow-lg">
              <CardHeader>
                <CardTitle className="text-xl flex items-center gap-2">
                  <User className="h-5 w-5" />
                  Account Information
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
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
                      <Shield className="h-4 w-4" />
                      Account Role
                    </div>
                    <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${
                      user.role === 'admin' 
                        ? 'bg-purple-100 text-purple-800' 
                        : 'bg-green-100 text-green-800'
                    }`}>
                      {user.role.toUpperCase()}
                    </span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>

      <Separator className="my-8" />

      {/* My Learning Section */}
      <div className="pb-12">
        <MyLearning />
      </div>
    </div>
  );
};

export default Profile;