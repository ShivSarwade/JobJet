import React from 'react'

function TeamMember({member}) {
    return (
        <div className="w-1/4 bg-white-200 p-[0.7rem] rounded-[20px] shadow-[0_0_10px_rgba(0,0,0,0.1)] text-[16px] max-md:w-[90vw] max-md:text-[4vw]">
            <div className="bg-[rgb(236,236,236)] w-full aspect-square rounded-[10px] transition-transform duration-300 overflow-hidden hover:transform-scale">
                <img src={member.image} alt={member.name} className="w-full object-cover " />
            </div>
            <div className="text-primary text-[1.4rem] p-[7px] font-semibold font-primary text-nowrap">{member.name}
                <div className="text-black font-normal text-base pt-2">{member.role}</div>
            </div>
        </div>
    );
}

export default TeamMember