import React from 'react'
import MainNavbar from './main-navbar/MainNavbar'
import MainSidebar from './main-sidebar/MainSidebar'
import { Outlet } from 'react-router-dom'

function LoggedInLayout() {
  return (
    <>
        <MainSidebar />
        <MainNavbar />
        <main>
            <Outlet />
        </main>
    </>
  )
}

export default LoggedInLayout