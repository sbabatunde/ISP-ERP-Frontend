import React, { useState, useEffect, useMemo, useRef } from "react";
import apiClient, {
  postEquipmentMovement,
  fetchUsersList,
  fetchLocations,
  fetchEquipmentByLocation,
  fetchEquipmentList,
} from "../../api/axios";
import {
  Truck,
  User,
  Calendar,
  Package,
  Check,
  Send,
  Trash,
  ChevronDown,
  ChevronUp,
  MapPin,
  Move,
  ClipboardList,
  Search,
  X,
  Filter,
  Plus,
  Minus,
  Users,
  Clock,
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
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Loader2 } from "lucide-react";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

function EquipmentMovementForm() {
  const [locations, setLocations] = useState({});
  const [locationSearch, setLocationSearch] = useState({
    from: "",
    to: "",
  });
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState("");
  const [submitError, setSubmitError] = useState("");

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

  const [equipmentByLocation, setEquipmentByLocation] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    fetchAll();
  }, []);

  async function fetchAll() {
    try {
      setLoading(true);
      const [locationData, equipmentData, userList] = await Promise.all([
        fetchLocations(),
        fetchEquipmentByLocation(),
        fetchUsersList(),
      ]);

      setLocations(locationData || {});
      setEquipmentByLocation(equipmentData || []);
      setUsers(userList || []);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  }

  async function handleMovementSubmit() {
    if (!isFormValid) return;

    setIsSubmitting(true);
    try {
      const response = await postEquipmentMovement(formData);

      // Reset form to initial state
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

      // Clear search term and reset selected equipment
      setSearchTerm("");

      // Refresh data after successful submission
      await fetchAll();

      // Show success message
      setSubmitSuccess("Equipment movement submitted successfully!");
      setSubmitError("");
    } catch (error) {
      console.error("Error submitting movement:", error);

      // Show error message to user
      const errorMessage =
        error?.response?.data?.message ||
        error?.message ||
        "Failed to submit equipment movement. Please try again.";

      setSubmitError(errorMessage);
      setSubmitSuccess("");

      // Clear error message after 8 seconds
      setTimeout(() => setSubmitError(""), 8000);
    } finally {
      setIsSubmitting(false);
    }
  }

  const locationMap = useMemo(() => {
    return {
      store: locations?.data || [],
      pop: locations?.pops || [],
      customer: locations?.customers || [],
    };
  }, [locations]);

  const getFromData = useMemo(() => {
    const data = locationMap[formData.from_location_type] || [];
    if (!locationSearch.from) return data;
    return data.filter((location) => {
      const name =
        formData.from_location_type === "customer"
          ? location.clients
          : formData.from_location_type === "pop"
            ? location.POP_name
            : location.name;
      return name?.toLowerCase().includes(locationSearch.from.toLowerCase());
    });
  }, [formData.from_location_type, locationMap, locationSearch.from]);

  const getToData = useMemo(() => {
    const data = locationMap[formData.to_location_type] || [];
    if (!locationSearch.to) return data;
    return data.filter((location) => {
      const name =
        formData.to_location_type === "customer"
          ? location.clients
          : formData.to_location_type === "pop"
            ? location.POP_name
            : location.name;
      return name?.toLowerCase().includes(locationSearch.to.toLowerCase());
    });
  }, [formData.to_location_type, locationMap, locationSearch.to]);

  const getEquipmentForSelectedLocation = useMemo(() => {
    if (!formData.from_location_id || !formData.from_location_type) {
      return [];
    }
    const locationGroup = equipmentByLocation.find(
      (group) =>
        group.location_type === formData.from_location_type &&
        group.location_id === parseInt(formData.from_location_id),
    );
    if (!locationGroup) return [];
    if (!searchTerm) return locationGroup.equipment_items || [];
    return (locationGroup.equipment_items || []).filter(
      (item) =>
        item.equipment?.name
          ?.toLowerCase()
          .includes(searchTerm.toLowerCase()) ||
        item.equipment?.model
          ?.toLowerCase()
          .includes(searchTerm.toLowerCase()) ||
        item.serial_number?.toLowerCase().includes(searchTerm.toLowerCase()),
    );
  }, [
    equipmentByLocation,
    formData.from_location_id,
    formData.from_location_type,
    searchTerm,
  ]);

  const getLocationsData = (type) => {
    switch (type) {
      case "from_location_type":
        return getFromData;
      case "to_location_type":
        return getToData;
      default:
        return [];
    }
  };

  const getLocationName = (location, type) => {
    switch (type) {
      case "store":
        return location.name || "";
      case "pop":
        return location.POP_name || "";
      case "customer":
        return location.clients || "";
      default:
        return "";
    }
  };

  // Helper function to check if an equipment item is selected
  const isEquipmentSelected = (serialNumber) => {
    return formData.equipment.some((eq) =>
      eq.serial_numbers.includes(serialNumber),
    );
  };

  // Helper function to add/remove equipment by serial number
  const toggleEquipmentSelection = (item) => {
    const isSelected = isEquipmentSelected(item.serial_number);

    if (isSelected) {
      // Remove by serial number from all equipment items
      const updatedEquipment = formData.equipment
        .map((eq) => ({
          ...eq,
          serial_numbers: eq.serial_numbers.filter(
            (sn) => sn !== item.serial_number,
          ),
        }))
        .filter((eq) => eq.serial_numbers.length > 0); // Remove empty equipment items

      setFormData({
        ...formData,
        equipment: updatedEquipment,
      });
    } else {
      // Check if we already have this equipment type in the selection
      const existingEquipmentIndex = formData.equipment.findIndex(
        (eq) => eq.id === item.equipment.id,
      );

      if (existingEquipmentIndex >= 0) {
        // Add serial number to existing equipment type
        const updatedEquipment = [...formData.equipment];
        updatedEquipment[existingEquipmentIndex] = {
          ...updatedEquipment[existingEquipmentIndex],
          serial_numbers: [
            ...updatedEquipment[existingEquipmentIndex].serial_numbers,
            item.serial_number,
          ],
        };
        setFormData({
          ...formData,
          equipment: updatedEquipment,
        });
      } else {
        // Create new equipment type with serial number
        setFormData({
          ...formData,
          equipment: [
            ...formData.equipment,
            {
              id: item.equipment.id,
              equipment_id: item.equipment.id,
              serial_numbers: [item.serial_number],
              model_number: item.equipment.model,
              name: item.equipment.name,
              unit_cost: item.equipment.unit_cost,
            },
          ],
        });
      }
    }
  };
  const scrollRef = useRef(null);
  useEffect(() => {
    if (!loading && scrollRef.current) {
      // Small delay to ensure DOM is fully rendered
      setTimeout(() => {
        scrollRef.current?.scrollIntoView({ behavior: "smooth" });
      }, 100);
    }
  }, [loading]);

  // Helper function to remove a specific serial number
  const removeSerialNumber = (equipmentId, serialNumber) => {
    const updatedEquipment = formData.equipment
      .map((eq) =>
        eq.id === equipmentId
          ? {
              ...eq,
              serial_numbers: eq.serial_numbers.filter(
                (sn) => sn !== serialNumber,
              ),
            }
          : eq,
      )
      .filter((eq) => eq.serial_numbers.length > 0); // Remove empty equipment items

    setFormData({
      ...formData,
      equipment: updatedEquipment,
    });
  };

  // Helper function to get selected count for an equipment type
  const getSelectedCountForEquipment = (equipmentId) => {
    const equipment = formData.equipment.find((eq) => eq.id === equipmentId);
    return equipment ? equipment.serial_numbers.length : 0;
  };

  // Calculate total number of selected serial numbers
  const totalSelectedSerialNumbers = formData.equipment.reduce(
    (total, eq) => total + eq.serial_numbers.length,
    0,
  );

  const isFormValid =
    formData.from_location_id &&
    formData.to_location_id &&
    totalSelectedSerialNumbers > 0;

  if (loading) {
    return (
      <>
        <div>loading</div>
      </>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 p-4 lg:p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="text-center space-y-3 bg-white/80 backdrop-blur-sm rounded-2xl p-6 shadow-sm border border-white">
          <div className="flex items-center justify-center gap-3">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">
                Equipment Movement
              </h1>
              <p className="text-gray-600 text-lg mt-1">
                Transfer equipment between different locations
              </p>
            </div>
          </div>

          {/* Progress Indicators */}
          <div className="flex justify-center items-center gap-8 pt-4">
            {[
              {
                label: "Locations",
                icon: MapPin,
                completed: formData.from_location_id && formData.to_location_id,
              },
              {
                label: "Equipment",
                icon: Package,
                completed: totalSelectedSerialNumbers > 0,
              },
              {
                label: "Details",
                icon: ClipboardList,
                completed: formData.movement_type && formData.movement_date,
              },
              {
                label: "Personnel",
                icon: Users,
                completed: formData.moved_by && formData.handled_by,
              },
            ].map((step, index) => (
              <div key={index} className="flex items-center gap-3">
                <div
                  className={`flex items-center justify-center w-10 h-10 rounded-full border-2 ${
                    step.completed
                      ? "bg-green-500 border-green-500 text-white"
                      : "bg-white border-gray-300 text-gray-400"
                  }`}
                >
                  <step.icon className="h-5 w-5" />
                </div>
                <span
                  className={`text-sm font-medium ${step.completed ? "text-green-600" : "text-gray-500"}`}
                >
                  {step.label}
                </span>
                {index < 3 && (
                  <div
                    className={`w-8 h-0.5 ${step.completed ? "bg-green-500" : "bg-gray-300"}`}
                  />
                )}
              </div>
            ))}
          </div>
        </div>

        <div ref={scrollRef} className="grid grid-cols-1 xl:grid-cols-3 gap-6">
          {/* Left Column - Locations */}
          <div className="xl:col-span-2 space-y-6">
            {/* Location Details Card */}
            <Card className="shadow-lg border-0 bg-white/80 backdrop-blur-sm">
              <CardHeader className="pb-4 border-b bg-gradient-to-r from-blue-50 to-indigo-50 rounded-t-xl">
                <CardTitle className="flex items-center gap-3 text-xl text-gray-800">
                  <MapPin className="h-6 w-6 text-blue-600" />
                  Location Details
                  <Badge
                    variant="secondary"
                    className="ml-2 bg-blue-100 text-blue-800"
                  >
                    Required
                  </Badge>
                </CardTitle>
              </CardHeader>
              <CardContent className="p-6">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  {[
                    {
                      name: "from_location_type",
                      label: "Source Location",
                      icon: Truck,
                    },
                    {
                      name: "to_location_type",
                      label: "Destination Location",
                      icon: Package,
                    },
                  ].map((item, index) => (
                    <div key={index} className="space-y-4">
                      <div className="flex items-center gap-3">
                        <div className="p-2 rounded-xl bg-blue-100 text-blue-600">
                          <item.icon className="h-5 w-5" />
                        </div>
                        <Label className="text-sm font-semibold text-gray-700">
                          {item.label}
                        </Label>
                      </div>

                      <div className="space-y-3">
                        <Select
                          onValueChange={(value) => {
                            setFormData({ ...formData, [item.name]: value });
                          }}
                          value={formData[item.name]}
                        >
                          <SelectTrigger className="w-full bg-gray-50 border-gray-200 h-11 rounded-lg">
                            <SelectValue
                              placeholder={`Select ${item.label.split(" ")[0]} Type`}
                            />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem
                              value="store"
                              className="flex items-center gap-2"
                            >
                              <Package className="h-4 w-4" />
                              Store
                            </SelectItem>
                            <SelectItem
                              value="pop"
                              className="flex items-center gap-2"
                            >
                              <MapPin className="h-4 w-4" />
                              POP
                            </SelectItem>
                            <SelectItem
                              value="customer"
                              className="flex items-center gap-2"
                            >
                              <User className="h-4 w-4" />
                              Customer
                            </SelectItem>
                          </SelectContent>
                        </Select>

                        {formData[item.name] && (
                          <div className="space-y-2">
                            <div className="relative">
                              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                              <Input
                                placeholder={`Search ${formData[item.name]}...`}
                                value={
                                  locationSearch[
                                    item.name.includes("from") ? "from" : "to"
                                  ]
                                }
                                onChange={(e) => {
                                  const searchKey = item.name.includes("from")
                                    ? "from"
                                    : "to";
                                  setLocationSearch({
                                    ...locationSearch,
                                    [searchKey]: e.target.value,
                                  });
                                }}
                                className="pl-10 bg-white border-gray-200 rounded-lg"
                              />
                            </div>

                            <ScrollArea className="h-32 rounded-lg border border-gray-200 bg-white">
                              {getLocationsData(item.name).length > 0 ? (
                                getLocationsData(item.name).map((location) => {
                                  const isSelected =
                                    formData[
                                      item.name.replace("type", "id")
                                    ] === location.id.toString();
                                  return (
                                    <div
                                      key={location.id}
                                      className={`p-3 border-b cursor-pointer transition-all duration-200 ${
                                        isSelected
                                          ? "bg-blue-50 border-blue-200 shadow-sm"
                                          : "hover:bg-gray-50 hover:shadow-sm"
                                      }`}
                                      onClick={() => {
                                        const idKey = item.name.replace(
                                          "type",
                                          "id",
                                        );
                                        setFormData({
                                          ...formData,
                                          [idKey]: location.id.toString(),
                                        });
                                        const searchKey = item.name.includes(
                                          "from",
                                        )
                                          ? "from"
                                          : "to";
                                        setLocationSearch({
                                          ...locationSearch,
                                          [searchKey]: getLocationName(
                                            location,
                                            formData[item.name],
                                          ),
                                        });
                                      }}
                                    >
                                      <div className="flex items-center justify-between">
                                        <span className="font-medium text-gray-900 text-sm">
                                          {getLocationName(
                                            location,
                                            formData[item.name],
                                          )}
                                        </span>
                                        {isSelected && (
                                          <Check className="h-4 w-4 text-green-600" />
                                        )}
                                      </div>
                                    </div>
                                  );
                                })
                              ) : (
                                <div className="p-4 text-center text-gray-500 text-sm">
                                  No locations found
                                </div>
                              )}
                            </ScrollArea>
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Equipment Selection Card */}
            <Card className="shadow-lg border-0 bg-white/80 backdrop-blur-sm">
              <CardHeader className="pb-4 border-b bg-gradient-to-r from-orange-50 to-amber-50 rounded-t-xl">
                <CardTitle className="flex items-center gap-3 text-xl text-gray-800">
                  <ClipboardList className="h-6 w-6 text-orange-600" />
                  Select Equipment to Move
                  <Badge
                    variant="secondary"
                    className="ml-2 bg-orange-100 text-orange-800"
                  >
                    {totalSelectedSerialNumbers} selected
                  </Badge>
                </CardTitle>
              </CardHeader>
              <CardContent className="p-6">
                <div className="space-y-4">
                  <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
                    <div className="flex items-center gap-3">
                      <div className="p-2 rounded-xl bg-orange-100 text-orange-600">
                        <Package className="h-5 w-5" />
                      </div>
                      <div>
                        <Label className="text-sm font-semibold text-gray-700">
                          Available Equipment
                        </Label>
                        <p className="text-xs text-gray-500">
                          Select equipment by serial number
                        </p>
                      </div>
                    </div>
                    <Badge variant="outline" className="bg-white">
                      {getEquipmentForSelectedLocation.length} items available
                    </Badge>
                  </div>

                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                    <Input
                      placeholder="Search equipment by name, model, or serial number..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="pl-10 bg-white border-gray-200 rounded-lg"
                    />
                    {searchTerm && (
                      <Button
                        variant="ghost"
                        size="sm"
                        className="absolute right-2 top-1/2 transform -translate-y-1/2 h-6 w-6 p-0"
                        onClick={() => setSearchTerm("")}
                      >
                        <X className="h-3 w-3" />
                      </Button>
                    )}
                  </div>

                  <ScrollArea className="h-64 rounded-lg border border-gray-200 bg-white">
                    {formData.from_location_id ? (
                      getEquipmentForSelectedLocation.length > 0 ? (
                        getEquipmentForSelectedLocation.map((item) => {
                          const isSelected = isEquipmentSelected(
                            item.serial_number,
                          );
                          const selectedCount = getSelectedCountForEquipment(
                            item.equipment.id,
                          );

                          return (
                            <div
                              key={`${item.equipment.id}-${item.serial_number}`}
                              className={`p-4 border-b transition-all duration-200 ${
                                isSelected
                                  ? "bg-green-50 border-green-200 shadow-sm"
                                  : "hover:bg-gray-50 hover:shadow-sm"
                              }`}
                            >
                              <div className="flex items-center justify-between">
                                <div className="flex-1">
                                  <div className="flex items-center gap-2 mb-1">
                                    <p className="font-semibold text-gray-900">
                                      {item.equipment?.name}
                                    </p>
                                    {selectedCount > 0 && (
                                      <Badge
                                        variant="outline"
                                        className="bg-blue-100 text-blue-700 border-blue-200 text-xs"
                                      >
                                        {selectedCount} selected
                                      </Badge>
                                    )}
                                    {isSelected && (
                                      <Badge
                                        variant="outline"
                                        className="bg-green-100 text-green-700 border-green-200 text-xs"
                                      >
                                        This item selected
                                      </Badge>
                                    )}
                                  </div>
                                  <p className="text-sm text-gray-600">
                                    Model: {item.equipment?.model}
                                  </p>
                                  <p className="text-sm font-mono text-gray-800 bg-gray-100 px-2 py-1 rounded mt-1 inline-block">
                                    Serial: {item.serial_number}
                                  </p>
                                  <p className="text-xs text-gray-500 mt-1">
                                    Unit Cost: ₦
                                    {parseFloat(
                                      item.equipment?.unit_cost || 0,
                                    ).toLocaleString()}
                                  </p>
                                </div>
                                <Button
                                  onClick={() => toggleEquipmentSelection(item)}
                                  variant={isSelected ? "outline" : "default"}
                                  size="sm"
                                  className={`whitespace-nowrap ${
                                    isSelected
                                      ? "border-red-200 text-red-700 hover:bg-red-50"
                                      : "bg-pink-600 hover:bg-pink-700"
                                  }`}
                                >
                                  {isSelected ? (
                                    <>
                                      <Minus className="h-4 w-4 mr-1" />
                                      Remove
                                    </>
                                  ) : (
                                    <>
                                      <Plus className="h-4 w-4 mr-1" />
                                      Select
                                    </>
                                  )}
                                </Button>
                              </div>
                            </div>
                          );
                        })
                      ) : (
                        <div className="p-8 text-center text-gray-500">
                          <Package className="h-12 w-12 mx-auto mb-3 text-gray-300" />
                          <p className="font-medium">
                            No equipment found at this location
                          </p>
                          <p className="text-sm mt-1">
                            The selected location has no available equipment
                          </p>
                        </div>
                      )
                    ) : (
                      <div className="p-8 text-center text-gray-500">
                        <MapPin className="h-12 w-12 mx-auto mb-3 text-gray-300" />
                        <p className="font-medium">Select a source location</p>
                        <p className="text-sm mt-1">
                          Choose a source location to view available equipment
                        </p>
                      </div>
                    )}
                  </ScrollArea>

                  {/* Selected Equipment Summary */}
                  {formData.equipment.length > 0 && (
                    <div className="mt-4 p-4 bg-blue-50 rounded-lg border border-blue-200">
                      <h4 className="font-semibold text-blue-900 mb-2 flex items-center gap-2">
                        <Check className="h-4 w-4" />
                        Selected Equipment ({totalSelectedSerialNumbers} serial
                        numbers)
                      </h4>
                      <div className="space-y-3 max-h-48 overflow-y-auto">
                        {formData.equipment.map((eq, index) => (
                          <div
                            key={index}
                            className="bg-white p-3 rounded border"
                          >
                            <div className="flex justify-between items-start mb-2">
                              <div>
                                <span className="font-medium">{eq.name}</span>
                                <span className="text-gray-600 ml-2">
                                  ({eq.model_number})
                                </span>
                                <Badge
                                  variant="outline"
                                  className="ml-2 bg-gray-100 text-gray-700 text-xs"
                                >
                                  {eq.serial_numbers.length} serials
                                </Badge>
                              </div>
                            </div>
                            <div className="flex flex-wrap gap-1">
                              {eq.serial_numbers.map((serial, serialIndex) => (
                                <div
                                  key={serialIndex}
                                  className="flex items-center gap-1 bg-gray-100 px-2 py-1 rounded text-xs"
                                >
                                  <code>{serial}</code>
                                  <Button
                                    variant="ghost"
                                    size="sm"
                                    className="h-4 w-4 p-0 text-red-600 hover:text-red-800"
                                    onClick={() =>
                                      removeSerialNumber(eq.id, serial)
                                    }
                                  >
                                    <X className="h-2 w-2" />
                                  </Button>
                                </div>
                              ))}
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Right Column - Details */}
          <div className="space-y-6">
            {/* Movement Details */}
            <Card className="shadow-lg border-0 bg-white/80 backdrop-blur-sm">
              <CardHeader className="pb-4 border-b bg-gradient-to-r from-purple-50 to-violet-50 rounded-t-xl">
                <CardTitle className="flex items-center gap-3 text-xl text-gray-800">
                  <Clock className="h-6 w-6 text-purple-600" />
                  Movement Details
                </CardTitle>
              </CardHeader>
              <CardContent className="p-6">
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label className="text-sm font-medium text-gray-700 flex items-center gap-2">
                      <Move className="h-4 w-4" />
                      Movement Type
                    </Label>
                    <Select
                      value={formData.movement_type}
                      onValueChange={(value) => {
                        setFormData({ ...formData, movement_type: value });
                      }}
                    >
                      <SelectTrigger className="w-full bg-gray-50 border-gray-200 h-11 rounded-lg">
                        <SelectValue placeholder="Select movement type" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="installation">
                          Installation
                        </SelectItem>
                        <SelectItem value="retrieval">Retrieval</SelectItem>
                        <SelectItem value="swap">Swap</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label className="text-sm font-medium text-gray-700 flex items-center gap-2">
                      <Calendar className="h-4 w-4" />
                      Movement Date
                    </Label>
                    <Input
                      type="date"
                      value={formData.movement_date}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          movement_date: e.target.value,
                        })
                      }
                      className="rounded-lg"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label className="text-sm font-medium text-gray-700 flex items-center gap-2">
                      Logistics Cost
                    </Label>
                    <Input
                      type="number"
                      placeholder="0.00"
                      value={formData.logistics_cost}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          logistics_cost: e.target.value,
                        })
                      }
                      className="rounded-lg"
                    />
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Personnel */}
            <Card className="shadow-lg border-0 bg-white/80 backdrop-blur-sm">
              <CardHeader className="pb-4 border-b bg-gradient-to-r from-teal-50 to-cyan-50 rounded-t-xl">
                <CardTitle className="flex items-center gap-3 text-xl text-gray-800">
                  <Users className="h-6 w-6 text-teal-600" />
                  Personnel
                </CardTitle>
              </CardHeader>
              <CardContent className="p-6">
                <div className="space-y-4">
                  {[
                    { name: "moved_by", placeholder: "Moved By", icon: Truck },
                    {
                      name: "handled_by",
                      placeholder: "Handled By",
                      icon: User,
                    },
                  ].map((item, index) => (
                    <div key={index} className="space-y-2">
                      <Label className="text-sm font-medium text-gray-700 flex items-center gap-2">
                        <item.icon className="h-4 w-4" />
                        {item.placeholder}
                      </Label>
                      <Select
                        value={formData[item.name]}
                        onValueChange={(value) => {
                          setFormData({ ...formData, [item.name]: value });
                        }}
                      >
                        <SelectTrigger className="w-full bg-gray-50 border-gray-200 h-11 rounded-lg">
                          <SelectValue placeholder={item.placeholder} />
                        </SelectTrigger>
                        <SelectContent>
                          {users.map((user) => (
                            <SelectItem
                              key={user.id}
                              value={user.id.toString()}
                            >
                              {user.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Summary Card */}
            <Card className="shadow-lg border-0 bg-gradient-to-br from-gray-900 to-gray-800 text-white">
              <CardHeader className="pb-4 border-b border-gray-700 rounded-t-xl">
                <CardTitle className="flex items-center gap-3 text-xl">
                  <Check className="h-6 w-6 text-green-400" />
                  Movement Summary
                </CardTitle>
              </CardHeader>
              <CardContent className="p-6">
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-gray-300">Equipment Types:</span>
                    <Badge
                      variant="secondary"
                      className="bg-blue-500 text-white"
                    >
                      {formData.equipment.length}
                    </Badge>
                  </div>

                  <div className="flex justify-between items-center">
                    <span className="text-gray-300">Status:</span>
                    <Badge
                      variant="secondary"
                      className={isFormValid ? "bg-green-500" : "bg-yellow-500"}
                    >
                      {isFormValid ? "Ready to Move" : "Incomplete"}
                    </Badge>
                  </div>

                  {/* Success/Error Messages */}
                  {submitSuccess && (
                    <div className="p-3 bg-green-50 border border-green-200 rounded-lg">
                      <div className="flex items-center gap-2">
                        <Check className="h-4 w-4 text-green-600" />
                        <p className="text-sm font-medium text-green-800">
                          {submitSuccess}
                        </p>
                      </div>
                    </div>
                  )}

                  {submitError && (
                    <div className="p-3 bg-red-50 border border-red-200 rounded-lg">
                      <div className="flex items-center gap-2">
                        <X className="h-4 w-4 text-red-600" />
                        <p className="text-sm font-medium text-red-800">
                          {submitError}
                        </p>
                      </div>
                    </div>
                  )}

                  <Separator className="bg-gray-700" />
                  <div className="pt-2">
                    <Button
                      onClick={handleMovementSubmit}
                      disabled={!isFormValid || isSubmitting}
                      className="w-full bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
                      size="lg"
                    >
                      {loading ? (
                        <>
                          <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                          Processing...
                        </>
                      ) : (
                        <>
                          <Send className="h-4 w-4 mr-2" />
                          Move Equipment
                        </>
                      )}
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}

export default EquipmentMovementForm;
