import React from 'react'
import { useState } from 'react';
export const Loginform = () => {
    const [visible,setvisible] = useState("login");
  return (
    <div>
        <div>
                {visible === 'login' && (<Login />)}
                {visible === 'signup' && (<Signup/>)}
        </div>
    </div>
  )
}
