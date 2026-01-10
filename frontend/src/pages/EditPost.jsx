import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { useLocation, useNavigate } from "react-router-dom";
import axios from "axios";
import { useSelector } from "react-redux";
import ReactQuill from "react-quill-new";
import "react-quill-new/dist/quill.snow.css";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectGroup, SelectItem, SelectLabel, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { uploadFile, getFilePreview } from "@/lib/appwrite/uploadImage";



const EditPost = () => {
 const { toast } = useToast();
 const { postId } = useParams()
  const location = useLocation();
  const navigate = useNavigate();
  const user = useSelector((state) =>
  state.user);

  const queryParams = new URLSearchParams(location.search);
 
  const {currentUser} = useSelector((state) => state.user)

  const [file, setFile] = useState(null);
  const [imageUploadError, setImageUploadError] = useState(null);
  const [imageUploading, setImageUploading] = useState(false);
  const [UpdatePostError, setUpdatePostError] = useState(null);

  const [formData, setFormData] = useState({});

 useEffect(() => {
    try {
const fetchPost = async() => {
    const res= await fetch(`/api/post/getPosts?postId=${postId}`)

    const data = await res.json() 

    if(!res.ok) {
        console.log(data.message)
        setUpdatePostError(data.message)
        return
    }

    if(res.ok) {
        setUpdatePostError(null)
        setFormData(data.posts[0])
    }
}

   fetchPost()
    } catch (error) {
        console.log(error)
    }
 }, [postId])

  // 📌 Image Upload
  const handleUploadImage = async () => {
    try {
      if (!file) {
        setImageUploadError("Please select an image");
        toast({ title: "Please select an image" });
        return;
      }

      setImageUploading(true);
      setImageUploadError(null);

      const uploadedFile = await uploadFile(file);
      const postImageUrl = getFilePreview(uploadedFile.$id);

      setFormData({ ...formData, image: postImageUrl });
      toast({ title: "Image uploaded successfully!" });
      setImageUploading(false);
    } catch (error) {
      console.log(error);
      setImageUploadError("Image upload failed");
      toast({ title: "Image upload failed" });
      setImageUploading(false);
    }
  };

 


const handleSubmit = async (e) => {
  e.preventDefault();

  try {
    const token = localStorage.getItem("access_token")

    const res =  await fetch(`http://localhost:5000/api/post/updatepost/${formData._id}/${currentUser._id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`, 
      },
      credentials: "include",
      body: JSON.stringify(formData),
    });

    const data = await res.json();

    if (!res.ok) {
      toast({ title: data.message || "Something went wrong! Please try again later."})
      setUpdatePostError(data.message)
      return;
    }
    
    toast({description: "Article Updated Successfully."})
      setUpdatePostError();

      setTimeout(() => {
         navigate(`/post/${data.slug}`);
      }, 500);

     
    
  } catch (error) {
    toast({ description: "Something went wrong! Please try again later." });
    setUpdatePostError("Something went wrong! Please try again later.")
  }
};

  const modules = {
    toolbar: [
      [{ header: [1, 2, 3, false] }],
      ["bold", "italic", "underline", "strike"],
      [{ list: "ordered" }, { list: "bullet" }],
      ["link", "image"],
      ["clean"],
    ],
  };

  return (
    <div className="p-3 max-w-3xl mx-auto min-h-screen">
      <h1 className="text-center text-3xl my-7 font-semibold text-slate-700">
        {postId ? "Edit Post" : "Create a Post"}
      </h1>

      <form className="flex flex-col gap-6 items-center mt-10" onSubmit={handleSubmit}>
        {/* Title + category */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center w-full">
          <input
            type="text"
            placeholder="Enter post title..."
            required
            value={formData.title}
            className="w-[70%] sm:w-[500px] h-12 px-4 border border-gray-300 rounded-lg text-lg font-medium"
            onChange={(e) => setFormData({ ...formData, title: e.target.value })}
          />

          <Select
            value={formData.category || ""}
            onValueChange={(value) => setFormData({ ...formData, category: value })}
          >
            <SelectTrigger className="w-[180px] h-12 border border-gray-300">
              <SelectValue placeholder="Select Category" />
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                <SelectLabel>Category</SelectLabel>
                <SelectItem value="worldnews">World News</SelectItem>
                <SelectItem value="localnews">Local News</SelectItem>
                <SelectItem value="sportsnews">Sports News</SelectItem>
              </SelectGroup>
            </SelectContent>
          </Select>
        </div>

        {/* Image upload */}
        <div className="flex gap-4 items-center justify-center border-4 border-slate-600 border-dotted p-5 w-full">
          <Input type="file" accept="image/*" onChange={(e) => setFile(e.target.files[0])} />
          <Button type="button" className="bg-slate-700" onClick={handleUploadImage}>
            {imageUploading ? "Uploading..." : "Upload Image"}
          </Button>
        </div>

        {imageUploadError && <p className="text-red-600">{imageUploadError}</p>}

        {formData.image && (
          <img src={formData.image} alt="upload" className="w-full h-72 object-cover rounded-md" />
        )}

        {/* Content */}
        <div className="mt-4 w-full">
          <ReactQuill
            theme="snow"
            modules={modules}
            value={formData.content}
            onChange={(value) => setFormData({ ...formData, content: value })}
            className="h-64 mb-10"
            placeholder="Write your article here..."
          />
        </div>

        <Button type="submit" className="h-12 bg-green-600 w-full text-md font-semibold">
          {postId ? "Update Your Article" : "Publish Your Article" }
        </Button>

        {setUpdatePostError && <p className="text-red-600 mt-5">{setUpdatePostError}</p>}
      </form>
    </div>
  );
};

export default EditPost;