import { Home, BarChart2, FileText, Users, ListChecks, PackagePlus, ShoppingBag, Package, Settings } from "lucide-react";

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
            path:"/products",
        label:"products"
    }]
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