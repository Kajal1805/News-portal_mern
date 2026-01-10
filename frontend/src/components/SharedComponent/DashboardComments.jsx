import React, { useEffect, useState } from 'react'
import axios from 'axios'
import { useNavigate } from 'react-router-dom'
import { useSelector } from 'react-redux'
import { Table, TableCaption, TableHeader, TableRow, TableHead, TableBody, TableCell } from '../ui/table'
import toast from 'react-hot-toast'
import { FaCheck } from 'react-icons/fa'
import { RxCross2 } from "react-icons/rx";
import { 
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogTitle,
  AlertDialogTrigger
} from '../ui/alert-dialog'
import { AlertDialogFooter, AlertDialogHeader } from '../ui/alert-dialog'

const DashboardComments = () => {

  const navigate = useNavigate();
  const { currentUser, token: reduxToken } = useSelector((state) => state.user)
  const token = reduxToken || JSON.parse(localStorage.getItem("user"))?.token
  console.log("redux users:", currentUser)
  console.log("redux token:", token)
  
  
  const [comments, setComments] = useState([]);
  const [showMore, setShowMore] = useState(true);
  const [commentIdToDelete, setCommentIdToDelete] = useState("");

  useEffect(() => {
    const fetchComments = async () => {
      try {
        const res = await fetch(`http://localhost:5000/api/comment/getcomments`, {
          headers: {
            Authorization: `Bearer ${token}`
          }
        })
        const data = await res.json();

        if (res.ok) {
          setComments(data.comments);

          if (data.comments.length < 9) {
            setShowMore(false);
          }
        }
      } catch (error) {
        console.log("Fetch error:", error);
      }
    };

    fetchComments();
      },
  [token]);

  const handleShowMore = async () => {
    const startIndex = comments.length;

    try {
      const res = await fetch(
        `http://localhost:5000/api/comment/getcomments?startIndex=${startIndex}`, {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );

      const data = await res.json();

      if (res.ok) {
        setComments((prev) => [...prev, ...data.comments]);

        if (data.comments.length < 9) {
          setShowMore(false);
        }
      }
    } catch (error) {
      console.log(error.message);
    }
  };

 const handleDeleteComment = async () => {
  if (!commentIdToDelete) return;

  try {
    const res = await fetch(`http://localhost:5000/api/comment/delete/${commentIdToDelete}`, {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${token}`
      }
    });

    const data = await res.json();

    if (res.ok) {
      toast.success("Comment deleted successfully");

     
      setComments((prev) => prev.filter((comment) => comment._id !== commentIdToDelete));

      setCommentIdToDelete("");
    } else {
      toast.error(data.message || "Failed to delete comment");
    }

  } catch (error) {
    console.log("Delete error:", error);
    toast.error("Something went wrong");
  }
};


  return (
    <div className="flex flex-col items-center justify-center w-full p-3">

      {comments.length > 0 ? (
        <>
          <Table>
            <TableCaption>A list of your recent Comments</TableCaption>

            <TableHeader>
              <TableRow className="hover:bg-gray-500">
                <TableHead className="w-[200px]">Date Updates</TableHead>
                <TableHead>Comments</TableHead>
                <TableHead>Number of likes</TableHead>
                <TableHead className="text-center w-28">Post Id</TableHead>
                <TableHead className="text-center w-28">userId</TableHead>
                <TableHead className="text-center w-28">Delete</TableHead>
              </TableRow>
            </TableHeader>

            <TableBody className="divide-y">
              {comments.map((comment) => (
                <TableRow key={comment._id}>

                  <TableCell>
                    {new Date(comment.updatedAt).toLocaleDateString()}
                  </TableCell>

                  <TableCell>
                   {comment.content}
                  </TableCell>

                  <TableCell>{comment.numberOfLikes}</TableCell>

                  <TableCell className="text-center">
                    {comment.postId}
                  </TableCell>
                 
                 <TableCell className="text-center">{comment.userId}</TableCell>

                  <TableCell className="text-center">
                    <AlertDialog>
                      <AlertDialogTrigger asChild>
                        <span
                          onClick={() => setCommentIdToDelete(comment._id)}
                          className="font-medium text-red-500 hover:underline cursor-pointer"
                        >
                          Delete
                        </span>
                      </AlertDialogTrigger>

                      <AlertDialogContent className="sm:maz-w-md rounded-xl shadow-2xl">
                        <AlertDialogHeader>
                          <AlertDialogTitle className="text-xl font-semibold text-gray-900">
                            Are you sure you want to delete this comment?
                          </AlertDialogTitle>
                          <AlertDialogDescription className="text-gray-600">
                            This action cannot be undone. It will permanently delete your comment.
                          </AlertDialogDescription>
                        </AlertDialogHeader>

                        <AlertDialogFooter className="mt-4">
                          <AlertDialogCancel className="px-5">Cancel</AlertDialogCancel>
                          <AlertDialogAction
                            className="bg-red-600 px-5 hover:bg-red-700"
                            onClick={handleDeleteComment}>
                            Continue
                        </AlertDialogAction>
                        </AlertDialogFooter>
                      </AlertDialogContent>
                    </AlertDialog>
                  </TableCell>

                </TableRow>
              ))}
            </TableBody>
          </Table>

          {showMore && (
            <button
              onClick={handleShowMore}
              className="w-full text-blue-700 self-center text-sm py-7"
            >
              Show more
            </button>
          )}
        </>
      ) : (
        <p>You have no comments yet</p>
      )}

    </div>
  );
};

export default DashboardComments;