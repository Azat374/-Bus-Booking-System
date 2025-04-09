import React, { useEffect, useState } from "react";
import { toast, Toaster } from "react-hot-toast";
import { axiosInst } from "src/axiosInstance";
import "react-toastify/dist/ReactToastify.css";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import "./styles.css";
import { useTranslation } from "react-i18next";
const AddBus = () => {
  const [busDetails, setBusDetails] = useState({
    busNo: "",
    totalSeats: "",
    startTime: "",
    endTime: "",
    routeId: "",
    driverId: "",
    busClass: ""
  });
  const { t } = useTranslation();
  const [routesData, setRoutesData] = useState([]);
  const [driversData, setDriversData] = useState([]);
  const [selectedDate, setSelectedDate] = useState(null);
  const [endDate, setEndDate] = useState(null);
  const [price, setPrice] = useState("");

  useEffect(() => {
    fetchRoutes();
    fetchDrivers();
  }, []);

  const fetchRoutes = async () => {
    try {
      const response = await axiosInst.get("/route/allroutes", {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("jwtToken")}`,
        },
      });
      setRoutesData(response.data);
    } catch (error) {
      toast.error("Failed to fetch routes.");
    }
  };

  const fetchDrivers = async () => {
    try {
      const response = await axiosInst.get("/drivers/all", {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("jwtToken")}`,
        },
      });
      setDriversData(response.data);
    } catch (error) {
      toast.error("Failed to fetch drivers.");
    }
  };

  const handleInputChange = (e) => {
    setBusDetails({ ...busDetails, [e.target.name]: e.target.value });
  };

  const addBus = async () => {
    if (!busDetails.busNo || !busDetails.totalSeats || !selectedDate || !endDate || !busDetails.routeId || !busDetails.driverId || !price) {
      toast.error("Please fill in all required fields.");
      return;
    }
  
    const token = localStorage.getItem("jwtToken");
    if (!token) {
      toast.error("Authentication failed. Please log in again.");
      return;
    }
  
    try {
      await axiosInst.post(
        `/bus/addbus/${busDetails.routeId}/${busDetails.driverId}`,
        {
          busNo: busDetails.busNo,
          totalSeats: busDetails.totalSeats,
          startTime: selectedDate.toISOString(),
          endTime: endDate.toISOString(),
          routeId: busDetails.routeId,
          busClass: busDetails.busClass,
          price: parseFloat(price)  // <-- добавили цену
        },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
  
      toast.success("Bus added successfully.");
      setPrice("");
    } catch (error) {
      console.error("Error adding bus:", error.response);
      toast.error(`Failed to add bus. ${error.response?.data || "Unknown error"}`);
    }
  };
  
  
  
  return (
    <div className="container mt-5">
      <h2>{t("buses.add")}</h2>
      <form>
        <div className="form-group">
          <label>{t("buses.route")}</label>
          <select className="form-control" name="routeId" onChange={handleInputChange}>
            <option value="">{t("buses.selectRoute")}</option>
            {routesData.map((route) => (
              <option key={route.id} value={route.id}>
                {route.from} - {route.to}
              </option>
            ))}
          </select>
        </div>

        <div className="form-group">
          <label>{t("buses.driver")}</label>
          <select className="form-control" name="driverId" onChange={handleInputChange}>
            <option value="">{t("buses.selectDriver")}</option>
            {driversData.map((driver) => (
              <option key={driver.id} value={driver.id}>
                {driver.firstName} {driver.lastName} ({driver.licenseNumber})
              </option>
            ))}
          </select>
        </div>

        <div className="form-group">
          <label>{t("buses.no")}</label>
          <input name="busNo" className="form-control" onChange={handleInputChange} placeholder={t("buses.enterBusNo")} required />
        </div>

        <div className="form-group">
          <label>{t("buses.totalSeats")}</label>
          <input type="number" name="totalSeats" className="form-control" onChange={handleInputChange} placeholder={t("buses.enterTotalSeats")} required />
        </div>

        <div className="form-group">
          <label>{t("startTime")}</label>
          <DatePicker selected={selectedDate} onChange={(date) => setSelectedDate(date)} showTimeSelect timeFormat="HH:mm:ss" dateFormat="MMMM d, yyyy h:mm aa" className="form-control" />
        </div>

        <div className="form-group">
          <label>{t("endTime")}</label>
          <DatePicker selected={endDate} onChange={(date) => setEndDate(date)} showTimeSelect timeFormat="HH:mm:ss" dateFormat="MMMM d, yyyy h:mm aa" className="form-control" />
        </div>
        <div className="form-group">
          <label>{t("buses.busClass")}</label>
          <select className="form-control" name="busClass" onChange={handleInputChange}>
            <option value="">{t("buses.selectBusClass")}</option>
            <option value="BUSINESS">{t("buses.business")}</option>
            <option value="COMFORT">{t("buses.comfort")}</option>
            <option value="ECONOMY">{t("buses.economy")}</option>
          </select>
        </div>
        <div className="form-group">
          <label>{t("buses.ticketPrice")}</label>
          <input
            type="number"
            className="form-control"
            name="price"
            value={price}
            onChange={(e) => setPrice(e.target.value)}
            placeholder={t("buses.enterTicketPrice")}
            required
          />
        </div>


        <button type="button" onClick={addBus} className="btn btn-primary">{t("buses.add")}</button>
      </form>
      <Toaster toastOptions={{ duration: 4000 }} />
    </div>
  );
};

export default AddBus;
