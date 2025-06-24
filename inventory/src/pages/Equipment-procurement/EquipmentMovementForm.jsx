import React, { useState, useEffect } from "react";
import apiClient, { postEquipmentMovement } from '../../api/axios';

const EquipmentMovementForm = () => {
    const [formData, setFormData] = useState({
        from_location_type: "",
        from_location_id: "",
        to_location_type: "",
        to_location_id: "",
        movement_type: "",
        movement_date: "",
        logistics_cost: "",
        moved_by: "",
        handled_by: "",
        equipment_item_ids: []
    });

    const [locations, setLocations] = useState([]);
    const [equipmentItems, setEquipmentItems] = useState([]);
    const [users, setUsers] = useState([]);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isSubmitted, setIsSubmitted] = useState(false);
  

    useEffect(() => {
        fetchLocations();
        fetchEquipmentItems();
        fetchUsers();
    }, []);

    // Fetch Locations (POP, Customer, Store)
    const fetchLocations = async () => {
        try {
            const response = await apiClient.get("/api/locations");
            setLocations(response.data);
        } catch (error) {
            console.error("Error fetching locations", error);
        }
    };

    // Fetch Equipment Items (Available in store)
    const fetchEquipmentItems = async () => {
        try {
            const response = await apiClient.get("/api/equipment-items");
            setEquipmentItems(response.data);
        } catch (error) {
            console.error("Error fetching equipment items", error);
        }
    };

    // Fetch Users (For moved_by & handled_by)
    const fetchUsers = async () => {
        try {
            const response = await apiClient.get("/api/users");
            setUsers(response.data);
        } catch (error) {
            console.error("Error fetching users", error);
        }
    };

    // Handle Input Changes
    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    // Handle Equipment Item Selection (Multiple Selection)
    const handleEquipmentSelection = (e) => {
        const selectedOptions = [...e.target.selectedOptions].map(option => option.value);
        setFormData({ ...formData, equipment_item_ids: selectedOptions });
    };

    // Handle Form Submission
    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await postEquipmentMovement(formData);
            alert("Equipment movement recorded successfully!");
            setFormData({
                from_location_type: "",
                from_location_id: "",
                to_location_type: "",
                to_location_id: "",
                movement_type: "",
                movement_date: "",
                logistics_cost: "",
                moved_by: "",
                handled_by: "",
                equipment_item_ids: []
            });
        } catch (error) {
            console.error("Error submitting movement", error);
            alert("Error processing the movement");
        }
    };

    return (
        
            <div className="max-w-3xl mx-auto p-6 bg-white shadow-lg rounded-lg">
                <h2 className="text-2xl font-bold mb-6 text-center">Record Equipment Movement</h2>
                <form onSubmit={handleSubmit} className="space-y-4">
                    {/* From Location */}
                    <div>
                        <label className="block font-medium">From Location Type:</label>
                        <select name="from_location_type" value={formData.from_location_type} onChange={handleChange} required
                            className="w-full p-2 border rounded-md">
                            <option value="">Select Type</option>
                            <option value="store">Store</option>
                            <option value="POP">POP</option>
                            <option value="Customer">Customer</option>
                        </select>
                    </div>
    
                    <div>
                        <label className="block font-medium">From Location:</label>
                        <select name="from_location_id" value={formData.from_location_id} onChange={handleChange} required
                            className="w-full p-2 border rounded-md">
                            <option value="">Select Location</option>
                            {locations.map(location => (
                                <option key={location.id} value={location.id}>{location.name}</option>
                            ))}
                        </select>
                    </div>
    
                    {/* To Location */}
                    <div>
                        <label className="block font-medium">To Location Type:</label>
                        <select name="to_location_type" value={formData.to_location_type} onChange={handleChange} required
                            className="w-full p-2 border rounded-md">
                            <option value="">Select Type</option>
                            <option value="store">Store</option>
                            <option value="POP">POP</option>
                            <option value="Customer">Customer</option>
                        </select>
                    </div>
    
                    <div>
                        <label className="block font-medium">To Location:</label>
                        <select name="to_location_id" value={formData.to_location_id} onChange={handleChange} required
                            className="w-full p-2 border rounded-md">
                            <option value="">Select Location</option>
                            {locations.map(location => (
                                <option key={location.id} value={location.id}>{location.name}</option>
                            ))}
                        </select>
                    </div>
    
                    {/* Movement Type */}
                    <div>
                        <label className="block font-medium">Movement Type:</label>
                        <select name="movement_type" value={formData.movement_type} onChange={handleChange} required
                            className="w-full p-2 border rounded-md">
                            <option value="">Select Type</option>
                            <option value="installation">Installation</option>
                            <option value="retrieval">Retrieval</option>
                            <option value="swap">Swap</option>
                        </select>
                    </div>
    
                    {/* Movement Date */}
                    <div>
                        <label className="block font-medium">Movement Date:</label>
                        <input type="date" name="movement_date" value={formData.movement_date} onChange={handleChange} required
                            className="w-full p-2 border rounded-md" />
                    </div>
    
                    {/* Equipment Items */}
                    <div>
                        <label className="block font-medium">Equipment Items:</label>
                        <select name="equipment_item_ids" multiple onChange={handleEquipmentSelection} required
                            className="w-full p-2 border rounded-md">
                            {equipmentItems.map(item => (
                                <option key={item.id} value={item.id}>{item.serial_number} - {item.equipment.name}</option>
                            ))}
                        </select>
                    </div>
    
                    {/* Logistics Cost */}
                    <div>
                        <label className="block font-medium">Logistics Cost:</label>
                        <input type="number" name="logistics_cost" value={formData.logistics_cost} onChange={handleChange} required
                            className="w-full p-2 border rounded-md" />
                    </div>
    
                    {/* Moved By */}
                    <div>
                        <label className="block font-medium">Moved By:</label>
                        <select name="moved_by" value={formData.moved_by} onChange={handleChange} required
                            className="w-full p-2 border rounded-md">
                            <option value="">Select User</option>
                            {users.map(user => (
                                <option key={user.id} value={user.id}>{user.name}</option>
                            ))}
                        </select>
                    </div>
    
                    {/* Handled By */}
                    <div>
                        <label className="block font-medium">Handled By:</label>
                        <select name="handled_by" value={formData.handled_by} onChange={handleChange} required
                            className="w-full p-2 border rounded-md">
                            <option value="">Select User</option>
                            {users.map(user => (
                                <option key={user.id} value={user.id}>{user.name}</option>
                            ))}
                        </select>
                    </div>
    
                    {/* Submit Button */}
                    <div className="text-center">
                    <button
            type="submit"
            className={`relative flex justify-center items-center cursor-pointer gap-3 h-14 w-full px-6 rounded-full text-white bg-pink-500 hover:bg-pink-600 font-semibold transition-all duration-500 ease-in-out overflow-hidden ${
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
                    </div>
                </form>
            </div>
        )
    };

export default EquipmentMovementForm;