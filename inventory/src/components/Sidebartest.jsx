import React, { useState } from 'react';
import { FaArrowLeft } from 'react-icons/fa6';
import syslogo from '../assets/syslogo.jpg';
import { MdDashboard, MdOutlineInventory } from 'react-icons/md';
import { RiInboxArchiveFill } from 'react-icons/ri';
import { FaSearch } from 'react-icons/fa';
import { IoSettings } from 'react-icons/io5';
import { MdProductionQuantityLimits } from 'react-icons/md';
import { MdOutlineCancel } from 'react-icons/md';
import { Link } from 'react-router-dom';
import { FiChevronsUp } from "react-icons/fi";
import { LuChevronsDown } from "react-icons/lu";

const Sidebartest = () => {
    const [open, setOpen] = useState(true);
    const [supplierDropdownOpen, setSupplierDropdownOpen] = useState(false);
    const [equipmentForm, setEquipmentForm] = useState(false)

    return (
        <div className='flex h-screen'>
            <div className={`${open ? 'w-72' : 'w-20'} duration-300 h-screen p-5 pt-8 bg-pink-600 relative`}>
                <MdOutlineCancel 
                    className={`absolute cursor-pointer rounded-full right-3 top-9 w-7 border-2 border-purple-950 ${!open && 'rotate-180'}`} 
                    onClick={() => setOpen(!open)}
                />
                <div className='flex gap-x-4 items-center'>
                    <img 
                        src={syslogo} 
                        className={`cursor-pointer duration-500 ${open && "rotate-[360deg]"}`} 
                        alt="" 
                    />
                    <h1 className={`text-white origin-left font-medium text-xl duration-300 ${!open && 'scale-0'}`}>
                        {/* Syscodes */}
                    </h1>
                </div>
                <ul className='pt-6'>
                    <li className='text-white text-sm flex items-center gap-x-4 p-2 cursor-pointer hover:bg-gray-700 rounded-md'>
                        <MdDashboard className='text-white' />
                        <span className={`${!open && 'hidden'} origin-left duration-200 `}>Dashboard</span>
                    </li>
                    <li className='text-white text-sm flex items-center gap-x-4 p-2 cursor-pointer hover:bg-gray-700 rounded-md'>
                        <RiInboxArchiveFill className='text-white' />
                        <span className={`${!open && 'hidden'} origin-left duration-200 `}>Inbox</span>
                    </li>
                    <li className='text-white text-sm flex items-center gap-x-4 p-2 cursor-pointer hover:bg-gray-700 rounded-md'>
                        <FaSearch className='text-white' />
                        <span className={`${!open && 'hidden'} origin-left duration-200 `}>Search</span>
                    </li>
                    <li className='text-white text-sm flex items-center gap-x-4 p-2 cursor-pointer hover:bg-gray-700 rounded-md'>
                        <IoSettings className='text-white' />
                        <span className={`${!open && 'hidden'} origin-left duration-200 `}>Setting</span>
                    </li>

                    {/* Suppliers Dropdown */}
                    <li 
                        className='text-white text-sm flex items-center justify-between gap-x-4 p-2 cursor-pointer hover:bg-gray-700 rounded-md mt-9'
                        onClick={() => setSupplierDropdownOpen(!supplierDropdownOpen)}
                    >
                        <div className='flex items-center gap-x-4'>
                            <MdOutlineInventory className='text-white' />
                            <span className={`${!open && 'hidden'} origin-left duration-200`}>Suppliers</span>
                        </div>
                        {open && (
                            <span className='text-white'>{supplierDropdownOpen ? <FiChevronsUp /> : <LuChevronsDown />}</span>
                        )}
                    </li>

                    {/* Dropdown menu */}
                    {supplierDropdownOpen && open && (
                        <ul className='ml-10 mt-2 space-y-2'>
                            <li className='text-white text-sm p-2 cursor-pointer hover:bg-gray-700 rounded-md'>
                                {/* <Link to="/">Suppliers List</Link> */}
                                <h1>suppliers list</h1>
                            </li>
                            <li className='text-white text-sm p-2 cursor-pointer hover:bg-gray-700 rounded-md'>
                                {/* <h1>suppliers form</h1> */}
                                <Link to="/suppliers">Suppliers Form</Link>
                            </li>
                        </ul>
                    )}

                    {/* {equipmentForm Dropdown} */}

                    <li className='text-white text-sm flex items-center gap-x-4 p-2 cursor-pointer hover:bg-gray-700 rounded-md mt-9'
                        onClick={() => setEquipmentForm(!equipmentForm)}

                    >
                        <div className="flex items-center gap-x-4">
                            <MdProductionQuantityLimits className='text-white' />
                            <span className={`${!open && 'hidden'} origin-left duration-200`}>Equipment Procurement</span>                            
                        </div>
                        {open && (
                            <span className='text-white'>{equipmentForm ? <FiChevronsUp /> : <LuChevronsDown />}</span>
                        )}
                    </li>

                    {/* Equipmentform dropdown menu */}
                    {equipmentForm && open && (
                        <ul className='ml-10 mt-2 space-y-2'>
                            <li className='text-white text-sm p-2 cursor-pointer hover:bg-gray-700 rounded-md'>
                                <Link to="/equipment-form">Equipment Procurement Form</Link>
                            </li>
                            <li className='text-white text-sm p-2 cursor-pointer hover:bg-gray-700 rounded-md'>
                                <h1>Equipment Procurement List</h1>
                            </li>
                        </ul>
                    )}
                </ul>
            </div>
            {/* <div className='p-7 text-2xl font-semibold flex-1 h-screen overflow-auto'>
                <h1>Home page</h1>             
            </div> */}
        </div>
    );
}

export default Sidebartest;





// import React, { useState } from "react";
// import { FaArrowLeft } from "react-icons/fa6";
// import syslogo from "../assets/syslogo.jpg";
// import { MdDashboard, MdOutlineInventory } from "react-icons/md";
// import { RiInboxArchiveFill } from "react-icons/ri";
// import { FaSearch } from "react-icons/fa";
// import { IoSettings } from "react-icons/io5";
// import { MdProductionQuantityLimits } from "react-icons/md";
// import { Link } from "react-router-dom";

// const Sidebartest = () => {
//   const [open, setOpen] = useState(true);
//   const [supplierDropdownOpen, setSupplierDropdownOpen] = useState(false);

//   return (
//     <div className="flex h-screen">
//       <div
//         className={`${
//           open ? "w-72" : "w-20"
//         } duration-300 h-screen p-5 pt-8 bg-pink-950 relative`}
//       >
//         <FaArrowLeft
//           className={`absolute cursor-pointer rounded-full right-3 top-9 w-7 
//                         border-2 border-purple-950 ${!open && "rotate-180"}`}
//           onClick={() => setOpen(!open)}
//         />
//         <div className="flex gap-x-4 items-center">
//           <img
//             src={syslogo}
//             className={`cursor-pointer duration-500 ${open && "rotate-[360deg]"}`}
//             alt="Logo"
//           />
//           <h1
//             className={`text-white origin-left font-medium text-xl duration-300 ${
//               !open && "scale-0"
//             }`}
//           >
//             Syscodes
//           </h1>
//         </div>
//         <ul className="pt-6">
//           <li className="text-gray-300 text-sm flex items-center gap-x-4 p-2 cursor-pointer hover:bg-gray-700 rounded-md">
//             <MdDashboard className="text-white" />
//             <Link to="/" className={`${!open && "hidden"} origin-left duration-200`}>
//               Dashboard
//             </Link>
//           </li>
//           <li className="text-gray-300 text-sm flex items-center gap-x-4 p-2 cursor-pointer hover:bg-gray-700 rounded-md">
//             <RiInboxArchiveFill className="text-white" />
//             <Link to="/inbox" className={`${!open && "hidden"} origin-left duration-200`}>
//               Inbox
//             </Link>
//           </li>
//           <li className="text-gray-300 text-sm flex items-center gap-x-4 p-2 cursor-pointer hover:bg-gray-700 rounded-md">
//             <FaSearch className="text-white" />
//             <Link to="/search" className={`${!open && "hidden"} origin-left duration-200`}>
//               Search
//             </Link>
//           </li>
//           <li className="text-gray-300 text-sm flex items-center gap-x-4 p-2 cursor-pointer hover:bg-gray-700 rounded-md">
//             <IoSettings className="text-white" />
//             <Link to="/settings" className={`${!open && "hidden"} origin-left duration-200`}>
//               Settings
//             </Link>
//           </li>

//           {/* Suppliers Dropdown */}
//           <li
//             className="text-gray-300 text-sm flex items-center justify-between gap-x-4 p-2 cursor-pointer hover:bg-gray-700 rounded-md mt-9"
//             onClick={() => setSupplierDropdownOpen(!supplierDropdownOpen)}
//           >
//             <div className="flex items-center gap-x-4">
//               <MdOutlineInventory className="text-white" />
//               <span className={`${!open && "hidden"} origin-left duration-200`}>
//                 Suppliers
//               </span>
//             </div>
//             {open && (
//               <span className="text-white">{supplierDropdownOpen ? "▲" : "▼"}</span>
//             )}
//           </li>

//           {/* Dropdown menu */}
//           {supplierDropdownOpen && open && (
//             <ul className="ml-10 mt-2 space-y-2">
//               <li className="text-gray-300 text-sm p-2 cursor-pointer hover:bg-gray-700 rounded-md">
//                 <Link to="/suppliers-list">Suppliers List</Link>
//               </li>
//               <li className="text-gray-300 text-sm p-2 cursor-pointer hover:bg-gray-700 rounded-md">
//                 <Link to="/suppliers-form">Suppliers Form</Link>
//               </li>
//             </ul>
//           )}

//           <li className="text-gray-300 text-sm flex items-center gap-x-4 p-2 cursor-pointer hover:bg-gray-700 rounded-md mt-9">
//             <MdProductionQuantityLimits className="text-white" />
//             <Link
//               to="/equipment-procurement"
//               className={`${!open && "hidden"} origin-left duration-200`}
//             >
//               Equipment Procurement
//             </Link>
//           </li>
//         </ul>
//       </div>
//       <div className="p-7 text-2xl font-semibold flex-1 overflow-auto">
//         <h1>Welcome to the App</h1>
//       </div>
//     </div>
//   );
// };

// export default Sidebartest;
