import React from 'react'
import { Button } from "../index"
import { useNavigate } from 'react-router';
function TwoSideSection({ sectionData = {
        direction: "row",
        heading: "heading1",
        headingSpan: "headingSpan",
        tagline: "tagline",
        buttonText: "Submit",
        redirectTo: "/recruiter/login",
        image: '',
    },
}) {
    const navigate = useNavigate()
    const handleRedirectionButtonClick = (path) => {
        navigate(path);
    };

    return (
        <div className={`w-full  flex  h-max  lg:h-sectionHeight justify-center items-center gap-2 py-8 px-6 flex-col-reverse ${sectionData.direction=="row"?" md:flex-row":" md:flex-row-reverse"}`}>
            <div className={`w-full md:w-3/5 h-full flex flex-col justify-center gap-4 font-primary`} >
                <div className='flex flex-col gap-1'>
                    <h2 className=' text-[6vw] md:text-4xl lg:text-5xl lg:leading-relaxed font-bold '>{sectionData.heading+" "}
                        <span className='text-primary' >{sectionData.headingSpan}</span>
                    </h2>
                    <h3 className='font-bold text-[3vw] md:text-base lg:text-xl'>
                        {sectionData.tagline}
                    </h3>
                </div>
                <Button
                    className="group font-primary w-max box-border text-[3vw] text-white cursor-pointer md:text-base font-semibold bg-accent  rounded-xl md:rounded-2xl py-[2vw] px-[4vw] md:py-3 md:px-6 flex transition-[background] duration-200 items-center lg:text-lg hover:bg-[#111] "
                    onClick={() => {
                        handleRedirectionButtonClick(sectionData.redirectTo);
                    }}
                >
                    {sectionData.buttonText}
                </Button>
            </div>
            <div className="w-3/4  md:w-2/5 h-3/5 md:h-full flex items-center justify-center">
                <img src={sectionData.image} alt="" className='w-full object-contain' />
            </div>
        </div>
    )
}

export default TwoSideSection