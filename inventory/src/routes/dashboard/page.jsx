import React, { useState, useEffect } from "react";
import {
  Package,
  Calendar,
  Filter,
  TrendingUp,
  BarChart3,
  RefreshCw,
  ArrowUp,
  ArrowDown,
  ChevronRight,
  MapPin,
} from "lucide-react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
} from "recharts";
import { Footer } from "../../layout/Footer";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useNavigate } from "react-router-dom";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import {
  fetchAllProcurements,
  fetchEquipmentList,
  fetchDashboardStats,
} from "@/api/axios";
import { Skeleton } from "@/components/ui/skeleton";

const COLORS = [
  "#0088FE",
  "#00C49F",
  "#FFBB28",
  "#FF8042",
  "#8884D8",
  "#82ca9d",
];

const DashboardPage = () => {
  const navigate = useNavigate();
  const [data, setdata] = useState(null);
  console.log(data);
  const [loading, setLoading] = useState(true);
  const [dateRange, setDateRange] = useState({
    from: "",
    to: "",
  });

  const [timeRange, setTimeRange] = useState("monthly");
  const [approved, setApproved] = useState();
  const [pending, setPending] = useState();
  const [storeItems, setStoreItems] = useState();

  useEffect(() => {
    const handleDashboard = async () => {
      try {
        const data = await fetchDashboardStats();
        console.log(data);
        setdata(data);
      } catch (error) {
        console.log(error);
      }
    };
    handleDashboard();
  }, []);

  // useEffect(() => {
  //   const fetchdata? = async () => {
  //     try {
  //       const [procurements, equipment] = await Promise.all([
  //         fetchAllProcurements(),
  //         fetchEquipmentList(),
  //       ]);
  //       setApproved(procurements.filter((item) => item.status === "approved"));
  //       setPending(procurements.filter((item) => item.status === "pending"));
  //       setStoreItems(equipment);
  //       setLoading(false);
  //     } catch (error) {
  //       console.error("Error fetching data?:", error);
  //       setLoading(false);
  //     }
  //   };
  //   fetchdata?();
  // }, []);

  const handleDateChange = (e, type) => {
    setDateRange((prev) => ({
      ...prev,
      [type]: e.target.value,
    }));
  };

  const handleApplyFilter = () => {
    setLoading(true);
    // Simulate API call with filters
    setTimeout(() => {
      setLoading(false);
    }, 1000);
  };

  const getActivityBadgeVariant = (type) => {
    switch (type) {
      case "incoming":
        return "default";
      case "outgoing":
        return "destructive";
      case "retrieval":
        return "secondary";
      default:
        return "outline";
    }
  };

  const applyTimeRange = (range) => {
    const currentDate = new Date();
    const currentMonth = currentDate.getMonth();
    const currentYear = currentDate.getFullYear();

    let fromDate;
    let toDate;

    switch (range) {
      case "daily":
        fromDate = new Date(currentYear, currentMonth, currentDate.getDate());
        toDate = new Date(
          currentYear,
          currentMonth,
          currentDate.getDate(),
          23,
          59,
          59,
          999,
        );
        break;
      case "weekly":
        const startOfWeek = new Date(
          currentDate.getFullYear(),
          currentDate.getMonth(),
          currentDate.getDate() - currentDate.getDay(),
        );
        fromDate = startOfWeek;
        toDate = new Date(
          startOfWeek.getFullYear(),
          startOfWeek.getMonth(),
          startOfWeek.getDate() + 6,
          23,
          59,
          59,
          999,
        );
        break;
      case "monthly":
        fromDate = new Date(currentYear, currentMonth, 1);
        toDate = new Date(currentYear, currentMonth + 1, 0, 23, 59, 59, 999);
        break;
      case "quarterly":
        const quarter = Math.floor(currentMonth / 3);
        fromDate = new Date(currentYear, quarter * 3, 1);
        toDate = new Date(currentYear, quarter * 3 + 3, 0, 23, 59, 59, 999);
        break;
      case "yearly":
        fromDate = new Date(currentYear, 0, 1);
        toDate = new Date(currentYear, 11, 31, 23, 59, 59, 999);
        break;
      default:
        fromDate = new Date(currentYear, 0, 1);
        toDate = new Date(currentYear, 11, 31, 23, 59, 59, 999);
    }

    return {
      from: fromDate.toISOString().split("T")[0],
      to: toDate.toISOString().split("T")[0],
    };
  };

  useEffect(() => {
    const newDateRange = applyTimeRange(timeRange);
    setDateRange((prev) => ({
      ...prev,
      from: newDateRange.from,
      to: newDateRange.to,
    }));
  }, [timeRange]);
  console.log(loading);

  // if (loading) {
  //   return (
  //     <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-gray-50 to-gray-100 dark:from-slate-950 dark:to-slate-900 p-6">
  //       <div className="flex flex-col items-center gap-4">
  //         <RefreshCw className="h-8 w-8 text-pink-600 animate-spin" />
  //         <p className="text-gray-900 dark:text-white text-lg">
  //           Loading dashboard data?...
  //         </p>
  //       </div>
  //     </div>
  //   );
  // }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-slate-950 dark:to-slate-900 p-6">
      {/* Header Section */}
      <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-4">
        <div className="flex items-center gap-3">
          <div className="p-3 bg-pink-500 rounded-xl shadow-lg">
            <Package className="h-6 w-6 text-white" />
          </div>
          <div>
            <h1 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white">
              Inventory Dashboard
            </h1>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Comprehensive overview of inventory and activities
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Select value={timeRange} onValueChange={setTimeRange}>
            <SelectTrigger className="w-[130px] bg-white dark:bg-slate-800 border-gray-300 dark:border-slate-700">
              <SelectValue placeholder="Time Range" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="daily">Daily</SelectItem>
              <SelectItem value="weekly">Weekly</SelectItem>
              <SelectItem value="monthly">Monthly</SelectItem>
              <SelectItem value="yearly">Yearly</SelectItem>
            </SelectContent>
          </Select>
          <Button
            variant="outline"
            size="sm"
            className="bg-white dark:bg-slate-800 border-gray-300 dark:border-slate-700"
          >
            <Filter className="h-4 w-4 mr-2" />
            Filters
          </Button>
        </div>
      </div>

      {/* Date Range Filter */}
      <Card className="mb-8 bg-white dark:bg-slate-800 border-gray-200 dark:border-slate-700 shadow-md">
        <CardHeader className="pb-3">
          <CardTitle className="text-lg flex items-center gap-2 text-gray-900 dark:text-white">
            <Calendar className="h-5 w-5 text-pink-600" />
            Date Range Filter
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col sm:flex-row gap-4 items-end">
            <div className="flex-1 space-y-2">
              <Label
                htmlFor="from"
                className="text-sm font-medium text-gray-700 dark:text-gray-300"
              >
                From Date
              </Label>
              <Input
                type="date"
                id="from"
                className="w-full bg-gray-50 dark:bg-slate-900 border-gray-300 dark:border-slate-700"
                value={dateRange.from}
                onChange={(e) => handleDateChange(e, "from")}
              />
            </div>
            <div className="flex-1 space-y-2">
              <Label
                htmlFor="to"
                className="text-sm font-medium text-gray-700 dark:text-gray-300"
              >
                To Date
              </Label>
              <Input
                type="date"
                id="to"
                className="w-full bg-gray-50 dark:bg-slate-900 border-gray-300 dark:border-slate-700"
                value={dateRange.to}
                onChange={(e) => handleDateChange(e, "to")}
              />
            </div>
            <Button
              className="w-full sm:w-auto bg-pink-500 shadow-md"
              onClick={handleApplyFilter}
            >
              Apply Filter
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4 mb-8">
        <Card className="bg-white dark:bg-slate-800 border-gray-200 dark:border-slate-700 shadow-sm hover:shadow-md transition-shadow duration-300">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-gray-700 dark:text-gray-300">
              Inventory Value
            </CardTitle>
            <div className="h-8 w-8 rounded-full bg-pink-100 dark:bg-pink-900/30 flex items-center justify-center">
              <Package className="h-4 w-4 text-pink-600 dark:text-pink-400" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-md font-bold text-gray-900 dark:text-white">
              {data?.performanceIndicator.totalInventoryValue}
            </div>
            <p className="text-xs text-green-600 dark:text-green-400 mt-1 flex items-center">
              <ArrowUp className="h-3 w-3 mr-1" /> +5.2% from last month
            </p>
          </CardContent>
        </Card>

        <Card
          className="bg-white dark:bg-slate-800 border-gray-200 dark:border-slate-700 shadow-sm hover:shadow-md transition-all duration-300 cursor-pointer group hover:border-pink-300 dark:hover:border-pink-700"
          onClick={() => navigate("/products")}
        >
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-gray-700 dark:text-gray-300">
              Items In Store
            </CardTitle>
            <div className="h-8 w-8 rounded-full bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center group-hover:scale-110 transition-transform">
              <BarChart3 className="h-4 w-4 text-blue-600 dark:text-blue-400" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-gray-900 dark:text-white">
              {data?.performanceIndicator.totalItemsInStore || (
                <Skeleton className="h-8 w-16 bg-gray-200 dark:bg-slate-700" />
              )}
            </div>
            <p className="text-xs text-green-600 dark:text-green-400 mt-1 flex items-center">
              <ArrowUp className="h-3 w-3 mr-1" /> +120 from last week
            </p>
          </CardContent>
        </Card>

        <Card
          className="bg-white dark:bg-slate-800 border-gray-200 dark:border-slate-700 shadow-sm hover:shadow-md transition-all duration-300 cursor-pointer group hover:border-amber-300 dark:hover:border-amber-700"
          onClick={() => navigate("/pending-purchase")}
        >
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-gray-700 dark:text-gray-300">
              Pending Procurements
            </CardTitle>
            <div className="h-8 w-8 rounded-full bg-amber-100 dark:bg-amber-900/30 flex items-center justify-center group-hover:scale-110 transition-transform">
              <TrendingUp className="h-4 w-4 text-amber-600 dark:text-amber-400" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-gray-900 dark:text-white">
              {data?.performanceIndicator.pendingProcurements || (
                <Skeleton className="h-8 w-16 bg-gray-200 dark:bg-slate-700" />
              )}
            </div>
            <p className="text-xs text-red-600 dark:text-red-400 mt-1 flex items-center">
              <ArrowDown className="h-3 w-3 mr-1" /> -15% from last month
            </p>
          </CardContent>
        </Card>

        <Card
          className="bg-white dark:bg-slate-800 border-gray-200 dark:border-slate-700 shadow-sm hover:shadow-md transition-all duration-300 cursor-pointer group hover:border-violet-300 dark:hover:border-violet-700"
          onClick={() => navigate("/pending-retrievals")}
        >
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-gray-700 dark:text-gray-300">
              Pending Retrievals
            </CardTitle>
            <div className="h-8 w-8 rounded-full bg-violet-100 dark:bg-violet-900/30 flex items-center justify-center group-hover:scale-110 transition-transform">
              <RefreshCw className="h-4 w-4 text-violet-600 dark:text-violet-400" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-gray-900 dark:text-white">
              {data?.performanceIndicator.pendingRetrievals}
            </div>
            <p className="text-xs text-green-600 dark:text-green-400 mt-1 flex items-center">
              <ArrowUp className="h-3 w-3 mr-1" /> +3 from yesterday
            </p>
          </CardContent>
        </Card>

        <Card className="bg-white dark:bg-slate-800 border-gray-200 dark:border-slate-700 shadow-sm hover:shadow-md transition-shadow duration-300">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-gray-700 dark:text-gray-300">
              Low Stock Items
            </CardTitle>
            <div className="h-8 w-8 rounded-full bg-orange-100 dark:bg-orange-900/30 flex items-center justify-center">
              <ArrowDown className="h-4 w-4 text-orange-600 dark:text-orange-400" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-gray-900 dark:text-white">
              {data?.performanceIndicator.lowStockItems}
            </div>
            <p className="text-xs text-amber-600 dark:text-amber-400 mt-1">
              Needs attention
            </p>
          </CardContent>
        </Card>

        <Card className="bg-white dark:bg-slate-800 border-gray-200 dark:border-slate-700 shadow-sm hover:shadow-md transition-shadow duration-300">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-gray-700 dark:text-gray-300">
              Out of Stock
            </CardTitle>
            <div className="h-8 w-8 rounded-full bg-red-100 dark:bg-red-900/30 flex items-center justify-center">
              <ArrowDown className="h-4 w-4 text-red-600 dark:text-red-400" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-gray-900 dark:text-white">
              {data?.performanceIndicator.outOfStockItems}
            </div>
            <p className="text-xs text-red-600 dark:text-red-400 mt-1">
              Urgent restock needed
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Location data? */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {[
          { name: "IBADAN OFFICE", value: "₦350,000", items: 750 },
          { name: "ABA EQUIPMENT", value: "₦285,000", items: 520 },
          { name: "NOC IKEJA EQUIPMENTS", value: "₦420,000", items: 680 },
          { name: "POP EQUIPMENTS", value: "₦195,000", items: 400 },
        ].map((location, index) => (
          <Card
            key={index}
            className="bg-white dark:bg-slate-800 border-gray-200 dark:border-slate-700 shadow-sm hover:shadow-md transition-all duration-300 group cursor-pointer"
            onClick={() => navigate("/locations")}
          >
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-gray-700 dark:text-gray-300">
                Inventory by Location
              </CardTitle>
              <div className="h-8 w-8 rounded-full bg-indigo-100 dark:bg-indigo-900/30 flex items-center justify-center group-hover:scale-110 transition-transform">
                <MapPin className="h-4 w-4 text-indigo-600 dark:text-indigo-400" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-lg font-bold text-gray-900 dark:text-white mb-1">
                {location.name}
              </div>
              <div className="flex justify-between items-center mt-2">
                <div>
                  <p className="text-xs text-gray-500 dark:text-gray-400">
                    Value
                  </p>
                  <p className="text-sm font-semibold text-gray-900 dark:text-white">
                    {location.value}
                  </p>
                </div>
                <div className="text-right">
                  <p className="text-xs text-gray-500 dark:text-gray-400">
                    Items
                  </p>
                  <p className="text-sm font-semibold text-gray-900 dark:text-white">
                    {location.items}
                  </p>
                </div>
              </div>
              <div className="flex items-center justify-between mt-3 pt-3 border-t border-gray-100 dark:border-slate-700">
                <span className="text-xs text-pink-600 dark:text-pink-400 flex items-center">
                  View details <ChevronRight className="h-3 w-3 ml-1" />
                </span>
                <Badge variant="outline" className="text-xs">
                  Active
                </Badge>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Charts and data? Visualization */}
      <Tabs defaultValue="inventory" className="mb-8">
        <TabsList className="grid w-full grid-cols-2 lg:grid-cols-4 mb-6 bg-gray-100 dark:bg-slate-800 p-1 rounded-lg">
          <TabsTrigger
            value="inventory"
            className="data?-[state=active]:bg-white data?-[state=active]:shadow-sm data?-[state=active]:dark:bg-slate-900 rounded-md transition-all"
          >
            Inventory Flow
          </TabsTrigger>
          <TabsTrigger
            value="distribution"
            className="data?-[state=active]:bg-white data?-[state=active]:shadow-sm data?-[state=active]:dark:bg-slate-900 rounded-md transition-all"
          >
            Distribution
          </TabsTrigger>
          <TabsTrigger
            value="products"
            className="data?-[state=active]:bg-white data?-[state=active]:shadow-sm data?-[state=active]:dark:bg-slate-900 rounded-md transition-all"
          >
            Top Products
          </TabsTrigger>
          <TabsTrigger
            value="activity"
            className="data?-[state=active]:bg-white data?-[state=active]:shadow-sm data?-[state=active]:dark:bg-slate-900 rounded-md transition-all"
          >
            Recent Activity
          </TabsTrigger>
        </TabsList>

        <TabsContent value="inventory" className="animate-fadeIn">
          <Card className="bg-white dark:bg-slate-800 border-gray-200 dark:border-slate-700 shadow-md overflow-hidden">
            <CardHeader className="bg-gray-50 dark:bg-slate-900/50 pb-3">
              <CardTitle className="text-gray-900 dark:text-white flex items-center">
                <TrendingUp className="h-5 w-5 mr-2 text-pink-600" />
                Monthly Inventory Flow (2023)
              </CardTitle>
              <CardDescription>
                Installation, procurement, and retrieval trends
              </CardDescription>
            </CardHeader>
            <CardContent className="pt-6">
              <div className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart
                    data={data?.monthlyInventoryFlow}
                    margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
                  >
                    <CartesianGrid
                      strokeDasharray="3 3"
                      className="opacity-30"
                    />
                    <XAxis dataKey="name" stroke="#888888" />
                    <YAxis stroke="#888888" />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: "rgba(255, 255, 255, 0.9)",
                        borderColor: "#e5e7eb",
                        borderRadius: "0.5rem",
                      }}
                    />
                    <Legend />
                    <Bar
                      dataKey="Installation"
                      fill="#8884d8"
                      radius={[4, 4, 0, 0]}
                    />
                    <Bar
                      dataKey="Procurement"
                      fill="#82ca9d"
                      radius={[4, 4, 0, 0]}
                    />
                    <Bar
                      dataKey="Retrieval"
                      fill="#ffc658"
                      radius={[4, 4, 0, 0]}
                    />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="distribution" className="animate-fadeIn">
          <Card className="bg-white dark:bg-slate-800 border-gray-200 dark:border-slate-700 shadow-md overflow-hidden">
            <CardHeader className="bg-gray-50 dark:bg-slate-900/50 pb-3">
              <CardTitle className="text-gray-900 dark:text-white flex items-center">
                <BarChart3 className="h-5 w-5 mr-2 text-pink-600" />
                Inventory Distribution
              </CardTitle>
              <CardDescription>
                Breakdown of inventory by category
              </CardDescription>
            </CardHeader>
            <CardContent className="pt-6">
              <div className="h-80 flex items-center justify-center">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={data?.inventoryDistribution}
                      cx="50%"
                      cy="50%"
                      innerRadius={60}
                      outerRadius={100}
                      paddingAngle={2}
                      dataKey="value"
                      label={({ name, percent }) =>
                        `${name} ${(percent * 100).toFixed(0)}%`
                      }
                      labelLine={false}
                    >
                      {data?.locations.map((entry, index) => (
                        <Cell
                          key={`cell-${index}`}
                          fill={COLORS[index % COLORS.length]}
                        />
                      ))}
                    </Pie>
                    <Tooltip
                      contentStyle={{
                        backgroundColor: "rgba(255, 255, 255, 0.9)",
                        borderColor: "#e5e7eb",
                        borderRadius: "0.5rem",
                      }}
                    />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="products" className="animate-fadeIn">
          <Card className="bg-white dark:bg-slate-800 border-gray-200 dark:border-slate-700 shadow-md overflow-hidden">
            <CardHeader className="bg-gray-50 dark:bg-slate-900/50 pb-3">
              <CardTitle className="text-gray-900 dark:text-white flex items-center">
                <Package className="h-5 w-5 mr-2 text-pink-600" />
                Top Products
              </CardTitle>
              <CardDescription>
                Products with highest stock levels
              </CardDescription>
            </CardHeader>
            <CardContent className="pt-6">
              <div className="space-y-4">
                {data?.topProducts.map((product, index) => (
                  <div
                    key={index}
                    className="flex items-center justify-between p-4 rounded-lg bg-gray-50 dark:bg-slate-700/30 hover:bg-gray-100 dark:hover:bg-slate-700/50 transition-colors duration-200"
                  >
                    <div className="flex items-center gap-3">
                      <div
                        className={`h-12 w-12 rounded-full flex items-center justify-center ${
                          product.trend === "up"
                            ? "bg-green-100 dark:bg-green-900/30"
                            : "bg-red-100 dark:bg-red-900/30"
                        }`}
                      >
                        {product.trend === "up" ? (
                          <ArrowUp className="h-6 w-6 text-green-600 dark:text-green-400" />
                        ) : (
                          <ArrowDown className="h-6 w-6 text-red-600 dark:text-red-400" />
                        )}
                      </div>
                      <div>
                        <p className="font-medium text-gray-900 dark:text-white">
                          {product.name}
                        </p>
                        <p className="text-sm text-gray-500 dark:text-gray-400">
                          Current stock: {product.stock}
                        </p>
                      </div>
                    </div>
                    <Badge
                      variant={
                        product.trend === "up" ? "default" : "destructive"
                      }
                      className="text-xs py-1"
                    >
                      {product.trend === "up" ? "Increasing" : "Decreasing"}
                    </Badge>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="activity" className="animate-fadeIn">
          <Card className="bg-white dark:bg-slate-800 border-gray-200 dark:border-slate-700 shadow-md overflow-hidden">
            <CardHeader className="bg-gray-50 dark:bg-slate-900/50 pb-3">
              <CardTitle className="text-gray-900 dark:text-white flex items-center">
                <RefreshCw className="h-5 w-5 mr-2 text-pink-600" />
                Recent Activity
              </CardTitle>
              <CardDescription>
                Latest inventory movements and transactions
              </CardDescription>
            </CardHeader>
            <CardContent className="pt-6">
              <div className="rounded-lg border border-gray-200 dark:border-slate-700 overflow-hidden">
                <table className="w-full">
                  <thead className="bg-gray-50 dark:bg-slate-700/30">
                    <tr>
                      <th className="text-left py-3 px-4 text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                        Date
                      </th>
                      <th className="text-left py-3 px-4 text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                        Item
                      </th>
                      <th className="text-left py-3 px-4 text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                        Quantity
                      </th>
                      <th className="text-left py-3 px-4 text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                        Location
                      </th>
                      <th className="text-left py-3 px-4 text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                        Type
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200 dark:divide-slate-700">
                    {data?.recentActivity.map((activity) => (
                      <tr
                        key={activity.id}
                        className="hover:bg-gray-50 dark:hover:bg-slate-700/30 transition-colors duration-150"
                      >
                        <td className="py-3 px-4 text-sm text-gray-900 dark:text-white">
                          {activity.date}
                        </td>
                        <td className="py-3 px-4 text-sm text-gray-900 dark:text-white">
                          {activity.description}
                        </td>
                        <td className="py-3 px-4 text-sm text-gray-900 dark:text-white">
                          {activity.quantity}
                        </td>
                        <td className="py-3 px-4 text-sm text-gray-900 dark:text-white">
                          {activity.location}
                        </td>
                        <td className="py-3 px-4">
                          <Badge
                            variant={getActivityBadgeVariant(activity.type)}
                            className="capitalize text-xs"
                          >
                            {activity.type}
                          </Badge>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      <Footer />

      {/* Add some custom styles for animations */}
      <style jsx>{`
        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: translateY(10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        .animate-fadeIn {
          animation: fadeIn 0.5s ease-out;
        }
      `}</style>
    </div>
  );
};

export default DashboardPage;
