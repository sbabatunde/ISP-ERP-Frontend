import React from 'react'
import { FaArrowsToDot } from "react-icons/fa6";

const Sidebar = ({children}) => {
  return (
    <aside className='h-screen'>
        <nav className='h-full flex flex-col shadow-m bg-white border-r'>
            <div className='p-4 pb-2 flex justify-between items-center'>
                <img src="" className='w-32' alt="" />
                <button className='p-1.5 rounded-lg bg-gray-50 hover:bg-gray-100'>
                    <FaArrowsToDot />
                </button>
            </div>

            <ul className='flex-1 px-3'>{children}</ul>
            
            <div className='border-t flex p-3'>
                <img src="" className='' alt="" />s
                <div className={`flex justify-between items-center w-52 ml-3`}>
                    <div>

                    </div>
                </div>
            </div>
        </nav>
    </aside>
  )
}

export default Sidebar