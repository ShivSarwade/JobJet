import React from 'react'
import {TwoSideSection,RecruitmentPartner} from '../index'
import { nanoid } from '@reduxjs/toolkit'
import { useSelector } from 'react-redux'


function Home() {

  const TwoSideSectionData = useSelector(state =>state.staticPages.homePage.TwoSideSectionData)
  
  const Recruiter =useSelector(state =>state.staticPages.homePage.RecruitmentPartnerSectionData)
  
  return (
    <main className='bg-primaryBackground min-h-sectionHeight w-full'>
      {
        TwoSideSectionData.map((section)=>(
          <TwoSideSection sectionData={section} key={nanoid()} />
        ))
      }

      <RecruitmentPartner recruiter={Recruiter}  />
    </main>
  )
}

export default Home