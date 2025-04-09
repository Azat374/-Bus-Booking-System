import React, { useState, useEffect } from "react";
import { Form, Button } from "react-bootstrap";
import { axiosInst } from "src/axiosInstance";
import { toast } from "react-hot-toast";
import { useTranslation } from "react-i18next";
const AddSchedule = () => {
  const [buses, setBuses] = useState([]);
  const [busId, setBusId] = useState("");
  const [dayOfMonth, setDayOfMonth] = useState("");
  const [departureTime, setDepartureTime] = useState("");
  const [active, setActive] = useState(true);
  const { t } = useTranslation();
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
  
    const payload = {
      dayOfMonth: parseInt(dayOfMonth, 10),
      departureTime: departureTime + ":00",
      active,
    };
  
    try {
      await axiosInst.post(`/schedule/add/${busId}`, payload, {
        headers: { Authorization: `Bearer ${localStorage.getItem("jwtToken")}` },
      });
  
      toast.success("Schedule entry added successfully!");
      setDayOfMonth("");
      setDepartureTime("");
      setActive(true);
    } catch (error) {
      toast.error("Failed to add schedule entry");
    }
  };
  
  

  return (
    <div>
      <h3>{t("schedule.addTitle")}</h3>
      <Form onSubmit={handleSubmit} style={{ maxWidth: "400px" }}>
        <Form.Group className="mb-2">
          <Form.Label>{t("schedule.bus")}</Form.Label>
          <Form.Select
            value={busId}
            onChange={(e) => setBusId(e.target.value)}
            required
          >
            <option value="">-- {t("schedule.selectBus")} --</option>
            {buses.map((bus) => (
              <option key={bus.id} value={bus.id}>
                {bus.busNo} (ID: {bus.id})
              </option>
            ))}
          </Form.Select>
        </Form.Group>

        <Form.Group className="mb-2">
          <Form.Label>{t("schedule.dayOfMonth")}</Form.Label>
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
          <Form.Label>{t("schedule.departureTime")}</Form.Label>
          <Form.Control
            type="time"
            value={departureTime}
            onChange={(e) => setDepartureTime(e.target.value)}
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

        <Button type="submit">{t("schedule.addBtn")}</Button>
      </Form>
    </div>
  );
};

export default AddSchedule;
