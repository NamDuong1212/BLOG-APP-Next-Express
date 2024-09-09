"use client";

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import gigachad from '@/public/img/gigachad.jpg';
import { AiOutlineClose } from 'react-icons/ai';
import { usePathname } from 'next/navigation';
import { signOut } from 'next-auth/react';
import axios from 'axios';

const Navbar = () => {
  const [showDropdown, setShowDropdown] = useState(false);
  const [user, setUser] = useState(null); 
  const [isAuthenticated, setIsAuthenticated] = useState(false); 

  useEffect(() => {
    if (typeof window !== 'undefined') { 
      const token = localStorage.getItem('token');
      if (token) {
        setIsAuthenticated(true);
        axios.get('/api/user', { headers: { Authorization: `Bearer ${token}` } })
          .then(response => {
            setUser(response.data); 
          })
          .catch(error => {
            console.error('Error fetching user data:', error);
          });
      }
    }
  }, []);

  const handleShowDropdown = () => setShowDropdown(true);
  const handleHideDropdown = () => setShowDropdown(false);

  const handleLogout = () => {
    if (typeof window !== 'undefined') {
      localStorage.removeItem('token'); 
    }
    signOut();
    setIsAuthenticated(false);
    handleHideDropdown();
  };

  return (
    <div className='container py-2 h-16 flex items-center justify-between'>
      <Link href="/">
        <h2>
          <span className='special-word'>VJU </span> Blog
        </h2>
      </Link>
      <ul className='flex items-center gap-3'>
        <li>
          <Link href="/blog" className={usePathname() === '/blog' ? "text-primaryColor font-bold" : ""}>Blog</Link>
        </li>

        {isAuthenticated ? (
          <>
            <li>
              <Link href="/admin/create-blog" className={usePathname() === '/create-blog' ? "text-primaryColor font-bold" : ""}>Create</Link>
            </li>
            <li>
              <Link href="/admin/update-blog" className={usePathname() === '/update-blog' ? "text-primaryColor font-bold" : ""}>Update</Link>
            </li>
            <li>
              <div className='relative'>
                <div
                  onClick={handleShowDropdown}
                  className='flex items-center cursor-pointer'
                >
                  <Image
                    src={user?.avatar || gigachad} 
                    alt='avatar'
                    sizes='100vw'
                    className='w-10 h-10 rounded-full'
                    width={40}
                    height={40}
                  />
                </div>
                {showDropdown && (
                  <div className='absolute top-0 right-0 bg-primaryColorLight p-5'>
                    <AiOutlineClose onClick={handleHideDropdown} className='w-full cursor-pointer' />
                    <Link onClick={handleHideDropdown} href="/user">Profile</Link>
                    <button onClick={handleLogout}>Logout</button>
                  </div>
                )}
              </div>
            </li>
          </>
        ) : (
          <>
            <li>
              <Link href="/login" className={usePathname() === '/login' ? "text-primaryColor font-bold" : ""}>Login</Link>
            </li>
            <li>
              <Link href="/signup" className={usePathname() === '/signup' ? "text-primaryColor font-bold" : ""}>Sign Up</Link>
            </li>
          </>
        )}
      </ul>
    </div>
  );
};

export default Navbar;
