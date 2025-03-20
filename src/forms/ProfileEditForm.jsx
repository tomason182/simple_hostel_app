import styles from "./defaultFormStyle.module.css";
import { UserProfileContext } from "../data_providers/UserProfileProvider";
import { useContext, useEffect, useState } from "react";
import Spinner from "../components/Spinner/Spinner";

export default function ProfileEditForm() {
  const { userProfile, loading, error, refreshUserProfile } =
    useContext(UserProfileContext);

  const [formData, setFormData] = useState({
    first_name: "",
    last_name: "",
    username: "",
    role: "",
  });
  const [loadingForm, setLoadingForm] = useState(false);

  useEffect(() => {
    function handleFormInitialValues() {
      setFormData({
        first_name: userProfile?.first_name || "",
        last_name: userProfile?.last_name || "",
        username: userProfile?.username || "",
        role: userProfile?.role || "",
      });
    }

    handleFormInitialValues();
  }, [userProfile]);

  function handleFormChange(e) {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value,
    }));
  }

  function handleFormSubmit(e) {
    e.preventDefault();
    setLoadingForm(true);

    const formBody = {
      first_name: formData.first_name,
      lastName: formData.last_name,
    };

    const url = import.meta.env.VITE_URL_BASE + "users/profile";
    const options = {
      mode: "cors",
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include",
      body: JSON.stringify(formBody),
    };

    fetch(url, options)
      .then(response => {
        if (response.status >= 400) {
          throw new Error("Unable to update user profile");
        }
        return response.json();
      })
      .then(() => {
        refreshUserProfile();
        alert("User updated successfully");
      })
      .catch(e => alert(e.message))
      .finally(() => setLoadingForm(false));
  }

  if (loading) return <Spinner />;

  if (error) return <p>Error fetching user profile</p>;

  return (
    <>
      <h3>Profile</h3>
      <form className={styles.userEditForm} onSubmit={handleFormSubmit}>
        <label>
          First Name
          <input
            type="text"
            name="first_name"
            value={formData.first_name}
            onChange={handleFormChange}
          />
        </label>
        <label>
          Last Name
          <input
            type="text"
            name="lastName"
            value={formData.lastName}
            onChange={handleFormChange}
          />
        </label>
        <label>
          Email
          <input
            type="email"
            name="email"
            disabled
            value={formData.email}
            onChange={handleFormChange}
          />
        </label>
        <label>
          Role
          <input
            type="text"
            name="role"
            value={formData.role}
            onChange={handleFormChange}
            disabled
          />
        </label>
        <button type="submit" disabled={loadingForm}>
          Save
        </button>
      </form>
    </>
  );
}
