import { ChartColumn, Home, NotepadText, Package, PackagePlus, Settings, ShoppingBag, UserCheck, UserPlus, Users } from "lucide-react";

export const navbarLinks = [
    {
        title: "Dashboard",
        links: [
            {
                label:"Dashboard",
                path: "/",
                icon: Home
            },
            {
                label: "Analytics",
                path: "/analytics",
                icon: ChartColumn,
            },
            {
                label:"Reports",
                path:"/reports",
                icon: NotepadText,
            }
        ],
    },
    {
        title: "Suppliers",
        links: [
            {
                label:"Suppliers Form",
                path: "/supplier",
                icon: Users,
            },
            {
                label: "Suppliers List",
                path: "/suppliers-list",
                icon: UserCheck,
            }
        ]
    },
    {
        title: "Equipment",
        links: [
            {
                label:"Equipment Form",
                path: "/equipment-form",
                icon: Users,
            },
            {
                label: "Procurement Form",
                path: "/procurement-form",
                icon: UserCheck,
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