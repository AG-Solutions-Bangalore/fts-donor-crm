import { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import Cookies from "js-cookie";
import { Lock, Eye, EyeOff, Loader2, Key } from "lucide-react";
import { toast } from "sonner";


import {  Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger, } from "../ui/dialog";
import { Button } from "../ui/button";
import { useNavigate } from "react-router-dom";
import { appLogout } from "@/utils/logout";
import BASE_URL from "@/config/base-url";

export const ChangePasswordForm = () => {
  const token = Cookies.get("token");
  const userName = Cookies.get("user_name");
  const [showOldPassword, setShowOldPassword] = useState(false);
  const navigate = useNavigate()
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [passwordData, setPasswordData] = useState({
    old_password: "",
    new_password: "",
    confirm_password: "",
  });
  const [open, setOpen] = useState(false);

  // Change password mutation
  const changePasswordMutation = useMutation({
    mutationFn: async (data) => {
      const response = await fetch(
       `${BASE_URL}/api/panel-change-donor-password`,
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            username: userName,
            old_password: data.old_password,
            new_password: data.new_password,
          }),
        }
      );

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to change password");
      }
      return response.json();
    },
    onSuccess: () => {
      toast.success("Password changed successfully!");
      setPasswordData({
        old_password: "",
        new_password: "",
        confirm_password: "",
      });
      setOpen(false); // Close dialog on success

     setTimeout(()=>{
        appLogout()
        navigate('/')
        toast.success("Please Login with new crendential");
     },1000)
    },
    onError: (error) => {
      toast.error(error.message || "Failed to change password");
    },
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setPasswordData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    // Validation
    if (passwordData.old_password === passwordData.new_password) {
      toast.error("New password cannot be same as old password");
      return;
    }
    
    if (passwordData.new_password !== passwordData.confirm_password) {
      toast.error("New password and confirm password do not match");
      return;
    }
    
    if (passwordData.new_password.length < 6) {
      toast.error("Password must be at least 6 characters long");
      return;
    }
    
    changePasswordMutation.mutate(passwordData);
  };

  const handleOpenChange = (isOpen) => {
    setOpen(isOpen);
    // Reset form when dialog closes
    if (!isOpen) {
      setPasswordData({
        old_password: "",
        new_password: "",
        confirm_password: "",
      });
    }
  };

  return (
    <Dialog  open={open} onOpenChange={handleOpenChange}>
      <DialogTrigger asChild>
        <Button 
          variant="outline" 
          className="w-full flex items-center gap-2 justify-center"
        >
          <Key className="w-4 h-4" />
          Change Password
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md bg-gradient-to-br from-gray-100 to-amber-50
      ">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Key className="w-5 h-5" />
            Change Password
          </DialogTitle>
          <DialogDescription>
            Update your account password. Make sure your new password is strong and secure.
          </DialogDescription>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} noValidate>
          <div className="space-y-4 py-4">
            {/* Old Password */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700 flex items-center gap-1">
                <Lock className="w-4 h-4" />
                Old Password *
              </label>
              <div className="relative">
                <input
                  type={showOldPassword ? "text" : "password"}
                  name="old_password"
                  value={passwordData.old_password}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 bg-gray-50 border border-gray-300 rounded-md text-gray-900 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent text-sm pr-10"
                  required
                  placeholder="Enter current password"
                />
                <button
                  type="button"
                  onClick={() => setShowOldPassword(!showOldPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700"
                >
                  {showOldPassword ? (
                    <EyeOff className="w-4 h-4" />
                  ) : (
                    <Eye className="w-4 h-4" />
                  )}
                </button>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* New Password */}
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700 flex items-center gap-1">
                  <Lock className="w-4 h-4" />
                  New Password *
                </label>
                <div className="relative">
                  <input
                    type={showNewPassword ? "text" : "password"}
                    name="new_password"
                    value={passwordData.new_password}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 bg-gray-50 border border-gray-300 rounded-md text-gray-900 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent text-sm pr-10"
                    required
                    placeholder="Enter new password"
                  />
                  <button
                    type="button"
                    onClick={() => setShowNewPassword(!showNewPassword)}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700"
                  >
                    {showNewPassword ? (
                      <EyeOff className="w-4 h-4" />
                    ) : (
                      <Eye className="w-4 h-4" />
                    )}
                  </button>
                </div>
              </div>

              {/* Confirm Password */}
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700 flex items-center gap-1">
                  <Lock className="w-4 h-4" />
                  Confirm Password *
                </label>
                <div className="relative">
                  <input
                    type={showConfirmPassword ? "text" : "password"}
                    name="confirm_password"
                    value={passwordData.confirm_password}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 bg-gray-50 border border-gray-300 rounded-md text-gray-900 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent text-sm pr-10"
                    required
                    placeholder="Confirm new password"
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700"
                  >
                    {showConfirmPassword ? (
                      <EyeOff className="w-4 h-4" />
                    ) : (
                      <Eye className="w-4 h-4" />
                    )}
                  </button>
                </div>
              </div>
            </div>
          </div>

          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => setOpen(false)}
              disabled={changePasswordMutation.isLoading}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={changePasswordMutation.isLoading}
              className="bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700"
            >
              {changePasswordMutation.isLoading ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Changing Password...
                </>
              ) : (
                "Update Password"
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};