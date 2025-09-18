import React from 'react'
import { useState } from 'react';
import { Login } from '../components/Login';
import { Signup } from '../components/Signup';
export const Auth = ({setuser}) => {
  const [visible, setVisible] = useState("login");
  return (
    <div>
      <div className='bg-green-100 w-full h-screen flex justify-center items-center flex-col'>
        <div>
                {visible === 'login' && (<Login setuser={setuser} setvisible={(v) => setVisible(v)} />)}
                {visible === 'signup' && (<Signup setuser={setuser} setvisible={(v) => setVisible(v)} />)}
        </div>
      </div>
    </div>
  )
}
