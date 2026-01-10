import React, { useRef, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Input } from '../ui/input'
import { Button } from '../ui/button'
import { updateStart, updateSuccess, updateFailure, deleteUserStart, deleteUserFailure, deleteUserSuccess, SignOutSuccess } from '@/redux/user/userSlice'
import { uploadFile as uploadToAppwrite, getFilePreview } from '@/lib/appwrite/uploadImage'
import { toast } from 'react-hot-toast'
import { AlertDialog, AlertDialogTrigger, AlertDialogContent, AlertDialogHeader, AlertDialogDescription, AlertDialogTitle, AlertDialogCancel, AlertDialogAction, AlertDialogFooter } from '../ui/alert-dialog'

const DashboardProfile = () => {
const { currentUser, token, error, loading } = useSelector((state) => state.user)
const profilePicRef = useRef();
const dispatch = useDispatch();

const [imageFile, setImageFile] = useState(null)
const [imageFileUrl, setImageFileUrl] = useState(null)
const [formData, setFormData] = useState({})

const handleImageChange = (e) => {
const file = e.target.files[0]
if (file) {
setImageFile(file)
setImageFileUrl(URL.createObjectURL(file))
}
}

const handleChange = (e) => {
setFormData({ ...formData, [e.target.id]: e.target.value })
}

const uploadImage = async () => {
if (!imageFile) return currentUser?.user?.profilePicture
try {
const uploaded = await uploadToAppwrite(imageFile)
const profileUrl = uploaded? getFilePreview(uploaded.$id) : currentUser?.profilePicture;
return profileUrl
} catch (error) {
toast.error('Image upload failed.')
console.log(error)
}
}

const handleSubmit = async (e) => {
  e.preventDefault();
   console.log("current user: ", currentUser)
   console.log("token: ", currentUser?.token)
  try {
    console.log("API HIT ✅");

    dispatch(updateStart());

    const profilePicture = await uploadImage();

    const updateProfile = { ...formData, profilePicture };
    if (!updateProfile.password) delete updateProfile.password;

    const userId = currentUser?._id;
    const tokenFromStore = token;

    const res = await fetch(`http://localhost:5000/api/user/update/${userId}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${tokenFromStore}`,
      },
      body: JSON.stringify(updateProfile),
    });

    const data = await res.json();
    console.log("Response:", data);

    if (res.ok) {
      dispatch(updateSuccess({ user: data.user, token }));
      localStorage.setItem("user", JSON.stringify({ user: data.user, token }));
      toast.success("Profile updated successfully ✅");
    } else {
      dispatch(updateFailure(data.message || "Update failed"));
      toast.error(data.message || "Update failed ❌");
    }
  } catch (error) {
    console.log(error);
    dispatch(updateFailure(error.message));
    toast.error("Update failed ❌");
  }
};

const handleDeleteUser = async () => {
try {
dispatch(deleteUserStart());

const userId = currentUser?.user?._id || currentUser?._id;  
const tokenFromStore = token;  
const res = await fetch(`http://localhost:5000/api/user/delete/${userId}`, {  
  method: "DELETE",  
  headers: {  
    "Authorization": `Bearer ${tokenFromStore}`,  
  },  
})  

const data = await res.json()  

if (!res.ok) {  
  dispatch(deleteUserFailure(data.message));  
  toast.error("Delete failed, Please try again later.");  
} else {  
  dispatch(deleteUserSuccess());  
  toast.success("User deleted successfully!");  
}

} catch (error) {
console.log(error);
dispatch(deleteUserFailure(error.message));
toast.error("Delete failed, Please try again later.");
}
};

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
<div className='max-w-lg mx-auto p-3 w-full'>
<h1 className='mt-7 text-center font-semibold text-3xl'>Update your profile</h1>
<form className='flex flex-col gap-4 mt-5' onSubmit={handleSubmit}>
<input type='file' hidden ref={profilePicRef} accept='image/*' onChange={handleImageChange} />
<div className='w-32 h-32 self-center cursor-pointer shadow-md overflow-hidden rounded-full'>
<img
src={imageFileUrl || currentUser?.user?.profilePicture || 'https://cdn-icons-png.flaticon.com/512/149/149071.png'}
alt='profile'
className='rounded-full w-full h-full object-cover border-8 border-gray-300'
onClick={() => profilePicRef.current.click()}
/>
</div>
<Input id='username' value={formData.username || currentUser?.username || ''} placeholder='Username' onChange={handleChange} />
<Input id='email' value={formData.email ||currentUser?.email || ''} placeholder='Email' onChange={handleChange} />
<Input id='password' type='password' placeholder='Password' onChange={handleChange} />
 <Button
  type='submit' className='h-12 bg-green-600' >
 Update
</Button>
</form>
<div className='text-red-500 flex justify-between mt-5 '>
<AlertDialog>
<AlertDialogTrigger asChild>
<Button variant="ghost" className='cursor-pointer'>Delete Account</Button>
</AlertDialogTrigger>

<AlertDialogContent className="w-[90%] bg-white text-black shadow-2xl border border-gray-300 ">  
<AlertDialogHeader>  
  <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>  

  <AlertDialogDescription>  
    This action cannot be undone. This will permanently delete your account  
    and remove your data from our servers.  
  </AlertDialogDescription>  
  </AlertDialogHeader>  
  
<AlertDialogFooter>  
  <AlertDialogCancel>Cancel</AlertDialogCancel>  
  <AlertDialogAction className="bg-red-600" onClick={handleDeleteUser}>Continue</AlertDialogAction>  
</AlertDialogFooter>

  </AlertDialogContent>  
          </AlertDialog>  <Button variant="ghost" className='cursor-pointer' onClick={handleSignOut}>Sign Out</Button>  
    </div>  
</div>

)
}

export default DashboardProfile;