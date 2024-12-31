import React, { useEffect, useState } from "react";
import { Outlet, useNavigate } from "react-router-dom";
import { Sidebar, SidebarItem, AdminAuthContainer, Loader } from "../..";
import { useDispatch, useSelector } from "react-redux";
import { getAdminData } from "../../../utils/admin.utils";
import { logInAdmin } from "../../../app/Reducers/admin.slice";

function AdminLayout() {
  const sidebarItems = [
    {
      icon: "fa-solid fa-house",
      page: "",
      text: "Dashboard",
      alert: false,
    },
    {
      icon: "fa-solid fa-user-plus",
      page: "/admin/register",
      text: "Create Admin",
      alert: false,
    },
  ];
  const [error, setError] = useState("");

  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const dispatch = useDispatch();
  const adminData = useSelector((state) => state.admin);

  useEffect(() => {
    const fetchAdminData = async () => {
      setLoading(true);
      try {
        const response = await getAdminData();

        if (response.error) {
          setError(response.error);
        } else {
          dispatch(logInAdmin(response));
        }
      } catch (error) {
        console.log("admin is not Logged in", error);
      } finally {
        setLoading(false);
      }
    };

    if (!adminData.isAdminLoggedIn) {
      fetchAdminData();
    } else {
      setLoading(false); 
    }
  }, [dispatch, adminData.isAdminLoggedIn]);
  return loading ? (
    <div className="w-full h-screen">
      <Loader />
    </div>
  ) : (
    <div className="flex w-full min-h-[100dvh] md:h-screen ">
      <Sidebar>
        {sidebarItems.map((item, index) => {
          if (index <= 4)
            return (
              <SidebarItem
                key={item.text}
                icon={item.icon}
                page={item.page}
                text={item.text}
                alert={item.alert}
                active={item.active}
              />
            );
        })}
      </Sidebar>
      <div className="p-0 rounded-none pl-16 sm:pl-4 md:pl-4 w-full h-screen overflow-auto relative">
        <Outlet />
      </div>
    </div>
  );
}

export default AdminLayout;
