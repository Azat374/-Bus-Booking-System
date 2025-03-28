// admin/src/views/pages/driver/Drivers.js
import React, { useEffect, useState } from "react";
import { Table, Modal, Button, Form } from "react-bootstrap";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTrash, faEdit, faPlus } from "@fortawesome/free-solid-svg-icons";
import { axiosInst } from "src/axiosInstance";
import { toast } from "react-hot-toast";

const Drivers = () => {
  const [drivers, setDrivers] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [editedDriver, setEditedDriver] = useState(null);

  // Новое поле salary включено в стейт:
  const [driverDetails, setDriverDetails] = useState({
    id: "",
    firstName: "",
    lastName: "",
    licenseNumber: "",
    phoneNumber: "",
    salary: "", // <-- поле salary
  });

  useEffect(() => {
    fetchDrivers();
  }, []);

  // Загрузка списка водителей
  const fetchDrivers = async () => {
    try {
      const response = await axiosInst.get("/drivers/all", {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("jwtToken")}`,
        },
      });
      setDrivers(response.data);
    } catch (error) {
      toast.error("Failed to fetch drivers.");
    }
  };

  // Кнопка "Add Driver"
  const handleAddDriver = () => {
    setEditedDriver(null);
    setDriverDetails({
      firstName: "",
      lastName: "",
      licenseNumber: "",
      phoneNumber: "",
      salary: "", // сбрасываем до пустого
    });
    setShowModal(true);
  };

  // Кнопка "Edit"
  const handleEditDriver = (driver) => {
    setEditedDriver(driver);
    setDriverDetails(driver); // driver уже содержит salary
    setShowModal(true);
  };

  // Удаление водителя
  const handleDeleteDriver = async (driverId) => {
    const confirmed = window.confirm("Are you sure you want to delete this driver?");
    if (!confirmed) return;

    try {
      await axiosInst.delete(`/drivers/delete/${driverId}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("jwtToken")}`,
        },
      });
      toast.success("Driver deleted successfully.");
      fetchDrivers();
    } catch (error) {
      toast.error("Failed to delete driver.");
    }
  };

  // Сохранение водителя (добавление или обновление)
  const handleSaveDriver = async () => {
    try {
      const method = editedDriver ? "put" : "post";
      const url = editedDriver
        ? `/drivers/update/${editedDriver.id}`
        : "/drivers/add";

      await axiosInst[method](url, driverDetails, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("jwtToken")}`,
        },
      });

      toast.success(`Driver ${editedDriver ? "updated" : "added"} successfully.`);
      setShowModal(false);
      fetchDrivers();
    } catch (error) {
      toast.error("Failed to save driver.");
    }
  };

  return (
    <div>
      <h2>Drivers</h2>
      <Button variant="primary" onClick={handleAddDriver}>
        <FontAwesomeIcon icon={faPlus} /> Add Driver
      </Button>

      <Table striped bordered hover className="mt-3">
        <thead>
          <tr>
            <th>First Name</th>
            <th>Last Name</th>
            <th>License Number</th>
            <th>Phone Number</th>
            <th>Salary</th> {/* Новая колонка */}
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {drivers.map((driver) => (
            <tr key={driver.id}>
              <td>{driver.firstName}</td>
              <td>{driver.lastName}</td>
              <td>{driver.licenseNumber}</td>
              <td>{driver.phoneNumber}</td>
              <td>{driver.salary || 0}</td> {/* Отображаем зарплату */}
              <td>
                <FontAwesomeIcon
                  icon={faEdit}
                  color="blue"
                  onClick={() => handleEditDriver(driver)}
                  style={{ cursor: "pointer", marginRight: "10px" }}
                />
                <FontAwesomeIcon
                  icon={faTrash}
                  color="red"
                  onClick={() => handleDeleteDriver(driver.id)}
                  style={{ cursor: "pointer" }}
                />
              </td>
            </tr>
          ))}
        </tbody>
      </Table>

      {/* Модальное окно для добавления/редактирования */}
      <Modal show={showModal} onHide={() => setShowModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>{editedDriver ? "Edit Driver" : "Add Driver"}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            {/* First Name */}
            <Form.Group className="mb-2">
              <Form.Label>First Name</Form.Label>
              <Form.Control
                type="text"
                value={driverDetails.firstName}
                onChange={(e) =>
                  setDriverDetails({ ...driverDetails, firstName: e.target.value })
                }
              />
            </Form.Group>

            {/* Last Name */}
            <Form.Group className="mb-2">
              <Form.Label>Last Name</Form.Label>
              <Form.Control
                type="text"
                value={driverDetails.lastName}
                onChange={(e) =>
                  setDriverDetails({ ...driverDetails, lastName: e.target.value })
                }
              />
            </Form.Group>

            {/* License Number */}
            <Form.Group className="mb-2">
              <Form.Label>License Number</Form.Label>
              <Form.Control
                type="text"
                value={driverDetails.licenseNumber}
                onChange={(e) =>
                  setDriverDetails({ ...driverDetails, licenseNumber: e.target.value })
                }
              />
            </Form.Group>

            {/* Phone Number */}
            <Form.Group className="mb-2">
              <Form.Label>Phone Number</Form.Label>
              <Form.Control
                type="text"
                value={driverDetails.phoneNumber}
                onChange={(e) =>
                  setDriverDetails({ ...driverDetails, phoneNumber: e.target.value })
                }
              />
            </Form.Group>

            {/* Salary */}
            <Form.Group className="mb-2">
              <Form.Label>Salary</Form.Label>
              <Form.Control
                type="number"
                value={driverDetails.salary}
                onChange={(e) =>
                  setDriverDetails({ ...driverDetails, salary: e.target.value })
                }
              />
            </Form.Group>

          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowModal(false)}>
            Close
          </Button>
          <Button variant="primary" onClick={handleSaveDriver}>
            Save
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default Drivers;
