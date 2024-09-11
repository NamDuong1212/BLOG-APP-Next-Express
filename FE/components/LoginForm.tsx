"use client";

import React, { useState, useEffect } from 'react';
import Input from "./Input";
import Link from "next/link";
import { useRouter } from 'next/navigation';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const initialState = {
  email: "",
  password: "",
};

const LoginForm = () => {
  const [state, setState] = useState(initialState);
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const access_Token = localStorage.getItem('access_token');
    if (access_Token) {
      router.push('/');
    }
  }, [router]);

  const handleChange = (e) => {
    setState({ ...state, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const { email, password } = state;

    if (!email || !password) {
      toast.error('All fields are required', { autoClose: 2000 });
      return;
    }
    const pattern = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/;
    if (!pattern.test(email)) {
      toast.error('Invalid email format', { autoClose: 2000 });
      return;
    }
    if (password.length < 6) {
      toast.error('Password must be at least 6 characters', { autoClose: 2000 });
      return;
    }
  
    setIsLoading(true);
  
    try {
      const response = await fetch('http://localhost:8080/users/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });
  
      const data = await response.json();
      
      if (response.ok) {
        localStorage.setItem('access_token', data.access_token); 
        toast.success('Login Successful', { autoClose: 2000 });

        setTimeout(() => router.push('/'), 2000);
      } else {
        toast.error(data.message || 'Invalid Credentials', { autoClose: 2000 });
      }
    } catch (error) {
      toast.error('Unexpected error occurred', { autoClose: 2000 });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <section className="container">
      <form onSubmit={handleSubmit} className="border-2 border-paragraphColor rounded-lg max-w-sm mx-auto px-8 py-6 space-y-5">
        <h2 className="text-center special-word">Login</h2>

        <Input
          label="Email"
          type="email"
          name="email"
          onChange={handleChange}
          value={state.email}
        />
        <Input
          label="Password"
          type="password"
          name="password"
          onChange={handleChange}
          value={state.password}
        />

        <button type="submit" className="btn w-full">
          {isLoading ? 'Loading...' : 'Login'}
        </button>

        <p className="text-center">
          Need an account?{" "}
          <Link href="/signup" className="text-primaryColor">
            Sign Up
          </Link>
        </p>
      </form>

      <ToastContainer />
    </section>
  );
};

export default LoginForm;
