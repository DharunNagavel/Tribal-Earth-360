import React from 'react'
import { Link } from 'react-router-dom'
export const Digitalization = () => 
{
  return (
    <div className='bg-green-100 w-full h-screen flex justify-center items-center flex-col'>
      <div className='flex flex-col gap-6 bg-white p-10 rounded-2xl shadow-2xl min-w-[350px] w-full max-w-md'>
        <h1 className='text-4xl font-bold text-center text-green-700 mb-6'>Digitalization of FRA</h1>
        <form className='flex flex-col gap-6'>
          <div className='flex flex-col gap-2'>
            <label className='text-lg font-medium text-green-700 mb-1'>Application Form</label>
            <input className='bg-green-200 border-2 rounded-xl border-green-400 p-2 focus:outline-green-400 w-full' type="file" />
          </div>
          <div className='flex flex-col gap-2'>
            <label className='text-lg font-medium text-green-700 mb-1'>Annexure Form</label>
            <input className='bg-green-200 border-2 rounded-xl border-green-400 p-2 focus:outline-green-400 w-full' type="file" />
          </div>
          <button className='bg-green-700 hover:bg-green-800 transition text-white p-3 rounded-xl text-lg font-semibold mt-2 w-full'>Digitalize</button>
        </form>
        <div>
          <button className='bg-green-700 hover:bg-green-800 transition text-white p-3 rounded-xl text-lg font-semibold mt-2 w-full'> View Digitalized Document</button>
        </div>
      </div>
    </div>
  );
}
