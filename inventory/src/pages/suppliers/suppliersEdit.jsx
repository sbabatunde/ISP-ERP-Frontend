import { Camera, Upload, Loader2, Info, Phone, Mail, Building } from "lucide-react";
import { useParams, useNavigate } from "react-router-dom";
import { fetchSupplierDetails } from "../../api/axios";
import { useEffect, useState } from "react";

export default function SuppliersEdit() {
    const { id } = useParams();
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        name: "",
        contact_name: '',
        address: '',
        contact_email: '',
        contact_phone: '',
    });
    const [loading, setLoading] = useState(true);
    const [imagePreview, setImagePreview] = useState(null);
    const [supplierDetails, setSupplierDetails] = useState();
    const [error, setError] = useState(null);
    const [isSubmitting, setIsSubmitting] = useState(false);

    useEffect(() => {
        const loadData = async () => {
            try {
                const data = await fetchSupplierDetails(id);
                setSupplierDetails(data);
                setFormData({
                    contact_name: data.contact_name || '',
                    address: data.address || '',
                    contact_email: data.contact_email || '',
                    contact_phone: data.contact_phone || '',
                    name: data.name || ''
                });
            } catch (error) {
                console.error("Error loading supplier details:", error);
                setError("Failed to load supplier details");
            } finally {
                setLoading(false);
            }
        };

        loadData();
    }, [id]);

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

    const handleSubmit = (e) => {
        e.preventDefault();
        setIsSubmitting(true);
        // Add your submission logic here
        console.log("Form submitted:", formData);
        // Simulate API call
        setTimeout(() => {
            setIsSubmitting(false);
            navigate("/suppliers-list");
        }, 1500);
    };

    return (
        <div className="w-full min-h-screen py-6 max-w-7xl mx-auto">
            {/* Header Section */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
                <div className="flex items-center gap-3">
                    <div className="bg-pink-100 dark:bg-pink-900/20 p-2.5 rounded-lg">
                        <Building className="h-5 w-5 text-pink-600 dark:text-pink-400" />
                    </div>
                    <div>
                        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Edit Supplier</h1>
                        <p className="text-sm text-gray-500 dark:text-gray-400">Update supplier information</p>
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
                                ) : supplierDetails?.image ? (
                                    <img 
                                        src={supplierDetails.image} 
                                        alt="Supplier" 
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
                {loading ? (
                    <div className="lg:col-span-3 flex items-center justify-center h-64">
                        <Loader2 className="w-8 h-8 text-pink-500 animate-spin" />
                    </div>
                ) : (
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
                                            onChange={(e) => setFormData({...formData, name: e.target.value})}
                                            required
                                            className="w-full px-3 py-2 text-sm rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 focus:ring-2 focus:ring-pink-500 focus:border-transparent text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500"
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
                                            onChange={(e) => setFormData({...formData, contact_name: e.target.value})}
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
                                                onChange={(e) => setFormData({...formData, contact_email: e.target.value})}
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
                                                onChange={(e) => setFormData({...formData, contact_phone: e.target.value})}
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
                                        onChange={(e) => setFormData({...formData, address: e.target.value})}
                                        required
                                        rows={3}
                                        className="w-full px-3 py-2 text-sm rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 focus:ring-2 focus:ring-pink-500 focus:border-transparent text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500"
                                        placeholder="123 Main St, City, Country"
                                    />
                                </div>
                            </div>

                            {/* Form Footer */}
                            <div className="p-6 bg-gray-50 dark:bg-gray-800/30 flex flex-col sm:flex-row justify-between items-center gap-4">
                                {error && (
                                    <div className="text-red-600 dark:text-red-400 text-sm flex items-center gap-2 bg-red-50 dark:bg-red-900/20 px-3 py-2 rounded-lg">
                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                                            <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                                        </svg>
                                        {error}
                                    </div>
                                )}
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
                                        "Save Changes"
                                    )}
                                </button>
                            </div>
                        </form>
                    </div>
                )}
            </div>
        </div>
    );
}