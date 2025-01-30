import { useState } from "react";
import apiClient, { getCsrfToken } from "../api/axios";

export default function SuppliersForm() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    address: "",
    socials: ""
  });
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);
    
    try {
      await getCsrfToken(); // Ensure CSRF token is set
      const response = await apiClient.post("/api/suppliers", formData);
      console.log("Response:", response.data);
      setSuccess("Supplier information submitted successfully!");
  } catch (error) {
      console.error("Error submitting form:", error);
      setError(error.response?.data?.message || "Failed to submit supplier information.");
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
    <div className="min-h-screen flex items-center justify-center bg-gray-100 p-4">
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
            <label className="block text-sm font-medium text-gray-700">Email</label>
            <input 
              type="email" 
              name="email" 
              value={formData.email} 
              onChange={handleChange} 
              required
              className="mt-1 p-2 w-full border rounded-lg focus:ring focus:ring-blue-200 focus:border-blue-400"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Contact Phone</label>
            <input 
              type="tel" 
              name="phone" 
              value={formData.phone} 
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
          <button 
            type="submit" 
            className="w-full bg-blue-500 text-white p-2 rounded-lg hover:bg-blue-600 transition"
          >
            Submit
          </button>
        </form>
      </div>
    </div>
  );
}
