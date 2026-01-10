import React, { useEffect, useState } from 'react'
import { useSelector } from 'react-redux'
import { Link } from 'react-router-dom'
import { Textarea } from '../ui/textarea'
import { Button } from '../ui/button'
import toast from "react-hot-toast";


export const CommentSection = ({ postId }) => {
    const {currentUser, token } = useSelector((state) => state.user)
    const [comment, setComment] = useState("")
    const [allComments, setAllComments] = useState([])
    const [editCommentId, setEditCommentId] = useState(null)
    


    console.log("allComments", allComments)

    const handleSubmit = async (e) => {
        e.preventDefault()

        if(comment.length > 200) {
            toast.error( "Comment length must be lower than or equal to 200 characters" )
            return
        }

        try {
            const res = await fetch(`/api/comment/create`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`
                },
                body: JSON.stringify ({
                    content: comment,
                    postId,
                     
                }),
            })
        
            const data = await res.json()

            if (res.ok) {
                console.log("toast fired")
                toast.success("Comment created successfully!")
                setComment("")
                setAllComments((prev) => [data.comment, ...prev])
            }
        }
        catch (error) {
        console.log(error)
        toast.error("Something went wrong, please try again later.")
        }
    }
   
    useEffect(() => {
      
        const getComments = async () => {
            try {
                const res = await fetch(`/api/comment/getPostComments/${postId}`)

                if (res.ok) {
                    const data = await res.json()
                    setAllComments(data)
                }
            } catch (error) {
                console.log(error)
            }
        }
        getComments()
    }, [postId])

    const handleLike = async (commentId) => {
  if (!token) return;

  try {
    const res = await fetch(`/api/comment/likecomment/${commentId}`, {
      method: "PUT",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    const data = await res.json();

    if (res.ok) {
      setAllComments((prev) =>
        prev.map((c) => (c._id === data._id ? data : c))
      );
    }
  } catch (error) {
    console.log(error);
  }
};

const handleDelete = async (commentId) => {
  try {
    const res = await fetch(`/api/comment/delete/${commentId}`, {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (res.ok) {
      setAllComments((prev) => prev.filter((c) => c._id !== commentId));
      toast.success("Comment deleted");
    }
  } catch (error) {
    console.log(error);
  }
};

const handleEdit = async (comment) => {
  const newContent = prompt("Edit your comment:", comment.content);

  if (!newContent) return;

  try {
    const res = await fetch(`/api/comment/update/${comment._id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ content: newContent }),
    });

    const data = await res.json();

    if (res.ok) {
      setAllComments((prev) =>
       prev.map((c) => (c._id === data._id ? data : c))
      );
      toast.success("Comment updated");
    }
  } catch (error) {
    console.log(error);
  }
};

  return (
    <div className='max-w-3xl mx-auto w-full p-3'>
        {currentUser ? ( <div className='flex items-center gap-1 my-5 text-gray-500 text-sm'>
            <p>Signed in as:</p>
            <img src={currentUser.profilePicture} alt="Profile pic" className='h-5 w-5 object-cover rounded-full' />

            <Link to={"/dashboard?tab=profile"} className='text-sm text-blue-800 hover:underline'>
            @{currentUser.username}</Link>


        </div>
     ): ( 
     <div className='text-sm text-gray-700 my-5 flex-gap-1'>
        You must be Signed In to  comment.

        <Link to={"/sign-in" } className="text-blue-600 hover:underline">Sign In</Link>
     </div> 
     )}

     {currentUser && (
        <form className='border-2 border-gray-400 rounded-md p-4' onSubmit={handleSubmit}>
            <Textarea placeholder="Add a comment..." rows="3" maxLength="200" className="border border-slate-400 focus-visible:ring-0 focus:visible:ring-offset-0"
            onChange={(e) => setComment(e.target.value)}
            value={comment}
            />

            <div className="flex justify-between items-center mt-5">
                <p className="text-sm text-gray-500">{200 - comment.length} characters remaining</p>

                <Button type="submit" >Submit</Button>
            </div>
        </form>
     )}
       
     
        <div className='mt-8'><h2 className='text-xl font-semibold mb-4'>Comments</h2>

        {allComments.length === 0 ? (
            <p className="text-gray-600 text-sm italic text-center">No comments yet. Be the first to comment!</p>
        ) : (
          <div className='flex flex-col gap-4'> {allComments.filter(Boolean).map((c) => (
            <div
          key={c._id} className="border p-4 rounded-md shadow-sm bg-gray-50">
            <div className='flex items-center gap-2 mb-2'>

                <img
                src={currentUser.profilePicture}
                alt="profile"
                className='h-6 w-6 rounded-full object-cover' />
                <p className='text-sm font-medium'>@{currentUser.username}</p>
            </div>

            <p className='text-gray-800'>{c.content}</p>

             <div className='flex gap-4 items-center text-sm text-gray-600'>

      {/* LIKE */}
      <button
        onClick={() => handleLike(c._id)}
        className='hover:text-blue-600 flex gap-1 items-center'
      >
        👍
        <span>{c.noOfLikes}</span>
      </button>

      {/* EDIT */}
      {currentUser?._id === c.userId && (
        <button
          onClick={() => setComment(c.content)}
          className='hover:text-green-600'
        >
          Edit
        </button>
      )}

      {/* DELETE (sirf apna ho toh) */}
      {currentUser?._id === c.userId && (
        <button
          onClick={() => handleDelete(c._id)}
          className='hover:text-red-600'
        >
          Delete
        </button>
      )}
            </div>
    </div>
    
        ))}
  </div>
        )}
    </div>
    </div>
  )}
 


export default CommentSection;