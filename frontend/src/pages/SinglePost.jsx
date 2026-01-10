import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

const SinglePost = () => {
  const { slug } = useParams();

  const [post, setPost] = useState(null);

  useEffect(() => {
    const fetchPost = async () => {
      try {
        const res = await fetch(`http://localhost:5000/api/post/getposts?slug=${slug}`);
        const data = await res.json();
        if (res.ok && data.posts && data.posts.length > 0) {
          setPost(data.posts[0]);
        }
      } catch (error) {
        console.error("Error fetching single post:", error);
      }
    };

    fetchPost();
  }, [slug]);

  if (!post) return <p>Loading post...</p>;

  return (
    <div className="max-w-3xl mx-auto p-6">
      <img
        src={post.image || "https://via.placeholder.com/600"}
        alt={post.title}
        className="w-full rounded-lg mb-4"
      />
      <h1 className="text-3xl font-bold mb-2">{post.title}</h1>
      <p className="text-gray-500 mb-4">{post.category}</p>
      <div
       className="prose prose-lg max-w-none text-gray-800"
       dangerouslySetInnerHTML={{ __html: post.content }}>
      </div>
      </div>
  );
};

export default SinglePost;