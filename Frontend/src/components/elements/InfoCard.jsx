import { Container } from '..'
import React from 'react'

function InfoCard({icon='fa-solid fa-icons',text="dummy",color="orange",count=0}) {
    const colors ='text-red-600 bg-red-200 bg-green-200 text-green-600 bg-blue-200 text-blue-600 bg-purple-200 text-purple-600'
  return (
    <Container className={`w-half min-w-[200px]  shadow-md  flex flex-grow min-h-20 w-full h-auto sm:max-w-[400px] sm:min-h-28 sm:w-auto sm:min-w-[300px] rounded-lg p-2 items-center justify-start`}>
        <div className={`sm:p-2 bg-${color}-200 rounded-lg aspect-square flex h-full items-center  justify-center`}>
            <i className={`${icon} text-3xl  aspect-square text-${color}-600`}></i>
        </div>
        <div className="p-2">
            <h3 className='text-sm sm:text-lg md:text-xl font-extrabold font-primary'>{text}</h3>
            <p className='text-base sm:text-xl md:text-2xl font-bold'>{count}</p>
        </div>

    </Container>
  )
}

export default InfoCard