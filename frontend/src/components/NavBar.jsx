import React,{useState} from 'react'
import { Link } from 'react-router-dom'

import {HomeIcon,User2} from "lucide-react"

export default function NavBar() {

    let [isLoggedIn,setIsLoggedIn] = useState(true);

  return (
    <div className='bg-gradient-to-r from-blue-500 to-purple-600 text-white px-4 py-6 flex items-center justify-between  ' >
        <h2 className='text-2xl font-bold animate-pulse' >JobNest</h2>
        <ul className='flex items-center gap-4' >
            <li><Link className='flex gap-2 hover:text-slate-300' ><HomeIcon/> <span>Home</span></Link></li>
            <li>
                {
                    isLoggedIn?
                    <Link className='flex gap-2 hover:text-slate-300' ><User2/> <span>Profile</span></Link>
                    :
                    <Link className='flex gap-2 hover:text-slate-300' >Login</Link>
                }
            </li>
        </ul>
    </div>
  )
}
