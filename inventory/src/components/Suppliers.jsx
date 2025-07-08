import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { createSupplier } from "../api/axios";
import { Camera, Upload, Loader2, Info, Phone, Mail, Globe, Users, Building, Link2 } from "lucide-react";

export default function SuppliersForm() {
  const [formData, setFormData] = useState({
    name: "",
    contact_name: "",
    contact_email: "",
    contact_phone: "",
    address: "",
    socials: "",
    website: "",
  });

  const navigate = useNavigate();
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [imagePreview, setImagePreview] = useState(null);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);
    setIsSubmitting(true);

    // Convert socials string to array
    const socialsArray = formData.socials 
      ? formData.socials.split(',').map(s => s.trim()).filter(s => s)
      : [];

    if(!formData.name || !formData.contact_name || !formData.contact_email || !formData.contact_phone || !formData.address) {
      setError("Please fill all required fields");
      setIsSubmitting(false);
      return;
    }

    try {
      await createSupplier({ ...formData, socials: socialsArray });
      setSuccess("Supplier created successfully!");
      setTimeout(() => navigate("/suppliers-list"), 1500);
    } catch (error) {
      setError(error.response?.data?.message || "Submission failed. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  useEffect(() => {
    if(success || error) {
      const timer = setTimeout(() => {
        setSuccess(null);
        setError(null);
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [success, error]);

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 1024 * 1024) { // 1MB limit
        setError("Image size must be less than 1MB");
        return;
      }
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="w-full min-h-screen py-6    max-w-7xl mx-auto">
      {/* Header Section */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
        <div className="flex items-center gap-3">
          <div className="bg-pink-100 dark:bg-pink-900/20 p-2.5 rounded-lg">
            <Building className="h-5 w-5 text-pink-600 dark:text-pink-400" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Add New Supplier</h1>
            <p className="text-sm text-gray-500 dark:text-gray-400">Enter supplier details below</p>
          </div>
        </div>
        
        <button
          onClick={() => navigate("/suppliers-list")}
          className="px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-200 bg-pink-100 dark:bg-pink-700 hover:bg-pink-200 dark:hover:bg-pink-600 cursor-pointer rounded-lg transition-colors"
        >
          Back to Suppliers
        </button>
      </div>

      {/* Main Form Content */}
      <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
        {/* Profile Picture Section */}
        <div className="lg:col-span-2 bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700">
          <header className="border-b border-gray-200 dark:border-gray-700 px-6 py-4">
            <h2 className="text-lg font-semibold text-gray-800 dark:text-white">Profile Picture</h2>
          </header>
          <div className="flex flex-col items-center p-6 gap-4">
            <div className="relative group">
              <div className="w-32 h-32 rounded-full bg-gray-100 dark:bg-gray-700 flex items-center justify-center overflow-hidden border-2 border-dashed border-gray-300 dark:border-gray-600 hover:border-pink-500 transition-colors duration-200">
                {imagePreview ? (
                  <img 
                    src={imagePreview} 
                    alt="Supplier preview" 
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <Camera className="w-10 h-10 text-gray-400 dark:text-gray-500 group-hover:text-pink-500 transition-colors duration-200" />
                )}
              </div>
              <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-200 cursor-pointer">
                <div className="bg-black/50 rounded-full p-2">
                  <Upload className="w-5 h-5 text-white" />
                </div>
              </div>
              <input 
                type="file" 
                onChange={handleImageChange}
                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                accept="image/jpeg,image/png"
              />
            </div>
            
            <div className="text-center space-y-2 w-full max-w-xs">
              <p className="text-sm text-gray-500 dark:text-gray-400">
                JPG or PNG. Max size of 1MB
              </p>
              <label className="cursor-pointer inline-block">
                <div className="px-4 py-2 bg-pink-50 dark:bg-pink-900/30 text-pink-600 dark:text-pink-400 rounded-lg hover:bg-pink-100 dark:hover:bg-pink-900/40 transition-colors duration-200 text-sm font-medium">
                  Upload New Photo
                </div>
                <input 
                  type="file" 
                  onChange={handleImageChange}
                  className="hidden" 
                  accept="image/jpeg,image/png" 
                />
              </label>
            </div>
          </div>
        </div>

        {/* Supplier Details Form */}
        <div className="lg:col-span-3 bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden">
          <form onSubmit={handleSubmit} className="divide-y divide-gray-200 dark:divide-gray-700">
            {/* Section 1: Basic Info */}
            <div className="p-6 space-y-5">
              <div className="flex items-center gap-3">
                <Info className="h-5 w-5 text-pink-600 dark:text-pink-400" />
                <h2 className="font-semibold text-gray-800 dark:text-white">
                  Basic Information
                </h2>
              </div>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                    Company Name <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    required
                    className="w-full px-3 py-2 text-sm rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 focus:ring-1 focus:ring-pink-200 focus:border-transparent text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500"
                    
                  />
                </div>
                <div className="space-y-1">
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                    Contact Person <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    name="contact_name"
                    value={formData.contact_name}
                    onChange={handleChange}
                    required
                    className="w-full px-3 py-2 text-sm rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 focus:ring-2 focus:ring-pink-500 focus:border-transparent text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500"
             
                  />
                </div>
              </div>
            </div>

            {/* Section 2: Contact Info */}
            <div className="p-6 space-y-5">
              <div className="flex items-center gap-3">
                <Phone className="h-5 w-5 text-pink-600 dark:text-pink-400" />
                <h2 className="font-semibold text-gray-800 dark:text-white">
                  Contact Information
                </h2>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                    Email <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <Mail className="h-4 w-4 text-gray-400 dark:text-gray-500" />
                    </div>
                    <input
                      type="email"
                      name="contact_email"
                      value={formData.contact_email}
                      onChange={handleChange}
                      required
                      className="w-full pl-9 px-3 py-2 text-sm rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 focus:ring-2 focus:ring-pink-500 focus:border-transparent text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500"
                      placeholder="contact@example.com"
                    />
                  </div>
                </div>
                <div className="space-y-1">
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                    Phone <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <Phone className="h-4 w-4 text-gray-400 dark:text-gray-500" />
                    </div>
                    <input
                      type="tel"
                      name="contact_phone"
                      value={formData.contact_phone}
                      onChange={handleChange}
                      required
                      className="w-full pl-9 px-3 py-2 text-sm rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 focus:ring-2 focus:ring-pink-500 focus:border-transparent text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500"
                      placeholder="+1 (555) 123-4567"
                    />
                  </div>
                </div>
              </div>

              <div className="space-y-1">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                  Address <span className="text-red-500">*</span>
                </label>
                <textarea
                  name="address"
                  value={formData.address}
                  onChange={handleChange}
                  required
                  rows={2}
                  className="w-full px-3 py-2 text-sm rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 focus:ring-2 focus:ring-pink-500 focus:border-transparent text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500"
                  placeholder="123 Main St, City, Country"
                />
              </div>
            </div>

            {/* Section 3: Digital Presence */}
            <div className="p-6 space-y-5">
              <div className="flex items-center gap-3">
                <Globe className="h-5 w-5 text-pink-600 dark:text-pink-400" />
                <h2 className="font-semibold text-gray-800 dark:text-white">
                  Digital Presence
                </h2>
              </div>

              <div className="space-y-4">
                <div className="space-y-1">
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                    Website
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <Link2 className="h-4 w-4 text-gray-400 dark:text-gray-500" />
                    </div>
                    <input
                      type="url"
                      name="website"
                      value={formData.website}
                      onChange={handleChange}
                      className="w-full pl-9 px-3 py-2 text-sm rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 focus:ring-2 focus:ring-pink-500 focus:border-transparent text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500"
                      placeholder="https://example.com"
                    />
                  </div>
                </div>

                <div className="space-y-1">
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                    Social Media Profiles
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <Users className="h-4 w-4 text-gray-400 dark:text-gray-500" />
                    </div>
                    <input
                      type="text"
                      name="socials"
                      value={formData.socials}
                      onChange={handleChange}
                      className="w-full pl-9 px-3 py-2 text-sm rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 focus:ring-2 focus:ring-pink-500 focus:border-transparent text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500"
                      placeholder="https://linkedin.com/company, https://twitter.com/company"
                    />
                  </div>
                  <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                    Enter comma-separated URLs of social media profiles
                  </p>
                </div>
              </div>
            </div>

            {/* Form Footer */}
            <div className="p-6 bg-gray-50 dark:bg-gray-800/30 flex flex-col sm:flex-row justify-between items-center gap-4">
              <div className="w-full sm:w-auto">
                {error && (
                  <div className="text-red-600 dark:text-red-400 text-sm flex items-center gap-2 bg-red-50 dark:bg-red-900/20 px-3 py-2 rounded-lg">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                    </svg>
                    {error}
                  </div>
                )}
                {success && (
                  <div className="text-green-600 dark:text-green-400 text-sm flex items-center gap-2 bg-green-50 dark:bg-green-900/20 px-3 py-2 rounded-lg">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                    {success}
                  </div>
                )}
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className={`w-full sm:w-auto px-6 py-2.5 text-sm font-medium rounded-lg text-white bg-pink-600 hover:bg-pink-700 flex items-center justify-center gap-2 min-w-[150px] transition-colors ${
                  isSubmitting ? "opacity-80 cursor-not-allowed" : ""
                }`}
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" />
                    Saving...
                  </>
                ) : (
                  "Save Supplier"
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}