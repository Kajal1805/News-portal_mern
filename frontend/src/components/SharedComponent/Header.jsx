import React, { useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { FaSearch } from "react-icons/fa";
import { Button } from '../ui/button';
import { useDispatch, useSelector } from 'react-redux';
import { useLocation } from 'react-router-dom';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { SignOutSuccess } from '@/redux/user/userSlice';


const Header = () => {
  const dispatch = useDispatch()
  const {currentUser} = useSelector((state) => state.user)
  // console.log("Current User in Header:", currentUser); // debug
  const location = useLocation();
  const navigate = useNavigate()
  const [searchTerm, setSearchTerm] = useState("")
  

  useEffect(() => {
    const urlParams = new URLSearchParams(location.search)


    const searchTermFromUrl = urlParams.get("searchTerm")

    if(searchTermFromUrl) {
      setSearchTerm(searchTermFromUrl)
    }
  }, [location.search])

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
   console.log(error)
  }
}

const handleSubmit = (e) => {
  e.preventDefault()

  const urlParams = new URLSearchParams(location.search)
  urlParams.set("searchTerm", searchTerm)

  const searchQuery = urlParams.toString()

  navigate(`/search/${searchQuery}`)
}
  

  const hideProfile = 
  location.pathname === "/sign-in" ||
  location.pathname === "/sign-up";
  
  return (
    <nav className=" bg-background shadow-lg sticky ">
    <div className="flex justify-between items-center max-w-6xl lg:max-w-7xl max-auto p-4 gap-10">
        <Link to="/">
        <h1 className="font-bold text-xl sm:text-2xl flex flexwrap p-4">
         <span className="text-slate-500">Morning</span>   
         <span className="text-slate-900">Dispatch</span>   
        </h1></Link>

        <form className="p-3 bg-slate-100 rounded-lg flex items-center" onSubmit={handleSubmit}>
            <input type="text" placeholder="Search..." className="focus:outline-none bg-transparent w-24 sm:w-64" 
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            />

            <button>
                <FaSearch className="text-slate-600" />
            </button>

        </form>

        <ul className="flex gap-6">
            <Link to="/">
            <li className="hidden lg:inline text-slate-700 hover:underline">Home</li>
                </Link>

                <Link to="/About">
            <li className="hidden lg:inline text-slate-700 hover:underline">About</li>
                </Link>

                <Link to="/NewsArticle">
            <li className="hidden lg:inline text-slate-700 hover:underline">News Articles</li>
                </Link>

              </ul>
              {hideProfile ? (
 
  <Link to={"/sign-in"}>
    <Button>Sign In</Button>
  </Link>
) : currentUser ? (
  
  <DropdownMenu>
    <DropdownMenuTrigger asChild>
      <div>
        <img
         src={
    currentUser?.profilePicture ||
       "https://cdn-icons-png.flaticon.com/512/149/149071.png"
  }
  alt="user"
  className="w-10 h-10 rounded-full object-cover"
    
        />
      </div>
    </DropdownMenuTrigger>
    <DropdownMenuContent className="w-60 bg-white text-black shadow-xl border border-gray-200 z-50">
      <DropdownMenuLabel>My Account</DropdownMenuLabel>
      <DropdownMenuSeparator className="bg-gray-400" />
      <DropdownMenuItem className="block font-sm bg-gray-50 rounded-md p-2">
        <div className='flex flex-col gap-1'>
          <span>{currentUser?.user?.username}</span>
          <span>{currentUser?.user?.email}</span>
        </div>
      </DropdownMenuItem >
      <DropdownMenuItem className= "font-semibold mt-2 hover:bg-gray-100 cursor-pointer">
        <Link to={"/dashboard?tab=profile"}>Profile</Link>
      </DropdownMenuItem>

      <DropdownMenuItem onClick={handleSignOut} className="font-semibold mt-2 hover:bg-red-100 text-red-600 cursor-pointer">Signout</DropdownMenuItem>
      
    </DropdownMenuContent>
  </DropdownMenu>
) : (
  
  <Link to={"/sign-in"}>
    <Button>Sign In</Button>
  </Link>
)}
              
            
    </div>
    </nav>
  );
};

export default Header;