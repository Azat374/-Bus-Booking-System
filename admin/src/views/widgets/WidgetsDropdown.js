import React from 'react'
import { useEffect,useState } from 'react'
import { axiosInst } from "src/axiosInstance";
import {
  CRow,
  CCol,
  CWidgetStatsA,
} from '@coreui/react'
import { getStyle } from '@coreui/utils'
import { CChartBar, CChartLine } from '@coreui/react-chartjs'
import CIcon from '@coreui/icons-react'
import { cilArrowTop } from '@coreui/icons'


const WidgetsDropdown = () => {
  const [stationCount, setstationCount] = useState(0);
  const [bookings, setBookings] = useState([]);
  const [routes, setroutes] = useState([]);
  const [drivers, setDrivers] = useState([]);

  useEffect(() => {
    const fetchstationCount = async () => {
      try {
        const response = await axiosInst.get("/station/getstations", {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("jwtToken")}`,
          },
        });
        setstationCount(response.data);
      } catch (error) {
        console.error("Error fetching station count:", error);
      }
    };

    const fetchBookings = async () => {
      try {
        const response = await axiosInst.get("/bookings/getbookings", {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("jwtToken")}`,
          },
        });
        setBookings(response.data);
        console.log(Array.isArray(bookings)); // должен быть true
        console.log(typeof bookings);         // должен быть "object"

      } catch (error) {
        console.error("Error fetching bookings:", error);
      }
    };

    const fetchroutes = async () => {
      try {
        const response = await axiosInst.get("route/allroutes", {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("jwtToken")}`,
          },
        });
        setroutes(response.data);
      } catch (error) {
        console.error("Error fetching routes:", error);
      }
    };

    const fetchDrivers = async () => {
      try {
        const response = await axiosInst.get('/drivers/all', {
          headers: { Authorization: `Bearer ${localStorage.getItem('jwtToken')}` },
        });
        setDrivers(response.data);
      } catch (error) {
        console.error('Error fetching drivers:', error);
      }
    };

    fetchstationCount();
    fetchBookings();
    fetchroutes();
    fetchDrivers();
  }, []);

  {/*
  const handleDownloadGeneralReport = async () => {
    try {
      const response = await axiosInst.get("/bookings/report/general", {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("jwtToken")}`,
        },
        responseType: "blob", // Важно! Указываем, что ожидаем PDF-данные
      });
  
      const blob = new Blob([response.data], { type: "application/pdf" });
      const link = document.createElement("a");
      link.href = window.URL.createObjectURL(blob);
      link.download = "full-report.pdf";
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
  
      toast.success("Отчёт успешно скачан!");
    } catch (error) {
      console.error("Ошибка загрузки отчёта:", error);
      toast.error("Ошибка при скачивании отчёта.");
    }
  };  
  */}
  
  

  const totalAmount = bookings.reduce((acc, item) => acc + Number(item.totalFare), 0);
  const totalBooking = bookings.length;
  const totalroutes= routes.length;
  const totalDrivers = drivers.length;
  return (
    
    <CRow>
      <CCol sm={6} lg={3}>
        <CWidgetStatsA
          className="mb-4"
          color="primary"
          value={
            <>
              {stationCount.length}{' '}
              {/* <span className="fs-6 fw-normal">
                (-12.4% <CIcon icon={cilArrowBottom} />)
              </span> */}
            </>
          }
          title="Total stations"
          // action={
          //   <CDropdown alignment="end">
          //     <CDropdownToggle color="transparent" caret={false} className="p-0">
          //       <CIcon icon={cilOptions} className="text-high-emphasis-inverse" />
          //     </CDropdownToggle>
          //     <CDropdownMenu>
          //       <CDropdownItem>Action</CDropdownItem>
          //       <CDropdownItem>Another action</CDropdownItem>
          //       <CDropdownItem>Something else here...</CDropdownItem>
          //       <CDropdownItem disabled>Disabled action</CDropdownItem>
          //     </CDropdownMenu>
          //   </CDropdown>
          // }
          chart={
            <CChartLine
              className="mt-3 mx-3"
              style={{ height: '70px' }}
              data={{
                labels: ['January', 'February', 'March', 'April', 'May', 'June', 'July'],
                datasets: [
                  {
                    label: 'My First dataset',
                    backgroundColor: 'transparent',
                    borderColor: 'rgba(255,255,255,.55)',
                    pointBackgroundColor: getStyle('--cui-primary'),
                    data: [65, 59, 84, 84, 51, 55, 40],
                  },
                ],
              }}
              options={{
                plugins: {
                  legend: {
                    display: false,
                  },
                },
                maintainAspectRatio: false,
                scales: {
                  x: {
                    grid: {
                      display: false,
                      drawBorder: false,
                    },
                    ticks: {
                      display: false,
                    },
                  },
                  y: {
                    min: 30,
                    max: 89,
                    display: false,
                    grid: {
                      display: false,
                    },
                    ticks: {
                      display: false,
                    },
                  },
                },
                elements: {
                  line: {
                    borderWidth: 1,
                    tension: 0.4,
                  },
                  point: {
                    radius: 4,
                    hitRadius: 10,
                    hoverRadius: 4,
                  },
                },
              }}
            />
          }
        />
      </CCol>
      <CCol sm={6} lg={3}>
        <CWidgetStatsA
          className="mb-4"
          color="info"
          value={
            <>
              {totalAmount}{' '}
              <span className="fs-6 fw-normal">
                 <CIcon icon={cilArrowTop} />
              </span>
            </>
          }
          title="Income"
          // action={
          //   <CDropdown alignment="end">
          //     <CDropdownToggle color="transparent" caret={false} className="p-0">
          //       <CIcon icon={cilOptions} className="text-high-emphasis-inverse" />
          //     </CDropdownToggle>
          //     <CDropdownMenu>
          //       <CDropdownItem>Action</CDropdownItem>
          //       <CDropdownItem>Another action</CDropdownItem>
          //       <CDropdownItem>Something else here...</CDropdownItem>
          //       <CDropdownItem disabled>Disabled action</CDropdownItem>
          //     </CDropdownMenu>
          //   </CDropdown>
          // }
          chart={
            <CChartLine
              className="mt-3 mx-3"
              style={{ height: '70px' }}
              data={{
                labels: ['January', 'February', 'March', 'April', 'May', 'June', 'July'],
                datasets: [
                  {
                    label: 'My First dataset',
                    backgroundColor: 'transparent',
                    borderColor: 'rgba(255,255,255,.55)',
                    pointBackgroundColor: getStyle('--cui-info'),
                    data: [1, 18, 9, 17, 34, 22, 11],
                  },
                ],
              }}
              options={{
                plugins: {
                  legend: {
                    display: false,
                  },
                },
                maintainAspectRatio: false,
                scales: {
                  x: {
                    grid: {
                      display: false,
                      drawBorder: false,
                    },
                    ticks: {
                      display: false,
                    },
                  },
                  y: {
                    min: -9,
                    max: 39,
                    display: false,
                    grid: {
                      display: false,
                    },
                    ticks: {
                      display: false,
                    },
                  },
                },
                elements: {
                  line: {
                    borderWidth: 1,
                  },
                  point: {
                    radius: 4,
                    hitRadius: 10,
                    hoverRadius: 4,
                  },
                },
              }}
            />
          }
        />
      </CCol>
      <CCol sm={6} lg={3}>
        <CWidgetStatsA
          className="mb-4"
          color="warning"
          value={
            <>
              {totalBooking}{' '}
              <span className="fs-6 fw-normal">
                <CIcon icon={cilArrowTop} />
              </span>
            </>
          }
          title="Total Bookings"
          // action={
          //   <CDropdown alignment="end">
          //     <CDropdownToggle color="transparent" caret={false} className="p-0">
          //       <CIcon icon={cilOptions} className="text-high-emphasis-inverse" />
          //     </CDropdownToggle>
          //     <CDropdownMenu>
          //       <CDropdownItem>Action</CDropdownItem>
          //       <CDropdownItem>Another action</CDropdownItem>
          //       <CDropdownItem>Something else here...</CDropdownItem>
          //       <CDropdownItem disabled>Disabled action</CDropdownItem>
          //     </CDropdownMenu>
          //   </CDropdown>
          // }
          chart={
            <CChartLine
              className="mt-3"
              style={{ height: '70px' }}
              data={{
                labels: ['January', 'February', 'March', 'April', 'May', 'June', 'July'],
                datasets: [
                  {
                    label: 'My First dataset',
                    backgroundColor: 'rgba(255,255,255,.2)',
                    borderColor: 'rgba(255,255,255,.55)',
                    data: [78, 81, 80, 45, 34, 12, 40],
                    fill: true,
                  },
                ],
              }}
              options={{
                plugins: {
                  legend: {
                    display: false,
                  },
                },
                maintainAspectRatio: false,
                scales: {
                  x: {
                    display: false,
                  },
                  y: {
                    display: false,
                  },
                },
                elements: {
                  line: {
                    borderWidth: 2,
                    tension: 0.4,
                  },
                  point: {
                    radius: 0,
                    hitRadius: 10,
                    hoverRadius: 4,
                  },
                },
              }}
            />
          }
        />
      </CCol>
      <CCol sm={6} lg={3}>
        <CWidgetStatsA
          className="mb-4"
          color="danger"
          value={
            <>
              {totalroutes}{' '}
              <span className="fs-6 fw-normal">
                 <CIcon icon={cilArrowTop} />
              </span>
            </>
          }
          title="Total routes"
          // action={
          //   <CDropdown alignment="end">
          //     <CDropdownToggle color="transparent" caret={false} className="p-0">
          //       <CIcon icon={cilOptions} className="text-high-emphasis-inverse" />
          //     </CDropdownToggle>
          //     <CDropdownMenu>
          //       <CDropdownItem>Action</CDropdownItem>
          //       <CDropdownItem>Another action</CDropdownItem>
          //       <CDropdownItem>Something else here...</CDropdownItem>
          //       <CDropdownItem disabled>Disabled action</CDropdownItem>
          //     </CDropdownMenu>
          //   </CDropdown>
          // }
          chart={
            <CChartBar
              className="mt-3 mx-3"
              style={{ height: '70px' }}
              data={{
                labels: [
                  'January',
                  'February',
                  'March',
                  'April',
                  'May',
                  'June',
                  'July',
                  'August',
                  'September',
                  'October',
                  'November',
                  'December',
                  'January',
                  'February',
                  'March',
                  'April',
                ],
                datasets: [
                  {
                    label: 'My First dataset',
                    backgroundColor: 'rgba(255,255,255,.2)',
                    borderColor: 'rgba(255,255,255,.55)',
                    data: [78, 81, 80, 45, 34, 12, 40, 85, 65, 23, 12, 98, 34, 84, 67, 82],
                    barPercentage: 0.6,
                  },
                ],
              }}
              options={{
                maintainAspectRatio: false,
                plugins: {
                  legend: {
                    display: false,
                  },
                },
                scales: {
                  x: {
                    grid: {
                      display: false,
                      drawTicks: false,
                    },
                    ticks: {
                      display: false,
                    },
                  },
                  y: {
                    grid: {
                      display: false,
                      drawBorder: false,
                      drawTicks: false,
                    },
                    ticks: {
                      display: false,
                    },
                  },
                },
              }}
            />
          }
        />
      </CCol>
      <CCol sm={6} lg={3}>
        <CWidgetStatsA
          className="mb-4"
          color="success" // Изменим цвет для отличия
          value={<>{totalDrivers} <span className="fs-6 fw-normal"><CIcon icon={cilArrowTop} /></span></>}
          title="Total Drivers"
          chart={
            <CChartBar
              className="mt-3 mx-3"
              style={{ height: '70px' }}
              data={{
                labels: ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'],
                datasets: [
                  {
                    label: 'Drivers',
                    backgroundColor: 'rgba(255,255,255,.2)',
                    borderColor: 'rgba(255,255,255,.55)',
                    data: [10, 15, 13, 17, 20, 18, 22, 25, 23, 19, 21, 24],
                    barPercentage: 0.6,
                  },
                ],
              }}
              options={{
                maintainAspectRatio: false,
                plugins: { legend: { display: false } },
                scales: {
                  x: { grid: { display: false, drawTicks: false }, ticks: { display: false } },
                  y: { grid: { display: false, drawBorder: false, drawTicks: false }, ticks: { display: false } },
                },
              }}
            />
          }
        />
      </CCol>
    </CRow>
    
  )
}

export default WidgetsDropdown
