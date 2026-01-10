import React from 'react'
import DashboardSidebar from '@/components/SharedComponent/DashboardSidebar.jsx';
import { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import DashboardProfile from '@/components/SharedComponent/DashboardProfile';
import BottomNavBar from '@/components/SharedComponent/BottomNavBar';
import DashboardPosts from '@/components/SharedComponent/DashboardPosts';
import DashboardUsers from '@/components/SharedComponent/DashboardUsers';
import DashboardComments from '@/components/SharedComponent/DashboardComments';
import MainDashboard from '@/components/SharedComponent/MainDashboard';

const Dashboard = () => {
    const location = useLocation()
const [tab, setTab] = useState("")

useEffect(() => {
    const urlParams = new URLSearchParams(location.search)
    const tabFromUrl = urlParams.get("tab")

    // console.log(tabFromUrl)

    if(tabFromUrl) {
        setTab(tabFromUrl)
    }
}, [location.search])

    return (
        <div className='min-h-screen flex flex-col md:flex-row w-full'>
            {/* Sidebar */}
            <div className='hidden md:block'>
                <DashboardSidebar />
            </div>

            <BottomNavBar />
        <div className='w-full'>
            { /* profile */ }
            {tab=== "profile" && <DashboardProfile />}
            
            { /* news Articles */}
            {tab=== "posts" && <DashboardPosts />}
            { /* users */}
            {tab=== "users" && <DashboardUsers />}

            {/* {comments} */}
            {tab === "comments" && <DashboardComments />}

            {/* {Main dashboard} */}
            {tab === "dashboard" && <MainDashboard/>}

            </div>
            
            </div>
        
    );
};

export default Dashboard;