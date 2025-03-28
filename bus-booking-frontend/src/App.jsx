import { Routes, Route, BrowserRouter } from 'react-router-dom';
import Layout from './Layout';
import Login from "./pages/login/Login";
import Signup from './pages/signup/Signup';
import BusLayout from './components/buslayout/BusLayout';
import Home from './pages/home/Home';
import ForgotPassword from './pages/forgotpass/ForgotPassword';
import ChangePassword from './pages/changepass/ChangePassword';
import ResetPassword from './pages/resetpass/ResetPassword';
import MyBookings from './pages/mybookings/MyBookings';
import Ticket from './components/ticket/Ticket';
import Navbar from './components/header/Navbar';
import Details from './components/buslayout/Details';
function App() {
  
  return (
    
    <BrowserRouter>
    <div className="w-full min-h-screen bg-neutral-50 dark:bg-neutral-950 text-neutral-800 dark:text-neutral-300 flex flex-col overflow-hidden">
    <Navbar />
      <Routes>
        
      <Route path='/' element={<Layout/>}> 
        <Route index element={<Home/>}></Route>
        <Route path='/login' element={<Login />} />
        <Route path='/signup' element={<Signup />} />
        <Route path='/buslayout/:id' element={<BusLayout />} />
        <Route path='/forgot-password' element={<ForgotPassword/>}/>
        <Route path='/change-password' element={<ChangePassword/>}/>
        <Route path='/reset-password' element={<ResetPassword/>}/>
        <Route  path="/bookings/:id" element={<MyBookings/>}/>
        <Route path='/details/:bookingId' element={<Details />} />
        {/* <Route path='/bookings/getbooking/:bookingId' element={<Ticket/>}/> */}
        
        {/* <Route path='/ticket/print/:bookingId' element={<Ticket />} /> */}
        {/* <Route path='/seatselection' element={<BusSeats />} /> */}
        {/* Add more routes here */}
        </Route>
       
        <Route path='*' element={<NoMatch />} />
      </Routes>
      </div>
    </BrowserRouter>
  
  );
}

function NoMatch() {
  return <h1>404 - Not Found</h1>;
}

export default App;
