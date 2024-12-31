import React from 'react'

function Container({className,children,shadow=true}) {
    return (
        <div className={className?className:` font-primary h-max w-[300px] px-4 pb-6 flex rounded-lg flex-col bg-primaryBackground ${shadow?"shadow-[2px_7px_9px_rgba(0,0,0,0.3),2px_2px_9px_rgba(0,0,0,0.2)]":""}`}>{children}</div>
    )
}

export default Container
