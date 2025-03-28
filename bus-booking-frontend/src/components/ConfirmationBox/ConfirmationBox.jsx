import { useEffect } from "react";
import PropTypes from "prop-types";
import "./ConfirmationBox.css"; // Import the CSS file

function ConfirmationBox({ onClose, handleConfirm, confirmObject }) {
  const handleClick = () => {
    handleConfirm();
    onClose();
  };


  return (
    <div className="confirmation-box">
      <p>Растағыңыз келетініне сенімдісіз бе?</p>
      <p>Қайдан: {confirmObject.from}</p>
      <p>Қайда: {confirmObject.to}</p>
      <p>Автобус нөмірі: {confirmObject.busNo}</p>
      <p>Билеттер саны: {confirmObject.noOfTickets}</p>
      <p>Бағасы: {confirmObject.cost}</p>
      
      <button onClick={handleClick}>Растау</button>
    </div>
  );
}

ConfirmationBox.propTypes = {
  onClose: PropTypes.func.isRequired,
  handleConfirm: PropTypes.func.isRequired,
  confirmObject: PropTypes.object.isRequired,
};

export default ConfirmationBox;