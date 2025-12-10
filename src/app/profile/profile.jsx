import React, { useState, useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import Cookies from 'js-cookie';
import { 
  User, Mail, Phone, MapPin, Calendar, CreditCard, 
  Briefcase, Globe, Home, Building, Save, Loader2,
  CheckCircle, XCircle, Edit2, Upload, Camera
} from 'lucide-react';
import { toast } from 'sonner';


const Profile = () => {
  const token = Cookies.get("token");
  const queryClient = useQueryClient();
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({});
  const [selectedImage, setSelectedImage] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);

  // Fetch donor profile
  const { data, isLoading, error } = useQuery({
    queryKey: ['donorProfile'],
    queryFn: async () => {
      const response = await fetch('https://agstest.in/api2/public/api/fetch-donor-profile', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      if (!response.ok) throw new Error('Failed to fetch profile');
      return response.json();
    }
  });

  // Update profile mutation
  const updateMutation = useMutation({
    mutationFn: async (updatedData) => {
      const formData = new FormData();
      
      // Append all form fields
      Object.keys(updatedData).forEach(key => {
        if (key !== 'image' && updatedData[key] !== undefined && updatedData[key] !== null) {
          formData.append(key, updatedData[key]);
        }
      });

      // Append image if selected
      if (selectedImage) {
        formData.append('indicomp_image_logo', selectedImage);
      }

      const response = await fetch('https://agstest.in/api2/public/api/update-donor-profile', {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: formData,
      });

      if (!response.ok) throw new Error('Failed to update profile');
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries(['donorProfile']);
      setIsEditing(false);
      setSelectedImage(null);
      toast.success('Profile updated successfully!');
    },
    onError: (error) => {
      toast.error(error.message || 'Failed to update profile');
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
    setFormData(prev => ({
      ...prev,
      [name]: value
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
      const donorImageBase = data.image_url?.find(img => img.image_for === "Donor")?.image_url;
      return `${donorImageBase}${data.data.indicomp_image_logo}`;
    }
    return data?.image_url?.find(img => img.image_for === "No Image")?.image_url;
  };

  // Personal Info Fields
  const personalFields = [
    { name: 'indicomp_full_name', label: 'Full Name', icon: User, type: 'text', required: true },
    { name: 'title', label: 'Title', icon: User, type: 'text', options: ['Mr.', 'Mrs.', 'Ms.', 'Dr.'] },
    { name: 'indicomp_type', label: 'Type', icon: User, type: 'select', options: ['Individual', 'Company', 'Trust', 'Private'] },
    { name: 'indicomp_gender', label: 'Gender', icon: User, type: 'select', options: ['Male', 'Female', 'Other'] },
    { name: 'indicomp_dob_annualday', label: 'Date of Birth/Annual Day', icon: Calendar, type: 'date' },
    { name: 'indicomp_doa', label: 'Date of Anniversary', icon: Calendar, type: 'date' },
    { name: 'indicomp_pan_no', label: 'PAN Number', icon: CreditCard, type: 'text' },
  ];

  // Contact Info Fields
  const contactFields = [
    { name: 'indicomp_mobile_phone', label: 'Mobile Phone', icon: Phone, type: 'tel', required: true },
    { name: 'indicomp_mobile_whatsapp', label: 'WhatsApp Number', icon: Phone, type: 'tel' },
    { name: 'indicomp_email', label: 'Email', icon: Mail, type: 'email', required: true },
    { name: 'indicomp_website', label: 'Website', icon: Globe, type: 'url' },
  ];

  // Company Info Fields (if applicable)
  const companyFields = [
    { name: 'indicomp_com_contact_name', label: 'Contact Person', icon: User, type: 'text' },
    { name: 'indicomp_com_contact_designation', label: 'Designation', icon: Briefcase, type: 'text' },
  ];

  // Family Info Fields
  const familyFields = [
    { name: 'indicomp_father_name', label: "Father's Name", icon: User, type: 'text' },
    { name: 'indicomp_mother_name', label: "Mother's Name", icon: User, type: 'text' },
    { name: 'indicomp_spouse_name', label: "Spouse's Name", icon: User, type: 'text' },
  ];

  // Residential Address Fields
  const residentialFields = [
    { name: 'indicomp_res_reg_address', label: 'Address', icon: Home, type: 'text' },
    { name: 'indicomp_res_reg_area', label: 'Area', icon: MapPin, type: 'text' },
    { name: 'indicomp_res_reg_ladmark', label: 'Landmark', icon: MapPin, type: 'text' },
    { name: 'indicomp_res_reg_city', label: 'City', icon: MapPin, type: 'text' },
    { name: 'indicomp_res_reg_state', label: 'State', icon: MapPin, type: 'text' },
    { name: 'indicomp_res_reg_pin_code', label: 'PIN Code', icon: MapPin, type: 'text' },
  ];

  // Office/Branch Address Fields
  const officeFields = [
    { name: 'indicomp_off_branch_address', label: 'Office Address', icon: Building, type: 'text' },
    { name: 'indicomp_off_branch_area', label: 'Area', icon: MapPin, type: 'text' },
    { name: 'indicomp_off_branch_ladmark', label: 'Landmark', icon: MapPin, type: 'text' },
    { name: 'indicomp_off_branch_city', label: 'City', icon: MapPin, type: 'text' },
    { name: 'indicomp_off_branch_state', label: 'State', icon: MapPin, type: 'text' },
    { name: 'indicomp_off_branch_pin_code', label: 'PIN Code', icon: MapPin, type: 'text' },
  ];

  // Other Fields
  const otherFields = [
    { name: 'indicomp_source', label: 'Source', icon: User, type: 'text' },
    { name: 'indicomp_promoter', label: 'Promoter (%)', icon: User, type: 'number' },
    { name: 'indicomp_is_promoter', label: 'Is Promoter', icon: User, type: 'select', options: ['Yes', 'No'] },
    { name: 'indicomp_corr_preffer', label: 'Correspondence Preference', icon: Mail, type: 'select', options: ['Residential', 'Registered', 'Office'] },
    { name: 'indicomp_csr', label: 'CSR', icon: Briefcase, type: 'text' },
    { name: 'indicomp_belongs_to', label: 'Belongs To', icon: User, type: 'text' },
    { name: 'indicomp_donor_type', label: 'Donor Type', icon: User, type: 'text' },
    { name: 'indicomp_remarks', label: 'Remarks', icon: Briefcase, type: 'textarea' },
  ];

  if (isLoading) {
    return (
      <main className="px-4 md:px-8 pb-8 mx-auto">
        <div className="bg-gradient-to-br from-gray-100 to-amber-50 rounded-[2rem] md:rounded-[3rem] p-8 shadow-lg">
          <div className="text-center py-12">
            <div className="w-16 h-16 border-4 border-gray-900 border-t-amber-400 rounded-full animate-spin mx-auto mb-4"></div>
            <p className="text-gray-600 font-medium">Loading profile...</p>
          </div>
        </div>
      </main>
    );
  }

  if (error) {
    return (
      <main className="px-4 md:px-8 pb-8 mx-auto">
        <div className="bg-gradient-to-br from-gray-100 to-amber-50 rounded-[2rem] md:rounded-[3rem] p-8 shadow-lg">
          <div className="text-center py-12">
            <div className="text-red-500 text-5xl mb-4">⚠️</div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Error Loading Profile</h2>
            <p className="text-gray-600">{error.message}</p>
          </div>
        </div>
      </main>
    );
  }

  const profile = data?.data || {};

  return (
    <>
   
      <main className="px-4 md:px-8 pb-8 mx-auto">
        <div className="bg-gradient-to-br from-gray-100 to-amber-50 rounded-[2rem] md:rounded-[3rem] p-4 md:p-8 shadow-lg">
          {/* Header */}
          <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-4">
            <div>
              <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-2">Profile Settings</h1>
              <p className="text-gray-600">Manage your donor profile information</p>
            </div>
            
            <div className="flex items-center gap-3">
              {!isEditing ? (
                <button
                  onClick={() => setIsEditing(true)}
                  className="px-6 py-3 bg-gradient-to-r from-gray-900 to-gray-800 text-white rounded-full font-medium hover:from-gray-800 hover:to-gray-700 transition-all shadow-md flex items-center gap-2"
                >
                  <Edit2 className="w-4 h-4" />
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
                    className="px-6 py-3 border-2 border-gray-300 text-gray-700 rounded-full font-medium hover:bg-gray-50 transition-all flex items-center gap-2"
                  >
                    <XCircle className="w-4 h-4" />
                    Cancel
                  </button>
                  <button
                    onClick={handleSubmit}
                    disabled={updateMutation.isLoading}
                    className="px-6 py-3 bg-gradient-to-r from-emerald-500 to-emerald-600 text-white rounded-full font-medium hover:from-emerald-600 hover:to-emerald-700 transition-all shadow-md flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {updateMutation.isLoading ? (
                      <Loader2 className="w-4 h-4 animate-spin" />
                    ) : (
                      <Save className="w-4 h-4" />
                    )}
                    {updateMutation.isLoading ? 'Saving...' : 'Save Changes'}
                  </button>
                </>
              )}
            </div>
          </div>

          <form onSubmit={handleSubmit}>
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Left Column - Profile Image & Basic Info */}
              <div className="lg:col-span-1 space-y-6">
                {/* Profile Image */}
                <div className="bg-white rounded-3xl p-6 shadow-sm border border-gray-200/50">
                  <div className="text-center">
                    <div className="relative inline-block mb-4">
                      <img
                        src={getImageUrl()}
                        alt={profile.indicomp_full_name}
                        className="w-48 h-48 rounded-2xl object-cover shadow-md mx-auto"
                      />
                      {isEditing && (
                        <>
                          <label
                            htmlFor="profile-image"
                            className="absolute bottom-4 right-4 bg-gradient-to-r from-gray-900 to-gray-800 text-white p-3 rounded-full cursor-pointer hover:from-gray-800 hover:to-gray-700 transition-all shadow-lg"
                          >
                            <Camera className="w-5 h-5" />
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
                    <h2 className="text-2xl font-bold text-gray-900 mb-1">
                      {profile.indicomp_full_name}
                    </h2>
                    <p className="text-gray-600 mb-3">{profile.title}</p>
                    <div className="inline-flex items-center gap-2 bg-gradient-to-r from-amber-100 to-amber-200 text-amber-800 px-4 py-2 rounded-full text-sm font-medium">
                      <User className="w-4 h-4" />
                      {profile.indicomp_type}
                    </div>
                  </div>
                </div>

                {/* Account Status */}
                <div className="bg-white rounded-3xl p-6 shadow-sm border border-gray-200/50">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Account Status</h3>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-gray-600">Status</span>
                      <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-sm font-medium bg-gradient-to-r from-green-100 to-green-200 text-green-800">
                        <CheckCircle className="w-4 h-4" />
                        {profile.indicomp_status}
                      </span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-gray-600">Last Login</span>
                      <span className="text-sm font-medium text-gray-900">
                        {new Date(profile.last_login).toLocaleString()}
                      </span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-gray-600">Member Since</span>
                      <span className="text-sm font-medium text-gray-900">
                        {new Date(profile.indicomp_joining_date).toLocaleDateString()}
                      </span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-gray-600">FTS ID</span>
                      <span className="text-sm font-medium text-gray-900">
                        {profile.indicomp_fts_id}
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Right Columns - Form Fields */}
              <div className="lg:col-span-2 space-y-6">
                {/* Personal Information */}
                <div className="bg-white rounded-3xl p-6 shadow-sm border border-gray-200/50">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                    <User className="w-5 h-5 text-gray-600" />
                    Personal Information
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {personalFields.map((field) => (
                      <div key={field.name} className="space-y-2">
                        <label className="text-sm font-medium text-gray-700 flex items-center gap-2">
                          <field.icon className="w-4 h-4" />
                          {field.label}
                          {field.required && <span className="text-red-500">*</span>}
                        </label>
                        {isEditing ? (
                          field.type === 'select' ? (
                            <select
                              name={field.name}
                              value={formData[field.name] || ''}
                              onChange={handleInputChange}
                              className="w-full px-4 py-3 bg-gray-50 border border-gray-300 rounded-xl text-gray-900 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                              required={field.required}
                            >
                              <option value="">Select {field.label}</option>
                              {field.options?.map(option => (
                                <option key={option} value={option}>{option}</option>
                              ))}
                            </select>
                          ) : (
                            <input
                              type={field.type}
                              name={field.name}
                              value={formData[field.name] || ''}
                              onChange={handleInputChange}
                              className="w-full px-4 py-3 bg-gray-50 border border-gray-300 rounded-xl text-gray-900 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                              required={field.required}
                            />
                          )
                        ) : (
                          <div className="px-4 py-3 bg-gray-50 rounded-xl text-gray-900">
                            {profile[field.name] || 'Not provided'}
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </div>

                {/* Contact Information */}
                <div className="bg-white rounded-3xl p-6 shadow-sm border border-gray-200/50">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                    <Phone className="w-5 h-5 text-gray-600" />
                    Contact Information
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {contactFields.map((field) => (
                      <div key={field.name} className="space-y-2">
                        <label className="text-sm font-medium text-gray-700 flex items-center gap-2">
                          <field.icon className="w-4 h-4" />
                          {field.label}
                          {field.required && <span className="text-red-500">*</span>}
                        </label>
                        {isEditing ? (
                          <input
                            type={field.type}
                            name={field.name}
                            value={formData[field.name] || ''}
                            onChange={handleInputChange}
                            className="w-full px-4 py-3 bg-gray-50 border border-gray-300 rounded-xl text-gray-900 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                            required={field.required}
                          />
                        ) : (
                          <div className="px-4 py-3 bg-gray-50 rounded-xl text-gray-900">
                            {profile[field.name] || 'Not provided'}
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </div>

                {/* Residential Address */}
                <div className="bg-white rounded-3xl p-6 shadow-sm border border-gray-200/50">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                    <Home className="w-5 h-5 text-gray-600" />
                    Residential Address
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {residentialFields.map((field) => (
                      <div key={field.name} className={field.name === 'indicomp_res_reg_address' ? 'md:col-span-2' : ''}>
                        <label className="text-sm font-medium text-gray-700 flex items-center gap-2 mb-2">
                          <field.icon className="w-4 h-4" />
                          {field.label}
                        </label>
                        {isEditing ? (
                          field.type === 'textarea' ? (
                            <textarea
                              name={field.name}
                              value={formData[field.name] || ''}
                              onChange={handleInputChange}
                              rows="3"
                              className="w-full px-4 py-3 bg-gray-50 border border-gray-300 rounded-xl text-gray-900 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                            />
                          ) : (
                            <input
                              type={field.type}
                              name={field.name}
                              value={formData[field.name] || ''}
                              onChange={handleInputChange}
                              className="w-full px-4 py-3 bg-gray-50 border border-gray-300 rounded-xl text-gray-900 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                            />
                          )
                        ) : (
                          <div className="px-4 py-3 bg-gray-50 rounded-xl text-gray-900">
                            {profile[field.name] || 'Not provided'}
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </div>

                {/* Other Information */}
                <div className="bg-white rounded-3xl p-6 shadow-sm border border-gray-200/50">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                    <Briefcase className="w-5 h-5 text-gray-600" />
                    Other Information
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {otherFields.map((field) => (
                      <div key={field.name} className={field.name === 'indicomp_remarks' ? 'md:col-span-2' : ''}>
                        <label className="text-sm font-medium text-gray-700 flex items-center gap-2 mb-2">
                          <field.icon className="w-4 h-4" />
                          {field.label}
                        </label>
                        {isEditing ? (
                          field.type === 'select' ? (
                            <select
                              name={field.name}
                              value={formData[field.name] || ''}
                              onChange={handleInputChange}
                              className="w-full px-4 py-3 bg-gray-50 border border-gray-300 rounded-xl text-gray-900 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                            >
                              <option value="">Select {field.label}</option>
                              {field.options?.map(option => (
                                <option key={option} value={option}>{option}</option>
                              ))}
                            </select>
                          ) : field.type === 'textarea' ? (
                            <textarea
                              name={field.name}
                              value={formData[field.name] || ''}
                              onChange={handleInputChange}
                              rows="3"
                              className="w-full px-4 py-3 bg-gray-50 border border-gray-300 rounded-xl text-gray-900 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                            />
                          ) : (
                            <input
                              type={field.type}
                              name={field.name}
                              value={formData[field.name] || ''}
                              onChange={handleInputChange}
                              className="w-full px-4 py-3 bg-gray-50 border border-gray-300 rounded-xl text-gray-900 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                            />
                          )
                        ) : (
                          <div className="px-4 py-3 bg-gray-50 rounded-xl text-gray-900">
                            {profile[field.name] || 'Not provided'}
                          </div>
                        )}
                      </div>
                    ))}
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