import { nanoid } from '@reduxjs/toolkit'
import React from 'react'
import { Link } from 'react-router-dom'

function RecruitmentPartner({recruiter={
    RecruitmentSectionHeading:{
        heading1:"",
        heading2:"",
        span:"",
        brand:""
    },
    RecruiterArray:{}
}}) {
  return (
    <div className='w-full h-fit flex flex-col justify-center font-primary items-center pt-4'>
        <div className="w-full text-[6vw]  lg:text-5xl text-center inline-block lg:block">
            <h2 className='font-bold leading-relaxed '>
                {recruiter.RecruitmentSectionHeading.heading1+" "}
                <span className='text-accent'>{recruiter.RecruitmentSectionHeading.span+" "}</span>
                {recruiter.RecruitmentSectionHeading.heading2+" "}
                <span className='text-primary font-bold inline-block lg:block'>{recruiter.RecruitmentSectionHeading.brand}</span>
            </h2>
        </div>
        <div className="grid grid-cols-[repeat(2,auto)] sm:grid-cols-[repeat(4,auto)] lg:grid-cols-[repeat(6,auto)] gap-[6vw] 
        md:gap-[6vw] lg:grid-rows-[auto auto] justify-center p-[4vw] ">
            {
                recruiter.RecruiterArray.map((Recruiters)=>(
                    <Link to={Recruiters.website} target='_blank' className="rounded py-0 px-8 flex items-center justify-center" key={nanoid()}>
                        <img src={Recruiters.src} alt="" className='w-full object-cover' />
                    </Link>
                ))
            }

        </div>
    </div>
  )
}

export default RecruitmentPartner