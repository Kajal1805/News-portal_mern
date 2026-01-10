import React, { useState } from "react";
import axios from "axios";
import { Navigate, useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import ReactQuill from "react-quill-new";
import "react-quill-new/dist/quill.snow.css";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectGroup, SelectItem, SelectLabel, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { uploadFile, getFilePreview } from "@/lib/appwrite/uploadImage";


const CreatePost = () => {
  const { toast } = useToast();
  const navigate = useNavigate();
  const user = useSelector((state) => state.user);

  const { currentUser } = useSelector((state) => state.user);
  const [file, setFile] = useState(null);
  const [imageUploading, setImageUploading] = useState(false);
  const [isPublishing, setIsPublishing] = useState(false);
  const [formData, setFormData] = useState({
    title: "",
    category: "",
    content: "",
    image: "",
  });

  const handleUploadImage = async () => {
    try {
      if (!file) {
        toast({ title: "Please select an image" });
        return;
      }
      setImageUploading(true);

      const uploadedFile = await uploadFile(file);
      const postImageUrl = getFilePreview(uploadedFile.$id);

      setFormData({ ...formData, image: postImageUrl });
      toast({ title: "Image uploaded successfully!" });
    } catch (error) {
      toast({ title: "Image upload failed" });
    } finally {
      setImageUploading(false);
    }
  };

 const handleSubmit = async (e) => {
  e.preventDefault();
  setIsPublishing(true);

  try {
    const token = localStorage.getItem("token");
    console.log("TOKEN FROM LOCALSTORAGE:", token);

    const res = await axios.post(
  `http://localhost:5000/api/post/create`,
  {
    title: formData.title,
    content: formData.content,
    category: formData.category,
    image: formData.image,
  },
  {
    headers: {
      Authorization: `Bearer ${token}`,
    },
    withCredentials: true,
  }
);

    toast({ title: res.data.message });
    navigate("/dashboard?tab=posts");

  } catch (error) {
    toast({ title: error.response?.data?.message || "Request failed" });
  } finally {
    setIsPublishing(false);
  }

}
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
        Create a Post
      </h1>

      <form className="flex flex-col gap-6 items-center mt-10" onSubmit={handleSubmit}>
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
            value={formData.category}
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

        <div className="flex gap-4 items-center justify-center border-4 border-slate-600 border-dotted p-5 w-full">
          <Input type="file" accept="image/*" onChange={(e) => setFile(e.target.files[0])} />
          <Button type="button" className="bg-slate-700" onClick={handleUploadImage}>
            {imageUploading ? "Uploading..." : "Upload Image"}
          </Button>
        </div>

        {formData.image && (
          <img src={formData.image} alt="upload" className="w-full h-72 object-cover rounded-md" />
        )}

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
         {isPublishing ? "Publishing..." : "Publish article "}
        </Button>
      </form>
    </div>
  );
};

export default CreatePost;