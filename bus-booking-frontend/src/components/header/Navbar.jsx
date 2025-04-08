import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { ToastContainer, toast } from 'react-toastify'
import { Modal } from 'react-responsive-modal'
import 'react-responsive-modal/styles.css'
import 'react-toastify/dist/ReactToastify.css'

import { IoNotificationsSharp } from "react-icons/io5"
import { CgProfile } from "react-icons/cg"
import { LiaTimesSolid } from 'react-icons/lia'
import { FaBars } from 'react-icons/fa6'

import Theme from '../theme/Theme'
import ProfileCard from '../profileCard/ProfileCard'
import Logo from "../../assets/images/logo.png"
import { useTranslation } from 'react-i18next';

const Navbar = () => {
  const [jwtToken, setJwtToken] = useState(localStorage.getItem('jwtToken'))
  const [id, setId] = useState(localStorage.getItem('id'))

  const [openMenu, setOpenMenu] = useState(false)        // мобильное меню
  const [showProfile, setShowProfile] = useState(false)  // модалка профиля
  const { t, i18n } = useTranslation();
  // Обработка клика по иконке-бургеру
  const handleToggleMenu = () => {
    setOpenMenu(!openMenu)
  }

  // Спрятать меню при клике на ссылку
  const handleCloseMenu = () => {
    setOpenMenu(false)
  }

  // Показ уведомления (пример)
  const handleNotify = () => {
    toast.info("Уведомление тестовое", {
      position: "top-right",
      autoClose: 3000,
      hideProgressBar: false,
      closeOnClick: true,
      draggable: true,
    })
  }

  // Обработка логаута
  const handleLogout = () => {
    if (window.confirm("Confirm Logout!")) {
      localStorage.removeItem('jwtToken')
      localStorage.removeItem('id')
      setJwtToken(null)
      setId(null)
      toast.success('Logged out successfully')
    }
  }

  return (
    <div className='w-full h-[8ch] bg-neutral-100 dark:bg-neutral-900 flex items-center 
      md:flex-row lg:px-28 md:px-16 sm:px-7 px-4 fixed top-0 z-50'>
      {/* Логотип */}
      <Link to="/" className='mr-16 flex items-center'>
        <img src={Logo} alt="Dimash Bus" className="w-28 h-auto object-contain" />
      </Link>

      {/* Кнопка-бургер для мобильного меню */}
      <button
        onClick={handleToggleMenu}
        className="flex-1 lg:hidden text-neutral-600 dark:text-neutral-300 
          ease-in-out duration-300 flex items-center justify-end"
      >
        {openMenu ? <LiaTimesSolid className='text-xl' /> : <FaBars className='text-xl' />}
      </button>

      {/* Блок основных ссылок и кнопок */}
      <div
        className={`${openMenu ? 
          'flex absolute top-14 left-0 w-full h-auto md:h-auto md:relative' 
          : 'hidden'}
          flex-1 md:flex flex-col md:flex-row gap-x-5 gap-y-2 md:items-center 
          md:p-0 sm:p-4 p-4 justify-between md:bg-transparent bg-neutral-100 
          md:shadow-none shadow-md rounded-md`}
      >
        <ul className="list-none flex md:items-center items-start gap-x-5 gap-y-1 
          flex-wrap md:flex-row flex-col text-base text-neutral-600 dark:text-neutral-500 font-medium"
        >
          <li>
            <Link
              to="/"
              onClick={handleCloseMenu}
              className="hover:text-violet-600 ease-in-out duration-300"
            >
              {t('booking')}
            </Link>
          </li>
          {jwtToken && (
            <li>
              <Link
                to={`/bookings/${id}`}
                onClick={handleCloseMenu}
                className="hover:text-violet-600 ease-in-out duration-300"
              >
                {t('myBooking')}
              </Link>
            </li>
          )}
        </ul>

        <div className="flex md:items-center items-start gap-x-5 gap-y-2 
          flex-wrap md:flex-row flex-col text-base font-medium text-neutral-800 dark:text-neutral-100"
        >
          {/* Нотификации */}
          <button
            onClick={handleNotify}
            className='bg-violet-600 rounded-md px-3 py-2 w-fit relative text-neutral-50'
          >
            <IoNotificationsSharp className='text-lg' />
          </button>

          {/* Модалка профиля */}
          <Modal open={showProfile} onClose={() => setShowProfile(false)} center>
            <ProfileCard 
              className="ProfileCard" 
              id={id} 
              onClose={() => setShowProfile(false)}
            />
          </Modal>

          {jwtToken && id ? (
            // Если пользователь залогинен
            <div className="flex items-center gap-x-2">
              <button
                onClick={() => setShowProfile(true)}
                className="bg-violet-600 rounded-md px-3 py-2 w-fit text-neutral-50 flex items-center gap-x-1"
              >
                <CgProfile className="text-lg" />
                {t('profile')}
              </button>
              <button
                onClick={handleLogout}
                className="bg-red-500 rounded-md px-3 py-2 w-fit text-neutral-50"
              >
                {t('logout')}
              </button>
            </div>
          ) : (
            // Если не залогинен
            <Link
              to="/login"
              onClick={handleCloseMenu}
              className="bg-violet-600 rounded-md px-3 py-2 w-fit text-neutral-50"
            >
              {t('login')}
            </Link>
          )}

          {/* Переключатель темы */}
          <Theme />
          <button onClick={() => i18n.changeLanguage("kz")}>KZ</button>
          <button onClick={() => i18n.changeLanguage("ru")}>RU</button>
          <button onClick={() => i18n.changeLanguage("en")}>EN</button>
        </div>
      </div>

      <ToastContainer />
    </div>
  )
}

export default Navbar
