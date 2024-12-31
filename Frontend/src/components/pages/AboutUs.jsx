import React from "react";
import { useSelector } from "react-redux";
import { nanoid } from "@reduxjs/toolkit";
import { AboutUsSection, TeamMember } from "../index"
function Aboutus() {
    const sections = useSelector(state => state.staticPages.aboutUsPage)
    return (
        <div className="w-full bg-primaryBackground font-primary">
            {sections.aboutSections.map((section) => (
                <AboutUsSection key={nanoid()} section={section} />
            ))}
            <div className="w-full pt-4">
                <h1 className="w-full text-5xl text-primary font-primary font-bold max-[900px]:text-[2.4rem] max-[700px]:w-full max-[700px]:text-[6.2vw] text-center"> Meet Our Team</h1>
                <div className="w-full py-4 px-8 flex items-center justify-center gap-4 max-sm:flex-col">
                    {sections.teamMembers.map((member) => (
                        <TeamMember key={nanoid()} member={member} />
                    ))}
                </div>
            </div>
        </div>
    )
}
export default Aboutus