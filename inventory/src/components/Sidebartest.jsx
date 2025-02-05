import React, { useState } from 'react';
import syslogo from '../assets/syslogo.jpg';
import { MdDashboard, MdOutlineInventory, MdProductionQuantityLimits, MdOutlineCancel, MdTableRows } from 'react-icons/md';
import { RiInboxArchiveFill } from 'react-icons/ri';
import { FaSearch } from 'react-icons/fa';
import { IoSettings } from 'react-icons/io5';
import { Link } from 'react-router-dom';
import { FiChevronsUp } from "react-icons/fi";
import { LuChevronsDown } from "react-icons/lu";
import { IoCloseSharp } from "react-icons/io5";

const Sidebartest = ({ open, setOpen }) => {
    const [supplierDropdownOpen, setSupplierDropdownOpen] = useState(false);
    const [equipmentForm, setEquipmentForm] = useState(false);

    return (
        <div className={`fixed top-0 left-0 h-full bg-pink-600 z-50 transition-transform duration-300 ${open ? 'translate-x-0' : '-translate-x-full'} md:relative md:translate-x-0 md:w-72 ${open ? 'w-72' : 'w-20'}`}> 
            <div className='flex gap-x-4 items-center p-5 pt-8'>
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
                <li className='text-white text-sm flex items-center gap-x-4 p-2 cursor-pointer hover:bg-gray-600 rounded-md'>
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
                <li 
                    className='text-white text-sm flex items-center justify-between gap-x-4 p-2 cursor-pointer hover:bg-gray-700 rounded-md '
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

                {supplierDropdownOpen && open && (
                    <ul className='ml-10 mt-2 space-y-2 bg-white bg-opacity-10'>
                        <li className='text-black text-sm p-2 cursor-pointer hover:bg-gray-700 rounded-md '>
                            <Link to="inventory/suppliers-list">Suppliers List</Link>
                        </li>
                        <li className='text-black text-sm p-2 cursor-pointer hover:bg-gray-700 rounded-md'>
                            <Link to="inventory/suppliers">Suppliers Form</Link>
                        </li>
                    </ul>
                )}

                <li className='text-white text-sm flex items-center gap-x-4 p-2 cursor-pointer hover:bg-gray-700 rounded-md '
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

                {equipmentForm && open && (
                    <ul className='ml-10 mt-2 space-y-2 bg-white bg-opacity-10'>
                        <li className='text-black text-sm p-2 cursor-pointer hover:bg-gray-700 rounded-md'>
                            <Link to="/equipment-form">Equipment Procurement Form</Link>
                        </li>
                        <li className='text-black text-sm p-2 cursor-pointer hover:bg-gray-700 rounded-md'>
                            <Link to="/equipment-list">Equipment Procurement List</Link>
                        </li>
                        <li className='text-black text-sm p-2 cursor-pointer hover:bg-gray-700 rounded-md'>
                            <Link to="/equipment-type-form">Equipment Type Form</Link>
                        </li>
                        <li className='text-black text-sm p-2 cursor-pointer hover:bg-gray-700 rounded-md'>
                            <Link to="/equipment-movement-form">Equipment Movement Form</Link>
                        </li>
                    </ul>
                )}
                <li className='text-white text-sm flex items-center gap-x-4 p-2 cursor-pointer hover:bg-gray-700 rounded-md'>
                    <IoSettings className='text-white' />
                    <span className={`${!open && 'hidden'} origin-left duration-200 `}>Settings</span>
                </li>
            </ul>
        </div>
    );
}

export default Sidebartest;
