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

const DashboardUsers = () => {

  const navigate = useNavigate();
  const { currentUser, token: reduxToken } = useSelector((state) => state.user)
  const token = reduxToken || JSON.parse(localStorage.getItem("user"))?.token
  console.log("redux users:", currentUser)
  console.log("redux token:", token)
  
  
  const [users, setUsers] = useState([]);
  const [showMore, setShowMore] = useState(true);
  const [userIdToDelete, setUserIdToDelete] = useState("");

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const res = await fetch(`http://localhost:5000/api/user/getusers`, {
          headers: {
            Authorization: `Bearer ${token}`
          }
        })
        const data = await res.json();

        if (res.ok) {
          setUsers(data.users);

          if (data.users.length >= 9) {
            setShowMore(false);
          }
        }
      } catch (error) {
        console.log("Fetch error:", error);
      }
    };

    fetchUsers();
      },
  [token]);

  const handleShowMore = async () => {
    const startIndex = users.length;

    try {
      const res = await fetch(
        `http://localhost:5000/api/user/getusers?startIndex=${startIndex}`, {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );

      const data = await res.json();

      if (res.ok) {
        setUsers((prev) => [...prev, ...data.users]);

        if (data.users.length < 9) {
          setShowMore(false);
        }
      }
    } catch (error) {
      console.log(error.message);
    }
  };

 const handleDeleteUsers = async () => {
  if (!userIdToDelete) return;

  try {
    const res = await fetch(`http://localhost:5000/api/user/delete/${userIdToDelete}`, {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${token}`
      }
    });

    const data = await res.json();

    if (res.ok) {
      toast.success("User deleted successfully");

     
      setUsers((prev) => prev.filter((u) => u._id !== userIdToDelete));

      setUserIdToDelete("");
    } else {
      toast.error(data.message || "Failed to delete user");
    }

  } catch (error) {
    console.log("Delete error:", error);
    toast.error("Something went wrong");
  }
};


  return (
    <div className="flex flex-col items-center justify-center w-full p-3">

      {users.length > 0 ? (
        <>
          <Table>
            <TableCaption>A list of your recent Users</TableCaption>

            <TableHeader>
              <TableRow className="hover:bg-gray-500">
                <TableHead className="w-[200px]">Joined on</TableHead>
                <TableHead>User Image</TableHead>
                <TableHead>Username</TableHead>
                <TableHead className="text-center w-28">Email</TableHead>
                <TableHead className="text-center w-28">Admin</TableHead>
                <TableHead className="text-center w-28">Delete</TableHead>
              </TableRow>
            </TableHeader>

            <TableBody className="divide-y">
              {users.map((user) => (
                <TableRow key={user._id}>

                  <TableCell>
                    {new Date(user.createdAt).toLocaleDateString()}
                  </TableCell>

                  <TableCell>
                    <img
                     src={user.profilePicture?.startsWith("http")? user.profilePicture: `http://localhost:5000/${user.profilePicture}` }alt={user.username}className="w-14 h-14 object-cover rounded"
                     />
                  </TableCell>

                  <TableCell>{user.username}</TableCell>

                  <TableCell className="text-center">
                    {user.email}
                  </TableCell>

                  <TableCell className=" text-center ">
                    {user.isAdmin ? (
                      <FaCheck className="text-green-600 text-xl mx-auto" />
                    ) : (
                      <RxCross2 className="text-red-600 text-xl mx-auto" />
                    )}
                  </TableCell>

                  <TableCell className="text-center">
                    <AlertDialog>
                      <AlertDialogTrigger asChild>
                        <span
                          onClick={() => setUserIdToDelete(user._id)}
                          className="font-medium text-red-500 hover:underline cursor-pointer"
                        >
                          Delete
                        </span>
                      </AlertDialogTrigger>

                      <AlertDialogContent className="sm:maz-w-md rounded-xl shadow-2xl">
                        <AlertDialogHeader>
                          <AlertDialogTitle className="text-xl font-semibold text-gray-900">
                            Are you sure you want to delete this user?
                          </AlertDialogTitle>
                          <AlertDialogDescription className="text-gray-600">
                            This action cannot be undone. It will permanently delete your account.
                          </AlertDialogDescription>
                        </AlertDialogHeader>

                        <AlertDialogFooter className="mt-4">
                          <AlertDialogCancel className="px-5">Cancel</AlertDialogCancel>
                          <AlertDialogAction
                            className="bg-red-600 px-5 hover:bg-red-700"
                            onClick={handleDeleteUsers}>
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
        <p>You have no users yet</p>
      )}

    </div>
  );
};

export default DashboardUsers;