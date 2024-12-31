import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { Outlet, useNavigate, useParams } from 'react-router-dom';

function UserAuthContainer({ className, children }) {
    const { recruiterusername } = useParams();
    const isUserLoggedIn = useSelector((state) => state.user.isUserLoggedIn);
    const isRecruiterLoggedIn = useSelector((state) => state.recruiter.isRecruiterLoggedIn);
    const [isStateLoaded, setIsStateLoaded] = useState(false); // Add loading state
    const navigate = useNavigate();

    useEffect(() => {
        // Ensure states are defined before proceeding
        setIsStateLoaded(
            typeof isUserLoggedIn !== "undefined" && typeof isRecruiterLoggedIn !== "undefined"
        );
    }, [isUserLoggedIn, isRecruiterLoggedIn]);

    useEffect(() => {
        if (isStateLoaded) {
            if (isRecruiterLoggedIn && !isUserLoggedIn) {
                console.log("User not logged in, redirecting to recruiter login");
                navigate(`/recruiter/${recruiterusername}`);
            } else if (!isRecruiterLoggedIn && !isUserLoggedIn) {
                console.log("User not logged in, redirecting to login");
                navigate("/login");
            }
        }
    }, [isStateLoaded, isUserLoggedIn, isRecruiterLoggedIn, navigate, recruiterusername]);

    if (!isStateLoaded) {
        return <div>Loading...</div>;
    }

    return <Outlet />;
}

export default UserAuthContainer;
