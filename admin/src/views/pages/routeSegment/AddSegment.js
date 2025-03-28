// admin/src/views/pages/routeSegment/AddSegment.js
import React, { useState } from "react";
import { Form, Button } from "react-bootstrap";
import { axiosInst } from "src/axiosInstance";
import { toast } from "react-hot-toast";

const AddSegment = () => {
  const [routeId, setRouteId] = useState("");
  const [stationId, setStationId] = useState("");
  const [orderIndex, setOrderIndex] = useState("");
  const [distanceToNext, setDistanceToNext] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      // Объект, который придёт в body
      const payload = {
        orderIndex,
        distanceToNext,
      };
      await axiosInst.post(`/routesegment/add/${routeId}/${stationId}`, payload, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("jwtToken")}`,
        },
      });
      toast.success("Segment added");
      // очищаем поля
      setOrderIndex("");
      setDistanceToNext("");
    } catch (error) {
      toast.error("Failed to add segment");
    }
  };

  return (
    <div>
      <h3>Add Route Segment</h3>
      <Form onSubmit={handleSubmit} style={{ maxWidth: "400px" }}>
        <Form.Group className="mb-2">
          <Form.Label>Route ID</Form.Label>
          <Form.Control
            type="text"
            value={routeId}
            onChange={(e) => setRouteId(e.target.value)}
            required
          />
        </Form.Group>
        <Form.Group className="mb-2">
          <Form.Label>Station ID</Form.Label>
          <Form.Control
            type="text"
            value={stationId}
            onChange={(e) => setStationId(e.target.value)}
            required
          />
        </Form.Group>
        <Form.Group className="mb-2">
          <Form.Label>Order Index</Form.Label>
          <Form.Control
            type="number"
            value={orderIndex}
            onChange={(e) => setOrderIndex(e.target.value)}
            required
          />
        </Form.Group>
        <Form.Group className="mb-2">
          <Form.Label>Distance to Next</Form.Label>
          <Form.Control
            type="number"
            value={distanceToNext}
            onChange={(e) => setDistanceToNext(e.target.value)}
            required
          />
        </Form.Group>
        <Button type="submit">Add Segment</Button>
      </Form>
    </div>
  );
};

export default AddSegment;
