import React, { useState, useEffect } from "react";
import { Plus, MapPin, Edit2, Trash2, Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Loader2 } from "lucide-react";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { fetchLocations, createLocation } from "@/api/axios";

const Location = () => {
  const [locations, setLocations] = useState([]);
  console.log(locations);
  const [loading, setLoading] = useState(false);
  useEffect(() => {
    try {
      async function getLocation() {
        setLoading(true);
        const response = await fetchLocations();
        setLocations(response.data);
        setLoading(false);
      }
      getLocation();
    } catch (error) {
      console.error(error);
    }
  }, []);

  const [newLocation, setNewLocation] = useState({
    name: "",
    description: "",
  });

  const [isSubmitting, setIsSubmitting] = useState(false);

  async function handleAddLocation(e) {
    e.preventDefault(); // Prevent default form submission

    try {
      setIsSubmitting(true);
      await createLocation(newLocation);

      // Reset form
      setNewLocation({
        name: "",
        description: "",
      });

      // Close dialog
      setIsDialogOpen(false);

      // Refresh locations list
      const updatedLocations = await fetchLocations();
      setLocations(updatedLocations);

      // You might want to add a success toast notification here
      console.log("Location added successfully");
    } catch (error) {
      console.error("Error adding location:", error);
      // You might want to add an error toast notification here
    } finally {
      setIsSubmitting(false);
    }
  }

  const [searchTerm, setSearchTerm] = useState("");
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewLocation((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleDeleteLocation = (id) => {
    setLocations(locations.filter((location) => location.id !== id));
  };

  const filteredLocations = locations.filter(
    (location) =>
      location.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      location.description.toLowerCase().includes(searchTerm.toLowerCase()),
  );
  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="flex flex-col items-center">
          <Loader2 className="h-12 w-12 text-pink-600 dark:text-pink-400 animate-spin" />
          <p>loading...</p>
        </div>
      </div>
    );
  }
  return (
    <div className="p-6 max-w-6xl mx-auto">
      <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-4">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-pink-100 dark:bg-pink-900/30 rounded-lg">
            <MapPin className="h-6 w-6 text-pink-600 dark:text-pink-400" />
          </div>
          <div>
            <h1 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white">
              Location Management
            </h1>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              Create and manage inventory locations
            </p>
          </div>
        </div>

        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button className="bg-pink-600 cursor-pointer hover:bg-pink-700">
              <Plus className="h-4 w-4 mr-2" />
              Add Location
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[500px]">
            <DialogHeader>
              <DialogTitle>Add New Location</DialogTitle>
              <DialogDescription>
                Create a new inventory location with a name and description.
              </DialogDescription>
            </DialogHeader>
            <form onSubmit={handleAddLocation} className="space-y-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="name">Location Name</Label>
                <Input
                  id="name"
                  name="name"
                  placeholder="e.g., Main Warehouse"
                  value={newLocation.name}
                  onChange={handleInputChange}
                  disabled={isSubmitting}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  name="description"
                  placeholder="Describe the location and its purpose"
                  value={newLocation.description}
                  onChange={handleInputChange}
                  disabled={isSubmitting}
                  rows={3}
                />
              </div>
              <div className="flex justify-end gap-3 pt-4">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setIsDialogOpen(false)}
                  disabled={isSubmitting}
                >
                  Cancel
                </Button>
                <Button type="submit" disabled={isSubmitting}>
                  {isSubmitting ? "Adding..." : "Add Location"}
                </Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-6">
          <Card className="bg-white dark:bg-slate-800 border-gray-200 dark:border-slate-700">
            <CardHeader className="pb-3">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <CardTitle className="text-gray-900 dark:text-white">
                    Locations
                  </CardTitle>
                  <CardDescription>
                    {locations.length} location{locations.length !== 1 && "s"}{" "}
                    available
                  </CardDescription>
                </div>
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <Input
                    placeholder="Search locations..."
                    className="pl-10 w-full sm:w-64"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                </div>
              </div>
            </CardHeader>
            <CardContent>
              {filteredLocations.length > 0 ? (
                <div className="space-y-4">
                  {filteredLocations.map((location) => (
                    <div
                      key={location.id}
                      className="flex items-center justify-between p-4 rounded-lg border border-gray-200 dark:border-slate-700 hover:bg-gray-50 dark:hover:bg-slate-700/50 transition-colors"
                    >
                      <div className="flex items-start gap-4">
                        <div className="p-2 bg-pink-100 dark:bg-pink-900/30 rounded-lg">
                          <MapPin className="h-5 w-5 text-pink-600 dark:text-pink-400" />
                        </div>
                        <div>
                          <h3 className="font-semibold text-gray-900 dark:text-white">
                            {location.name}
                          </h3>
                          <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                            {location.description}
                          </p>
                        </div>
                      </div>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleDeleteLocation(location.id)}
                        className="text-red-600 hover:text-red-700 hover:bg-red-100 dark:hover:bg-red-900/20"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8">
                  <MapPin className="h-12 w-12 text-gray-300 dark:text-gray-600 mx-auto mb-4" />
                  <h3 className="font-medium text-gray-500 dark:text-gray-400 mb-1">
                    No locations found
                  </h3>
                  <p className="text-sm text-gray-400 dark:text-gray-500">
                    {searchTerm
                      ? "Try adjusting your search term"
                      : "Get started by adding your first location"}
                  </p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* <div>
          <Card className="bg-white dark:bg-slate-800 border-gray-200 dark:border-slate-700 sticky top-6">
            <CardHeader>
              <CardTitle className="text-gray-900 dark:text-white">
                Locations to Add
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-start gap-3">
                <div className="p-2 bg-pink-100 dark:bg-pink-900/30 rounded-lg">
                  <MapPin className="h-5 w-5 text-pink-600 dark:text-pink-400" />
                </div>
                <div>
                  <h4 className="font-medium text-gray-900 dark:text-white">
                    What are locations?
                  </h4>
                  <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                    Locations represent physical places where inventory items
                    are stored, such as warehouses, rooms, or shelves.
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="p-2 bg-amber-100 dark:bg-amber-900/30 rounded-lg">
                  <Edit2 className="h-5 w-5 text-amber-600 dark:text-amber-400" />
                </div>
                <div>
                  <h4 className="font-medium text-gray-900 dark:text-white">
                    Best practices
                  </h4>
                  <ul className="text-sm text-gray-600 dark:text-gray-400 mt-1 list-disc pl-5 space-y-1">
                    <li>Use clear, descriptive names</li>
                    <li>
                      Please include details about what items are stored there
                    </li>
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>
        </div> */}
      </div>
    </div>
  );
};

export default Location;
