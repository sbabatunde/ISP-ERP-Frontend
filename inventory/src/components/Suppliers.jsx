import { useState } from "react";
import { useNavigate } from "react-router-dom";
import apiClient from "../api/axios";

export default function SuppliersForm() {
  const [formData, setFormData] = useState({
    name: "",
    contact_name: "",
    contact_email: "",
    contact_phone: "",
    address: "",
    socials: [],
    website: "",
  });
  const navigate= useNavigate();
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);
    setIsSubmitting(true);
    setIsSubmitted(false);
    
    try {
      // await getCsrfToken(); // Ensure CSRF token is set
      const response = await apiClient.post("/inventory/suppliers/store", formData);
      console.log("Response:", response.data);
      setSuccess("Supplier information submitted successfully!");
      setIsSubmitting(false);
      setIsSubmitted(true);
      setTimeout(() => setIsSubmitted(false), 2500);
      navigate('/inventory/suppliers-list')
  } catch (error) {
      console.error("Error submitting form:", error);
      setError(error.response?.data?.message || "Failed to submit supplier information.");
      setIsSubmitting(false);
  }
  };
// );
      
//       if (!response.ok) {
//         throw new Error(`Error: ${response.status} - ${response.statusText}`);
//       }
      
//       const data = await response.json();
//       console.log("Response:", data);
//       setSuccess("Supplier information submitted successfully!");
//     } catch (error) {
//       console.error("Error submitting form:", error);
//       setError(error.message || "Failed to submit supplier information.");
//     }
//   };

  return (
    <div className="min-h-screen flex items-center justify-center  bg-gradient-to-r from-pink-500 to-pink-200 p-4">
      <div className="bg-white p-6 rounded-2xl shadow-lg w-full max-w-lg">
        <h2 className="text-2xl font-semibold text-gray-800 mb-4 text-center">Supplier Registration</h2>
        {error && <p className="text-red-500 text-sm text-center">{error}</p>}
        {success && <p className="text-green-500 text-sm text-center">{success}</p>}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">Name</label>
            <input 
              type="text" 
              name="name" 
              value={formData.name} 
              onChange={handleChange} 
              required
              className="mt-1 p-2 w-full border rounded-lg focus:ring focus:ring-blue-200 focus:border-blue-400"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Contact Name</label>
            <input 
              type="text" 
              name="contact_name" 
              value={formData.contact_name} 
              onChange={handleChange} 
              required
              className="mt-1 p-2 w-full border rounded-lg focus:ring focus:ring-blue-200 focus:border-blue-400"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Email</label>
            <input 
              type="email" 
              name="contact_email" 
              value={formData.contact_email} 
              onChange={handleChange} 
              required
              className="mt-1 p-2 w-full border rounded-lg focus:ring focus:ring-blue-200 focus:border-blue-400"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Contact Phone</label>
            <input 
              type="tel" 
              name="contact_phone" 
              value={formData.contact_phone} 
              onChange={handleChange} 
              required
              className="mt-1 p-2 w-full border rounded-lg focus:ring focus:ring-blue-200 focus:border-blue-400"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Address</label>
            <textarea 
              name="address" 
              value={formData.address} 
              onChange={handleChange} 
              required
              className="mt-1 p-2 w-full border rounded-lg focus:ring focus:ring-blue-200 focus:border-blue-400"
            ></textarea>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Social Media Links</label>
            <input 
              type="text" 
              name="socials" 
              value={formData.socials} 
              onChange={handleChange} 
              placeholder="e.g., https://linkedin.com/in/example"
              className="mt-1 p-2 w-full border rounded-lg focus:ring focus:ring-blue-200 focus:border-blue-400"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">website</label>
            <input 
              type="text" 
              name="website" 
              value={formData.website} 
              onChange={handleChange} 
              placeholder="e.g., https://linkedin.com/in/example"
              className="mt-1 p-2 w-full border rounded-lg focus:ring focus:ring-blue-200 focus:border-blue-400"
            />
          </div>
          <button
            type="submit"
            className={`relative flex justify-center items-center gap-3 h-14 w-full px-6 rounded-full text-white bg-pink-500 hover:bg-pink-600 font-semibold transition-all duration-500 ease-in-out overflow-hidden ${
              isSubmitting || isSubmitted ? "registering" : ""
            }`}
          >
            <span className={`text-2xl transition-transform duration-[2s] ${isSubmitting ? "translate-x-[-250px]" : isSubmitted ? "translate-x-[34px]" : ""}`}>
              {isSubmitted ? "✔" : "📩"}
            </span>
            <span className={`text-lg font-semibold transition-transform duration-[2s] ${isSubmitting ? "translate-x-[300px]" : isSubmitted ? "translate-x-[34px]" : "translate-x-0"}`}>
              {isSubmitting ? "Submitting..." : isSubmitted ? "Submitted Successfully" : "Submit"}
            </span>
          </button>
        </form>
      </div>
    </div>
  );
}
