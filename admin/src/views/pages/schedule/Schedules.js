// admin/src/views/pages/schedule/Schedules.js

import React, { useEffect, useState } from "react";
import { Table, Button, Form } from "react-bootstrap";
import { axiosInst } from "src/axiosInstance";
import { toast } from "react-hot-toast";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTrash } from "@fortawesome/free-solid-svg-icons";

const Schedules = () => {
  const [buses, setBuses] = useState([]);     // список автобусов
  const [busId, setBusId] = useState("");     // текущий выбор выпадающего списка
  const [schedules, setSchedules] = useState([]);

  // Загружаем список всех автобусов (или только тех, что нужны)
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

  // Загружаем расписание выбранного автобуса
  const fetchSchedules = async () => {
    if (!busId) return;
    try {
      const res = await axiosInst.get(`/schedule/${busId}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("jwtToken")}`,
        },
      });
      setSchedules(res.data);
    } catch (error) {
      toast.error("Failed to fetch schedules.");
    }
  };

  // Удаление расписания
  const handleDeleteSchedule = async (scheduleId) => {
    const confirmed = window.confirm("Delete this schedule entry?");
    if (!confirmed) return;
    try {
      await axiosInst.delete(`/schedule/${scheduleId}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("jwtToken")}`,
        },
      });
      toast.success("Schedule entry deleted");
      fetchSchedules(); // перезагружаем расписание
    } catch (error) {
      toast.error("Failed to delete schedule entry.");
    }
  };

  // При первой загрузке компонента - грузим автобусы
  useEffect(() => {
    fetchAllBuses();
  }, []);

  // Когда busId меняется — грузим расписание
  useEffect(() => {
    if (busId) {
      fetchSchedules();
    }
  }, [busId]);

  return (
    <div>
      <h3>Bus Schedules</h3>

      <Form.Group className="mb-2" style={{ maxWidth: "300px" }}>
        <Form.Label>Select Bus:</Form.Label>
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

      <Button onClick={fetchSchedules} className="mb-3">
        Load Schedule
      </Button>

      <Table striped bordered hover>
        <thead>
          <tr>
            <th>ID</th>
            <th>Day of Month</th>
            <th>Departure Time</th>
            <th>Active</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {schedules.map((sch) => (
            <tr key={sch.id}>
              <td>{sch.id}</td>
              <td>{sch.dayOfMonth}</td>
              <td>{sch.departureTime}</td>
              <td>{sch.active ? "Yes" : "No"}</td>
              <td>
                <FontAwesomeIcon
                  icon={faTrash}
                  color="red"
                  style={{ cursor: "pointer" }}
                  onClick={() => handleDeleteSchedule(sch.id)}
                />
              </td>
            </tr>
          ))}
        </tbody>
      </Table>
    </div>
  );
};

export default Schedules;
