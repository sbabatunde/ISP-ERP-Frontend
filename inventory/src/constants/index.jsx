import {
  Home,
  BarChart3,
  Clock,
  FileText,
  Users,
  ListChecks,
  PackagePlus,
  Settings,
  PackageCheck,
  CheckCircle,
  ScrollText,
  Move,
  MapPin,
  Hourglass,
  CheckSquare,
  Store,
  ClipboardList,
  Wrench,
  FileStack,
  Truck,
  Workflow,
} from "lucide-react";

export const navbarLinks = [
  {
    title: "Dashboard",
    links: [
      {
        label: "Overview",
        path: "/",
        icon: Home,
      },
      {
        label: "Analytics",
        path: "/analytics",
        icon: BarChart3,
      },
      {
        label: "Reports",
        path: "/reports",
        icon: FileText,
      },
    ],
  },
  {
    title: "Procurement",
    links: [
      {
        label: "Requisitions",
        children: [
          {
            label: "Create Requisition",
            path: "/requisition-form",
            icon: FileStack,
          },
          {
            label: "Pending Requisitions",
            path: "/pending-requisitions",
            icon: Hourglass,
          },
          {
            label: "Approved Requisitions",
            path: "/approved-requisitions",
            icon: CheckSquare,
          },
        ],
      },
      {
        label: "Purchase Orders",
        children: [
          {
            label: "Create Voucher",
            path: "/voucher-form",
            icon: ScrollText,
          },
          {
            label: "Pending Orders",
            path: "/pending-purchase",
            icon: Clock,
          },
          {
            label: "Completed Orders",
            path: "/completed-purchase",
            icon: CheckCircle,
          },
        ],
      },
      {
        label: "Procurement Form",
        path: "/procurement",
        icon: FileStack,
      },
    ],
  },
  {
    title: "Inventory",
    links: [
      {
        label: "Equipment",
        children: [
          {
            label: "Add Equipment",
            path: "/equipment-form",
            icon: PackagePlus,
          },
          {
            label: "Equipment Types",
            path: "/equipment-type-form",
            icon: PackageCheck,
          },
          {
            label: "Equipment Type List",
            path: "/equipment-type-list",
            icon: ClipboardList,
          },
          {
            label: "Equipment List",
            path: "/equipment-list",
            icon: ClipboardList,
          },
        ],
      },
      {
        label: "Tools",
        children: [
          {
            label: "Add Tool",
            path: "/tool-form",
            icon: Wrench,
          },
          {
            label: "Tool Types",
            path: "/tool-type-form",
            icon: Wrench,
          },
          {
            label: "Tool Type List",
            path: "/tool-type-list",
            icon: ListChecks,
          },
          {
            label: "Tool List",
            path: "/tool-list",
            icon: ListChecks,
          },
        ],
      },
    ],
  },
  {
    title: "Suppliers",
    links: [
      {
        label: "Add Supplier",
        path: "/supplier",
        icon: Users,
      },
      {
        label: "Supplier List",
        path: "/suppliers-list",
        icon: ListChecks,
      },
    ],
  },
  {
    title: "Storage",
    links: [
      {
        label: "Stores",
        path: "/store-list",
        icon: Store,
      },
      {
        label: "Locations",
        path: "/location",
        icon: MapPin,
      },
    ],
  },
  {
    title: "Movements",
    links: [
      {
        label: "Equipment Movement",
        path: "/equipment-movement",
        icon: Truck,
      },
      {
        label: "Movement History",
        path: "/movement-history",
        icon: Move,
      },
    ],
  },
  {
    title: "Repair",
    links: [
      {
        label: "Repairs",
        path: "/repair",
        icon: Wrench,
      },
      {
        label: "Repairs List",
        path: "/repair-list",
        icon: Wrench,
      },
    ],
  },
  {
    title: "Workflow",
    links: [
      {
        label: "Pending Tasks",
        path: "/pending-workflow",
        icon: Hourglass,
      },
      {
        label: "Completed Tasks",
        path: "/completed-workflow",
        icon: CheckSquare,
      },
      {
        label: "Workflow Status",
        path: "/workflow-status",
        icon: Workflow,
      },
    ],
  },
  {
    title: "Administration",
    links: [
      {
        label: "Settings",
        path: "/settings",
        icon: Settings,
      },
      {
        label: "Audit Log",
        path: "/audit-log",
        icon: FileText,
      },
    ],
  },
];
