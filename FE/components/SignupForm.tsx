"use client";

import React, { useState } from 'react';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useRouter } from 'next/navigation';
import Input from "./Input";
import Link from "next/link";

const initialState = {
  name: '',
  email: '',
  password: '',
  confirmPassword: '',
  phone: '',
};

const SignupForm = () => {
  const [state, setState] = useState(initialState);
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e) => {
    e.preventDefault();
    const { name, email, password, confirmPassword, phone } = state;

    if (!name || !email || !password || !confirmPassword || !phone) {
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
      const response = await fetch('http://localhost:8080/users/signup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, password, confirmPassword, phone }),
      });
      console.log(await response.json());
      if (response.status === 200 || response.status === 201) {
        toast.success('Registration Successful', { autoClose: 2000 });
        setTimeout(() => router.push('/login'), 2000);
      } else {
        toast.error('Error during registration', { autoClose: 2000 });
      }
    } catch (error) {
      toast.error('Unexpected error occurred', { autoClose: 2000 });
    } finally {
      setIsLoading(false);
    }
  };

  const handleChange = (e) => {
    setState({ ...state, [e.target.name]: e.target.value });
  };

  return (
    <section className="container">
      <form onSubmit={handleSubmit} className="border-2 border-paragraphColor rounded-lg max-w-sm mx-auto px-8 py-6 space-y-5">
        <h2 className="text-center special-word">Sign Up</h2>
        <div>
          <label>Name</label>
          <Input type="text" name="name" value={state.name} onChange={handleChange} />
        </div>
        <div>
          <label>Email</label>
          <Input type="email" name="email" value={state.email} onChange={handleChange} />
        </div>
        <div>
          <label>Password</label>
          <Input type="password" name="password" value={state.password} onChange={handleChange} />
        </div>
        <div>
          <label>Confirm Password</label>
          <Input type="password" name="confirmPassword" value={state.confirmPassword} onChange={handleChange} />
        </div>
        <div>
          <label>Phone</label>
          <Input type="text" name="phone" value={state.phone} onChange={handleChange} />
        </div>
        
        <button type="submit" className="btn w-full">{isLoading ? 'Loading...' : 'Sign Up'}</button>
        <p className="text-center">
          Already a user?{" "}
          <Link href="/login" className="text-primaryColor">
            Login
          </Link>
        </p>
      </form>
      <ToastContainer />
    </section>
  );
};

export default SignupForm;
