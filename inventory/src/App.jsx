import { createBrowserRouter, RouterProvider } from "react-router-dom";

import {ThemeProvider} from "./contexts/theme-context"

import Layout from "./routes/Layout"
import DashboardPage from "./routes/dashboard/page";
import SuppliersForm from "./components/Suppliers";
import SuppliersList from "./pages/suppliers/SuppliersList"
import EquipmentForm from "./pages/Equipment-procurement/Equipment";
import EquipmentProcurementForm from "./pages/Equipment-procurement/EquipmentProcurementForm"
import EquipmentTypeForm from "./pages/Equipment-procurement/EquipmentTypeForm"
import SuppliersEdit from "./pages/suppliers/suppliersEdit"
import SuppliersView from "./pages/suppliers/suppliersView"

export default function Test () {
    const router = createBrowserRouter([
        {
            path : "/",
            element: <Layout/>,
            children: [
                {
                    index:true,
                    element: <DashboardPage />,
                },
                {
                    path: "analytics",
                    element:<h1 className="title">Analytics</h1>
                },
                {
                    path: "reports",
                    element:<h1 className="title">Reports</h1>
                },
                {
                    path: "customers",
                    element:<h1 className="title">Customers</h1>
                },
                {
                    path: "settings",
                    element:<h1 className="title">Settings</h1>
                },
                {
                    path: "supplier",
                    element:<SuppliersForm/>
                },
                {
                    path: "suppliers-list",
                    element:<SuppliersList/>
                },
                {
                    path: "suppliers-edit/:id",
                    element:<SuppliersEdit/>
                },
                {
                    path: "suppliers-view/:id",
                    element:<SuppliersView/>
                },
                {
                    path: "equipment-form",
                    element:<EquipmentForm/>
                },
                {
                    path: "procurement-form",
                    element:<EquipmentProcurementForm/>
                },
                {
                    path: "equipment-type-form",
                    element:<EquipmentTypeForm/>
                },
                {
                    path: "products",
                    element:<h1 className="title">Products</h1>
                }
                
                
            ],
        },
    ])
    return(
        <ThemeProvider storageKey="theme">
            <RouterProvider router= {router}/>
        </ThemeProvider>
    )
}