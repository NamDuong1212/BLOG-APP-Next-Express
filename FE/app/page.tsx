'use client'
import Image from "next/image";
import gigachad from '@/public/img/gigachad.jpg';
import VJU from '@/public/img/VJU.png'
import BlogItem from "./blogitem/page"; 
import BlogList from "./bloglist/page";

export default function Home() {
  return (
    <div className="container flex flex-col gap-5 h-[calc(100vh-4rem)]">
      <div className="flex flex-col md:flex-row gap-5">
        <div className="basis-full flex flex-col justify-start md:basis-2/3 pt-10 md:pt-20">  
          <p className="special-word text-xs">
            You found the right place for knowledge
          </p>
          <h1 className="pb-5">
            Our <span className="special-word">VJU</span><br />Blog
          </h1>
          <p>
            Stories are the threads that weave us together; your blog is where those threads become a tapestry of shared experiences.
          </p>
        </div>
        <div className="md:block basis-1/3">
          <Image 
            src={VJU}
            alt="VJU"
            sizes="100vw"
            className="w-full h-auto rounded-lg"
          />
        </div>
      </div>
      <div>
        <BlogList /> 
      </div>
    </div>
  );
}
