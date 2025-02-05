import React, { useState, useEffect } from "react";
import axios from "axios";

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

    useEffect(() => {
        fetchLocations();
        fetchEquipmentItems();
        fetchUsers();
    }, []);

    // Fetch Locations (POP, Customer, Store)
    const fetchLocations = async () => {
        try {
            const response = await axios.get("/api/locations");
            setLocations(response.data);
        } catch (error) {
            console.error("Error fetching locations", error);
        }
    };

    // Fetch Equipment Items (Available in store)
    const fetchEquipmentItems = async () => {
        try {
            const response = await axios.get("/api/equipment-items");
            setEquipmentItems(response.data);
        } catch (error) {
            console.error("Error fetching equipment items", error);
        }
    };

    // Fetch Users (For moved_by & handled_by)
    const fetchUsers = async () => {
        try {
            const response = await axios.get("/api/users");
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
            const response = await axios.post("/api/movements", formData);
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
        <div className="container">
            <h2>Record Equipment Movement</h2>
            <form onSubmit={handleSubmit}>
                {/* From Location */}
                <label>From Location Type:</label>
                <select name="from_location_type" value={formData.from_location_type} onChange={handleChange} required>
                    <option value="">Select Type</option>
                    <option value="store">Store</option>
                    <option value="POP">POP</option>
                    <option value="Customer">Customer</option>
                </select>

                <label>From Location:</label>
                <select name="from_location_id" value={formData.from_location_id} onChange={handleChange} required>
                    <option value="">Select Location</option>
                    {locations.map(location => (
                        <option key={location.id} value={location.id}>{location.name}</option>
                    ))}
                </select>

                {/* To Location */}
                <label>To Location Type:</label>
                <select name="to_location_type" value={formData.to_location_type} onChange={handleChange} required>
                    <option value="">Select Type</option>
                    <option value="store">Store</option>
                    <option value="POP">POP</option>
                    <option value="Customer">Customer</option>
                </select>

                <label>To Location:</label>
                <select name="to_location_id" value={formData.to_location_id} onChange={handleChange} required>
                    <option value="">Select Location</option>
                    {locations.map(location => (
                        <option key={location.id} value={location.id}>{location.name}</option>
                    ))}
                </select>

                {/* Movement Type */}
                <label>Movement Type:</label>
                <select name="movement_type" value={formData.movement_type} onChange={handleChange} required>
                    <option value="">Select Type</option>
                    <option value="installation">Installation</option>
                    <option value="retrieval">Retrieval</option>
                    <option value="swap">Swap</option>
                </select>

                {/* Movement Date */}
                <label>Movement Date:</label>
                <input type="date" name="movement_date" value={formData.movement_date} onChange={handleChange} required />

                {/* Equipment Items (Multiple Selection) */}
                <label>Equipment Items:</label>
                <select name="equipment_item_ids" multiple onChange={handleEquipmentSelection} required>
                    {equipmentItems.map(item => (
                        <option key={item.id} value={item.id}>{item.serial_number} - {item.equipment.name}</option>
                    ))}
                </select>

                {/* Logistics Cost */}
                <label>Logistics Cost:</label>
                <input type="number" name="logistics_cost" value={formData.logistics_cost} onChange={handleChange} required />

                {/* Moved By */}
                <label>Moved By:</label>
                <select name="moved_by" value={formData.moved_by} onChange={handleChange} required>
                    <option value="">Select User</option>
                    {users.map(user => (
                        <option key={user.id} value={user.id}>{user.name}</option>
                    ))}
                </select>

                {/* Handled By */}
                <label>Handled By:</label>
                <select name="handled_by" value={formData.handled_by} onChange={handleChange} required>
                    <option value="">Select User</option>
                    {users.map(user => (
                        <option key={user.id} value={user.id}>{user.name}</option>
                    ))}
                </select>

                {/* Submit Button */}
                <button type="submit">Submit Movement</button>
            </form>
        </div>
    );
};

export default EquipmentMovementForm;