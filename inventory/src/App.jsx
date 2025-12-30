import { createBrowserRouter, RouterProvider } from "react-router-dom";

import Layout from "./routes/Layout";
import DashboardPage from "./routes/dashboard/page";
import SuppliersForm from "./pages/suppliers/SuppliersForm";
import SuppliersList from "./pages/suppliers/SuppliersList";
import EquipmentForm from "./pages/Equipment-procurement/Equipment";
import EquipmentProcurementForm from "./pages/Equipment-procurement/EquipmentProcurementForm";
import EquipmentTypeForm from "./pages/Equipment-procurement/EquipmentTypeForm";
import SuppliersEdit from "./pages/suppliers/suppliersEdit";
import ProductTypeList from "./pages/Equipment-procurement/productTypeList";
import EquipmentTypeList from "./pages/Equipment-procurement/EquipmentTypeList";
import CompleteOrder from "./pages/Orders/CompleteOrder";
import PendingOrder from "./pages/Orders/PendingOrder";
import ProcurementDetails from "./pages/Orders/components/individual";
import RequisitionForm from "./pages/Orders/RequisitionForm";
import PrintRequisitionForm from "./pages/Orders/components/preview";
import VoucherForm from "./pages/Orders/VoucherForm";
import EquipmentMovementForm from "./pages/Equipment-procurement/EquipmentMovementForm";
import StoreList from "./pages/Store/storeList";
import Location from "./pages/Equipment-procurement/LocationRegister";
import Reports from "./pages/Reports/report";
import CompletedRetrieval from "./pages/Work-Flow/components/completed";
import PendingRetrieval from "./pages/Work-Flow/components/pending";
import ToolForm from "./pages/Equipment-procurement/Tool";
import ToolTypeForm from "./pages/Equipment-procurement/ToolTypeForm";
import ToolTypeList from "./pages/Equipment-procurement/ToolTypeList";
import ToolList from "./pages/Equipment-procurement/ToolList";
import Repair from "./pages/Repair/Repair";
import EquipmentList from "./pages/Equipment-procurement/productTypeList";
import RepairList from "./pages/Repair/RepairList.";
// import Test from "./pages/Equipment-procurement/test";

// Import any new components you might need for the added routes
// import ToolList from "./pages/Tools/ToolList";
// import MovementHistory from "./pages/Movements/MovementHistory";
// import WorkflowStatus from "./pages/Workflow/WorkflowStatus";
// import AuditLog from "./pages/Administration/AuditLog";

export default function AppRouter() {
  const router = createBrowserRouter([
    {
      path: "/",
      element: <Layout />,
      children: [
        {
          index: true,
          element: <DashboardPage />,
        },
        {
          path: "analytics",
          element: <h1 className="title">Analytics</h1>,
        },
        {
          path: "reports",
          element: <Reports />,
        },

        // Procurement Routes
        {
          path: "requisition-form",
          element: <RequisitionForm />,
        },
        {
          path: "requisition-form/:id",
          element: <RequisitionForm />,
        },
        {
          path: "pending-requisitions",
          element: <h1 className="title">Pending Requisitions</h1>, // Create this component
        },
        {
          path: "approved-requisitions",
          element: <h1 className="title">Approved Requisitions</h1>, // Create this component
        },
        {
          path: "voucher-form",
          element: <VoucherForm />,
        },
        {
          path: "voucher-form/:id",
          element: <VoucherForm />,
        },
        {
          path: "pending-purchase",
          element: <PendingOrder />,
        },
        {
          path: "completed-purchase",
          element: <CompleteOrder />,
        },

        // Inventory Routes
        {
          path: "equipment-form",
          element: <EquipmentForm />,
        },
        {
          path: "equipment-type-form",
          element: <EquipmentTypeForm />,
        },
        {
          path: "equipment-list",
          element: <EquipmentList />, // Create this component
        },
        // {
        //   path: "test",
        //   element: <Test />, // Create this component
        // },
        {
          path: "tool-form",
          element: <ToolForm />,
        },
        {
          path: "tool-type-form",
          element: <ToolTypeForm />,
        },
        {
          path: "tool-list",
          element: <ToolList />, // Create this component
        },
        {
          path: "products",
          element: <ProductTypeList />,
        },
        {
          path: "procurement",
          element: <EquipmentProcurementForm />,
        },

        // Suppliers Routes
        {
          path: "supplier",
          element: <SuppliersForm />,
        },
        {
          path: "suppliers-list",
          element: <SuppliersList />,
        },
        {
          path: "suppliers-edit/:id",
          element: <SuppliersEdit />,
        },

        // Storage Routes
        {
          path: "store-list",
          element: <StoreList />,
        },
        {
          path: "location",
          element: <Location />,
        },

        // Movements Routes
        {
          path: "equipment-movement",
          element: <EquipmentMovementForm />,
        },
        {
          path: "movement-history",
          element: <h1 className="title">Movement History</h1>, // Create this component
        },

        // Workflow Routes
        {
          path: "pending-workflow",
          element: <PendingRetrieval />,
        },
        {
          path: "completed-workflow",
          element: <CompletedRetrieval />,
        },
        {
          path: "workflow-status",
          element: <h1 className="title">Workflow Status</h1>, // Create this component
        },

        // Repair Routes
        {
          path: "repair",
          element: <Repair />,
        },
        {
          path: "repair-List",
          element: <RepairList />,
        },

        // Administration Routes
        {
          path: "settings",
          element: <h1 className="title">Settings</h1>,
        },
        {
          path: "audit-log",
          element: <h1 className="title">Audit Log</h1>, // Create this component
        },

        // Additional existing routes
        {
          path: "procurement-details/:id",
          element: <ProcurementDetails />,
        },
        {
          path: "equipment-type-list",
          element: <EquipmentTypeList />,
        },
        {
          path: "tool-type-list",
          element: <ToolTypeList />,
        },
        {},
      ],
    },
  ]);

  return <RouterProvider router={router} />;
}
