import React, { useEffect, useState } from 'react'
import { useSelector } from 'react-redux'
import DashboardCard from './DashboardCard'
import { useNavigate } from 'react-router-dom'

const MainDashboard = () => {
    const navigate = useNavigate()

    const [users, setUsers] = useState([])
    const [comments, setComments] = useState([])
    const [posts, setPosts] = useState([])

    console.log(users)
    console.log(posts)
    console.log(comments)

    const [totalUsers, setTotalUsers] = useState(0)
    const [totalPosts, setTotalPosts] = useState(0)
    const [totalComments, setTotalComments] = useState(0)

    const [lastMonthUsers, setLastMonthUsers] = useState(0)
    const [lastMonthPosts, setLastMonthPosts] = useState(0)
    const [lastMonthComments, setLastMonthComments] = useState(0)

    const { currentUser, token } = useSelector((state) => state.user)

    useEffect (() => {
        const fetchUsers = async () => {
            try {
                const res = await fetch(`http://localhost:5000/api/user/getusers?limit=5`, {
                    method: "GET",
                headers: {
                    "Content-Type": "application/json",
                     Authorization: `Bearer ${token}`
          }
        })
                const data = await res.json()

                if(res.ok) {
                    setUsers(data.users)
                    setTotalUsers(data.totalUsers)
                    setLastMonthUsers(data.lastMonthUsers)
                }
            }
            catch (error) {
                console.log(error.message)
            }
        }

         const fetchPosts = async () => {
            try {
                const res = await fetch(`http://localhost:5000/api/post/getposts?limit=5`, {
                    
            headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },

                })

                const data = await res.json()

                if(res.ok) {
                    setPosts(data.posts)
                    setTotalPosts(data.totalPost || data.totalPosts || data.posts.length)
                    setLastMonthPosts(data.lastMonthPosts)
                }
            }
            catch (error) {
                console.log(error.message)
            }
        }


        const fetchComments = async () => {
            try {
                const res = await fetch(`http://localhost:5000/api/comment/getcomments?limit=5`, {
                    headers: {
                    Authorization: `Bearer ${token}`
                   }
        
                })

                const data = await res.json()

                if(res.ok) {
                    setComments(data.comments)
                    setTotalComments(data.totalComments)
                    setLastMonthComments(data.lastMonthComments)
                }
            }
            catch (error) {
                console.log(error.message)
            }
        }

        if(currentUser && token && currentUser.isAdmin) {
            fetchUsers()
            fetchPosts()
            fetchComments()
        }
    }, [currentUser, token])

  return (
    <div className="max-w-6xl mx-auto px-6 py-10 w-full min-h-fit rounded-2xl shadow-md p-6 border border-gray-200 flex flex-col gap-14 mb-10">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <DashboardCard 
            title = "All Users" 
            description={"November 2024 - Today"} 
            chartData={{ value: totalUsers}}
            chartConfig={{
                users: {label: "Users"},
            }}
            color="#2563eb"
             totalValue={totalUsers}
            lastMonthValue={lastMonthUsers}
            footerText={"Showing total users for all time"}
            endAngle={250}
            />

            <DashboardCard 
            title = "All Comments" 
            description={"November 2024 - Today"} 
            chartData={{ value: totalComments}}
            chartConfig={{
                users: {label: "Comments"},
            }}
             totalValue={totalComments}
            lastMonthValue={lastMonthComments}
            footerText={"Showing total comments for all time"}
            endAngle={160}
            color="#f59e0b"
            />

            <DashboardCard 
            title = "All Posts" 
            description={"November 2024 - Today"} 
            chartData={{ value: totalPosts}}
            chartConfig={{
                users: {label: "Posts"},
            }}
            color="#22c55e"
             totalValue={totalPosts}
            lastMonthValue={lastMonthPosts}
            footerText={"Showing total posts for all time"}
            endAngle={110}
            />

           
        </div>

        {/* Bottom Sections */}
<div className="mt-10  grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10 ">

  {/* ===== Recent Users ===== */}
  <div className="bg-white p-6 rounded-xl shadow-md border h-[350px] overflow-y-auto">
    <div className="flex justify-between items-center mb-5">
      <h2 className="font-semibold text-lg">Recent Users</h2>
      <button className="text-sm bg-black text-white px-3 py-1 rounded-full"
      onClick={() => navigate("/dashboard?tab=users")}>
        See all
      </button>
    </div>

    <ul className="space-y-3">
      {users.map((user) => (
        <li
          key={user._id}
          className="flex items-center gap-3 pb-2 border-b"
        >
          <img
            src={user.profilePicture}
            alt=""
            className="w-8 h-8 rounded-full object-cover"
          />
          <span className="text-sm">{user.username || user.email}</span>
        </li>
      ))}
    </ul>
  </div>

  {/* ===== Recent Comments ===== */}
  <div className="bg-white p-6 rounded-xl shadow-md border h-[350px] overflow-y-auto">
    <div className="flex justify-between items-center mb-5">
      <h2 className="font-semibold text-lg">Recent Comments</h2>
      <button className="text-sm bg-black text-white px-3 py-1 rounded-full"
      onClick={() => navigate("/dashboard?tab=comments")}>
        See all
      </button>
    </div>

    <ul className="space-y-3">
  {comments && comments.length > 0 ? comments.map((comment) => (
    <li key={comment._id} className="flex justify-between items-center pb-2 border-b">
      <span className="text-sm">{comment.comment ||comment.content || "No comment"}</span>
      <span className="text-xs text-gray-500">
        {comment.numberOfLikes ?? (comment.likes?.length || 0)} likes
      </span>
    </li>
  )) : <p className="text-sm text-gray-500">No comments found</p>}
</ul>
  </div>

  {/* ===== Recent Posts ===== */}
  <div className="bg-white p-6 rounded-xl shadow-md border h-[350px] overflow-y-auto">
    <div className="flex justify-between items-center mb-5">
      <h2 className="font-semibold text-lg">Recent Posts</h2>
      <button className="text-sm bg-black text-white px-3 py-1 rounded-full"
      onClick={() => navigate("/dashboard?tab=posts")}>
        See all
      </button>
    </div>

    <ul className="space-y-3">
      {posts.map((post) => (
        <li
          key={post._id}
          className="flex items-center gap-3 pb-2 border-b"
        >
          <img
            src={post.image}
            alt=""
            className="w-10 h-10 rounded-md object-cover"
          />

          <div>
            <p className="text-sm font-medium">
              {post.title}
            </p>
            <p className="text-xs text-gray-500">
              {post.category}
            </p>
          </div>
        </li>
      ))}
    </ul>
  </div>

</div>
    </div>


  )
}

export default MainDashboard;