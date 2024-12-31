import React, { useContext } from 'react'
import { SideBarContext } from './Sidebar'
import {NavLink} from 'react-router-dom'
function SidebarItem({icon="fa-solid fa-user",page="/",alert=false,text="test"}) {

  const {expanded} = useContext(SideBarContext)

  return (
    <NavLink to={page} className={({isActive})=>`relative w-full flex items-center p-2 rounded-md cursor-pointer transition-colors ${
      isActive?"bg-gradient-to-tr from-blue-200 to-blue-100 text-primary":"hover:bg-blue-50 text-gray"} ${expanded?"justify-start gap-2":"justify-center gap-0"} hover:text-primary`}>

      <i className={`${icon}`}></i>

      <span className={`transition-all overflow-hidden ${expanded?"w-full":"w-0"}`}>{text}</span>
      
      {
        alert && (
          <div className={`absolute right-2 w-2 h-2 rounded bg-accent `}></div>
        )
      }

    </NavLink>
  )
}

export default SidebarItem