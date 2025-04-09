import React from 'react'
import CIcon from '@coreui/icons-react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faCity, faBus, faRoute, faUsers, faUserPlus } from '@fortawesome/free-solid-svg-icons'
import {
  cilPencil,
  cilSpeedometer,
  cilBank
} from '@coreui/icons'
import { CNavItem, CNavTitle } from '@coreui/react'
import { useTranslation } from 'react-i18next'

const useNav = () => {
  const { t } = useTranslation()

  return [
    {
      component: CNavItem,
      name: t('dashboard'),
      to: '/dashboard',
      icon: <CIcon icon={cilSpeedometer} customClassName="nav-icon" />,
    },
    {
      component: CNavTitle,
      name: t('stations'),
    },
    {
      component: CNavItem,
      name: t('station.add'),
      to: '/pages/station',
      icon: <FontAwesomeIcon icon={faCity} className="nav-icon" />,
    },
    {
      component: CNavItem,
      name: t('station.all'),
      to: '/pages/stations',
      icon: <FontAwesomeIcon icon={faCity} className="nav-icon" />,
    },
    {
      component: CNavTitle,
      name: t('routes'),
    },
    {
      component: CNavItem,
      name: t('route.add'),
      to: '/pages/addRoute',
      icon: <FontAwesomeIcon icon={faRoute} className="nav-icon" />,
    },
    {
      component: CNavItem,
      name: t('route.title'),
      to: '/pages/routes',
      icon: <FontAwesomeIcon icon={faRoute} className="nav-icon" />,
    },
    {
      component: CNavTitle,
      name: t('bus'),
    },
    {
      component: CNavItem,
      name: t('buses.add'),
      to: '/pages/addBus',
      icon: <FontAwesomeIcon icon={faBus} className="nav-icon" />,
    },
    {
      component: CNavItem,
      name: t('buses.all'),
      to: '/pages/allBuses',
      icon: <CIcon icon={cilPencil} customClassName="nav-icon" />,
    },
    {
      component: CNavTitle,
      name: t('drivers.title'),
    },
    {
      component: CNavItem,
      name: t('drivers.all'),
      to: '/pages/drivers',
      icon: <FontAwesomeIcon icon={faUsers} className="nav-icon" />,
    },
    {
      component: CNavTitle,
      name: t('schedule.title'),
    },
    {
      component: CNavItem,
      name: t('schedule.all'),
      to: '/pages/schedules',
      icon: <FontAwesomeIcon icon={faRoute} className="nav-icon" />,
    },
    {
      component: CNavItem,
      name: t('schedule.addTitle'),
      to: '/pages/addSchedule',
      icon: <FontAwesomeIcon icon={faRoute} className="nav-icon" />,
    },
    {
      component: CNavTitle,
      name: t('clients.title'),
    },
    {
      component: CNavItem,
      name: t('clients.title'),
      to: '/pages/clients',
      icon: <FontAwesomeIcon icon={faUserPlus} className="nav-icon" />,
    },
    {
      component: CNavTitle,
      name: 'Payment',
    },
    {
      component: CNavItem,
      name: t('payments'),
      to: '/pages/payments',
      icon: <CIcon icon={cilBank} customClassName="nav-icon" />,
    }
  ]
}

export default useNav
