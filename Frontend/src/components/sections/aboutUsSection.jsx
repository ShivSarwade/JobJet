import React from 'react'

function AboutUsSection({ section = {
    title: "",
    description: "",
    image: "",
    alt: "",
    flexDirection: "flex-row", // This can be set to "flex-row" or "flex-row-reverse" later
} }) {
    return (
        <div className={`w-full flex py-4 px-8 ${section.flexDirection} max-[700px]:flex-col-reverse max-[700px]:px-[2vw] max-[700px]:py-[4vw]`}>
            <div className={`w-[50%] flex items-center justify-center flex-col gap-2 max-[900px]:gap-0 max-[700px]:w-full`}>
                <h2 className={`w-full text-5xl text-primary font-primary font-bold max-[900px]:text-[2.4rem] max-[700px]:w-full max-[700px]:text-[6.2vw]`}>
                    {section.title}
                </h2>
                <p className={`max-[900px]:text-[0.8rem] max-[700px]:text-[3.2vw]`}>
                    {section.description}
                </p>
            </div>
            <div className={`w-[50%] max-[700px]:w-full`}>
                <img src={section.image} alt={section.alt} className={`w-full object-contain`} />
            </div>
        </div>
    )
}

export default AboutUsSection