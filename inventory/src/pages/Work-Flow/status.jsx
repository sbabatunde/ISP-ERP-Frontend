import React, { useState, useMemo } from "react";
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
import { useLocation } from "react-router-dom";
import {
  Search,
  Filter,
  Download,
  MoreHorizontal,
  CheckCircle,
  XCircle,
  Clock,
  AlertCircle,
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
  DropdownMenuCheckboxItem,
} from "@/components/ui/dropdown-menu";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { updateEquipmentMovementStatus } from "@/api/axios";
import { Item } from "@radix-ui/react-dropdown-menu";

function Status({ data, isLoading = false }) {
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [dateFilter, setDateFilter] = useState(""); // New state for date filter
  const [visibleColumns, setVisibleColumns] = useState({
    id: true,
    from_location_type: true,
    to_location_type: true,
    movement_type: true,
    moved_by: true,
    handled_by: true,
    status: true,
    actions: true,
  });

  const navigation = useLocation();

  const filteredData = useMemo(() => {
    if (!data) return [];

    return data.filter((item) => {
      const matchesSearch =
        searchTerm === "" ||
        item.id.toString().includes(searchTerm) ||
        item.from_location?.name
          .toLowerCase()
          .includes(searchTerm.toLowerCase()) ||
        item.to_location?.name
          .toLowerCase()
          .includes(searchTerm.toLowerCase()) ||
        item.moved_by?.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.handled_by?.name.toLowerCase().includes(searchTerm.toLowerCase());

      const matchesStatus =
        statusFilter === "all" || item.movement_type === statusFilter;

      // Add date matching logic
      const matchesDate =
        dateFilter === "" ||
        new Date(item.movement_date).toISOString().slice(0, 10) === dateFilter;
      console.log(dateFilter);

      return matchesSearch && matchesStatus && matchesDate;
    });
  }, [data, searchTerm, statusFilter, dateFilter]); // Add dateFilter to dependencies

  const handleSearch = (event) => {
    setSearchTerm(event.target.value);
  };

  const handleDateChange = (event) => {
    setDateFilter(event.target.value);
  };

  const handleStatusChange = async (itemId, newStatus) => {
    const now = new Date();
    const date = now.toLocaleDateString("en-GB", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    });
    const itemToUpdate = data.find((item) => item.id === itemId);
    const dataToSend = {
      status: newStatus,
      handled_by: itemToUpdate.handled_by.id,
      from_location_id: itemToUpdate.from_location.id,
      from_location_type: itemToUpdate.from_location.type,
      to_location_id: itemToUpdate.to_location.id,
      to_location_type: itemToUpdate.to_location.type,
      movement_type: itemToUpdate.movement_type,
      movement_date: now.toISOString(),

      logistics_cost: itemToUpdate.logistics_cost,
      moved_by: itemToUpdate.moved_by.id,
    };
    if (!itemToUpdate) {
      console.error("Item not found");
      return;
    }

    console.log("Updating item:", itemToUpdate, "to status:", newStatus);

    try {
      const response = await updateEquipmentMovementStatus(itemId, {
        ...dataToSend,
      });
      console.log("Status updated:", response);
    } catch (error) {
      console.error("Error updating status:", error);
    }
  };

  const exportData = () => {
    console.log("Exporting data");
  };

  const toggleColumnVisibility = (column) => {
    setVisibleColumns((prev) => ({
      ...prev,
      [column]: !prev[column],
    }));
  };

  const getStatusBadge = (status) => {
    switch (status) {
      case "completed":
        return (
          <Badge variant="success">
            <CheckCircle className="w-3 h-3 mr-1" /> Completed
          </Badge>
        );
      case "declined":
        return (
          <Badge variant="destructive">
            <XCircle className="w-3 h-3 mr-1" /> Declined
          </Badge>
        );
      case "in_progress":
        return (
          <Badge variant="secondary">
            <Clock className="w-3 h-3 mr-1" /> In Progress
          </Badge>
        );
      default:
        return (
          <Badge variant="outline">
            <AlertCircle className="w-3 h-3 mr-1" /> Pending
          </Badge>
        );
    }
  };

  return (
    <div className="space-y-6 p-2">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <h1 className="text-3xl font-bold tracking-tight">Pending</h1>
        <Button onClick={exportData} variant="outline" size="sm">
          <Download className="w-4 h-4 mr-2" />
          Export
        </Button>
      </div>

      <Card>
        <CardHeader className="pb-3">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
            <CardTitle>Requests Overview</CardTitle>
            <div className="flex items-center gap-2">
              <span className="text-sm text-muted-foreground">
                {filteredData.length} result
                {filteredData.length !== 1 ? "s" : ""}
              </span>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col md:flex-row gap-4 mb-6">
            <div className="relative flex-1">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                type="text"
                placeholder="Search by ID, location, or person..."
                value={searchTerm}
                onChange={handleSearch}
                className="pl-8"
              />
            </div>

            {/* New Date Filter Input */}
            <Input
              type="date"
              value={dateFilter}
              onChange={handleDateChange}
              className="w-full md:w-[180px]"
            />

            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-full md:w-[180px]">
                <SelectValue placeholder="Filter by status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Pending</SelectItem>
                <SelectItem value="install">Install</SelectItem>
                <SelectItem value="swap">Swap</SelectItem>
                <SelectItem value="retrieve">Retrieve</SelectItem>
              </SelectContent>
            </Select>

            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <div>
                  <Button variant="outline" className="w-full md:w-auto">
                    <Filter className="w-4 h-4 mr-2" />
                    Columns
                  </Button>
                </div>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-48">
                <DropdownMenuLabel>Toggle Columns</DropdownMenuLabel>
                <DropdownMenuSeparator />
                {Object.entries(visibleColumns).map(([column, isVisible]) => (
                  <DropdownMenuCheckboxItem
                    key={column}
                    checked={isVisible}
                    onCheckedChange={() => toggleColumnVisibility(column)}
                    className="capitalize"
                  >
                    {column.replace(/_/g, " ")}
                  </DropdownMenuCheckboxItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>
          </div>

          {isLoading ? (
            <div className="space-y-2">
              {Array.from({ length: 5 }).map((_, i) => (
                <div
                  key={i}
                  className="flex items-center space-x-4 p-4 border rounded-md"
                >
                  <Skeleton className="h-12 w-12 rounded-full" />
                  <div className="space-y-2 flex-1">
                    <Skeleton className="h-4 w-full" />
                    <Skeleton className="h-4 w-3/4" />
                  </div>
                </div>
              ))}
            </div>
          ) : filteredData.length > 0 ? (
            <div className="rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow>
                    {visibleColumns.id && <TableHead>ID</TableHead>}
                    {visibleColumns.from_location_type && (
                      <TableHead>From</TableHead>
                    )}
                    {visibleColumns.to_location_type && (
                      <TableHead>To</TableHead>
                    )}
                    {visibleColumns.movement_type && (
                      <TableHead>Type</TableHead>
                    )}
                    {visibleColumns.moved_by && <TableHead>Moved By</TableHead>}
                    {visibleColumns.handled_by && (
                      <TableHead>Handled By</TableHead>
                    )}
                    {visibleColumns.status && <TableHead>Status</TableHead>}
                    {visibleColumns.actions && (
                      <TableHead className="text-right">Actions</TableHead>
                    )}
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredData.map((item) => (
                    <TableRow key={item.id}>
                      {visibleColumns.id && (
                        <TableCell className="font-medium">{item.id}</TableCell>
                      )}
                      {visibleColumns.from_location_type && (
                        <TableCell>
                          {item.from_location?.name || "N/A"}
                          <span className="font-bold mx-2">
                            ({item.from_location?.type || "N/A"})
                          </span>
                        </TableCell>
                      )}
                      {visibleColumns.to_location_type && (
                        <TableCell>
                          {item.to_location?.name || "N/A"}
                          <span className="font-bold mx-2">
                            ({item.to_location?.type || "N/A"})
                          </span>
                        </TableCell>
                      )}
                      {visibleColumns.movement_type && (
                        <TableCell>
                          <Badge variant="outline">{item.movement_type}</Badge>
                        </TableCell>
                      )}
                      {visibleColumns.moved_by && (
                        <TableCell>{item.moved_by?.name || "N/A"}</TableCell>
                      )}
                      {visibleColumns.handled_by && (
                        <TableCell>{item.handled_by?.name || "N/A"}</TableCell>
                      )}
                      {visibleColumns.status && (
                        <TableCell>
                          {getStatusBadge(item.status || "pending")}
                        </TableCell>
                      )}
                      {item.status === "pending" && visibleColumns.actions && (
                        <TableCell className="text-right">
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <div className="cursor-pointer">
                                <Button
                                  variant="ghost"
                                  className="h-8 w-8 p-0 cursor-pointer"
                                >
                                  <MoreHorizontal className="h-4 w-4" />
                                </Button>
                              </div>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              <DropdownMenuItem
                                onClick={() =>
                                  handleStatusChange(item.id, "completed")
                                }
                                className="text-green-600"
                              >
                                <CheckCircle className="w-4 h-4 mr-2" />
                                Mark as Completed
                              </DropdownMenuItem>
                              <DropdownMenuItem
                                onClick={() =>
                                  handleStatusChange(item.id, "declined")
                                }
                                className="text-red-600"
                              >
                                <XCircle className="w-4 h-4 mr-2" />
                                Decline Request
                              </DropdownMenuItem>
                              <DropdownMenuSeparator />
                              <DropdownMenuItem>View Details</DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </TableCell>
                      )}
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center p-12 text-center border rounded-lg">
              <Search className="w-12 h-12 text-muted-foreground mb-4" />
              <h3 className="text-lg font-medium mb-2">No results found</h3>
              <p className="text-sm text-muted-foreground mb-4">
                Try adjusting your search or filter to find what you're looking
                for.
              </p>
              <Button
                variant="outline"
                onClick={() => {
                  setSearchTerm("");
                  setStatusFilter("all");
                  setDateFilter("");
                }}
              >
                Clear filters
              </Button>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

export default Status;
