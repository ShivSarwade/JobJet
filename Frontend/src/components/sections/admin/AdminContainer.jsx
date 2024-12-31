import React, { useEffect } from 'react'
import {useNavigate } from 'react-router-dom'

function AdminContainer({className,children}) {
    const isUserloggedIn =true
    const navigate = useNavigate()
    useEffect(() => {
        if(!isUserloggedIn){
            console.log("hello")
            navigate("/login/adminLogin")
        }
    }, [isUserloggedIn])
     return (
        <div className={className}>{children}</div>
    )
}

export default AdminContainer


