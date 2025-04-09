import React, { useState } from 'react'
import { CChartLine } from '@coreui/react-chartjs'
import { getStyle, hexToRgba } from '@coreui/utils'
import CIcon from '@coreui/icons-react'
import WidgetsBrand from '../widgets/WidgetsBrand'
import WidgetsDropdown from '../widgets/WidgetsDropdown'
import { axiosInst } from 'src/axiosInstance'
import { toast } from 'react-hot-toast'
import { cilCloudDownload } from '@coreui/icons'
import {
  CButton,
  CCard,
  CCardBody,
  CCardHeader,
  CFormLabel,
  CFormInput,
  CRow,
  CCol,
} from '@coreui/react'
import { useTranslation } from 'react-i18next'

const Dashboard = () => {
  const { t } = useTranslation()

  // Состояние для хранения выбранного периода
  const [fromDate, setFromDate] = useState('')
  const [toDate, setToDate] = useState('')

  // Функция для скачивания отчёта
  const handleDownloadGeneralReport = async () => {
    try {
      // Вы можете проверять корректность дат:
      if (!fromDate || !toDate) {
        toast.error('Выберите обе даты!')
        return
      }

      // Пример: отправляем GET-запрос c query-параметрами fromDate и toDate
      const response = await axiosInst.get('/bookings/report/general', {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('jwtToken')}`,
        },
        responseType: 'blob', // ожидаем PDF
        params: {
          fromDate: fromDate,
          toDate: toDate,
        },
      })

      const blob = new Blob([response.data], { type: 'application/pdf' })
      const link = document.createElement('a')
      link.href = window.URL.createObjectURL(blob)
      link.download = 'full-report.pdf'
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)

      toast.success('Отчёт успешно скачан!')
    } catch (error) {
      console.error('Ошибка загрузки отчёта:', error)
      toast.error('Ошибка при скачивании отчёта.')
    }
  }

  return (
    <>
      {/* Секция с основными виджетами */}
      <WidgetsDropdown />

      {/* Карточка выбора периода */}
      <CCard className="mb-4">
        <CCardHeader>Выбор периода для отчёта</CCardHeader>
        <CCardBody>
          <CRow className="mb-3">
            <CCol md={3}>
              <CFormLabel>Дата «с»</CFormLabel>
              <CFormInput
                type="date"
                value={fromDate}
                onChange={(e) => setFromDate(e.target.value)}
              />
            </CCol>
            <CCol md={3}>
              <CFormLabel>Дата «по»</CFormLabel>
              <CFormInput
                type="date"
                value={toDate}
                onChange={(e) => setToDate(e.target.value)}
              />
            </CCol>
            <CCol md={3} className="d-flex align-items-end">
              <CButton color="success" onClick={handleDownloadGeneralReport}>
                <CIcon icon={cilCloudDownload} className="me-2" />
                {t('downloadReport')}
              </CButton>
            </CCol>
          </CRow>
        </CCardBody>
      </CCard>
    </>
  )
}

export default Dashboard
