import React, { useState } from 'react'

function FaqsElement({
    faq = {}
}) {
    
    
    const [expanded, setExpanded] = useState(false)
    return (
        <div className="border-[#ddd] mb-8 max-[800px]:text-base shadow-xl" onClick={()=>{setExpanded(prev=>!prev)}}>
            <h2 className={`max-[450px]:text-[5vw] max-[450px]:p-[4vw] text-2xl cursor-pointer m-0 relative p-6 bg-[#fff] flex items-center justify-between  duration-300 ease-in-out hover:bg-primaryBackground text-primary font-semibold max-xs: ${expanded?'rounded-t-lg':"rounded-lg"}`} >{faq.question}
                <i className={`fa-solid fa-circle-chevron-down text-[1.2rem] transition-transform duration-300 ease-in-out ${expanded?"rotate-180 ":"rotate-0"}`} ></i></h2>
            <div>
                <p className={` ${expanded ? "h-full py-2 " : "h-0 py-0"} bg-white overflow-hidden transition max-h duration-300 ease-out  px-6 rounded-b-lg`}>{faq.answer}</p>
            </div>
        </div>
    )
}

export default FaqsElement