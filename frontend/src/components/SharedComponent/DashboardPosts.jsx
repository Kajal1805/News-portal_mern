import React, { useEffect, useState } from 'react'
import axios from 'axios'
import { useParams } from 'react-router-dom'
import { useNavigate } from 'react-router-dom'
import { useSelector } from 'react-redux'
import { Table, TableCaption, TableHeader, TableRow, TableHead, TableBody, TableCell } from '../ui/table'
import { Link } from 'react-router-dom'
import toast from 'react-hot-toast'

export const DashboardPosts = () => {
const navigate = useNavigate();
const { token } = useSelector((state) => state.user)

  

const handleEdit = (id) => {
  navigate(`/create-post?postId=${id}`);
}
  const { currentUser } = useSelector((state) => state.user)
  const [userPosts, setUserPosts] = useState([])
  console.log(userPosts);

  useEffect(() => {
  const fetchPosts = async () => {
    // if (!currentUser?._id) return;

    try {
      const res = await fetch(`/api/post/getposts`,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },

        }
      );
      console.log("token")
      console.log("user")
      
      const data = await res.json();
      console.log("Fetched posts:", data);

      if (res.ok) {
        setUserPosts(data.posts); 
      }
    } catch (error) {
      console.log("Fetch error:", error);
    }
  }

  fetchPosts();
}, [currentUser?._id, token]);

 const handleDelete = async (id) => {
  if (!confirm("Are you sure you want to delete this post?")) return;

  try {
    const res = await fetch(
      `http://localhost:5000/api/post/deletepost/${id}/${currentUser._id}`,
      {
        method: "DELETE",
        credentials: "include",
      }
    );

    const data = await res.json();

    if (res.ok) {
      setUserPosts(prev => prev.filter(post => post._id !== id));
      toast.success("Post deleted successfully");
    } else {
      toast.error(data.message || "Failed to delete");
    }
  } catch (error) {
    console.log(error);
  }
};

  return (
    <div className='flex flex-col items-center justify-center w-full p-3'>
      {userPosts.length > 0 ? (
        <>
          <Table>
  <TableCaption>A list of your recent published articles.</TableCaption>
  <TableHeader>
    <TableRow>
      <TableHead className="w-[200px]">Date Updated</TableHead>
      <TableHead>Post Image</TableHead>
      <TableHead>Post Title</TableHead>
      <TableHead className="text-right">Category</TableHead>
      <TableHead className='text-right'>Delete</TableHead>
      <TableHead className='text-right'>Edit</TableHead>
    </TableRow>
  </TableHeader>

  <TableBody className='divide-y'>
    {userPosts.length > 0 ? (
      userPosts.map((post) => (
        <TableRow key={post._id}>
          <TableCell>{new Date(post.updatedAt).toLocaleDateString()}</TableCell>

          <TableCell>
            <Link to={`/post/${post.slug}`}>
            <img
              src={post.image || "https://via.placeholder.com/50"}
              alt="Post"
              className="w-12 h-12 object-cover rounded"
            />
            </Link>
          </TableCell>

          <TableCell>
            <Link to={`/post/${post.slug}`}
            className='text-blue-600 hover:underline'>{post.title}</Link>
          </TableCell>

          <TableCell className="text-right">{post.category}</TableCell>

          <TableCell>
            <span 
              onClick={() => handleDelete(post._id)}
            className=" font-medium text-red-500 hover:underline cursor-pointer"  
              >
                Delete
                </span>
          </TableCell>

          <TableCell>
            <Link
            to={`/update-post/${post._id}`}
           className='font-medium text-green-600 hover:underline cursor-pointer'>
         <span>Edit</span>
             </Link>
          </TableCell>
        </TableRow>
      ))
    ) : (
      <TableRow>
        <TableCell colSpan={6} className="text-center">
          No posts found.
        </TableCell>
      </TableRow>
    )}
  </TableBody>
</Table>

        </>
      ) : (
        <p>You have no post</p>
      )}
    </div>
  )
}

export default DashboardPosts;