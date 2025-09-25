import React from 'react'
import '../cssFiles/sidebar.css'
import { NavLink, useLocation } from 'react-router-dom'
import { MdHomeFilled } from "react-icons/md";
import { FaRegCreditCard } from "react-icons/fa6";
import { SiSimpleanalytics } from "react-icons/si";
import { GrConfigure } from "react-icons/gr";
import { useMemo } from 'react';

function Sidebar() {

    const items = useMemo(() => [
  { title: 'Home', path: '/', icon: <MdHomeFilled /> },
  { title: 'Tracker', path: '/tracker', icon: <FaRegCreditCard /> },
  { title: 'Analysis', path: '/analysis', icon: <SiSimpleanalytics /> },
  { title: 'Configuration', path: '/configuration', icon: <GrConfigure /> }
], []);

    const location=useLocation();
    const isActive = (path) => location.pathname === path;


  return (
    <div className='sidebar'>
      <p className='title'>API Management</p>

      <div className='line'></div>
      <div className='sidebar-items'>
      {
        items.map((item,index)=>{
          return(
            <NavLink to={item.path} key={index} className="navlink-reset">
           <div className={`sidebar-item ${isActive(item.path) ? 'active' : ''}`}>
  <div className="sidebar-item-content">
  <div className={`logo ${isActive(item.path) ? 'imgColor bgIcon' : ''}`}>
    {item.icon}
  </div>
  <p>{item.title}</p>
</div>

</div>
            </NavLink>
           
          )
      })
      }
      </div>
      <div className='line'></div>
    </div>
  )
}

export default Sidebar
