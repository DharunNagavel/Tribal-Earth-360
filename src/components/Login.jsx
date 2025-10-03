import React, { useEffect, useRef, useState } from 'react';
import { gsap } from 'gsap';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';

// Zod schema
const loginSchema = z.object({
  mail: z.string().email("Invalid email address"),
  password: z.string().min(6, "Password must be at least 6 characters"),
});

export const Login = ({ setvisible, setuser }) => {
  const formRef = useRef(null);
  const titleRef = useRef(null);
  const Navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(loginSchema),
  });

  // Animate form and title
  useEffect(() => {
    gsap.fromTo(
      formRef.current,
      { y: 60, opacity: 0, scale: 0.95 },
      { y: 0, opacity: 1, scale: 1, duration: 0.7, ease: 'power3.out' }
    );
    gsap.fromTo(
      titleRef.current,
      { y: -40, opacity: 0 },
      { y: 0, opacity: 1, duration: 0.7, ease: 'power3.out', delay: 0.2 }
    );
  }, []);

  // Animate error messages
  useEffect(() => {
    if (errors.mail) {
      gsap.fromTo(
        "#mail-error",
        { y: -5, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.4, ease: "power2.out" }
      );
    }
    if (errors.password) {
      gsap.fromTo(
        "#password-error",
        { y: -5, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.4, ease: "power2.out" }
      );
    }
  }, [errors]);

  const handleTogglePassword = (e) => {
    e.preventDefault();
    setShowPassword((prev) => !prev);
  };

  const onSubmit = async (data) => {
    try {
      const res = await axios.post(
        'https://tribal-earth-360-bjjy.vercel.app/api/v1/auth/signin',
        data
      );
      console.log(res);
      setuser(true);
      Navigate('/');
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <div className="bg-green-100 w-full h-screen flex justify-center items-center flex-col">
      <form
        onSubmit={handleSubmit(onSubmit)}
        ref={formRef}
        className="flex flex-col gap-4 bg-white p-10 rounded-lg shadow-lg"
      >
        <div>
          <h1
            ref={titleRef}
            className="text-5xl font-bold text-center text-green-700 m-3"
          >
            Login
          </h1>
        </div>

        {/* Email Input */}
        <input
          type="email"
          placeholder="Enter the Mail id"
          className="bg-green-200 border-2 rounded-xl border-green-400 p-2 focus:outline-green-400"
          {...register("mail")}
        />
        {errors.mail && (
          <span
            id="mail-error"
            className="text-red-500 text-sm"
          >
            {errors.mail.message}
          </span>
        )}

        {/* Password Input */}
        <div style={{ position: 'relative' }}>
          <input
            type={showPassword ? "text" : "password"}
            className="bg-green-200 border-2 rounded-xl border-green-400 p-2 focus:outline-green-400 w-full pr-10"
            placeholder="Enter the Password"
            id="login-password"
            {...register("password")}
          />
          <button
            type="button"
            className="absolute right-2 top-1/2 -translate-y-1/2 text-xl toggle-eye"
            onClick={handleTogglePassword}
            tabIndex={-1}
            aria-label="Toggle password visibility"
          >
            {showPassword ? "🙈" : "👁"}
          </button>
        </div>
        {errors.password && (
          <span
            id="password-error"
            className="text-red-500 text-sm"
          >
            {errors.password.message}
          </span>
        )}

        {/* Submit Button */}
        <button
          type="submit"
          className="bg-green-600 text-white p-2 rounded-xl text-2xl"
        >
          Submit
        </button>

        <p>
          you don't have an account?{" "}
          <button
            type="button"
            onClick={() => setvisible('signup')}
            className="text-green-500 cursor-pointer"
          >
            SignUp
          </button>
        </p>
      </form>
    </div>
  );
};
