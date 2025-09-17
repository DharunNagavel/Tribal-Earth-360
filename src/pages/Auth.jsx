import React from 'react'
import { useState } from 'react';
import { Login } from '../components/Login';
import { Signup } from '../components/Signup';
export const Auth = () => {
  const [visible, setVisible] = useState("login");
  return (
    <div>
      <div className='bg-green-100 w-full h-screen flex justify-center items-center flex-col'>
        <div>
                {visible === 'login' && (<Login setvisible={(v) => setVisible(v)} />)}
                {visible === 'signup' && (<Signup setvisible={(v) => setVisible(v)} />)}
        </div>
      </div>
    </div>
  )
}
