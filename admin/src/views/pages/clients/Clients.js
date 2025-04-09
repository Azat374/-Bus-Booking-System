import React, { useEffect, useState } from 'react'
import { CCard, CCardBody, CCardHeader, CTable, CTableBody, CTableHead, CTableHeaderCell, CTableRow, CTableDataCell } from '@coreui/react'
import { axiosInst } from 'src/axiosInstance'
import { useTranslation } from "react-i18next";

const Clients = () => {
  const [clients, setClients] = useState([])
  const { t } = useTranslation()
  useEffect(() => {
    fetchClients()
  }, [])

  const fetchClients = async () => {
    try {
      const response = await axiosInst.get('/user/clients')
      setClients(response.data)
    } catch (err) {
      console.error('Ошибка при загрузке клиентов:', err)
    }
  }

  return (
    <CCard>
      <CCardHeader>Clients</CCardHeader>
      <CCardBody>
        <CTable striped>
          <CTableHead>
            <CTableRow>
              <CTableHeaderCell>#</CTableHeaderCell>
              <CTableHeaderCell>{t("firstName")}</CTableHeaderCell>
              <CTableHeaderCell>{t("lastName")}</CTableHeaderCell>
              <CTableHeaderCell>{t("email")}</CTableHeaderCell>
              <CTableHeaderCell>{t("clients.mobile")}</CTableHeaderCell>
              <CTableHeaderCell>{t("age")}</CTableHeaderCell>
              <CTableHeaderCell>{t("gender")}</CTableHeaderCell>
            </CTableRow>
          </CTableHead>
          <CTableBody>
            {clients.map((client, index) => (
              <CTableRow key={index}>
                <CTableDataCell>{index + 1}</CTableDataCell>
                <CTableDataCell>{client.firstName}</CTableDataCell>
                <CTableDataCell>{client.lastName}</CTableDataCell>
                <CTableDataCell>{client.email}</CTableDataCell>
                <CTableDataCell>{client.mobile}</CTableDataCell>
                <CTableDataCell>{client.age}</CTableDataCell>
                <CTableDataCell>{client.gender}</CTableDataCell>
              </CTableRow>
            ))}
          </CTableBody>
        </CTable>
      </CCardBody>
    </CCard>
  )
}

export default Clients
