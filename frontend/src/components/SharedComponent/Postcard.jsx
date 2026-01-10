import React from 'react'
import { Link } from 'react-router-dom';

export const Postcard = ({ post}) => {
  return (
    <div className='bg-white hover:shadow-lg transition-shadow overflow-hidden rounded-lg w-full sm:w-[330px] border border-gray-400'>
        {/* {link wrapping the images} */}
        <Link to={`/post/${post.slug}`}
        className='block h-[250px] w-full overflow-hidden'>
            <img src={post.image} alt="post cover" className='w-full h-full object-cover transition-transform duration-300 hover:scale-105 bg-gray-500' />
        </Link>

        {/* {Content section} */}
        <div className="p-3 flex flex-col gap-2">
            {/* {post title} */}
            <p className='text-lg font-semibold line-clamp-1 text-slate-700'>{post.title}</p>

            {/* {post category} */}
            <span className='italic text-[16px] text-slate-600'>{post.category}</span>

            {/* {read Articles Button} */}
            <Link to={`/post/${post.slug}`} className='border border-slate-500 text-slate-700 hover:bg-blue-500 hover:text-white py-2 rounded-md mt-auto text-center'>Read Article</Link>
        </div>
    </div>
  )
}

export default Postcard;