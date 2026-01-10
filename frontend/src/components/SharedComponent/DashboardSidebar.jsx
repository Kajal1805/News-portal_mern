import React from 'react'
import { FaComments, FaUserAlt, FaUsers } from 'react-icons/fa';
import { Link } from 'react-router-dom';
import { FaSignOutAlt } from "react-icons/fa";
import { SignOutSuccess } from '@/redux/user/userSlice';
import { useDispatch, useSelector } from 'react-redux';
import { IoIosCreate } from "react-icons/io";
import { IoDocumentSharp } from "react-icons/io5";
import { MdDashboardCustomize } from "react-icons/md"

const DashboardSidebar = () => {
  const {currentUser} = useSelector((state) => state.user)

    const dispatch = useDispatch()

    const handleSignOut = async () => {
  try {
const res = await fetch('/api/user/signout', {
  method: 'POST'
})

const data = await res.json()

if(!res.ok) {
  toast.error('Sign out failed. Please try again.')
} else {
  dispatch(SignOutSuccess());
  toast.success('Signed out successfully.');
}
 } catch(error) {

  }
}

  return (
    <aside className='h-screen w-64 bg-slate-200 text-slate-800 flex flex-col'>
        {/* header */}
        <div className='p-4 flex items-center justify-center bg-slate-200'>
            <h1 className='text-2xl font-bold'>Dashboard</h1>
        </div>

        {/* Navigation links */}
        <nav className='flex-1 p-4'>
            <ul className='space-y-2'>

              { currentUser && (
            <Link to={"/dashboard?tab=dashboard"} className="flex items-center p-2 hover:bg-slate-300 rounded">
                    <MdDashboardCustomize className='m-3'/> 
                    <span> Dashboard</span></Link>
          )}

                <li>
                    <Link to={"/dashboard?tab=profile"} className="flex items-center p-2 hover:bg-slate-300 rounded">
                    <FaUserAlt className='m-3'/>
                    <span>Profile</span></Link>
                </li>

          { currentUser && (
            <Link to={"/create-post"} className="flex items-center p-2 hover:bg-slate-300 rounded">
                    <IoIosCreate className='m-3'/>
                    <span>Create Post</span></Link>
          )}

           { currentUser && (
            <Link to={"/dashboard?tab=posts"} className="flex items-center p-2 hover:bg-slate-300 rounded">
                    <IoDocumentSharp className='m-3'/>
                    <span>Your Articles</span></Link>
          )}

           { currentUser && (
            <Link to={"/dashboard?tab=users"} className="flex items-center p-2 hover:bg-slate-300 rounded">
                    <FaUsers className='m-3'/> 
                    <span>All Users</span></Link>
          )}

           { currentUser && (
            <Link to={"/dashboard?tab=comments"} className="flex items-center p-2 hover:bg-slate-300 rounded">
                    <FaComments className='m-3'/> 
                    <span>All Comments</span></Link>
          )}

          
            </ul>

            <div className='p-4 border-t border-gray-700'>
                <button className='flex item-center w-full p-2 hover:bg-slate-300 rounded' onClick={handleSignOut}>
                    <FaSignOutAlt   className='m-1'/>
                    <span>Logout</span>
                </button>
            </div>
        </nav>
    </aside>
  )
}

export default DashboardSidebar;