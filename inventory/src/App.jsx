import { createBrowserRouter, RouterProvider } from "react-router-dom";

import { ThemeProvider } from "./contexts/theme-context";

import Layout from "./routes/Layout";
import DashboardPage from "./routes/dashboard/page";
import SuppliersForm from "./pages/suppliers/SuppliersForm";
import SuppliersList from "./pages/suppliers/SuppliersList";
import EquipmentForm from "./pages/Equipment-procurement/Equipment";
import EquipmentProcurementForm from "./pages/Equipment-procurement/EquipmentProcurementForm";
import EquipmentTypeForm from "./pages/Equipment-procurement/EquipmentTypeForm";
import SuppliersEdit from "./pages/suppliers/suppliersEdit";
import SuppliersView from "./pages/suppliers/suppliersView";
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
// import Reports from "./pages/Reports/components/procurementReports";
import Reports from "./pages/Reports/report";
export default function Test() {
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
        {
          path: "customers",
          element: <h1 className="title">Customers</h1>,
        },
        {
          path: "settings",
          element: <h1 className="title">Settings</h1>,
        },
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
        {
          path: "suppliers-view/:id",
          element: <SuppliersView />,
        },
        {
          path: "equipment-form",
          element: <EquipmentForm />,
        },
        {
          path: "procurement-form",
          element: <EquipmentProcurementForm />,
        },
        {
          path: "equipment-type-form",
          element: <EquipmentTypeForm />,
        },
        {
          path: "products",
          element: <ProductTypeList />,
        },
        {
          path: "equipment-type-list",
          element: <EquipmentTypeList />,
        },
        {
          path: "completed-purchase",
          element: <CompleteOrder />,
        },
        {
          path: "pending-purchase",
          element: <PendingOrder />,
        },
        { path: "procurement-details/:id", element: <ProcurementDetails /> },

        { path: "requisition-form/:id", element: <RequisitionForm /> },
        { path: "voucher-form/:id", element: <VoucherForm /> },
        { path: "requisition-form", element: <RequisitionForm /> },
        { path: "voucher-form", element: <VoucherForm /> },
        { path: "equipment-movement", element: <EquipmentMovementForm /> },
        { path: "store-list", element: <StoreList /> },
        { path: "location", element: <Location /> },
      ],
    },
  ]);
  return <RouterProvider router={router} />;
}
