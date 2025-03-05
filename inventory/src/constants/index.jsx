import { CiHome } from "react-icons/ci";

export const navbarLinks = [
    {
        title: "Dashboard",
        links: [
            {
                label:"Dashboard",
                path: "/",
                icon: <CiHome />
            },
            {
                label: "Analytics",
                path: "/analytics"
            },
            {
                label:"Reports",
                path:"/reports"
            }
        ],
    },
    {
        title: "Suppliers",
        links: [
            {
                label:"Suppliers Form",
                path: "/inventory/supplier"
            },
            {
                label: "Suppliers List",
                path: "/inventory/suppliers-list"
            }
        ]
    },
    {
        title: "Settings",
        links:[
            {
                label: "settings",
                path: "/settings"
            }
        ]
    }
]