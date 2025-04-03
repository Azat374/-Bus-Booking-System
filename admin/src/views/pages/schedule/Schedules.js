import React, { useEffect, useState } from "react";
import { Table, Button, Form } from "react-bootstrap";
import { axiosInst } from "src/axiosInstance";
import { toast } from "react-hot-toast";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTrash } from "@fortawesome/free-solid-svg-icons";

const Schedules = () => {
  const [buses, setBuses] = useState([]);
  const [busId, setBusId] = useState("");
  const [schedules, setSchedules] = useState([]);

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

  const fetchSchedules = async () => {
    if (!busId) {
      toast.error("Please select a bus first");
      return;
    }
  
    try {
      const res = await axiosInst.get(`/schedule/${busId}`, {
        headers: { Authorization: `Bearer ${localStorage.getItem("jwtToken")}` },
      });
      setSchedules(res.data);
    } catch (error) {
      toast.error("Failed to fetch schedules.");
    }
  };
  

  const handleDeleteSchedule = async (scheduleId) => {
    if (!window.confirm("Delete this schedule entry?")) return;
    try {
      await axiosInst.delete(`/schedule/${scheduleId}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("jwtToken")}`,
        },
      });
      toast.success("Schedule entry deleted");
      fetchSchedules();
    } catch (error) {
      toast.error("Failed to delete schedule entry.");
    }
  };

  return (
    <div>
      <h3>Bus Schedules</h3>

      <Form.Group className="mb-2" style={{ maxWidth: "300px" }}>
  <Form.Label>Select Bus:</Form.Label>
  <Form.Select value={busId} onChange={(e) => setBusId(e.target.value)}>
    <option value="">-- Select Bus --</option>
    {[...new Map(buses.map(bus => [bus.busNo, bus])).values()].map((bus) => (
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
            <th>Bus No</th>
            <th>From</th>
            <th>To</th>
            <th>Departure Date</th>
            <th>Departure Time</th>
            <th>Class</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
        {schedules.map((sch) => (
  <tr key={sch.id}>
    <td>{sch.id}</td>
    <td>{sch.busNo}</td>
    <td>{sch.from}</td>
    <td>{sch.to}</td>
    <td>{sch.departureDate}</td>
    <td>{sch.departureTime}</td>
    <td>{sch.busClass}</td>
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
