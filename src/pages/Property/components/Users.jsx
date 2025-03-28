import styles from "./Users.module.css";
import { useState } from "react";
import Spinner from "../../../components/Spinner/Spinner";
import Button from "../../../components/Button/Button";
import UserForm from "../../../forms/UserForm";
import Modal from "../../../components/Modal/Modal";
import PropTypes from "prop-types";

// Fetch team members
import useUsersDataProvider from "../../../data_providers/UsersDataProvider";

export default function Users() {
  // Modal States
  const [isOpen, setIsOpen] = useState(false);
  // Form Data state
  const [userData, setUserData] = useState({
    id: "",
    username: "",
    first_name: "",
    last_name: "",
    role: "",
  });

  const { users, loading, usersError, refreshUsersData } =
    useUsersDataProvider();

  function editUser(id) {
    const selectedUser = users.find(user => user.id === id);
    if (selectedUser) {
      setUserData({
        id: selectedUser.id || "",
        username: selectedUser.username || "",
        first_name: selectedUser.first_name || "",
        last_name: selectedUser.last_name || "",
        role: selectedUser.role || "",
      });
    }
  }

  function resetState() {
    setUserData({
      id: "",
      username: "",
      first_name: "",
      last_name: "",
      role: "",
    });
  }

  function deleteUser(id) {
    const url = import.meta.env.VITE_URL_BASE + "/users/profile/delete/" + id;
    const options = {
      mode: "cors",
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include",
    };

    fetch(url, options)
      .then(async response => {
        if (response.status >= 400) {
          const error = await response.json();
          throw new Error(error.msg || "Server Error");
        }
        return response.json();
      })
      .then(() => alert("User deleted successfully"))
      .catch(e => {
        console.error(e);
        alert(`Unable to delete user. ${e.message}`);
      })
      .finally(() => refreshUsersData());
  }

  if (loading) return <Spinner />;

  if (usersError) return <div>Network Error</div>;

  const userList = users.map(user => (
    <li key={user.id}>
      <h3>{`${user.first_name} ${
        user.last_name === null ? "" : user.last_name
      }`}</h3>
      <p>{user.username}</p>
      <span>{user.role}</span>
      <div className={styles.buttonContainer}>
        <button
          className={styles.deleteBtn}
          onClick={() => deleteUser(user.id)}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="#000000"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <line x1="18" y1="6" x2="6" y2="18"></line>
            <line x1="6" y1="6" x2="18" y2="18"></line>
          </svg>
        </button>
        <button
          className={styles.editBtn}
          onClick={() => {
            editUser(user.id);
            setIsOpen(true);
          }}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="#000000"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <polygon points="14 2 18 6 7 17 3 17 3 13 14 2"></polygon>
            <line x1="3" y1="22" x2="21" y2="22"></line>
          </svg>
        </button>
      </div>
    </li>
  ));

  return (
    <div>
      <Button title="Create User" onClick={() => setIsOpen(true)} />
      <ul className={styles.list}>{userList}</ul>
      <Modal
        isOpen={isOpen}
        onClose={() => {
          setIsOpen(false);
          resetState();
        }}
      >
        <UserForm
          user={userData}
          setIsOpen={setIsOpen}
          refreshUsersData={refreshUsersData}
        />
      </Modal>
    </div>
  );
}

Users.propTypes = {
  users: PropTypes.object.isRequired,
  loading: PropTypes.bool.isRequired,
};
