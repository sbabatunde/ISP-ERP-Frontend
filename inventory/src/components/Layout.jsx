
// import React, { useState } from 'react';
// import Form from './Form';
// import SuppliersForm from './Suppliers';

// const Layout = () => {
//     const [activeComponent, setActiveComponent] = useState('suppliers');

//     const renderComponent = () => {
//         switch (activeComponent) {
//             case 'form':
//                 return <Form />;
//             case 'suppliers':
//                 return <SuppliersForm />;
//             default:
//                 return <SuppliersForm />;
//         }
//     };

//     return (
//         <div>
//             <nav className="mb-4">
//                 <button 
//                     className="mr-2 p-2 bg-blue-500 text-white rounded" 
//                     onClick={() => setActiveComponent('form')}
//                 >
//                     Show Form
//                 </button>
//                 <button 
//                     className="p-2 bg-blue-500 text-white rounded" 
//                     onClick={() => setActiveComponent('suppliers')}
//                 >
//                     Show Suppliers Form
//                 </button>
//             </nav>
//             <div className="component-container">
//                 {renderComponent()}
//             </div>
//         </div>
//     );
// };

// export default Layout;

import { Outlet } from "react-router-dom";
import Sidebartest from "./Sidebartest";

export default function Layout() {
  return (
    <div className="flex h-screen">
      <Sidebartest />
      <main className="p-5 flex-1 overflow-auto">
        <Outlet />
      </main>
    </div>
  );

}