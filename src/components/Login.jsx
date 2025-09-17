import React from 'react'
import { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { Link } from 'react-router-dom'
export const Login = ({setvisible}) => {
  const formRef = useRef(null);
  const titleRef = useRef(null);

  useEffect(() => {
    // Animate the form container
    gsap.fromTo(
      formRef.current,
      { y: 60, opacity: 0, scale: 0.95 },
      { y: 0, opacity: 1, scale: 1, duration: 0.7, ease: 'power3.out' }
    );
    // Animate the title
    gsap.fromTo(
      titleRef.current,
      { y: -40, opacity: 0 },
      { y: 0, opacity: 1, duration: 0.7, ease: 'power3.out', delay: 0.2 }
    );
  }, []);
  const [showPassword, setShowPassword] = React.useState(false);
  const handleTogglePassword = (e) => {
    e.preventDefault();
    setShowPassword((prev) => !prev);
  };

  return (
      <div className='bg-green-100 w-full h-screen flex justify-center items-center flex-col'>
        <form ref={formRef} action="" className='flex flex-col gap-4 bg-white p-10 rounded-lg shadow-lg'>
          <div className=''>
            <h1 ref={titleRef} className='text-5xl font-bold text-center text-green-700 m-3'>Login</h1>
          </div>
          <input type="mail" placeholder='Enter the Mail id' className='bg-green-200 border-2 rounded-xl border-green-400 p-2 focus:outline-green-400' />
          <div style={{ position: 'relative' }}>
            <input
              type={showPassword ? "text" : "password"}
              className='bg-green-200 border-2 rounded-xl border-green-400 p-2 focus:outline-green-400 w-full pr-10'
              placeholder='Enter the Password'
              id='login-password'
            />
            <button
              type="button"
              className='absolute right-2 top-1/2 -translate-y-1/2 text-xl toggle-eye'
              onClick={handleTogglePassword}
              tabIndex={-1}
              aria-label="Toggle password visibility"
            >
              {showPassword ? "🙈" : "👁"}
            </button>
          </div>
          <button className='bg-green-600 text-white p-2 rounded-xl text-2xl'>Submit</button>
          <p>you don't have an account? <button  onClick={() => setvisible('signup')} className='text-green-500 cursor-pointer'>SignUp</button></p>
        </form>
      </div>
  );
}
