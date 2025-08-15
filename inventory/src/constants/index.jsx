import {
  Home,
  BarChart2,
  Clock,
  FileText,
  Users,
  ListChecks,
  PackagePlus,
  ShoppingBag,
  Package,
  Settings,
  PackageCheck,
  Check,
  FileChartColumnIncreasing,
  ScrollText,
  MapPinPlusInside,
  MapPinHouse,
} from "lucide-react";

export const navbarLinks = [
  {
    title: "Dashboard",
    links: [
      {
        label: "Dashboard",
        path: "/",
        icon: Home,
      },
      {
        label: "Analytics",
        path: "/analytics",
        icon: BarChart2,
      },
      {
        label: "Reports",
        path: "/reports",
        icon: FileText,
      },
    ],
  },
  {
    title: "Purchase",
    links: [
      {
        label: "Completed",
        path: "/completed-purchase",
        icon: Check,
      },
      {
        label: "Pending",
        path: "/pending-purchase",
        icon: Clock,
      },
      {
        label: "Raise Voucher",
        path: "/voucher-form",
        icon: ScrollText,
      },
      {
        label: "Raise Requisition",
        path: "/requisition-form",
        icon: FileChartColumnIncreasing,
      },
    ],
  },
  {
    title: "Suppliers",
    links: [
      {
        label: "Suppliers Form",
        path: "/supplier",
        icon: Users,
      },
      {
        label: "Suppliers List",
        path: "/suppliers-list",
        icon: ListChecks,
      },
    ],
  },
  {
    title: "Equipment",
    links: [
      {
        label: "Equipment Form",
        path: "/equipment-form",
        icon: PackagePlus,
      },
      {
        label: "Procurement Form",
        path: "/procurement-form",
        icon: ShoppingBag,
      },
      {
        label: "Equipment Type Form",
        path: "/equipment-type-form",
        icon: Package,
      },
    ],
  },
  {
    title: "Products",
    links: [
      {
        label: "Products",
        path: "/products",
        icon: Package,
      },
      {
        label: "Equipment Type",
        path: "/equipment-type-list",
        icon: PackageCheck,
      },
    ],
  },
  {
    title: "Movements",
    links: [
      {
        label: "Equipment Movement",
        path: "/equipment-movement",
        icon: MapPinPlusInside,
      },
      {
        label: "Location",
        path: "/location",
        icon: MapPinHouse,
      },
    ],
  },

  {
    title: "Settings",
    links: [
      {
        label: "settings",
        path: "/settings",
        icon: Settings,
      },
    ],
  },
];
