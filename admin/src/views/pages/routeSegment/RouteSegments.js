// admin/src/views/pages/routeSegment/RouteSegments.js
import React, { useEffect, useState } from "react";
import { Table, Button } from "react-bootstrap";
import { axiosInst } from "src/axiosInstance";
import { toast } from "react-hot-toast";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTrash } from "@fortawesome/free-solid-svg-icons";

const RouteSegments = () => {
  const [routeId, setRouteId] = useState("");
  const [segments, setSegments] = useState([]);

  const fetchSegments = async () => {
    if (!routeId) return;
    try {
      // допустим, GET /routeSegment/all/{routeId} — 
      // вам нужно будет реализовать такой эндпоинт
      const res = await axiosInst.get(`/routesegment/all/${routeId}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("jwtToken")}`,
        },
      });
      setSegments(res.data);
    } catch (error) {
      toast.error("Failed to fetch segments");
    }
  };

  const handleDeleteSegment = async (segmentId) => {
    const confirmed = window.confirm("Delete this segment?");
    if (!confirmed) return;
    try {
      await axiosInst.delete(`/routesegment/${segmentId}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("jwtToken")}`,
        },
      });
      toast.success("Segment deleted");
      fetchSegments();
    } catch (error) {
      toast.error("Failed to delete segment");
    }
  };

  useEffect(() => {
    if (routeId) {
      fetchSegments();
    }
  }, [routeId]);

  return (
    <div>
      <h3>Route Segments</h3>
      <div className="mb-2">
        <label>Route ID:</label>
        <input
          type="text"
          value={routeId}
          onChange={(e) => setRouteId(e.target.value)}
          style={{ marginLeft: "10px" }}
        />
        <Button onClick={fetchSegments} className="ms-2">
          Load
        </Button>
      </div>

      <Table striped bordered hover>
        <thead>
          <tr>
            <th>ID</th>
            <th>Station ID</th>
            <th>Order Index</th>
            <th>Distance to Next</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {segments.map((seg) => (
            <tr key={seg.id}>
              <td>{seg.id}</td>
              <td>{seg.station?.id}</td>
              <td>{seg.orderIndex}</td>
              <td>{seg.distanceToNext}</td>
              <td>
                <FontAwesomeIcon
                  icon={faTrash}
                  color="red"
                  style={{ cursor: "pointer" }}
                  onClick={() => handleDeleteSegment(seg.id)}
                />
              </td>
            </tr>
          ))}
        </tbody>
      </Table>
    </div>
  );
};

export default RouteSegments;
