import { Camera, Upload, Loader2 } from "lucide-react";
import { useParams } from "react-router-dom";
import { fetchSupplierDetails } from "../../api/axios";
import { useEffect, useState } from "react";

export default function SuppliersEdit() {
    const { id } = useParams();
    const [formData, setFormData] = useState({
        name: "",
        contact_name: '',
        address: '',
        contact_email: '',
        contact_phone: '',
    });
    const [loading, setLoading] = useState(true);
    const [imagePreview, setImagePreview] = useState(null);
    const [supplierDetails,setSupplierDetails] = useState()

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
        <div className="max-w-6xl mx-auto  py-6">
            <div className="flex items-center justify-between mb-6">
                <h1 className="text-2xl font-bold text-gray-800">Edit Supplier</h1>
                <button className="px-4 py-2 bg-pink-600 text-white rounded-md hover:bg-pink-700 transition-colors flex items-center gap-2">
                    Save Changes
                </button>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
                {/* Profile Picture Section */}
                <div className="lg:col-span-2 bg-white rounded-lg shadow-sm border border-gray-100">
                    <header className="border-b border-gray-200 px-6 py-4">
                        <h2 className="text-lg font-semibold text-gray-800">Profile Picture</h2>
                    </header>
                    <div className="flex flex-col items-center p-6 gap-4">
                        <div className="relative group">
                            <div className="w-32 h-32 rounded-full bg-gray-100 flex items-center justify-center overflow-hidden border-2 border-dashed border-gray-300 hover:border-pink-500 transition-colors duration-200">
                                {imagePreview ? (
                                    <img 
                                        src={imagePreview} 
                                        alt="Supplier preview" 
                                        className="w-full h-full object-cover"
                                    />
                                ) : (
                                    <Camera className="w-10 h-10 text-gray-400 group-hover:text-pink-500 transition-colors duration-200" />
                                )}
                            </div>
                            <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-200 cursor-pointer">
                                <div className="bg-black bg-opacity-50 rounded-full p-2">
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
                            <p className="text-sm text-gray-500">
                                JPG or PNG. Max size of 1MB
                            </p>
                            <label className="cursor-pointer inline-block">
                                <div className="px-4 py-2 bg-pink-50 text-pink-600 rounded-md hover:bg-pink-100 transition-colors duration-200 text-sm font-medium">
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

                {/* Supplier Details Section */}
                {loading ? (
                    <div className="lg:col-span-3 flex items-center justify-center h-64">
                        <Loader2 className="w-8 h-8 text-pink-500 animate-spin" />
                    </div>
                ) : (
                    <div className="lg:col-span-3 bg-white rounded-lg shadow-sm border border-gray-100">
                        <header className="border-b border-gray-200 px-6 py-4">
                            <h2 className="text-lg font-semibold text-gray-800">Supplier Details</h2>
                        </header>
                        <div className="p-6 space-y-6">
                            {[
                                {
                                    label: "Supplier Name",
                                    key: "name",
                                    type: "text",
                                    required: true
                                },
                                {
                                    label: "Supplier Address",
                                    key: "address",
                                    type: "text",
                                    required: true
                                },
                                {
                                    label: "Supplier Contact",
                                    key: "contact_name",
                                    type: "text",
                                    required: true
                                },
                                {
                                    label: "Supplier Email",
                                    key: "contact_email",
                                    type: "email",
                                    required: true
                                },
                                {
                                    label: "Supplier Phone",
                                    key: "contact_phone",
                                    type: "tel",
                                    required: false
                                },
                            ].map((detail, index) => (
                                <div key={index} className="space-y-1">
                                    <label htmlFor={detail.key} className="block text-sm font-medium text-gray-700">
                                        {detail.label} {detail.required && <span className="text-red-500">*</span>}
                                    </label>
                                    <input
                                        type={detail.type}
                                        onChange={(e) => setFormData({ ...formData, [detail.key]: e.target.value })}
                                        value={formData[detail.key]}
                                        required={detail.required}
                                        id={detail.key}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-transparent transition-colors"
                                    />
                                </div>
                            ))}
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}