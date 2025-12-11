import React, { useState, useEffect } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import Cookies from "js-cookie";
import {
  User,
  Mail,
  Phone,
  MapPin,
  Calendar,
  CreditCard,
  Briefcase,
  Globe,
  Home,
  Building,
  Save,
  Loader2,
  CheckCircle,
  XCircle,
  Edit2,
  Camera,
} from "lucide-react";
import { toast } from "sonner";

const Profile = () => {
  const token = Cookies.get("token");
  const queryClient = useQueryClient();
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({});
  const [selectedImage, setSelectedImage] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);

  // Fetch donor profile
  const { data, isLoading, error } = useQuery({
    queryKey: ["donorProfile"],
    queryFn: async () => {
      const response = await fetch(
        "https://agstest.in/api2/public/api/fetch-donor-profile",
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      if (!response.ok) throw new Error("Failed to fetch profile");
      return response.json();
    },
  });

  // Update profile mutation
  const updateMutation = useMutation({
    mutationFn: async (updatedData) => {
      const formData = new FormData();

      // Append all form fields
      Object.keys(updatedData).forEach((key) => {
        if (
          key !== "image" &&
          updatedData[key] !== undefined &&
          updatedData[key] !== null
        ) {
          formData.append(key, updatedData[key]);
        }
      });

      // Append image if selected
      if (selectedImage) {
        formData.append("indicomp_image_logo", selectedImage);
      }

      const response = await fetch(
        "https://agstest.in/api2/public/api/update-donor-profile",
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
          },
          body: formData,
        }
      );

      if (!response.ok) throw new Error("Failed to update profile");
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries(["donorProfile"]);
      setIsEditing(false);
      setSelectedImage(null);
      toast.success("Profile updated successfully!");
    },
    onError: (error) => {
      toast.error(error.message || "Failed to update profile");
    },
  });

  // Initialize form data when data loads
  useEffect(() => {
    if (data?.data) {
      setFormData(data.data);
    }
  }, [data]);

  // Handle image selection
  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setSelectedImage(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  // Handle form input changes
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // Handle form submission
  const handleSubmit = (e) => {
    e.preventDefault();
    updateMutation.mutate(formData);
  };

  // Get image URL
  const getImageUrl = () => {
    if (imagePreview) return imagePreview;
    if (data?.data?.indicomp_image_logo) {
      const donorImageBase = data.image_url?.find(
        (img) => img.image_for === "Donor"
      )?.image_url;
      return `${donorImageBase}${data.data.indicomp_image_logo}`;
    }
    return data?.image_url?.find((img) => img.image_for === "No Image")
      ?.image_url;
  };

  if (isLoading) {
    return (
      <main className="px-4 md:px-8 pb-8 mx-auto">
        <div className="bg-gradient-to-br from-gray-100 to-amber-50 rounded-2xl p-4 shadow">
          <div className="text-center py-8">
            <div className="w-12 h-12 border-4 border-gray-900 border-t-amber-400 rounded-full animate-spin mx-auto mb-3"></div>
            <p className="text-gray-600 text-sm">Loading profile...</p>
          </div>
        </div>
      </main>
    );
  }

  if (error) {
    return (
      <main className="px-4 md:px-8 pb-8 mx-auto">
        <div className="bg-gradient-to-br from-gray-100 to-amber-50 rounded-2xl p-4 shadow">
          <div className="text-center py-8">
            <div className="text-red-500 text-3xl mb-3">⚠️</div>
            <h2 className="text-lg font-bold text-gray-900 mb-1">
              Error Loading Profile
            </h2>
            <p className="text-gray-600 text-sm">{error.message}</p>
          </div>
        </div>
      </main>
    );
  }

  const profile = data?.data || {};

  return (
    <>
      <main className=" px-8 pb-8 mx-auto">
        <div className="bg-gradient-to-br from-gray-100 to-amber-50 rounded-[3rem] p-8 shadow-lg">
          {/* Header */}
          <div className="flex flex-col md:flex-row md:items-center justify-between mb-6 gap-3">
            <div>
              <h1 className="text-2xl md:text-3xl font-bold text-gray-900">
                Profile Settings
              </h1>
              <p className="text-gray-600 text-sm">
                Manage your donor profile information
              </p>
            </div>

            <div className="flex items-center gap-2">
              {!isEditing ? (
                <button
                  onClick={() => setIsEditing(true)}
                  className="px-4 py-2 bg-gradient-to-r from-gray-900 to-gray-800 text-white rounded-lg font-medium hover:from-gray-800 hover:to-gray-700 transition-all shadow flex items-center gap-1 text-sm"
                >
                  <Edit2 className="w-3 h-3" />
                  Edit Profile
                </button>
              ) : (
                <>
                  <button
                    onClick={() => {
                      setIsEditing(false);
                      setFormData(profile);
                      setSelectedImage(null);
                      setImagePreview(null);
                    }}
                    className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg font-medium hover:bg-gray-50 transition-all flex items-center gap-1 text-sm"
                  >
                    <XCircle className="w-3 h-3" />
                    Cancel
                  </button>
                  <button
                    onClick={handleSubmit}
                    disabled={updateMutation.isLoading}
                    className="px-4 py-2 bg-gradient-to-r from-emerald-500 to-emerald-600 text-white rounded-lg font-medium hover:from-emerald-600 hover:to-emerald-700 transition-all shadow flex items-center gap-1 text-sm disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {updateMutation.isLoading ? (
                      <Loader2 className="w-3 h-3 animate-spin" />
                    ) : (
                      <Save className="w-3 h-3" />
                    )}
                    {updateMutation.isLoading ? "Saving..." : "Save"}
                  </button>
                </>
              )}
            </div>
          </div>

          <form onSubmit={handleSubmit}>
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
              {/* Left Column - Profile Image & Basic Info */}
              <div className="lg:col-span-1 space-y-4">
                {/* Combined Profile Image and Basic Info Card */}
                <div className="bg-white rounded-xl p-4 shadow border border-gray-200">
                  <div className="flex flex-col md:flex-row gap-4">
                    {/* Profile Image - Left Side */}
                    <div className="md:w-2/5 flex flex-col items-center">
                      <div className="relative">
                        <img
                          src={getImageUrl()}
                          alt={profile.indicomp_full_name}
                          className="w-32 h-32 rounded-lg object-cover shadow"
                        />
                        {isEditing && (
                          <>
                            <label
                              htmlFor="profile-image"
                              className="absolute bottom-2 right-2 bg-gradient-to-r from-gray-900 to-gray-800 text-white p-2 rounded-full cursor-pointer hover:from-gray-800 hover:to-gray-700 transition-all shadow text-xs"
                            >
                              <Camera className="w-3 h-3" />
                            </label>
                            <input
                              id="profile-image"
                              type="file"
                              accept="image/*"
                              onChange={handleImageChange}
                              className="hidden"
                            />
                          </>
                        )}
                      </div>
                    </div>

                    {/* Basic Info Fields - Right Side */}
                    <div className="md:w-3/5 space-y-2">
                      <div className="space-y-2">
                        <div className="flex items-center justify-between">
                          <span className="text-xs text-gray-600">
                            Full Name
                          </span>
                          <span className="inline-flex items-center gap-1 px-2 py-1 rounded text-xs font-medium bg-gradient-to-r from-green-100 to-green-200 text-green-800">
                            {profile.indicomp_full_name || "-"}
                          </span>
                        </div>

                        <div className="flex items-center justify-between">
                          <span className="text-xs text-gray-600">Title</span>
                          <span className="text-xs font-medium text-gray-900">
                            {profile.title || "—"}
                          </span>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-xs text-gray-600">Type</span>
                          <span className="text-xs font-medium text-gray-900">
                            <div className="inline-flex items-center gap-1 bg-gradient-to-r from-amber-100 to-amber-200 text-amber-800 px-2 py-1 rounded text-xs font-medium">
                              <User className="w-3 h-3" />
                              {profile.indicomp_type || "—"}
                            </div>
                          </span>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-xs text-gray-600">Gender</span>
                          <span className="text-xs font-medium text-gray-900">
                            {profile.indicomp_gender || "—"}
                          </span>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-xs text-gray-600">Mobile</span>
                          <span className="text-xs font-medium text-gray-900">
                            {profile.indicomp_mobile_phone || "—"}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Account Status */}
                <div className="bg-white rounded-xl p-4 shadow border border-gray-200">
                  <h3 className="text-base font-semibold text-gray-900 mb-3">
                    Account Status
                  </h3>
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-xs text-gray-600">Status</span>
                      <span className="inline-flex items-center gap-1 px-2 py-1 rounded text-xs font-medium bg-gradient-to-r from-green-100 to-green-200 text-green-800">
                        <CheckCircle className="w-3 h-3" />
                        {profile.indicomp_status}
                      </span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-xs text-gray-600">Last Login</span>
                      <span className="text-xs font-medium text-gray-900">
                        {profile.last_login
                          ? new Date(profile.last_login).toLocaleDateString()
                          : "—"}
                      </span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-xs text-gray-600">
                        Member Since
                      </span>
                      <span className="text-xs font-medium text-gray-900">
                        {profile.indicomp_joining_date
                          ? new Date(
                              profile.indicomp_joining_date
                            ).toLocaleDateString()
                          : "—"}
                      </span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-xs text-gray-600">FTS ID</span>
                      <span className="text-xs font-medium text-gray-900">
                        {profile.indicomp_fts_id || "—"}
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Right Columns - Form Fields */}
              <div className="lg:col-span-2 space-y-4">
                {/* All Form Fields in One Card */}
                <div className="bg-white rounded-xl p-4 shadow border border-gray-200">
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                    {/* DOB/Annual Day */}
                    <div className="space-y-1">
                      <label className="text-xs font-medium text-gray-700 flex items-center gap-1">
                        <Calendar className="w-3 h-3" />
                        DOB/Annual Day
                      </label>
                      {isEditing ? (
                        <input
                          type="date"
                          name="indicomp_dob_annualday"
                          value={formData.indicomp_dob_annualday || ""}
                          onChange={handleInputChange}
                          className="w-full px-3 py-2 bg-gray-50 border border-gray-300 rounded-md text-gray-900 focus:outline-none focus:ring-1 focus:ring-amber-500 text-sm"
                        />
                      ) : (
                        <div className="px-3 py-2 bg-gray-50 rounded-md text-sm text-gray-900">
                          {profile.indicomp_dob_annualday || "—"}
                        </div>
                      )}
                    </div>

                    {/* Date of Anniversary */}
                    <div className="space-y-1">
                      <label className="text-xs font-medium text-gray-700 flex items-center gap-1">
                        <Calendar className="w-3 h-3" />
                        Date of Anniversary
                      </label>
                      {isEditing ? (
                        <input
                          type="date"
                          name="indicomp_doa"
                          value={formData.indicomp_doa || ""}
                          onChange={handleInputChange}
                          className="w-full px-3 py-2 bg-gray-50 border border-gray-300 rounded-md text-gray-900 focus:outline-none focus:ring-1 focus:ring-amber-500 text-sm"
                        />
                      ) : (
                        <div className="px-3 py-2 bg-gray-50 rounded-md text-sm text-gray-900">
                          {profile.indicomp_doa || "—"}
                        </div>
                      )}
                    </div>

                    {/* PAN Number */}
                    <div className="space-y-1">
                      <label className="text-xs font-medium text-gray-700 flex items-center gap-1">
                        <CreditCard className="w-3 h-3" />
                        PAN Number
                      </label>
                      {isEditing ? (
                        <input
                          type="text"
                          name="indicomp_pan_no"
                          value={formData.indicomp_pan_no || ""}
                          onChange={handleInputChange}
                          className="w-full px-3 py-2 bg-gray-50 border border-gray-300 rounded-md text-gray-900 focus:outline-none focus:ring-1 focus:ring-amber-500 text-sm"
                        />
                      ) : (
                        <div className="px-3 py-2 bg-gray-50 rounded-md text-sm text-gray-900">
                          {profile.indicomp_pan_no || "—"}
                        </div>
                      )}
                    </div>

                

                    {/* WhatsApp Number */}
                    <div className="space-y-1">
                      <label className="text-xs font-medium text-gray-700 flex items-center gap-1">
                        <Phone className="w-3 h-3" />
                        WhatsApp Number
                      </label>
                      {isEditing ? (
                        <input
                          type="tel"
                          name="indicomp_mobile_whatsapp"
                          value={formData.indicomp_mobile_whatsapp || ""}
                          onChange={handleInputChange}
                          className="w-full px-3 py-2 bg-gray-50 border border-gray-300 rounded-md text-gray-900 focus:outline-none focus:ring-1 focus:ring-amber-500 text-sm"
                        />
                      ) : (
                        <div className="px-3 py-2 bg-gray-50 rounded-md text-sm text-gray-900">
                          {profile.indicomp_mobile_whatsapp || "—"}
                        </div>
                      )}
                    </div>

                    {/* Email */}
                    <div className="space-y-1">
                      <label className="text-xs font-medium text-gray-700 flex items-center gap-1">
                        <Mail className="w-3 h-3" />
                        Email *
                      </label>
                      {isEditing ? (
                        <input
                          type="email"
                          name="indicomp_email"
                          value={formData.indicomp_email || ""}
                          onChange={handleInputChange}
                          className="w-full px-3 py-2 bg-gray-50 border border-gray-300 rounded-md text-gray-900 focus:outline-none focus:ring-1 focus:ring-amber-500 text-sm"
                          required
                        />
                      ) : (
                        <div className="px-3 py-2 bg-gray-50 rounded-md text-sm text-gray-900">
                          {profile.indicomp_email || "—"}
                        </div>
                      )}
                    </div>

                    {/* Website */}
                    <div className="space-y-1">
                      <label className="text-xs font-medium text-gray-700 flex items-center gap-1">
                        <Globe className="w-3 h-3" />
                        Website
                      </label>
                      {isEditing ? (
                        <input
                          type="url"
                          name="indicomp_website"
                          value={formData.indicomp_website || ""}
                          onChange={handleInputChange}
                          className="w-full px-3 py-2 bg-gray-50 border border-gray-300 rounded-md text-gray-900 focus:outline-none focus:ring-1 focus:ring-amber-500 text-sm"
                        />
                      ) : (
                        <div className="px-3 py-2 bg-gray-50 rounded-md text-sm text-gray-900">
                          {profile.indicomp_website || "—"}
                        </div>
                      )}
                    </div>

                    {/* Father's Name */}
                    <div className="space-y-1">
                      <label className="text-xs font-medium text-gray-700 flex items-center gap-1">
                        <User className="w-3 h-3" />
                        Father's Name
                      </label>
                      {isEditing ? (
                        <input
                          type="text"
                          name="indicomp_father_name"
                          value={formData.indicomp_father_name || ""}
                          onChange={handleInputChange}
                          className="w-full px-3 py-2 bg-gray-50 border border-gray-300 rounded-md text-gray-900 focus:outline-none focus:ring-1 focus:ring-amber-500 text-sm"
                        />
                      ) : (
                        <div className="px-3 py-2 bg-gray-50 rounded-md text-sm text-gray-900">
                          {profile.indicomp_father_name || "—"}
                        </div>
                      )}
                    </div>

                    {/* Mother's Name */}
                    <div className="space-y-1">
                      <label className="text-xs font-medium text-gray-700 flex items-center gap-1">
                        <User className="w-3 h-3" />
                        Mother's Name
                      </label>
                      {isEditing ? (
                        <input
                          type="text"
                          name="indicomp_mother_name"
                          value={formData.indicomp_mother_name || ""}
                          onChange={handleInputChange}
                          className="w-full px-3 py-2 bg-gray-50 border border-gray-300 rounded-md text-gray-900 focus:outline-none focus:ring-1 focus:ring-amber-500 text-sm"
                        />
                      ) : (
                        <div className="px-3 py-2 bg-gray-50 rounded-md text-sm text-gray-900">
                          {profile.indicomp_mother_name || "—"}
                        </div>
                      )}
                    </div>

                    {/* Spouse's Name */}
                    <div className="space-y-1">
                      <label className="text-xs font-medium text-gray-700 flex items-center gap-1">
                        <User className="w-3 h-3" />
                        Spouse's Name
                      </label>
                      {isEditing ? (
                        <input
                          type="text"
                          name="indicomp_spouse_name"
                          value={formData.indicomp_spouse_name || ""}
                          onChange={handleInputChange}
                          className="w-full px-3 py-2 bg-gray-50 border border-gray-300 rounded-md text-gray-900 focus:outline-none focus:ring-1 focus:ring-amber-500 text-sm"
                        />
                      ) : (
                        <div className="px-3 py-2 bg-gray-50 rounded-md text-sm text-gray-900">
                          {profile.indicomp_spouse_name || "—"}
                        </div>
                      )}
                    </div>

                    {/* Residential Address */}
                    <div className="md:col-span-2 space-y-1">
                      <label className="text-xs font-medium text-gray-700 flex items-center gap-1">
                        <Home className="w-3 h-3" />
                        Residential Address
                      </label>
                      {isEditing ? (
                        <textarea
                          name="indicomp_res_reg_address"
                          value={formData.indicomp_res_reg_address || ""}
                          onChange={handleInputChange}
                          rows="2"
                          className="w-full px-3 py-2 bg-gray-50 border border-gray-300 rounded-md text-gray-900 focus:outline-none focus:ring-1 focus:ring-amber-500 text-sm"
                        />
                      ) : (
                        <div className="px-3 py-2 bg-gray-50 rounded-md text-sm text-gray-900">
                          {profile.indicomp_res_reg_address || "—"}
                        </div>
                      )}
                    </div>

                    {/* Area */}
                    <div className="space-y-1">
                      <label className="text-xs font-medium text-gray-700 flex items-center gap-1">
                        <MapPin className="w-3 h-3" />
                        Area
                      </label>
                      {isEditing ? (
                        <input
                          type="text"
                          name="indicomp_res_reg_area"
                          value={formData.indicomp_res_reg_area || ""}
                          onChange={handleInputChange}
                          className="w-full px-3 py-2 bg-gray-50 border border-gray-300 rounded-md text-gray-900 focus:outline-none focus:ring-1 focus:ring-amber-500 text-sm"
                        />
                      ) : (
                        <div className="px-3 py-2 bg-gray-50 rounded-md text-sm text-gray-900">
                          {profile.indicomp_res_reg_area || "—"}
                        </div>
                      )}
                    </div>

                    {/* Landmark */}
                    <div className="space-y-1">
                      <label className="text-xs font-medium text-gray-700 flex items-center gap-1">
                        <MapPin className="w-3 h-3" />
                        Landmark
                      </label>
                      {isEditing ? (
                        <input
                          type="text"
                          name="indicomp_res_reg_ladmark"
                          value={formData.indicomp_res_reg_ladmark || ""}
                          onChange={handleInputChange}
                          className="w-full px-3 py-2 bg-gray-50 border border-gray-300 rounded-md text-gray-900 focus:outline-none focus:ring-1 focus:ring-amber-500 text-sm"
                        />
                      ) : (
                        <div className="px-3 py-2 bg-gray-50 rounded-md text-sm text-gray-900">
                          {profile.indicomp_res_reg_ladmark || "—"}
                        </div>
                      )}
                    </div>

                    {/* City */}
                    <div className="space-y-1">
                      <label className="text-xs font-medium text-gray-700 flex items-center gap-1">
                        <MapPin className="w-3 h-3" />
                        City
                      </label>
                      {isEditing ? (
                        <input
                          type="text"
                          name="indicomp_res_reg_city"
                          value={formData.indicomp_res_reg_city || ""}
                          onChange={handleInputChange}
                          className="w-full px-3 py-2 bg-gray-50 border border-gray-300 rounded-md text-gray-900 focus:outline-none focus:ring-1 focus:ring-amber-500 text-sm"
                        />
                      ) : (
                        <div className="px-3 py-2 bg-gray-50 rounded-md text-sm text-gray-900">
                          {profile.indicomp_res_reg_city || "—"}
                        </div>
                      )}
                    </div>

                    {/* State */}
                    <div className="space-y-1">
                      <label className="text-xs font-medium text-gray-700 flex items-center gap-1">
                        <MapPin className="w-3 h-3" />
                        State
                      </label>
                      {isEditing ? (
                        <input
                          type="text"
                          name="indicomp_res_reg_state"
                          value={formData.indicomp_res_reg_state || ""}
                          onChange={handleInputChange}
                          className="w-full px-3 py-2 bg-gray-50 border border-gray-300 rounded-md text-gray-900 focus:outline-none focus:ring-1 focus:ring-amber-500 text-sm"
                        />
                      ) : (
                        <div className="px-3 py-2 bg-gray-50 rounded-md text-sm text-gray-900">
                          {profile.indicomp_res_reg_state || "—"}
                        </div>
                      )}
                    </div>

                    {/* PIN Code */}
                    <div className="space-y-1">
                      <label className="text-xs font-medium text-gray-700 flex items-center gap-1">
                        <MapPin className="w-3 h-3" />
                        PIN Code
                      </label>
                      {isEditing ? (
                        <input
                          type="text"
                          name="indicomp_res_reg_pin_code"
                          value={formData.indicomp_res_reg_pin_code || ""}
                          onChange={handleInputChange}
                          className="w-full px-3 py-2 bg-gray-50 border border-gray-300 rounded-md text-gray-900 focus:outline-none focus:ring-1 focus:ring-amber-500 text-sm"
                        />
                      ) : (
                        <div className="px-3 py-2 bg-gray-50 rounded-md text-sm text-gray-900">
                          {profile.indicomp_res_reg_pin_code || "—"}
                        </div>
                      )}
                    </div>

                    {/* Office Address */}
                    <div className="md:col-span-2 space-y-1">
                      <label className="text-xs font-medium text-gray-700 flex items-center gap-1">
                        <Building className="w-3 h-3" />
                        Office Address
                      </label>
                      {isEditing ? (
                        <textarea
                          name="indicomp_off_branch_address"
                          value={formData.indicomp_off_branch_address || ""}
                          onChange={handleInputChange}
                          rows="2"
                          className="w-full px-3 py-2 bg-gray-50 border border-gray-300 rounded-md text-gray-900 focus:outline-none focus:ring-1 focus:ring-amber-500 text-sm"
                        />
                      ) : (
                        <div className="px-3 py-2 bg-gray-50 rounded-md text-sm text-gray-900">
                          {profile.indicomp_off_branch_address || "—"}
                        </div>
                      )}
                    </div>

                    {/* Source */}
                    <div className="space-y-1">
                      <label className="text-xs font-medium text-gray-700 flex items-center gap-1">
                        <User className="w-3 h-3" />
                        Source
                      </label>
                      {isEditing ? (
                        <input
                          type="text"
                          name="indicomp_source"
                          value={formData.indicomp_source || ""}
                          onChange={handleInputChange}
                          className="w-full px-3 py-2 bg-gray-50 border border-gray-300 rounded-md text-gray-900 focus:outline-none focus:ring-1 focus:ring-amber-500 text-sm"
                        />
                      ) : (
                        <div className="px-3 py-2 bg-gray-50 rounded-md text-sm text-gray-900">
                          {profile.indicomp_source || "—"}
                        </div>
                      )}
                    </div>

                    {/* Donor Type */}
                    <div className="space-y-1">
                      <label className="text-xs font-medium text-gray-700 flex items-center gap-1">
                        <User className="w-3 h-3" />
                        Donor Type
                      </label>
                      {isEditing ? (
                        <input
                          type="text"
                          name="indicomp_donor_type"
                          value={formData.indicomp_donor_type || ""}
                          onChange={handleInputChange}
                          className="w-full px-3 py-2 bg-gray-50 border border-gray-300 rounded-md text-gray-900 focus:outline-none focus:ring-1 focus:ring-amber-500 text-sm"
                        />
                      ) : (
                        <div className="px-3 py-2 bg-gray-50 rounded-md text-sm text-gray-900">
                          {profile.indicomp_donor_type || "—"}
                        </div>
                      )}
                    </div>

                    {/* Remarks */}
                    <div className="md:col-span-2 space-y-1">
                      <label className="text-xs font-medium text-gray-700 flex items-center gap-1">
                        <Briefcase className="w-3 h-3" />
                        Remarks
                      </label>
                      {isEditing ? (
                        <textarea
                          name="indicomp_remarks"
                          value={formData.indicomp_remarks || ""}
                          onChange={handleInputChange}
                          rows="2"
                          className="w-full px-3 py-2 bg-gray-50 border border-gray-300 rounded-md text-gray-900 focus:outline-none focus:ring-1 focus:ring-amber-500 text-sm"
                        />
                      ) : (
                        <div className="px-3 py-2 bg-gray-50 rounded-md text-sm text-gray-900">
                          {profile.indicomp_remarks || "—"}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </form>
        </div>
      </main>
    </>
  );
};

export default Profile;
