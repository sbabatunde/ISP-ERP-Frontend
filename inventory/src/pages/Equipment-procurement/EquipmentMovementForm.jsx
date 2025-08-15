import React, { useState, useEffect } from "react";
import apiClient, {
  postEquipmentMovement,
  fetchUsersList,
  fetchLocations,
  fetchProcurementDetails,
  fetchEquipmentList,
} from "../../api/axios";
import {
  Truck,
  User,
  Calendar,
  Package,
  ArrowRight,
  Check,
  Send,
  Trash,
} from "lucide-react";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
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
    equipment: [],
  });
  useEffect(() => {
    console.log(formData);
  }, [formData]);

  const [locations, setLocations] = useState([]);
  const [equipmentItems, setEquipmentItems] = useState([]);
  const [users, setUsers] = useState([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [selectedEquipment, setSelectedEquipment] = useState([]);

  useEffect(() => {
    getLocations();
    fetchEquipmentItems();
    fetchUsers();
  }, []);

  const getLocations = async () => {
    try {
      const response = await fetchLocations();
      setLocations(response);
    } catch (error) {
      console.error("Error fetching locations", error);
    }
  };

  const fetchEquipmentItems = async () => {
    try {
      const response = await fetchEquipmentList();
      setEquipmentItems(response || []);
    } catch (error) {
      console.error("Error fetching equipment items", error);
    }
  };

  const fetchUsers = async () => {
    try {
      const response = await fetchUsersList();
      setUsers(response);
    } catch (error) {
      console.error("Error fetching users", error);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleEquipmentSelection = (item) => {
    if (selectedEquipment.some((equip) => equip.id === item.id)) return;

    setSelectedEquipment([...selectedEquipment, item]);
  };
  useEffect(() => {
    setFormData((prevFormData) => ({
      ...prevFormData,
      equipment: selectedEquipment.map((item) => ({
        id: item.id,
        serial_numbers: Array.isArray(item.model) ? item.model : [item.model], // fallback if not array
        unit_cost: item.unit_cost,
      })),
    }));
  }, [selectedEquipment]);

  const handleRemoveEquipment = (id) => {
    setSelectedEquipment(selectedEquipment.filter((item) => item.id !== id));
  };

  useEffect(() => {
    console.log("Updated selected equipment:", selectedEquipment);
  }, [selectedEquipment]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      await postEquipmentMovement(formData);
      setIsSubmitted(true);
      setTimeout(() => {
        setIsSubmitted(false);
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
          equipment: [],
        });
        setSelectedEquipment([]);
      }, 2000);
    } catch (error) {
      console.error("Error submitting movement", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="py-4">
      <div className=" flex gap-2 items-center ml-3  mb-8">
        <div className="">
          <Truck className="h-10 w-10 bg-pink-100 p-2 rounded-md text-pink-600" />
        </div>
        <div>
          <h2 className="text-xl  font-bold text-gray-800  gap-2">
            Record Equipment Movement
          </h2>
          <p className="text-gray-600 ">
            Track the movement of equipment between locations
          </p>
        </div>
      </div>
      <div className=" mx-auto p-2 ml-5 bg-white rounded-xl shadow-md">
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* From Location Section */}
            <div className="space-y-4">
              <div className="bg-gray-50 p-4 rounded-lg">
                <h3 className="font-medium text-gray-700 flex items-center gap-2 mb-3">
                  <ArrowRight className="h-4 w-4 rotate-180 text-pink-600" />
                  From Location
                </h3>

                <div className="space-y-3">
                  <div>
                    <label className="block text-sm font-medium text-gray-600 mb-1">
                      Location Type
                    </label>
                    <select
                      name="from_location_type"
                      value={formData.from_location_type}
                      onChange={handleChange}
                      required
                      className="w-full p-2 border border-gray-300 rounded-md focus:ring-pink-500 focus:border-pink-500"
                    >
                      <option value="">Select Type</option>
                      <option value="Store">Store</option>
                      <option value="POP">POP</option>
                      <option value="Customer">Customer</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-600 mb-1">
                      Specific Location
                    </label>
                    <select
                      name="from_location_id"
                      value={formData.from_location_id}
                      onChange={handleChange}
                      required
                      className="w-full p-2 border border-gray-300 rounded-md focus:ring-pink-500 focus:border-pink-500"
                    >
                      <option value="">Select Location</option>
                      {locations.map((location) => (
                        <option key={location.id} value={location.id}>
                          {location.name || `Location ${location.id}`}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
              </div>
            </div>

            {/* To Location Section */}
            <div className="space-y-4">
              <div className="bg-gray-50 p-4 rounded-lg">
                <h3 className="font-medium text-gray-700 flex items-center gap-2 mb-3">
                  <ArrowRight className="h-4 w-4 text-pink-600" />
                  To Location
                </h3>

                <div className="space-y-3">
                  <div>
                    <label className="block text-sm font-medium text-gray-600 mb-1">
                      Location Type
                    </label>
                    <select
                      name="to_location_type"
                      value={formData.to_location_type}
                      onChange={handleChange}
                      required
                      className="w-full p-2 border border-gray-300 rounded-md focus:ring-pink-500 focus:border-pink-500"
                    >
                      <option value="">Select Type</option>
                      <option value="store">Store</option>
                      <option value="POP">POP</option>
                      <option value="Customer">Customer</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-600 mb-1">
                      Specific Location
                    </label>
                    <select
                      name="to_location_id"
                      value={formData.to_location_id}
                      onChange={handleChange}
                      required
                      className="w-full p-2 border border-gray-300 rounded-md focus:ring-pink-500 focus:border-pink-500"
                    >
                      <option value="">Select Location</option>
                      {locations.map((location) => (
                        <option key={location.id} value={location.id}>
                          {location.name || `Location ${location.id}`}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Movement Details */}
          <div className="bg-gray-50 p-4 rounded-lg space-y-4">
            <h3 className="font-medium text-gray-700 flex items-center gap-2">
              <Truck className="h-4 w-4 text-pink-600" />
              Movement Details
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-600 mb-1">
                  Movement Type
                </label>
                <select
                  name="movement_type"
                  value={formData.movement_type}
                  onChange={handleChange}
                  required
                  className="w-full p-2 border border-gray-300 rounded-md focus:ring-pink-500 focus:border-pink-500"
                >
                  <option value="">Select Type</option>
                  <option value="installation">Installation</option>
                  <option value="retrieval">Retrieval</option>
                  <option value="swap">Swap</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-600 mb-1">
                  Movement Date
                </label>
                <div className="relative">
                  <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <input
                    type="date"
                    name="movement_date"
                    value={formData.movement_date}
                    onChange={handleChange}
                    required
                    className="w-full pl-10 p-2 border border-gray-300 rounded-md focus:ring-pink-500 focus:border-pink-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-600 mb-1">
                  Logistics Cost (₦)
                </label>
                <input
                  type="number"
                  name="logistics_cost"
                  value={formData.logistics_cost}
                  onChange={handleChange}
                  required
                  className="w-full p-2 border border-gray-300 rounded-md focus:ring-pink-500 focus:border-pink-500"
                />
              </div>
            </div>
          </div>

          {/* Equipment Items */}
          <div className="bg-gray-50 p-4 rounded-lg">
            <h3 className="font-medium text-gray-700 flex items-center gap-2 mb-3">
              <Package className="h-4 w-4 text-pink-600" />
              Equipment Items
            </h3>

            <div>
              <label className="block text-sm font-medium text-gray-600 mb-1">
                Select Equipment
              </label>
              <div
                name="equipment_item_ids"
                className="w-full p-4 border border-gray-300 rounded-lg shadow-sm focus:ring-pink-500 focus:border-pink-500 min-h-[120px] bg-white"
              >
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <h3 className="text-lg font-semibold text-gray-800">
                      Available Equipment
                    </h3>
                    {selectedEquipment.length > 0 && (
                      <span className="inline-flex items-center px-3 py-1 rounded-full bg-pink-100 text-pink-800 text-sm font-medium">
                        {selectedEquipment.length} selected
                      </span>
                    )}
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                    {equipmentItems.map((item) => {
                      const isSelected = selectedEquipment.some(
                        (equip) => equip.id === item.id,
                      );
                      return (
                        <div
                          key={item.id}
                          onClick={() => handleEquipmentSelection(item)}
                          className={`
            relative cursor-pointer transition-all duration-200
            border rounded-xl p-4 flex flex-col
            ${
              isSelected
                ? "border-transparent bg-gradient-to-br from-pink-50 to-pink-100 shadow-lg ring-2 ring-pink-400/20"
                : "border-gray-100 bg-white hover:border-pink-200 hover:shadow-md"
            }
            overflow-hidden
          `}
                        >
                          {/* Selection indicator */}
                          <div
                            className={`
            absolute top-3 right-3 w-5 h-5 rounded-full border-2 flex items-center justify-center
            ${isSelected ? "bg-pink-500 border-pink-500" : "bg-white border-gray-300"}
          `}
                          >
                            {isSelected && (
                              <Check
                                className="h-3 w-3 text-white"
                                strokeWidth={3}
                              />
                            )}
                          </div>

                          {/* Equipment image placeholder */}
                          {/* <div className="w-full aspect-square bg-gradient-to-br from-gray-50 to-gray-100 rounded-lg mb-3 flex items-center justify-center">
                            <Package className="h-8 w-8 text-gray-400" />
                          </div> */}

                          {/* Equipment details */}
                          <div className="flex-1">
                            <h4 className="font-medium text-gray-900 truncate">
                              {item.name}
                            </h4>
                            <p className="text-sm text-gray-500 mt-1 truncate">
                              {item.model}
                            </p>
                          </div>

                          {/* Price/status bar */}
                          <div className="mt-3 pt-3 border-t border-gray-100/50 flex justify-between items-center">
                            <span className="text-sm font-medium text-pink-600">
                              {item.unit_cost?.toLocaleString("en-NG", {
                                style: "currency",
                                currency: "NGN",
                              })}
                            </span>
                            <span className="text-xs px-2 py-1 rounded-full bg-gray-100 text-gray-600">
                              In Stock
                            </span>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>
              <div>
                {selectedEquipment.length > 0 && (
                  <div className="mt-4">
                    <div className="flex items-center justify-between mb-3">
                      <h4 className="text-sm font-medium text-gray-700">
                        Selected Equipment ({selectedEquipment.length})
                      </h4>
                      <Button
                        onClick={() => setSelectedEquipment([])}
                        variant="ghost"
                        size="sm"
                        className="text-red-500 hover:text-red-700 hover:bg-red-50"
                      >
                        Clear All
                        <Trash className="h-4 w-4 ml-1" />
                      </Button>
                    </div>

                    <div className="rounded-lg border border-gray-200 overflow-hidden">
                      <Table>
                        <TableHeader className="bg-gray-50">
                          <TableRow>
                            <TableHead className="font-medium text-gray-600">
                              Name
                            </TableHead>
                            <TableHead className="font-medium text-gray-600">
                              Model
                            </TableHead>
                            <TableHead className="font-medium text-gray-600">
                              Unit Cost
                            </TableHead>
                            <TableHead className="font-medium text-gray-600 text-right">
                              Action
                            </TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {selectedEquipment.map((item) => (
                            <TableRow
                              key={item.id}
                              className="hover:bg-gray-50"
                            >
                              <TableCell className="font-medium">
                                {item.name}
                              </TableCell>
                              <TableCell className="text-gray-600">
                                {item.model}
                              </TableCell>
                              <TableCell className="text-gray-600">
                                {item.unit_cost?.toLocaleString("en-NG", {
                                  style: "currency",
                                  currency: "NGN",
                                })}
                              </TableCell>
                              <TableCell className="text-right">
                                <Button
                                  onClick={() => handleRemoveEquipment(item.id)}
                                  variant="ghost"
                                  size="icon"
                                  className="h-8 w-8 text-red-500 hover:bg-red-50 hover:text-red-700"
                                >
                                  <Trash className="h-4 w-4" />
                                </Button>
                              </TableCell>
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                    </div>

                    {selectedEquipment.length > 3 && (
                      <div className="mt-2 text-right text-sm text-gray-500">
                        Showing {selectedEquipment.length} items
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Personnel */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-gray-50 p-4 rounded-lg">
              <h3 className="font-medium text-gray-700 flex items-center gap-2 mb-3">
                <User className="h-4 w-4 text-pink-600" />
                Moved By
              </h3>
              <select
                name="moved_by"
                value={formData.moved_by}
                onChange={handleChange}
                required
                className="w-full p-2 border border-gray-300 rounded-md focus:ring-pink-500 focus:border-pink-500"
              >
                <option value="">Select User</option>
                {users.map((user) => (
                  <option key={user.id} value={user.id}>
                    {user.name || `User ${user.id}`}
                  </option>
                ))}
              </select>
            </div>

            <div className="bg-gray-50 p-4 rounded-lg">
              <h3 className="font-medium text-gray-700 flex items-center gap-2 mb-3">
                <User className="h-4 w-4 text-pink-600" />
                Handled By
              </h3>
              <select
                name="handled_by"
                value={formData.handled_by}
                onChange={handleChange}
                required
                className="w-full p-2 border border-gray-300 rounded-md focus:ring-pink-500 focus:border-pink-500"
              >
                <option value="">Select User</option>
                {users.map((user) => (
                  <option key={user.id} value={user.id}>
                    {user.name || `User ${user.id}`}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Submit Button */}
          <div className="pt-4 flex justify-end">
            <button
              type="submit"
              disabled={isSubmitting || isSubmitted}
              className={`w-[200px]  py-2 px-2 rounded-lg font-medium text-white transition-all duration-300 flex items-center justify-center cursor-pointer gap-2 ${
                isSubmitting
                  ? "bg-pink-400 cursor-not-allowed"
                  : isSubmitted
                    ? "bg-green-500"
                    : "bg-pink-600 hover:bg-pink-700"
              }`}
            >
              Record Movement
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EquipmentMovementForm;
