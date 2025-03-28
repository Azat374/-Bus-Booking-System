import React from 'react'
import CIcon from '@coreui/icons-react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCity } from '@fortawesome/free-solid-svg-icons';
import { faBus } from '@fortawesome/free-solid-svg-icons';
import { faRoute, faUsers, faUserPlus } from '@fortawesome/free-solid-svg-icons';
import {

  cilPencil,

  cilSpeedometer,
  cilBank,

} from '@coreui/icons'
import {  CNavItem, CNavTitle } from '@coreui/react'

const _nav = [
  {
    component: CNavItem,
    name: 'Dashboard',
    to: '/dashboard',
    icon: <CIcon icon={cilSpeedometer} customClassName="nav-icon" />,
  },
  {
    component: CNavTitle,
    name: 'Station ',
  },
  {
    component: CNavItem,
    name: 'Add Station',
    to: '/pages/station',
    icon: <FontAwesomeIcon icon={faCity}  className="nav-icon"/>
    ,
  },
  { 
    component: CNavItem,
    name: 'All Stations',
    to: '/pages/stations',
    icon: <FontAwesomeIcon icon={faCity}  className="nav-icon"/>,
  },


  {
    component: CNavTitle,
    name: 'Routes ',
  },
  {
    component: CNavItem,
    name: 'Add Route  ',
    to: '/pages/addRoute',
    icon: <FontAwesomeIcon icon={faRoute}  className="nav-icon"/>
    ,
  },
  { 
    component: CNavItem,
    name: 'All Routes',
    to: '/pages/routes',
    icon: <FontAwesomeIcon icon={faRoute}  className="nav-icon"/>,
  },


  {
    component: CNavTitle,
    name: 'Bus ',
  },
  {
    component: CNavItem,
    name: 'Add Bus',
    to: '/pages/addBus',
    icon: <FontAwesomeIcon icon={faBus}  className="nav-icon"/>,
  },

  
  {
    component: CNavItem,
    name: 'All/Delete Buses',
    to: '/pages/allBuses',
    icon: <CIcon icon={cilPencil} customClassName="nav-icon" />,
  },

  {
    component: CNavTitle,
    name: 'Drivers',
  },
  {
    component: CNavItem,
    name: 'All Drivers',
    to: '/pages/drivers',
    icon: <FontAwesomeIcon icon={faUsers} className="nav-icon"/>,
  },
  
  
  {
    component: CNavTitle,
    name: 'Schedule',
  },
  {
    component: CNavItem,
    name: 'All Schedules',
    to: '/pages/schedules',
    icon: <FontAwesomeIcon icon={faRoute} className="nav-icon" />, // используйте любой
  },
  {
    component: CNavItem,
    name: 'Add Schedule',
    to: '/pages/addSchedule',
    icon: <FontAwesomeIcon icon={faRoute} className="nav-icon" />,
  },

  // -------------------------
  // (OPTIONAL) ROUTE SEGMENTS (пересадки)
  // -------------------------
  {
    component: CNavTitle,
    name: 'Segments',
  },
  {
    component: CNavItem,
    name: 'All Segments',
    to: '/pages/segments',
    icon: <FontAwesomeIcon icon={faRoute} className="nav-icon" />,
  },
  {
    component: CNavItem,
    name: 'Add Segment',
    to: '/pages/addSegment',
    icon: <FontAwesomeIcon icon={faRoute} className="nav-icon" />,
  },

  {
    component: CNavTitle,
    name: 'Payment ',
  },
  
  
  {
    component: CNavItem,
    name: 'Payments',
    to: '/pages/payments',
    icon: <CIcon icon={cilBank} customClassName="nav-icon" />,
  }
  
]

export default _nav
