import React from 'react'

import { Logo, LinkSection } from '../index'
import { nanoid } from '@reduxjs/toolkit'
import { useSelector } from 'react-redux'
export default function Footer({
    dropdownLinks = useSelector(state => state.staticPages.footer)

}) {
    return (
        <>
            <footer className=' font-primary flex h-max py-10 px-12 max-[900px]:py-[3vw] max-[900px]:px-[2.5vw] gap-4 shadow-[_0px_-10px_10px] shadow-navShadow *:w-1/4 max-[900px]:*:w-full max-[900px]:flex-col'>

                <div className="flex flex-col justify-start gap-8 max-[450px]:gap-0 *:p-2 max-[900px]:flex-row max-[900px]:items-center max-[900px]:justify-between">
                    <Logo classNameCnt="h-navHeight w-full items-center p-2 gap-[0.2rem] m-0 flex max-[900px]:w-full max-h-16 max-[400px]:h-[18vw]"
                        classNameImg='max-[450px]:h-3/4'
                        classNameHeading='max-[450px]:text-[5vw] max-[450px]:text-center'
                    />
                    <div className="flex flex-col justify-center gap-4 text-[1.4rem] max-[450px]:text-base">
                        <div className="max-[900px]:hidden text-xl font-bold">Connect with us :</div>
                        <div className="flex items-center  max-[450px]:text-[5vw] gap-2 text-center">
                            <div className='aspect-square w-8 flex items-center justify-center rounded-full bg-sectionBackground max-[450px]:w-[8vw] cursor-pointer active:bg-accent hover:text-white hover:bg-primary '><i className="fa-brands fa-facebook-f"></i></div>
                            <div className='aspect-square w-8 flex items-center justify-center rounded-full bg-sectionBackground max-[450px]:w-[8vw] cursor-pointer active:bg-accent hover:text-white hover:bg-primary '><i className="fa-brands fa-instagram"></i></div>
                            <div className='aspect-square w-8 flex items-center justify-center rounded-full bg-sectionBackground max-[450px]:w-[8vw] cursor-pointer active:bg-accent hover:text-white hover:bg-primary '><i className="fa-brands fa-x-twitter"></i></div>
                            <div className='aspect-square w-8 flex items-center justify-center rounded-full bg-sectionBackground max-[450px]:w-[8vw] cursor-pointer active:bg-accent hover:text-white hover:bg-primary '><i className="fa-brands fa-whatsapp"></i></div>
                            <div className='aspect-square w-8 flex items-center justify-center rounded-full bg-sectionBackground max-[450px]:w-[8vw] cursor-pointer active:bg-accent hover:text-white hover:bg-primary '><i className="fa-brands fa-youtube"></i></div>
                        </div>
                    </div>
                </div>
                {
                    dropdownLinks.map((key) =>
                        <LinkSection key={nanoid()} link={key.links} value={key.category} />

                    )
                }
            </footer>
        </>
    )
}
