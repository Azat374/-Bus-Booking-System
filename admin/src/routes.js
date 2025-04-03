import React from 'react'
const Dashboard = React.lazy(() => import('./views/dashboard/Dashboard'))
const AddStation = React.lazy(() => import('./views/pages/station/AddStation'))
const Stations = React.lazy(() => import('./views/pages/station/Stations'))
const AddRoute = React.lazy(() => import('./views/pages/route/AddRoute'))
const Routes = React.lazy(() => import('./views/pages/route/Routes'))

const AllBus = React.lazy(() => import('./views/pages/editBus/allBuses'))
const AddBus = React.lazy(() => import('./views/pages/addBus/AddBus'))

const Drivers = React.lazy(() => import('./views/pages/driver/Drivers'))

const Schedules = React.lazy(() => import('./views/pages/schedule/Schedules'))
const AddSchedule = React.lazy(() => import('./views/pages/schedule/AddSchedule'))

const RouteSegments = React.lazy(() => import('./views/pages/routeSegment/RouteSegments'))
const AddSegment = React.lazy(() => import('./views/pages/routeSegment/AddSegment'))

const Payments = React.lazy(() => import('./views/pages/payments/Payments'))
const ViewBooking = React.lazy(() => import('./views/pages/viewBooking/ViewBooking'))
const Clients = React.lazy(() => import('./views/pages/clients/Clients'))



const routes = [
  { path: '/', exact: true, name: 'Home' },
  { path: '/dashboard', name: 'Dashboard', element: Dashboard },

  { path: '/pages/station', name: 'Station', element: AddStation },
  { path: '/pages/stations', name: 'Stations', element: Stations },

  { path: '/pages/addRoute', name: 'AddRoute', element: AddRoute },
  { path: '/pages/routes', name: 'Routes', element: Routes },




  { path: '/pages/allBuses', name: 'allBuses', element: AllBus },
  { path: '/pages/addBus', name: 'AddBus', element: AddBus },

  { path: '/pages/drivers', name: 'Drivers', element: Drivers }, 
  
  { path: '/pages/schedules', name: 'Schedules', element: Schedules },
  { path: '/pages/addSchedule', name: 'AddSchedule', element: AddSchedule },

  { path: '/pages/segments', name: 'RouteSegments', element: RouteSegments },
  { path: '/pages/addSegment', name: 'AddSegment', element: AddSegment },

  { path: '/pages/clients', name: 'Clients', element: Clients },

  { path: '/pages/payments', name: 'Payments', element: Payments },
  { path: '/pages/viewBooking', name: 'ViewBooking', element: ViewBooking },

]

export default routes
