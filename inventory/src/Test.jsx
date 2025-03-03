import { createBrowserRouter, RouterProvider } from "react-router-dom";

import {ThemeProvider} from "./contexts/theme-context"

import Layout from "./routes/Layout"

export default function Test () {
    const router = createBrowserRouter([
        {
            path : "/",
            element: <Layout/>,
            children: [
                {
                    index:true,
                    // element: <Dashboard/>
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
                    path: "inventory",
                    element:<h1 className="title">Inventory</h1>
                },
            ],
        },
    ])
    return(
        <ThemeProvider storageKey="theme">
            <RouterProvider router= {router}/>
        </ThemeProvider>
    )
}