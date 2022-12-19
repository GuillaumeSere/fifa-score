import React from 'react'
import './header.css'
import ballon from '../images/ballon2.png'

const Header = () => {
    return (
        <div className='header'>
            <img src={ballon} className='logo' alt="" />
            <h1 className='title'>FIFA SCORE</h1>
            <img src={ballon} className='logo' alt="" />
        </div>
    )
}

export default Header
