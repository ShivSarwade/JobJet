import React from 'react'
import LogoImg from '../../assets/small.png'
import { Link } from 'react-router-dom'
function Logo({classNameCnt="",classNameImg="",classNameHeading=""}) {
  return (
    <>
        <Link to='/' className={classNameCnt}>
            <img src={LogoImg} alt="logo image" className={`h-full ${classNameImg}`} />
            <h1 className={`text-2xl font-logo font-bold text-primary ${classNameHeading}`}>JobJet</h1>
        </Link>
    </>
  )
}

export default Logo