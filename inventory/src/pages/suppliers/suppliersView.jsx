import { Camera, Upload, Loader2, Info, Phone, Mail, Globe, Users, Building, Link2 } from "lucide-react";
import { useParams } from "react-router-dom";
import { fetchSupplierDetails } from "../../api/axios";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

export default function SuppliersView() {
    const { id } = useParams();
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        name: "",
        contact_name: '',
        address: '',
        contact_email: '',
        contact_phone: '',
        website: '',
        social_media: ''
    });
    const [loading, setLoading] = useState(true);
    const [imagePreview, setImagePreview] = useState(null);
    const [supplierDetails, setSupplierDetails] = useState();

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
                    name: data.name || '',
                    website: data.website || '',
                    social_media: data.social_media || 'No social media'
                });
            } catch (error) {
                console.error("Error loading supplier details:", error);
            } finally {
                setLoading(false);
            }
        };

        loadData();
    }, [id]);

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                setImagePreview(reader.result);
            };
            reader.readAsDataURL(file);
        }
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
                        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Supplier Details</h1>
                        <p className="text-sm text-gray-500 dark:text-gray-400">View and manage supplier information</p>
                    </div>
                </div>
                
                <button
                    onClick={() => navigate("/suppliers-list")}
                    className="px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-200 bg-pink-100 dark:bg-pink-700 hover:bg-pink-200 dark:hover:bg-pink-600 cursor-pointer rounded-lg transition-colors"
                >
                    Back to Suppliers
                </button>
            </div>

            {/* Main Content */}
            <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
                {/* Profile Picture Section */}
                <div className="lg:col-span-2 bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700">
                    <header className="border-b border-gray-200 dark:border-gray-700 px-6 py-4">
                        <h2 className="text-lg font-semibold text-gray-800 dark:text-white">Profile Picture</h2>
                    </header>
                    <div className="flex flex-col items-center p-6 gap-4">
                        <div className="relative group">
                            <div className="w-32 h-32 rounded-full bg-gray-100 dark:bg-gray-700 flex items-center justify-center overflow-hidden border-2 border-dashed border-gray-300 dark:border-gray-600">
                                {supplierDetails?.image ? (
                                    <img 
                                        src={supplierDetails.image} 
                                        alt="Supplier preview" 
                                        className="w-full h-full object-cover"
                                    />
                                ) : (
                                    <Camera className="w-10 h-10 text-gray-400 dark:text-gray-500" />
                                )}
                            </div>
                        </div>
                        
                        <div className="text-center space-y-2 w-full max-w-xs">
                            <p className="text-sm text-gray-500 dark:text-gray-400">
                                JPG or PNG. Max size of 1MB
                            </p>
                            <button 
                                className="px-4 py-2 bg-pink-50 dark:bg-pink-900/30 text-pink-600 dark:text-pink-400 rounded-lg hover:bg-pink-100 dark:hover:bg-pink-900/40 transition-colors duration-200 text-sm font-medium cursor-not-allowed opacity-50"
                                disabled
                            >
                                Change Photo
                            </button>
                        </div>
                    </div>
                </div>

                {/* Supplier Details Section */}
                {loading ? (
                    <div className="lg:col-span-3 flex items-center justify-center h-64">
                        <Loader2 className="w-8 h-8 text-pink-500 animate-spin" />
                    </div>
                ) : (
                    <div className="lg:col-span-3 bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden">
                        <div className="divide-y divide-gray-200 dark:divide-gray-700">
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
                                            Company Name
                                        </label>
                                        <div className="w-full px-3 py-2 text-sm rounded-lg bg-gray-50 dark:bg-gray-700/50 text-gray-900 dark:text-white border border-gray-200 dark:border-gray-700">
                                            {formData.name || 'N/A'}
                                        </div>
                                    </div>
                                    <div className="space-y-1">
                                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                                            Contact Person
                                        </label>
                                        <div className="w-full px-3 py-2 text-sm rounded-lg bg-gray-50 dark:bg-gray-700/50 text-gray-900 dark:text-white border border-gray-200 dark:border-gray-700">
                                            {formData.contact_name || 'N/A'}
                                        </div>
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
                                            Email
                                        </label>
                                        <div className="relative">
                                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                                <Mail className="h-4 w-4 text-gray-400 dark:text-gray-500" />
                                            </div>
                                            <div className="w-full pl-9 px-3 py-2 text-sm rounded-lg bg-gray-50 dark:bg-gray-700/50 text-gray-900 dark:text-white border border-gray-200 dark:border-gray-700">
                                                {formData.contact_email || 'N/A'}
                                            </div>
                                        </div>
                                    </div>
                                    <div className="space-y-1">
                                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                                            Phone
                                        </label>
                                        <div className="relative">
                                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                                <Phone className="h-4 w-4 text-gray-400 dark:text-gray-500" />
                                            </div>
                                            <div className="w-full pl-9 px-3 py-2 text-sm rounded-lg bg-gray-50 dark:bg-gray-700/50 text-gray-900 dark:text-white border border-gray-200 dark:border-gray-700">
                                                {formData.contact_phone || 'N/A'}
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                <div className="space-y-1">
                                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                                        Address
                                    </label>
                                    <div className="w-full px-3 py-2 text-sm rounded-lg bg-gray-50 dark:bg-gray-700/50 text-gray-900 dark:text-white border border-gray-200 dark:border-gray-700 min-h-[60px]">
                                        {formData.address || 'N/A'}
                                    </div>
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
                                            <div className="w-full pl-9 px-3 py-2 text-sm rounded-lg bg-gray-50 dark:bg-gray-700/50 text-gray-900 dark:text-white border border-gray-200 dark:border-gray-700">
                                                {formData.website ? (
                                                    <a 
                                                        href={formData.website} 
                                                        target="_blank" 
                                                        rel="noopener noreferrer"
                                                        className="text-blue-600 dark:text-blue-400 hover:underline"
                                                    >
                                                        {formData.website}
                                                    </a>
                                                ) : 'N/A'}
                                            </div>
                                        </div>
                                    </div>

                                    <div className="space-y-1">
                                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                                            Social Media
                                        </label>
                                        <div className="relative">
                                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                                <Users className="h-4 w-4 text-gray-400 dark:text-gray-500" />
                                            </div>
                                            <div className="w-full pl-9 px-3 py-2 text-sm rounded-lg bg-gray-50 dark:bg-gray-700/50 text-gray-900 dark:text-white border border-gray-200 dark:border-gray-700">
                                                {formData.social_media || 'N/A'}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Footer */}
                            <div className="p-6 bg-gray-50 dark:bg-gray-800/30 flex flex-col sm:flex-row justify-end items-center gap-4">
                                <button
                                    onClick={() => navigate(`/suppliers-edit/${id}`)}
                                    className="w-full sm:w-auto px-6 py-2.5 text-sm font-medium rounded-lg text-white bg-pink-600 hover:bg-pink-700 flex items-center justify-center gap-2 min-w-[150px] transition-colors"
                                >
                                    Edit Supplier
                                </button>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}