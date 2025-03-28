// admin/src/views/pages/schedule/AddSchedule.js

import React, { useState, useEffect } from "react";
import { Form, Button } from "react-bootstrap";
import { axiosInst } from "src/axiosInstance";
import { toast } from "react-hot-toast";

const AddSchedule = () => {
  const [buses, setBuses] = useState([]);  // массив автобусов
  const [busId, setBusId] = useState(""); // ID выбранного автобуса
  const [dayOfMonth, setDayOfMonth] = useState("");
  const [departureTime, setDepartureTime] = useState("");
  const [active, setActive] = useState(true);

  // Грузим список автобусов при монтировании
  useEffect(() => {
    fetchAllBuses();
  }, []);

  const fetchAllBuses = async () => {
    try {
      const res = await axiosInst.get(`/bus/getallbuses`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("jwtToken")}`,
        },
      });
      setBuses(res.data);
    } catch (error) {
      toast.error("Failed to load buses.");
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!busId) {
      toast.error("Please select a bus");
      return;
    }

    try {
      // Формируем тело запроса
      const payload = { dayOfMonth, departureTime, active };

      // Делаем запрос на /schedule/add/{busId}
      await axiosInst.post(`/schedule/add/${busId}`, payload, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("jwtToken")}`,
        },
      });

      toast.success("Schedule entry added");
      // очистка полей
      setDayOfMonth("");
      setDepartureTime("");
      setActive(true);
    } catch (error) {
      toast.error("Failed to add schedule entry");
    }
  };

  return (
    <div>
      <h3>Add Schedule</h3>
      <Form onSubmit={handleSubmit} style={{ maxWidth: "400px" }}>
        {/* Выпадающий список автобусов */}
        <Form.Group className="mb-2">
          <Form.Label>Bus</Form.Label>
          <Form.Select
            value={busId}
            onChange={(e) => setBusId(e.target.value)}
            aria-label="Select Bus"
          >
            <option value="">-- Select Bus --</option>
            {buses.map((bus) => (
              <option key={bus.id} value={bus.id}>
                {bus.busNo} (ID: {bus.id})
              </option>
            ))}
          </Form.Select>
        </Form.Group>

        <Form.Group className="mb-2">
          <Form.Label>Day of Month</Form.Label>
          <Form.Control
            type="number"
            min={1}
            max={31}
            value={dayOfMonth}
            onChange={(e) => setDayOfMonth(e.target.value)}
            required
          />
        </Form.Group>

        <Form.Group className="mb-2">
          <Form.Label>Departure Time (e.g., 10:00)</Form.Label>
          <Form.Control
            type="time"
            value={departureTime}
            onChange={(e) => setDepartureTime(e.target.value)}
            placeholder="HH:MM"
            required
          />
        </Form.Group>

        <Form.Group className="mb-2">
          <Form.Check
            type="checkbox"
            label="Active"
            checked={active}
            onChange={(e) => setActive(e.target.checked)}
          />
        </Form.Group>

        <Button type="submit">Add Schedule</Button>
      </Form>
    </div>
  );
};

export default AddSchedule;
