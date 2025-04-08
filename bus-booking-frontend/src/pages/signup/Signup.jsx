
import { useState } from "react";
// import axios from "axios";
import { Link } from "react-router-dom";
import styles from "./styles.module.css";
import { axiosInst } from "../../service/axiosInstance";
import { toast } from "react-toastify";
import { useTranslation} from "react-i18next";

const Signup = () => {
  const {t, i18n} = useTranslation();
	const [data, setData] = useState({
		firstName: "",
		lastName: "",
		gender: "",
		age: "",
		mobilenumber: "",
		email: "",
		password: "",
	});
	// console.log(data,"second");
	// console.log(data,"next")
	const [error, setError] = useState("");
	const [msg, setMsg] = useState("");

  const handleChange = ({ currentTarget: input }) => {
    setData({ ...data, [input.name]: input.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log(data);
    try {
      const res = await axiosInst.post('user/signup', data);
      console.log(res.data.message);
      setMsg(res.data.message);
      toast.success("user added successfully.");
      alert("submitted successfully")
    } catch (error) {
      // handle errors 
      if (
        error.response &&
        error.response.status >= 400 &&
        error.response.status <= 500
      ) {
        console.error("Client Error:", error.response.data);
        setError(error.response.data.message);
      } else if (
        error.response &&
        error.response.status >= 500 &&
        error.response.status <= 599
      ) {
        console.error("Server Error:", error.response.data);
        // setError("Internal Server Error. Please try again later.");
        toast.error("Internal Server Error. Please try again later.")
      } else {
        // Handle other types of errors
        console.error("Error:", error.message);
        // setError("An unexpected error occurred. Please try again later.");
        toast.error("Unexpected Error");
      }
    }
  };

  return (
    <>
     
          {/* <ToastContainer /> */}
      <div className={styles.signup_container}>
        <div className={styles.signup_form_container}>
          <div className={styles.left}>
            <h1>{t("auth.welcomeBack")}</h1>
            <Link to="/login">
              <button type="button" className={styles.white_btn}>
                {t("auth.signIn")}
              </button>
            </Link>
          </div>
          <div className={styles.right}>
            <form className={styles.form_container} onSubmit={handleSubmit}>
              <h1>{t("auth.createAccount")}</h1>
              <input
                type="text"
                placeholder={t("auth.firstName")}
                name="firstName"
                onChange={handleChange}
                value={data.firstName}
                required
                className={styles.input}
              />
              <input
                type="text"
                placeholder={t("auth.lastName")}
                name="lastName"
                onChange={handleChange}
                value={data.lastName}
                required
                className={styles.input}
              />
              <select
                name="gender"
                onChange={handleChange}
                value={data.gender}
                required
                className={styles.input}
              >
                <option value="">{t("auth.selectGender")}</option>
                <option value="Male">{t("auth.male")}</option>
                <option value="Female">{t("auth.female")}</option>
                <option value="Others">{t("auth.other")}</option>
              </select>
              <input
                type="number"
                placeholder={t("auth.age")}
                name="age"
                onChange={handleChange}
                value={data.age}
                required
                className={styles.input}
              />
              <input
                type="tel"
                placeholder={t("auth.mobile")}
                name="mobile"
                onChange={handleChange}
                value={data.mobile}
                required
                className={styles.input}
              />
              <input
                type="email"
                placeholder={t("auth.email")}
                name="email"
                onChange={handleChange}
                value={data.email}
                required
                className={styles.input}
              />
              <input
                type="password"
                placeholder={t("auth.password")}
                name="password"
                onChange={handleChange}
                value={data.password}
                required
                className={styles.input}
              />
              {error && <div className={styles.error_msg}>{error}</div>}
              {msg && <div className={styles.success_msg}>{msg}</div>}
              <button type="submit" className={styles.green_btn}>
                {t("auth.signUp")}
              </button>
            </form>
          </div>
        </div>
      </div>
      
    </>
  );
};

export default Signup;
