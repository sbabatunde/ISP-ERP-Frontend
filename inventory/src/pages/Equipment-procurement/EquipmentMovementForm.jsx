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
  ChevronDown,
  ChevronUp,
  MapPin,
  Move,
  ClipboardList,
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

  console.log(formData);

  const [locations, setLocations] = useState([]);
  const [equipmentItems, setEquipmentItems] = useState([]);
  const [users, setUsers] = useState([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isLoadingLocations, setIsLoadingLocations] = useState(false);
  const [isLoadingEquipment, setIsLoadingEquipment] = useState(false);
  const [isLoadingUsers, setIsLoadingUsers] = useState(false);
  const [selectedEquipmentCategory, setSelectedEquipmentCategory] = useState(
    [],
  );
  const [selectedEquipment, setSelectedEquipment] = useState([]);
  const [expandedItems, setExpandedItems] = useState({});

  useEffect(() => {
    getLocations();
    fetchEquipmentItems();
    fetchUsers();
  }, []);

  const getLocations = async () => {
    try {
      setIsLoadingLocations(true);
      const response = await fetchLocations();
      setLocations(response);
    } catch (error) {
      console.error("Error fetching locations", error);
    } finally {
      setIsLoadingLocations(false);
    }
  };

  const fetchEquipmentItems = async () => {
    try {
      setIsLoadingEquipment(true);
      const response = await fetchEquipmentList();
      setEquipmentItems(response || []);
    } catch (error) {
      console.error("Error fetching equipment items", error);
    } finally {
      setIsLoadingEquipment(false);
    }
  };

  const fetchUsers = async () => {
    try {
      setIsLoadingUsers(true);
      const response = await fetchUsersList();
      setUsers(response);
    } catch (error) {
      console.error("Error fetching users", error);
    } finally {
      setIsLoadingUsers(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleEquipmentSelection = (item) => {
    if (selectedEquipmentCategory.some((equip) => equip.id === item.id)) return;
    setSelectedEquipmentCategory([...selectedEquipmentCategory, item]);
  };

  const toggleExpanded = (itemId) => {
    setExpandedItems((prev) => ({
      ...prev,
      [itemId]: !prev[itemId],
    }));
  };

  const handleIndividualEquipmentSelection = (equipmentItemId, isChecked) => {
    if (isChecked) {
      setSelectedEquipment((prev) => [...prev, equipmentItemId]);
    } else {
      setSelectedEquipment((prev) =>
        prev.filter((id) => id !== equipmentItemId),
      );
    }
  };

  useEffect(() => {
    setFormData((prevFormData) => ({
      ...prevFormData,
      equipment: selectedEquipment.map((equipmentItemId) => {
        const parentItem = selectedEquipmentCategory.find(
          (category) => category.id === equipmentItemId,
        );

        return {
          equipmentItemId,
        };
      }),
    }));
  }, [selectedEquipment, selectedEquipmentCategory]);

  useEffect(() => {
    setFormData((prevFormData) => ({
      ...prevFormData,
      equipment: selectedEquipment.map((equipmentItemId) => {
        // Find the parent item that contains this individual equipment item
        const parentItem = selectedEquipmentCategory.find((category) =>
          category.equipment_items?.some((item) => item.id === equipmentItemId),
        );
        const individualItem = parentItem?.equipment_items?.find(
          (item) => item.id === equipmentItemId,
        );

        return {
          id: equipmentItemId,
          serial_numbers: [individualItem?.serial_number],
          // model_number: individualItem?.model_number,
          unit_cost: parentItem?.unit_cost,
        };
      }),
    }));
  }, [selectedEquipment, selectedEquipmentCategory]);

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
        setSelectedEquipmentCategory([]);
        setSelectedEquipment([]);
        setExpandedItems({});
      }, 2000);
    } catch (error) {
      console.error("Error submitting movement", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="container mx-auto py-6 px-4">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
        <div className="flex items-center gap-3">
          <div className="p-3 rounded-lg bg-primary/10">
            <Truck className="h-6 w-6 text-primary" />
          </div>
          <div>
            <h1 className="text-2xl font-bold tracking-tight">
              Equipment Movement
            </h1>
            <p className="text-muted-foreground">
              Track and record equipment transfers between locations
            </p>
          </div>
        </div>
        <Badge variant="outline" className="px-4 py-1.5">
          <ClipboardList className="h-4 w-4 mr-2" />
          Movement Form
        </Badge>
      </div>

      <div className="space-y-6">
        {/* Location Cards */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* From Location */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center gap-2">
                <MapPin className="h-5 w-5 text-rose-500" />
                <span>From Location</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="from_location_type">Location Type</Label>
                <select
                  id="from_location_type"
                  name="from_location_type"
                  value={formData.from_location_type}
                  onChange={handleChange}
                  className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                  disabled={isLoadingLocations}
                >
                  <option value="">Select Type</option>
                  <option value="store">Store</option>
                  <option value="pop">POP</option>
                  <option value="customer">Customer</option>
                </select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="from_location_id">Specific Location</Label>
                <select
                  id="from_location_id"
                  name="from_location_id"
                  value={formData.from_location_id}
                  onChange={handleChange}
                  className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                  disabled={isLoadingLocations}
                >
                  <option value="">
                    {isLoadingLocations
                      ? "Loading locations..."
                      : "Select Location"}
                  </option>
                  {!isLoadingLocations &&
                    locations.map((location) => (
                      <option key={location.id} value={location.id}>
                        {location.name || `Location ${location.id}`}
                      </option>
                    ))}
                </select>
              </div>
            </CardContent>
          </Card>

          {/* To Location */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center gap-2">
                <MapPin className="h-5 w-5 text-emerald-500" />
                <span>To Location</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="to_location_type">Location Type</Label>
                <select
                  id="to_location_type"
                  name="to_location_type"
                  value={formData.to_location_type}
                  onChange={handleChange}
                  className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                  disabled={isLoadingLocations}
                >
                  <option value="">Select Type</option>
                  <option value="store">Store</option>
                  <option value="pop">POP</option>
                  <option value="customer">Customer</option>
                </select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="to_location_id">Specific Location</Label>
                <select
                  id="to_location_id"
                  name="to_location_id"
                  value={formData.to_location_id}
                  onChange={handleChange}
                  className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                  disabled={isLoadingLocations}
                >
                  <option value="">
                    {isLoadingLocations
                      ? "Loading locations..."
                      : "Select Location"}
                  </option>
                  {!isLoadingLocations &&
                    locations.map((location) => (
                      <option key={location.id} value={location.id}>
                        {location.name || `Location ${location.id}`}
                      </option>
                    ))}
                </select>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Movement Details */}
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center gap-2">
              <Move className="h-5 w-5 text-blue-500" />
              <span>Movement Details</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="space-y-2">
                <Label htmlFor="movement_type">Movement Type</Label>
                <select
                  id="movement_type"
                  name="movement_type"
                  value={formData.movement_type}
                  onChange={handleChange}
                  className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  <option value="">Select Type</option>
                  <option value="install">Installation</option>
                  <option value="retrieval">Retrieval</option>
                  <option value="swap">Swap</option>
                </select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="movement_date">Movement Date</Label>
                <div className="relative">
                  <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="movement_date"
                    type="date"
                    name="movement_date"
                    value={formData.movement_date}
                    onChange={handleChange}
                    className="pl-10"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="logistics_cost">Logistics Cost (₦)</Label>
                <Input
                  id="logistics_cost"
                  type="number"
                  name="logistics_cost"
                  value={formData.logistics_cost}
                  onChange={handleChange}
                  placeholder="0.00"
                />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Equipment Selection */}
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center gap-2">
              <Package className="h-5 w-5 text-amber-500" />
              <span>Equipment Selection</span>
              {selectedEquipment.length > 0 && (
                <Badge variant="secondary" className="ml-auto">
                  {selectedEquipment.length} item(s) selected
                </Badge>
              )}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              <div className="rounded-lg border border-dashed p-4">
                <h3 className="font-medium mb-4">Available Equipment</h3>

                {isLoadingEquipment ? (
                  <div className="flex items-center justify-center py-8 text-muted-foreground">
                    <Loader2 className="h-5 w-5 mr-2 animate-spin" /> Loading
                    equipment...
                  </div>
                ) : equipmentItems.length === 0 ? (
                  <div className="text-center py-8 text-muted-foreground">
                    No equipment items available
                  </div>
                ) : (
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                    {equipmentItems.map((item) => {
                      const isSelected = selectedEquipmentCategory.some(
                        (equip) => equip.id === item.id,
                      );
                      const isExpanded = expandedItems[item.id];
                      const selectedCount = selectedEquipment.filter(
                        (equipmentId) =>
                          item.equipment_items?.some(
                            (ei) => ei.id === equipmentId,
                          ),
                      ).length;

                      return (
                        <div
                          key={item.id}
                          className={`border rounded-lg p-4 transition-all ${isSelected ? "border-primary bg-primary/5" : "hover:border-muted-foreground/30"}`}
                        >
                          <div className="flex items-start justify-between gap-3">
                            <div>
                              <h4 className="font-medium">{item.name}</h4>
                              <p className="text-sm text-muted-foreground">
                                {item.model}
                              </p>
                            </div>
                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-8 w-8"
                              onClick={() => handleEquipmentSelection(item)}
                            >
                              <div
                                className={`h-4 w-4 rounded border flex items-center justify-center ${isSelected ? "bg-primary border-primary text-primary-foreground" : "border-muted-foreground"}`}
                              >
                                {isSelected && <Check className="h-3 w-3" />}
                              </div>
                            </Button>
                          </div>

                          <div className="mt-3 pt-3 border-t flex justify-between items-center">
                            <span className="text-sm font-medium">
                              {item.unit_cost?.toLocaleString("en-NG", {
                                style: "currency",
                                currency: "NGN",
                              })}
                            </span>
                            <Badge variant="outline">
                              {item.equipment_items?.length || 0} in stock
                            </Badge>
                          </div>

                          {isSelected && item.equipment_items?.length > 0 && (
                            <div className="mt-3">
                              <Button
                                variant="ghost"
                                size="sm"
                                className="w-full justify-between"
                                onClick={() => toggleExpanded(item.id)}
                              >
                                <span>
                                  {selectedCount > 0
                                    ? `${selectedCount} selected`
                                    : "Select items"}
                                </span>
                                {isExpanded ? (
                                  <ChevronUp className="h-4 w-4" />
                                ) : (
                                  <ChevronDown className="h-4 w-4" />
                                )}
                              </Button>

                              {isExpanded && (
                                <div className="mt-2 space-y-2">
                                  <ScrollArea className="h-40">
                                    {item.equipment_items.map(
                                      (equipmentItem) => {
                                        const isItemSelected =
                                          selectedEquipment.includes(
                                            equipmentItem.id,
                                          );
                                        return (
                                          <div
                                            key={equipmentItem.id}
                                            className={`p-2 rounded flex items-center justify-between ${isItemSelected ? "bg-primary/10" : "hover:bg-muted"}`}
                                          >
                                            <div>
                                              <p className="text-sm font-medium">
                                                {equipmentItem.serial_number}
                                              </p>
                                              <p className="text-xs text-muted-foreground">
                                                {equipmentItem.model_number}
                                              </p>
                                            </div>
                                            <input
                                              type="checkbox"
                                              checked={isItemSelected}
                                              onChange={(e) =>
                                                handleIndividualEquipmentSelection(
                                                  equipmentItem.id,
                                                  e.target.checked,
                                                )
                                              }
                                              className="h-4 w-4 rounded border-primary text-primary focus:ring-primary"
                                            />
                                          </div>
                                        );
                                      },
                                    )}
                                  </ScrollArea>
                                </div>
                              )}
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>

              {/* Selected Equipment Table */}
              {selectedEquipment.length > 0 && (
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <h3 className="font-medium">Selected Equipment</h3>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="text-destructive hover:text-destructive"
                      onClick={() => {
                        setSelectedEquipment([]);
                        setSelectedEquipmentCategory([]);
                        setExpandedItems({});
                      }}
                    >
                      <Trash className="h-4 w-4 mr-2" />
                      Clear All
                    </Button>
                  </div>

                  <div className="rounded-lg border">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Serial Number</TableHead>
                          <TableHead>Model</TableHead>
                          <TableHead>Equipment Type</TableHead>
                          <TableHead className="text-right">Action</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {selectedEquipment.map((equipmentItemId) => {
                          const parentItem = selectedEquipmentCategory.find(
                            (category) =>
                              category.equipment_items?.some(
                                (item) => item.id === equipmentItemId,
                              ),
                          );
                          const individualItem =
                            parentItem?.equipment_items?.find(
                              (item) => item.id === equipmentItemId,
                            );

                          return (
                            <TableRow key={equipmentItemId}>
                              <TableCell className="font-medium">
                                {individualItem?.serial_number}
                              </TableCell>
                              <TableCell>
                                {individualItem?.model_number}
                              </TableCell>
                              <TableCell>{parentItem?.name}</TableCell>
                              <TableCell className="text-right">
                                <Button
                                  variant="ghost"
                                  size="icon"
                                  className="h-8 w-8 text-destructive hover:text-destructive"
                                  onClick={() =>
                                    handleIndividualEquipmentSelection(
                                      equipmentItemId,
                                      false,
                                    )
                                  }
                                >
                                  <Trash className="h-4 w-4" />
                                </Button>
                              </TableCell>
                            </TableRow>
                          );
                        })}
                      </TableBody>
                    </Table>
                  </div>
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Personnel */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center gap-2">
                <User className="h-5 w-5 text-purple-500" />
                <span>Moved By</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <select
                name="moved_by"
                value={formData.moved_by}
                onChange={handleChange}
                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                disabled={isLoadingUsers}
              >
                <option value="">
                  {isLoadingUsers ? "Loading users..." : "Select User"}
                </option>
                {!isLoadingUsers &&
                  users.map((user) => (
                    <option key={user.id} value={user.id}>
                      {user.name || `User ${user.id}`}
                    </option>
                  ))}
              </select>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center gap-2">
                <User className="h-5 w-5 text-indigo-500" />
                <span>Handled By</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <select
                name="handled_by"
                value={formData.handled_by}
                onChange={handleChange}
                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                disabled={isLoadingUsers}
              >
                <option value="">
                  {isLoadingUsers ? "Loading users..." : "Select User"}
                </option>
                {!isLoadingUsers &&
                  users.map((user) => (
                    <option key={user.id} value={user.id}>
                      {user.name || `User ${user.id}`}
                    </option>
                  ))}
              </select>
            </CardContent>
          </Card>
        </div>

        {/* Submit Button */}
        <div className="flex justify-end gap-4 pt-4">
          <Button
            className="cursor-pointer"
            variant="outline"
            type="button"
            onClick={() => {
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
              setSelectedEquipmentCategory([]);
            }}
          >
            Reset
          </Button>
          <Button
            type="button"
            onClick={handleSubmit}
            disabled={
              isSubmitting || isSubmitted || selectedEquipment.length === 0
            }
            className="cursor-pointer min-w-[180px]"
          >
            {isSubmitting ? (
              <>
                <svg
                  className="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  ></circle>
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                  ></path>
                </svg>
                Processing...
              </>
            ) : isSubmitted ? (
              <>
                <Check className="h-4 w-4 mr-2" />
                Movement Recorded!
              </>
            ) : (
              <>
                <Send className="h-4 w-4 mr-2" />
                Record Movement
              </>
            )}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default EquipmentMovementForm;
