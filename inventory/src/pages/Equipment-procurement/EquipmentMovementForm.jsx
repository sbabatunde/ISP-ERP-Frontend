import React, { useState, useEffect, useMemo, useRef } from "react";
import apiClient, {
  postEquipmentMovement,
  fetchUsersList,
  fetchLocations,
  fetchEquipmentByLocation,
  fetchEquipmentList,
} from "../../api/axios";
import ComponentHeader from "@/layout/componentHeader";
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
  AlertCircle,
  ArrowRight,
  CheckCircle,
  Loader2 as Spinner,
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";
import { useTheme } from "@/hooks/use-theme";

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
  const { theme } = useTheme();
  const isDark = theme === "dark";

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

      // Clear success message after 5 seconds
      setTimeout(() => setSubmitSuccess(""), 5000);
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

  const isEquipmentSelected = (serialNumber) => {
    return formData.equipment.some((eq) =>
      eq.serial_numbers.includes(serialNumber),
    );
  };

  const toggleEquipmentSelection = (item) => {
    const isSelected = isEquipmentSelected(item.serial_number);

    if (isSelected) {
      const updatedEquipment = formData.equipment
        .map((eq) => ({
          ...eq,
          serial_numbers: eq.serial_numbers.filter(
            (sn) => sn !== item.serial_number,
          ),
        }))
        .filter((eq) => eq.serial_numbers.length > 0);

      setFormData({
        ...formData,
        equipment: updatedEquipment,
      });
    } else {
      const existingEquipmentIndex = formData.equipment.findIndex(
        (eq) => eq.id === item.equipment.id,
      );

      if (existingEquipmentIndex >= 0) {
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
      setTimeout(() => {
        scrollRef.current?.scrollIntoView({ behavior: "smooth" });
      }, 100);
    }
  }, [loading]);

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
      .filter((eq) => eq.serial_numbers.length > 0);

    setFormData({
      ...formData,
      equipment: updatedEquipment,
    });
  };

  const getSelectedCountForEquipment = (equipmentId) => {
    const equipment = formData.equipment.find((eq) => eq.id === equipmentId);
    return equipment ? equipment.serial_numbers.length : 0;
  };

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
      <div className="flex min-h-screen items-center justify-center bg-background">
        <div className="flex flex-col items-center">
          <Spinner className="h-12 w-12 text-primary animate-spin" />
          <p className="mt-4 text-muted-foreground">Loading form...</p>
        </div>
      </div>
    );
  }

  return (
    <div
      className={cn(
        "min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-950 p-4 lg:p-6 transition-colors duration-300",
      )}
    >
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <ComponentHeader
          header={"Equipment Movement"}
          description={"Transfer equipment between different locations"}
        />

        {/* Progress Indicators */}
        <div className="text-center space-y-3 bg-card/80 backdrop-blur-sm rounded-2xl p-6 shadow-sm border">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex justify-center items-center gap-8 pt-4 flex-wrap"
          >
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
                <motion.div
                  whileHover={{ scale: 1.1 }}
                  className={cn(
                    "flex items-center justify-center w-10 h-10 rounded-full border-2 transition-all",
                    step.completed
                      ? "bg-primary border-primary text-primary-foreground shadow-lg"
                      : "bg-background border-muted text-muted-foreground",
                  )}
                >
                  <step.icon className="h-5 w-5" />
                </motion.div>
                <span
                  className={cn(
                    "text-sm font-medium transition-colors",
                    step.completed ? "text-primary" : "text-muted-foreground",
                  )}
                >
                  {step.label}
                </span>
                {index < 3 && (
                  <div
                    className={cn(
                      "w-8 h-0.5 transition-colors",
                      step.completed ? "bg-primary" : "bg-muted",
                    )}
                  />
                )}
              </div>
            ))}
          </motion.div>
        </div>

        <div ref={scrollRef} className="grid grid-cols-1 xl:grid-cols-3 gap-6">
          {/* Left Column - Locations */}
          <div className="xl:col-span-2 space-y-6">
            {/* Location Details Card */}
            <Card className="shadow-lg border bg-card">
              <CardHeader
                className={cn(
                  "pb-4 border-b rounded-t-xl",
                  "bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20",
                )}
              >
                <CardTitle className="flex items-center gap-3 text-xl">
                  <MapPin className="h-6 w-6 text-blue-600 dark:text-blue-400" />
                  Location Details
                  <Badge variant="secondary" className="ml-2">
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
                        <div
                          className={cn(
                            "p-2 rounded-xl",
                            "bg-blue-100 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400",
                          )}
                        >
                          <item.icon className="h-5 w-5" />
                        </div>
                        <Label className="text-sm font-semibold">
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
                          <SelectTrigger className="w-full h-11">
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
                              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
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
                                className="pl-10"
                              />
                            </div>

                            <ScrollArea className="h-32 rounded-lg border">
                              {getFromData.length > 0 ? (
                                getFromData.map((location) => {
                                  const isSelected =
                                    formData[
                                      item.name.replace("type", "id")
                                    ] === location.id.toString();
                                  return (
                                    <motion.div
                                      key={location.id}
                                      whileHover={{ scale: 1.01 }}
                                      className={cn(
                                        "p-3 border-b cursor-pointer transition-all duration-200",
                                        isSelected
                                          ? "bg-primary/10 border-primary/20"
                                          : "hover:bg-accent",
                                      )}
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
                                        <span className="font-medium text-sm">
                                          {getLocationName(
                                            location,
                                            formData[item.name],
                                          )}
                                        </span>
                                        {isSelected && (
                                          <Check className="h-4 w-4 text-primary" />
                                        )}
                                      </div>
                                    </motion.div>
                                  );
                                })
                              ) : (
                                <div className="p-4 text-center text-muted-foreground text-sm">
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
            <Card className="shadow-lg border bg-card">
              <CardHeader
                className={cn(
                  "pb-4 border-b rounded-t-xl",
                  "bg-gradient-to-r from-orange-50 to-amber-50 dark:from-orange-900/20 dark:to-amber-900/20",
                )}
              >
                <CardTitle className="flex items-center gap-3 text-xl">
                  <ClipboardList className="h-6 w-6 text-orange-600 dark:text-orange-400" />
                  Select Equipment to Move
                  <Badge variant="secondary" className="ml-2">
                    {totalSelectedSerialNumbers} selected
                  </Badge>
                </CardTitle>
              </CardHeader>
              <CardContent className="p-6">
                <div className="space-y-4">
                  <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
                    <div className="flex items-center gap-3">
                      <div
                        className={cn(
                          "p-2 rounded-xl",
                          "bg-orange-100 text-orange-600 dark:bg-orange-900/30 dark:text-orange-400",
                        )}
                      >
                        <Package className="h-5 w-5" />
                      </div>
                      <div>
                        <Label className="text-sm font-semibold">
                          Available Equipment
                        </Label>
                        <p className="text-xs text-muted-foreground">
                          Select equipment by serial number
                        </p>
                      </div>
                    </div>
                    <Badge variant="outline">
                      {getEquipmentForSelectedLocation.length} items available
                    </Badge>
                  </div>

                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                      placeholder="Search equipment by name, model, or serial number..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="pl-10"
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

                  <ScrollArea className="h-64 rounded-lg border">
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
                            <motion.div
                              key={`${item.equipment.id}-${item.serial_number}`}
                              whileHover={{ scale: 1.01 }}
                              className={cn(
                                "p-4 border-b transition-all duration-200",
                                isSelected
                                  ? "bg-primary/10 border-primary/20"
                                  : "hover:bg-accent",
                              )}
                            >
                              <div className="flex items-center justify-between">
                                <div className="flex-1">
                                  <div className="flex items-center gap-2 mb-1">
                                    <p className="font-semibold">
                                      {item.equipment?.name}
                                    </p>
                                    {selectedCount > 0 && (
                                      <Badge
                                        variant="outline"
                                        className="text-xs"
                                      >
                                        {selectedCount} selected
                                      </Badge>
                                    )}
                                    {isSelected && (
                                      <Badge
                                        variant="secondary"
                                        className="text-xs bg-primary/20"
                                      >
                                        Selected
                                      </Badge>
                                    )}
                                  </div>
                                  <p className="text-sm text-muted-foreground">
                                    Model: {item.equipment?.model}
                                  </p>
                                  <p
                                    className={cn(
                                      "text-sm font-mono px-2 py-1 rounded mt-1 inline-block",
                                      "bg-accent text-accent-foreground",
                                    )}
                                  >
                                    Serial: {item.serial_number}
                                  </p>
                                  <p className="text-xs text-muted-foreground mt-1">
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
                                  className={cn(
                                    "whitespace-nowrap transition-all",
                                    isSelected &&
                                      "border-destructive text-destructive hover:bg-destructive/10",
                                  )}
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
                            </motion.div>
                          );
                        })
                      ) : (
                        <div className="p-8 text-center text-muted-foreground">
                          <Package className="h-12 w-12 mx-auto mb-3 opacity-50" />
                          <p className="font-medium">
                            No equipment found at this location
                          </p>
                          <p className="text-sm mt-1">
                            The selected location has no available equipment
                          </p>
                        </div>
                      )
                    ) : (
                      <div className="p-8 text-center text-muted-foreground">
                        <MapPin className="h-12 w-12 mx-auto mb-3 opacity-50" />
                        <p className="font-medium">Select a source location</p>
                        <p className="text-sm mt-1">
                          Choose a source location to view available equipment
                        </p>
                      </div>
                    )}
                  </ScrollArea>

                  {/* Selected Equipment Summary */}
                  {formData.equipment.length > 0 && (
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="mt-4 p-4 rounded-lg border border-primary/20 bg-primary/5"
                    >
                      <h4 className="font-semibold mb-2 flex items-center gap-2">
                        <Check className="h-4 w-4" />
                        Selected Equipment ({totalSelectedSerialNumbers} serial
                        numbers)
                      </h4>
                      <div className="space-y-3 max-h-48 overflow-y-auto">
                        {formData.equipment.map((eq, index) => (
                          <div
                            key={index}
                            className="bg-background p-3 rounded border"
                          >
                            <div className="flex justify-between items-start mb-2">
                              <div>
                                <span className="font-medium">{eq.name}</span>
                                <span className="text-muted-foreground ml-2">
                                  ({eq.model_number})
                                </span>
                                <Badge
                                  variant="outline"
                                  className="ml-2 text-xs"
                                >
                                  {eq.serial_numbers.length} serials
                                </Badge>
                              </div>
                            </div>
                            <div className="flex flex-wrap gap-1">
                              {eq.serial_numbers.map((serial, serialIndex) => (
                                <div
                                  key={serialIndex}
                                  className="flex items-center gap-1 bg-accent px-2 py-1 rounded text-xs"
                                >
                                  <code className="font-mono">{serial}</code>
                                  <Button
                                    variant="ghost"
                                    size="sm"
                                    className="h-4 w-4 p-0 text-destructive hover:text-destructive hover:bg-destructive/10"
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
                    </motion.div>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Right Column - Details */}
          <div className="space-y-6">
            {/* Movement Details */}
            <Card className="shadow-lg border bg-card">
              <CardHeader
                className={cn(
                  "pb-4 border-b rounded-t-xl",
                  "bg-gradient-to-r from-purple-50 to-violet-50 dark:from-purple-900/20 dark:to-violet-900/20",
                )}
              >
                <CardTitle className="flex items-center gap-3 text-xl">
                  <Clock className="h-6 w-6 text-purple-600 dark:text-purple-400" />
                  Movement Details
                </CardTitle>
              </CardHeader>
              <CardContent className="p-6">
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label className="text-sm font-medium flex items-center gap-2">
                      <Move className="h-4 w-4" />
                      Movement Type
                    </Label>
                    <Select
                      value={formData.movement_type}
                      onValueChange={(value) => {
                        setFormData({ ...formData, movement_type: value });
                      }}
                    >
                      <SelectTrigger className="w-full h-11">
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
                    <Label className="text-sm font-medium flex items-center gap-2">
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
                    />
                  </div>

                  <div className="space-y-2">
                    <Label className="text-sm font-medium flex items-center gap-2">
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
                    />
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Personnel */}
            <Card className="shadow-lg border bg-card">
              <CardHeader
                className={cn(
                  "pb-4 border-b rounded-t-xl",
                  "bg-gradient-to-r from-teal-50 to-cyan-50 dark:from-teal-900/20 dark:to-cyan-900/20",
                )}
              >
                <CardTitle className="flex items-center gap-3 text-xl">
                  <Users className="h-6 w-6 text-teal-600 dark:text-teal-400" />
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
                      <Label className="text-sm font-medium flex items-center gap-2">
                        <item.icon className="h-4 w-4" />
                        {item.placeholder}
                      </Label>
                      <Select
                        value={formData[item.name]}
                        onValueChange={(value) => {
                          setFormData({ ...formData, [item.name]: value });
                        }}
                      >
                        <SelectTrigger className="w-full h-11">
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
            <Card className="shadow-lg border bg-gradient-to-br from-primary/90 to-primary">
              <CardHeader className="pb-4 border-b border-primary/30 rounded-t-xl">
                <CardTitle className="flex items-center gap-3 text-xl text-primary-foreground">
                  <CheckCircle className="h-6 w-6" />
                  Movement Summary
                </CardTitle>
              </CardHeader>
              <CardContent className="p-6">
                <div className="space-y-3 text-primary-foreground/90">
                  <div className="flex justify-between items-center">
                    <span>Equipment Types:</span>
                    <Badge
                      variant="secondary"
                      className="bg-primary-foreground/20 text-primary-foreground"
                    >
                      {formData.equipment.length}
                    </Badge>
                  </div>

                  <div className="flex justify-between items-center">
                    <span>Status:</span>
                    <Badge
                      variant="secondary"
                      className={cn(
                        isFormValid ? "bg-green-500/90" : "bg-yellow-500/90",
                        "text-primary-foreground",
                      )}
                    >
                      {isFormValid ? "Ready to Move" : "Incomplete"}
                    </Badge>
                  </div>

                  {/* Success/Error Messages */}
                  <AnimatePresence>
                    {submitSuccess && (
                      <motion.div
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        className="p-3 bg-green-500/20 border border-green-500/30 rounded-lg"
                      >
                        <div className="flex items-center gap-2">
                          <Check className="h-4 w-4 text-green-400" />
                          <p className="text-sm font-medium">{submitSuccess}</p>
                        </div>
                      </motion.div>
                    )}

                    {submitError && (
                      <motion.div
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        className="p-3 bg-destructive/20 border border-destructive/30 rounded-lg"
                      >
                        <div className="flex items-center gap-2">
                          <AlertCircle className="h-4 w-4 text-destructive" />
                          <p className="text-sm font-medium">{submitError}</p>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>

                  <Separator className="bg-primary-foreground/20" />
                  <div className="pt-2">
                    <Button
                      onClick={handleMovementSubmit}
                      disabled={!isFormValid || isSubmitting}
                      className={cn(
                        "w-full bg-primary-foreground text-primary hover:bg-primary-foreground/90",
                        "disabled:opacity-50 disabled:cursor-not-allowed",
                      )}
                      size="lg"
                    >
                      {isSubmitting ? (
                        <>
                          <Spinner className="h-4 w-4 mr-2 animate-spin" />
                          Processing...
                        </>
                      ) : (
                        <>
                          <ArrowRight className="h-4 w-4 mr-2" />
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
