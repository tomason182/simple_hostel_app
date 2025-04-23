import SetPasswordForm from "../../forms/SetPasswordForm";
import styles from "./EmailVerified.module.css";
import { useState } from "react";
import { useParams } from "react-router";
import { jwtDecode } from "jwt-decode";
import { useNavigate } from "react-router";
export default function NewUser() {
  const [formData, setFromData] = useState({
    password: "",
    confirmPassword: "",
    token: "",
  });
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const { token } = useParams();
  const propertyName = jwtDecode(token).propertyName;

  function handleFormSubmit(e) {
    e.preventDefault();

    const url = import.meta.env.VITE_URL_BASE;
  }

  return (
    <div className={styles.mainContent}>
      <h1>Welcome to Simple Hostel</h1>
      <h3>{propertyName} has invite you to join their team</h3>
      <p className={styles.text}>
        To get started, please create a password for your account.
      </p>
      <SetPasswordForm />
    </div>
  );
}
