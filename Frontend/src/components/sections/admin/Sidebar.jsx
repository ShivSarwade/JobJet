import React, { useState } from "react";
import logoImg from "../../../assets/small.png";
import { createContext } from "react";
import { clearAdminSession } from "../../../utils/admin.utils";
import { useNavigate } from "react-router";
import { useSelector } from "react-redux";
import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { logOutAdmin } from "../../../app/Reducers/admin.slice";


function Sidebar({ children }) {
  const [expanded, setExpanded] = useState(false);
  const admin = useSelector(state=>state.admin.adminData)
  const dispatch= useDispatch()
  const logoutUser =async(e)=>{
    
    const response =await clearAdminSession()
    if (response.error) {
      setError(response.error);
    } else {
      dispatch(logOutAdmin(response));
    }
    // return response.data
  } 

  
  return (
    <>
      <aside className="h-full w-max fixed sm:relative shadow-slate-900 z-10">
        <nav className=" min-h-[100dvh] w-full flex flex-col py-1 sm:p-2 bg-primaryBackground border-r border-slate-300 rounded-r-xl ">
          <div
            className={`w-full flex flex-x-1 p-2 p-b2 items-center  ${
              expanded ? "justify-between" : "justify-center"
            }`}
          >
            <div
              className={`flex  items-end justify-between gap-1 ${
                expanded ? "w-max pr-2" : "w-0"
              }`}
            >
              <img src={logoImg} alt="logoImg" className="h-9 " />
              <h1
                className={`text-xl font-bold font-logo text-primary overflow-hidden duration-300`}
              >
                JobJet
              </h1>
            </div>
            <button
              className={`bg-sectionBackground w-10 px-2 h-10 rounded-lg hover:border  hover:border-primary hover:text-primary  flex items-center justify-center`}
              onClick={() => setExpanded((prev) => !prev)}
            >
              <i className="fa-solid fa-bars text-xl"></i>
            </button>
          </div>

          <SideBarContext.Provider value={{ expanded }}>
            <ul className="flex flex-col flex-1 p-2  rounded gap-2">
              {children}
            </ul>
          </SideBarContext.Provider>

          <div
            className={`w-full h-full rounded-lg flex p-2 items-center justify-start ${
              expanded ? "gap-2 " : "gap-0 "
            }`}
          >
            <i className="fa-solid fa-circle-user text-primary hover:text-accent transition-all duration-300 text-4xl" ></i>
            <div
              className={`flex flex-col gap-0 overflow-hidden  transition-all ${
                expanded ? "w-max" : "w-0"
              }`}
            >
              <div className="font-[800] font-primary text-base md:text-base capitalize">
                {admin.adminUserName?admin.adminUserName:"admin full name"}
              </div>
              <div className="text-sm md:text-sm font-primary">
                {admin.adminEmail?admin.adminEmail:"admin email"}
              </div>
            </div>
            <button
              className={` text-sm  h-12 self-start rounded-full bg-sectionBackground hover:text-primary hover:border hover:border-primary flex items-center justify-center overflow-hidden  transition-all ${
                expanded ? "w-8 px-2 mr-2" : "w-0 p-0"
              }`}
              onClick={logoutUser}
            >
              <i
                className={`fa-solid fa-sign-out overflow-hidden  transition-all ${
                  expanded ? "w-max" : "w-0"
                }`}
              ></i>
            </button>
          </div>
        </nav>
      </aside>
    </>
  );
}

export default Sidebar;
export const SideBarContext = createContext();
