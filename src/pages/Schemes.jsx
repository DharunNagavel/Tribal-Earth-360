import { useState } from 'react'
import { Displayscheme } from '../components/Displayscheme';
import Final from '../components/Final'

export const Schemes = () => 
{
    const [visible, setVisible] = useState("final");

    return (
        <div>
            <div className='bg-green-100 w-full h-screen flex justify-center items-center flex-col'>
                <div>
                    {visible === 'schemes' && (<Displayscheme setvisible={(v) => setVisible(v)} />)}
                    {visible === 'final' && (<Final setvisible={(v) => setVisible(v)} />)}
                </div>
            </div>
        </div>
    )
}