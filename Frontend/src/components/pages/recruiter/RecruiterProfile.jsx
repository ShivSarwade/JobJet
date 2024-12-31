import React from "react";
import ProfileHero from "../../sections/user/ProfileHero.jsx";
import { useParams } from "react-router";
import { useSelector } from "react-redux";

function RecruiterProfile({ presentingTo = "recruiter" }) {
  let { recruiterusername } = useParams();

  const recruiter = useSelector(
    (state) => state.recruiter.recruiterData.rUserName
  );

  return (
    <>
      {recruiterusername == recruiter ? (
        <ProfileHero
          servedTo="recruiter"
          isEditable={true}
          presentingTo={presentingTo}
        />
      ) : (
        <ProfileHero
          servedTo="recruiter"
          isEditable={false}
          presentingTo={presentingTo}
        />
      )}
    </>
  );
}

export default RecruiterProfile;
