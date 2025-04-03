import React, { useEffect, useState } from "react";
import { toast, Toaster } from "react-hot-toast";
import { axiosInst } from "src/axiosInstance";
import "react-toastify/dist/ReactToastify.css";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import "./styles.css";

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
      <h2>Add New Bus</h2>
      <form>
        <div className="form-group">
          <label>Route</label>
          <select className="form-control" name="routeId" onChange={handleInputChange}>
            <option value="">Select Route</option>
            {routesData.map((route) => (
              <option key={route.id} value={route.id}>
                {route.from} to {route.to}
              </option>
            ))}
          </select>
        </div>

        <div className="form-group">
          <label>Driver</label>
          <select className="form-control" name="driverId" onChange={handleInputChange}>
            <option value="">Select Driver</option>
            {driversData.map((driver) => (
              <option key={driver.id} value={driver.id}>
                {driver.firstName} {driver.lastName} ({driver.licenseNumber})
              </option>
            ))}
          </select>
        </div>

        <div className="form-group">
          <label>Bus No</label>
          <input name="busNo" className="form-control" onChange={handleInputChange} placeholder="Enter Bus No" required />
        </div>

        <div className="form-group">
          <label>Total Seats</label>
          <input type="number" name="totalSeats" className="form-control" onChange={handleInputChange} placeholder="Enter Total Seats" required />
        </div>

        <div className="form-group">
          <label>Start Time</label>
          <DatePicker selected={selectedDate} onChange={(date) => setSelectedDate(date)} showTimeSelect timeFormat="HH:mm:ss" dateFormat="MMMM d, yyyy h:mm aa" className="form-control" />
        </div>

        <div className="form-group">
          <label>End Time</label>
          <DatePicker selected={endDate} onChange={(date) => setEndDate(date)} showTimeSelect timeFormat="HH:mm:ss" dateFormat="MMMM d, yyyy h:mm aa" className="form-control" />
        </div>
        <div className="form-group">
          <label>Bus Class</label>
          <select className="form-control" name="busClass" onChange={handleInputChange}>
            <option value="">Select Class</option>
            <option value="BUSINESS">Business</option>
            <option value="COMFORT">Comfort</option>
            <option value="ECONOMY">Economy</option>
          </select>
        </div>
        <div className="form-group">
          <label>Цена билета</label>
          <input
            type="number"
            className="form-control"
            name="price"
            value={price}
            onChange={(e) => setPrice(e.target.value)}
            placeholder="Введите цену билета"
            required
          />
        </div>


        <button type="button" onClick={addBus} className="btn btn-primary">Add Bus</button>
      </form>
      <Toaster toastOptions={{ duration: 4000 }} />
    </div>
  );
};

export default AddBus;
