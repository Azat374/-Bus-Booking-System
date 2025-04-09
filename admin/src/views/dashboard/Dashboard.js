import React from 'react'
import { CChartLine } from '@coreui/react-chartjs'
import { getStyle, hexToRgba } from '@coreui/utils'
import CIcon from '@coreui/icons-react'
import WidgetsBrand from '../widgets/WidgetsBrand'
import WidgetsDropdown from '../widgets/WidgetsDropdown'
import { axiosInst } from "src/axiosInstance";
import { toast } from "react-hot-toast";
import {
  CButton,
} from '@coreui/react'
import { cilCloudDownload } from '@coreui/icons'

import { CCard, CCardBody, CCardHeader } from '@coreui/react';

import { useTranslation } from "react-i18next";

const Dashboard = () => {
  const random = (min, max) => Math.floor(Math.random() * (max - min + 1) + min)
  const { t } = useTranslation();
  
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

  return (
    <>
      <WidgetsDropdown />
      <CButton
        color="success"
        className=".download-report-btn {
                      position: fixed;
                      bottom: 20px;
                      right: 20px;
                      z-index: 1000;
                      padding: 12px 20px;
                      font-size: 16px;
                      font-weight: bold;
                      border-radius: 8px;
                      box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
                    }"
        onClick={handleDownloadGeneralReport}
      >
        <CIcon icon={cilCloudDownload} className="me-2" />
        {t("downloadReport")}
      </CButton>
    </>
  )
}

export default Dashboard
