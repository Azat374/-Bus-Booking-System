import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import PropTypes from "prop-types"; // Добавлено для валидации пропсов
import "./ProfileCard.css"; // Файл для стилизации
import { axiosInst } from "../../service/axiosInstance";
import { toast } from "react-hot-toast";

function ProfileCard({ id, onClose }) {
  const [user, setUser] = useState(null);

  useEffect(() => {
    fetchUserData();
  }, []);

  const fetchUserData = async () => {
    try {
      const response = await axiosInst.get(`/user/${id}`, {
        headers: { Authorization: `Bearer ${localStorage.getItem("jwtToken")}` },
      });
      setUser(response.data);
    } catch (error) {
      console.error("Error fetching user data:", error);
      toast.error("Failed to load user data.");
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("jwtToken");
    window.location.href = "/login"; // Перенаправление на страницу входа
  };

  return (
    <div className="profile-card">
      <h3>Welcome, {user ? user.firstName : "User"}!</h3>
      <div className="profile-content">
        {user ? (
          <>
            <p>First Name: {user.firstName}</p>
            <p>Last Name: {user.lastName}</p>
            <p>Age: {user.age}</p>
          </>
        ) : (
          <p>Loading...</p>
        )}
        <Link to="/change-password" className="link-change-password" onClick={onClose}>
          Change Password
        </Link>
        <button onClick={handleLogout} className="logout-button">
          Logout
        </button>
      </div>
    </div>
  );
}

// Валидация пропсов
ProfileCard.propTypes = {
  id: PropTypes.string.isRequired,
  onClose: PropTypes.func,
};

export default ProfileCard;
