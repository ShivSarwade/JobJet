import React from "react";
import { useSelector } from "react-redux";
import { useParams } from "react-router";
import ProfileHero from "../../sections/user/ProfileHero";

function UserProfile({presentingTo = "user"}) {
  let { username } = useParams();
  
  const user = useSelector((state) => state.user.userData.username);
  return (
    <>
      {username == user ? (
        <ProfileHero
          servedTo="user"
          isEditable={true}
          presentingTo={presentingTo}
        />
      ) : (
        <ProfileHero
          servedTo="user"
          isEditable={false}
          presentingTo={presentingTo}
        />
      )}
    </>
  );
}

export default UserProfile;
