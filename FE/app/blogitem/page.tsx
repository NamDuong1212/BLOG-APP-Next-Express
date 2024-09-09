import Image from 'next/image'
import React from 'react'
import {blog_data, assets} from '@/Assets/assets'

const BlogItem = ({title, description, category, image}) => {
  return (
    <div className='rounded-lg max-w-[330px] sm:max-w-[300px] bg-secondaryColor border border-primaryColor hover:shadow-[-7px_7px_0px_#FF9900]'>
        <Image src={image}  alt = '' width={400} height={400} className = 'border-b border-black rounded-lg '/>
        <p className='ml-5 mt-5 px-1 inline-block bg-primaryColor rounded-lg text-black text-sm'>{category}</p>
        <div className="p-5">
            <h5>{title}</h5>
            <p>{description}</p>
            <div className='inline-flex items-center py-2 font-semibold text-center'>
                Read more<Image src = {assets.arrow} className = 'ml-2'alt = '' width = {12}/>
            </div>
        </div>
    </div>
  )
}

export default BlogItem