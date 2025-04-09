import PropTypes from "prop-types";
import React, { useEffect, useState } from "react";
import { axiosInst } from "src/axiosInstance";
import { Modal, Button } from "react-bootstrap";
import { toast, Toaster } from "react-hot-toast";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEdit, faTrash } from "@fortawesome/free-solid-svg-icons";
import {
  CCard,
  CTable,
  CTableBody,
  CTableDataCell,
  CTableHead,
  CTableHeaderCell,
  CTableRow,
} from "@coreui/react";
import { useTranslation } from "react-i18next";
import { t } from "i18next";
const EditStationPopup = ({ show, handleClose, stationId, stationName }) => {
  const [editedStationName, setEditedStationName] = useState("");
  const { t } = useTranslation();
  useEffect(() => {
    setEditedStationName(stationName);
  }, [stationName]);

  const handleUpdateStation = async () => {
    try {
      const jwtToken = localStorage.getItem("jwtToken");
      const response = await axiosInst.put(`station/updatestation/${stationId}`,
        { station_name: editedStationName },
        {
          headers: {
            Authorization: `Bearer ${jwtToken}`,
          },
        }
      );

      if (response.status === 200) {
        console.log("Station updated successfully");
        toast.success("Station updated successfully");
        handleClose();
      } else {
        console.error("Failed to update station");
        toast.error("Failed to update station");
      }
    } catch (error) {
      console.error("Error updating station:", error);
      toast.error("Error updating station. Please try again later.");
    }
  };

  return (
    <Modal show={show} onHide={handleClose}>
      <Modal.Header closeButton>
        <Modal.Title>{t("station.edit")}</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <input
          type="text"
          value={editedStationName}
          onChange={(e) => setEditedStationName(e.target.value)}
          placeholder="Enter station name"
          className="form-control"
        />
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={handleClose}>
          {t("buttons.close")}
        </Button>
        <Button variant="primary" onClick={handleUpdateStation}>
          {t("buttons.save")}
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

EditStationPopup.propTypes = {
  show: PropTypes.bool.isRequired,
  handleClose: PropTypes.func.isRequired,
  stationId: PropTypes.string.isRequired,
  stationName: PropTypes.string.isRequired,
};

const Stations = () => {
  const [stations, setStations] = useState([]);
  const [showEditPopup, setShowEditPopup] = useState(false);
  const [selectedStationId, setSelectedStationId] = useState(null);
  const [selectedStationName, setSelectedStationName] = useState("");
  

  useEffect(() => {
    fetchStations();
  }, [showEditPopup]);

  const fetchStations = async () => {
    try {
      const response = await axiosInst.get("/station/getstations");
      setStations(response.data);
    } catch (error) {
      console.error("Error fetching stations:", error);
    }
  };

  const handleDelete = async (stationId) => {
    const confirmed = window.confirm("Are you sure you want to delete this station?");
    if (!confirmed) {
      return;
    }
    try {
      const jwtToken = localStorage.getItem("jwtToken");
      const response = await axiosInst.delete(`station/deletestation/${stationId}`, {
        headers: {
          Authorization: `Bearer ${jwtToken}`,
        },
      });

      if (response.status === 200 || response.status === 204) {
        console.log("Station deleted successfully");
        const updatedStations = stations.filter((station) => station.id !== stationId);
        setStations(updatedStations);
        toast.success("Station deleted successfully");
      } else {
        console.error("Failed to delete station");
        toast.error("Failed to delete station");
      }
    } catch (error) {
      if (error.response && error.response.status === 400) {
        console.error("Failed to delete station: Station is in use.");
        toast.error("Failed to delete station: Station is in use.");
      } else {
        console.error("Error deleting station:", error);
        toast.error("Error deleting station. Please try again later.");
      }
    }
  };

  const handleEdit = (stationId, stationName) => {
    setSelectedStationId(stationId);
    setSelectedStationName(stationName);
    setShowEditPopup(true);
  };

  const handleCloseEditPopup = () => {
    setShowEditPopup(false);
  };

  return (
    <>
      <Toaster toastOptions={{ duration: 4000 }} />
      <CCard className="mb-4">
        <CTable align="middle" className="mb-0 border" hover responsive>
          <CTableHead color="light">
            <CTableRow>
              <CTableHeaderCell className="text-center">{t("station.index")}</CTableHeaderCell>
              <CTableHeaderCell>{t("station.name")}</CTableHeaderCell>
              <CTableHeaderCell>{t("station.actions")}</CTableHeaderCell>
            </CTableRow>
          </CTableHead>
          <CTableBody>
            {stations.map((item, index) => (
              <CTableRow key={index}>
                <CTableDataCell className="text-center">{index + 1}</CTableDataCell>
                <CTableDataCell>
                  <div>{item.station_name}</div>
                </CTableDataCell>
                <CTableDataCell>
                  <span style={{ cursor: "pointer" }}>
                    <FontAwesomeIcon
                      icon={faEdit}
                      color="blue"
                      onClick={() => handleEdit(item.id, item.station_name)}
                      style={{ cursor: "pointer", marginRight: "5px" }}
                    />
                    <FontAwesomeIcon
                      icon={faTrash}
                      color="red"
                      onClick={() => handleDelete(item.id)}
                    />
                  </span>
                </CTableDataCell>
              </CTableRow>
            ))}
          </CTableBody>
        </CTable>
      </CCard>
      <EditStationPopup
        show={showEditPopup}
        handleClose={handleCloseEditPopup}
        stationId={selectedStationId}
        stationName={selectedStationName}
      />
    </>
  );
};

export default Stations;
