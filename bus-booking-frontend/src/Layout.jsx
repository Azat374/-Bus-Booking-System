import Header from "./components/header/Header";
import { Outlet } from 'react-router-dom';
// Если у вас есть Footer, раскомментируйте
// import Footer from './components/footer/Footer';

function Layout() {
  return (
    <>
      <Header/>
      <Outlet/>
      {/* <Footer/> */}
    </>
  );
}

export default Layout;
