import React, { useEffect } from 'react'
import { useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import UserAuthContainer from './user/UserAuthContainer'
import AdminAuthContainer from './admin/AdminAuthContainer'

function CommonAuthContainer({ className, children }) {
    const isClientLoggedIn = null
    


    if (isClientLoggedIn == "user") {
        return (
            <UserAuthContainer />
        )
    }
    else if (isClientLoggedIn == "recruiter") {
        return (
            <RecruiterAuthContainer />
        )
    } else if (isClientLoggedIn == "admin") {
        return <AdminAuthContainer />
    }
    else if (isClientLoggedIn == false) {
        return (
            <>
                <div className="fixed inset-0 flex items-center justify-center bg-gray-800 bg-opacity-50">
                    <div className="bg-white p-6 rounded shadow-lg">
                        <h2 className="text-lg font-semibold mb-4">Please Login To access this page</h2>
                        <button
                            onClick={}
                            className="bg-blue-500 text-white py-2 px-4 rounded"
                        >
                            Go to Login
                        </button>
                    </div>
                </div>
            </>
        )
    }
}

export default CommonAuthContainer


