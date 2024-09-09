import React from 'react'
import { blog_data } from '@/Assets/assets'
import BlogItem from '../blogitem/page'

const BlogList = () => {
  return (
    <div>
        <div className='flex justify-center gap-6 my-10'>
            <button className='px-1 bg-primaryColor text-white py-1 px4 rounded-sm '>All</button>
            <button>Technology</button>
            <button>Startup</button>
            <button>Lifestyle</button>
        </div>
        <div className='flex flex-wrap justify-around fap-1 gap-y-10 mb-16 xl:mx-24'>
            {blog_data.map((item, index)=>{
                return <BlogItem key = {index} image = {item.image} title = {item.title} description = {item.description} category = {item.category}/>
            })}
        </div>
    </div>
  )
}

export default BlogList