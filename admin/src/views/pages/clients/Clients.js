import React, { useEffect, useState } from 'react'
import { CCard, CCardBody, CCardHeader, CTable, CTableBody, CTableHead, CTableHeaderCell, CTableRow, CTableDataCell } from '@coreui/react'
import { axiosInst } from 'src/axiosInstance'

const Clients = () => {
  const [clients, setClients] = useState([])

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
              <CTableHeaderCell>First Name</CTableHeaderCell>
              <CTableHeaderCell>Last Name</CTableHeaderCell>
              <CTableHeaderCell>Email</CTableHeaderCell>
              <CTableHeaderCell>Mobile</CTableHeaderCell>
              <CTableHeaderCell>Age</CTableHeaderCell>
              <CTableHeaderCell>Gender</CTableHeaderCell>
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
