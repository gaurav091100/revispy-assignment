import React from 'react'
import Header from './header/Header'
import { Outlet } from 'react-router-dom'
// import Footer from './Footer'

const Layout:React.FC = () => {
  return (
    <>
    <Header />
    <Outlet />
    {/* <Footer /> */}
    </>
  )
}

export default Layout