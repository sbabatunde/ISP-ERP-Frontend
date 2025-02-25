import React, { useState, useEffect } from 'react';
import syslogo from '../assets/syslogo.jpg';
import sys from '../assets/sys.png';
import { MdDashboard, MdOutlineInventory, MdTableRows, MdMenu } from 'react-icons/md';
import { FaChevronDown, FaChevronUp } from "react-icons/fa6";
import { RiInboxArchiveFill } from 'react-icons/ri';
import { FaSearch } from 'react-icons/fa';
import { IoSettings } from 'react-icons/io5';
import { MdProductionQuantityLimits } from 'react-icons/md';
import { Link } from 'react-router-dom';
import { FiChevronsUp } from "react-icons/fi";
import { LuChevronsDown } from "react-icons/lu";

const Sidebartest = ({ open, toggleSidebar }) => {
    const [supplierDropdownOpen, setSupplierDropdownOpen] = useState(false);
    const [equipmentForm, setEquipmentForm] = useState(false);

    return (
        <>
            {/* Toggle Button (Always Visible in Top-Left Corner) */}
            <MdMenu
                className="fixed top-4 left-4 text-3xl text-pink-600 cursor-pointer z-50"
                onClick={toggleSidebar}
            />

            {/* Sidebar */}
            <div
                className={`fixed top-0 left-0 h-full bg-pink-600 text-white overflow-y-auto transform ${
                    open ? "translate-x-0" : "-translate-x-full"
                } transition-transform duration-300 w-72 shadow-lg`}
            >
                {/* Logo */}
                <div className="flex items-center p-5 gap-x-4">
                    <img 
                        src={sys} 
                        className="cursor-pointer h-10 duration-500 bg-white w-20"
                        alt="Logo"
                    />
                </div>

                {/* Sidebar Links */}
                <ul className="mt-5 space-y-2">
                    <li className="flex items-center gap-x-4 p-2 cursor-pointer hover:bg-gray-700 rounded-md">
                        <MdDashboard />
                        <span>Dashboard</span>
                    </li>
                    <li className="flex items-center gap-x-4 p-2 cursor-pointer hover:bg-gray-700 rounded-md">
                        <RiInboxArchiveFill />
                        <span>Inbox</span>
                    </li>
                    <li className="flex items-center gap-x-4 p-2 cursor-pointer hover:bg-gray-700 rounded-md">
                        <FaSearch />
                        <span>Search</span>
                    </li>

                    {/* Suppliers Dropdown */}
                    <li
                        className="flex items-center justify-between gap-x-4 p-2 cursor-pointer hover:bg-gray-700 rounded-md"
                        onClick={() => setSupplierDropdownOpen(!supplierDropdownOpen)}
                    >
                        <div className="flex items-center gap-x-4">
                            <MdOutlineInventory />
                            <span>Suppliers</span>
                        </div>
                        <span>{supplierDropdownOpen ? <FaChevronUp /> : <FaChevronDown />}</span>
                    </li>

                    {/* Dropdown Menu */}
                    {supplierDropdownOpen && (
                        <ul className="ml-10 mt-2 space-y-2 bg-opacity-10 p-2 rounded-md">
                            <li className="text-white text-sm p-2 cursor-pointer hover:bg-gray-700 rounded-md">
                                <Link to="inventory/suppliers-list">Suppliers List</Link>
                            </li>
                            <li className="text-white text-sm p-2 cursor-pointer hover:bg-gray-700 rounded-md">
                                <Link to="inventory/suppliers">Suppliers Form</Link>
                            </li>
                        </ul>
                    )}

                    {/* Equipment Form Dropdown */}
                    <li
                        className="flex items-center justify-between gap-x-4 p-2 cursor-pointer hover:bg-gray-700 rounded-md"
                        onClick={() => setEquipmentForm(!equipmentForm)}
                    >
                        <div className="flex items-center gap-x-4">
                            <MdProductionQuantityLimits />
                            <span>Equipment Procurement</span>
                        </div>
                        <span>{equipmentForm ? <FaChevronUp /> : <FaChevronDown />}</span>
                    </li>

                    {equipmentForm && (
                        <ul className="ml-10 mt-2 space-y-2 bg-opacity-10 p-2 rounded-md">
                            <li className="text-white text-sm p-2 cursor-pointer hover:bg-gray-700 rounded-md">
                                <Link to="/equipment-form">Equipment Procurement Form</Link>
                            </li>
                            <li className="text-white text-sm p-2 cursor-pointer hover:bg-gray-700 rounded-md">
                                <Link to="/equipment-list">Equipment Procurement List</Link>
                            </li>
                            <li className="text-white text-sm p-2 cursor-pointer hover:bg-gray-700 rounded-md">
                                <Link to="/equipment-type-form">Equipment Type Form</Link>
                            </li>
                            <li className="text-white text-sm p-2 cursor-pointer hover:bg-gray-700 rounded-md">
                                <Link to="/procurement-form">Procurement Form</Link>
                            </li>
                            <li className="text-white text-sm p-2 cursor-pointer hover:bg-gray-700 rounded-md">
                                <Link to="/equipment">Equipment Form</Link>
                            </li>
                        </ul>
                    )}

                    <li className="flex items-center gap-x-4 p-2 cursor-pointer hover:bg-gray-700 rounded-md">
                        <IoSettings />
                        <span>Settings</span>
                    </li>
                </ul>
            </div>
        </>
    );
};

export default Sidebartest;
