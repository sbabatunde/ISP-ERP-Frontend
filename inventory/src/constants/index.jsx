import { Home, BarChart2,Clock, FileText, Users, ListChecks, PackagePlus, ShoppingBag, Package, Settings, PackageCheck, Check  } from "lucide-react";


export const navbarLinks = [
    {
        title: "Dashboard",
        links: [
            {
                label: "Dashboard",
                path: "/",
                icon: Home
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
            }
        ],
    },
    {
        title: "Orders",
        links:[{
            label:"Completed",
            path:"/completed-orders",
            icon:Check
        },
        {
            label:"Pending",
            path:"/pending-orders",
            icon:Clock
        }]
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
            }
        ]
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
            }
        ]
    },{
        title:"Products",
        links:[{
            label:"Products",
            path:"/products",
            icon:Package

    },
    {
        label:"Equipment Type",
        path:"/equipment-type-list",
        icon: PackageCheck
    }
    ]
    },
    {
        title: "Settings",
        links:[
            {
                label: "settings",
                path: "/settings",
                icon: Settings,
            }
        ]
    }
]