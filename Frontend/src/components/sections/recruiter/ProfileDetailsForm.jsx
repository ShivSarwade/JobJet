import React, { useEffect } from 'react'
import { useSelector } from 'react-redux'

function ProfileDetailsForm({ servedTo = "user" }) {
  let recruiterData = useSelector(state => state.recruiter.recruiterData)
  return (
    <div>
      
    </div>
  )
}

export default ProfileDetailsForm