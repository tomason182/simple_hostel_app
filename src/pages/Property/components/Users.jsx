import styles from "./Users.module.css";
import { useState } from "react";
import Spinner from "../../../components/Spinner/Spinner";
import UserForm from "../../../forms/UserForm";
import Modal from "../../../components/Modal/Modal";
import PropTypes from "prop-types";
import Button from "../../../components/Button/Button";

import { useTranslation } from "react-i18next";

// Fetch team members
import useUsersDataProvider from "../../../data_providers/UsersDataProvider";
import { useToast } from "../../../hooks/useToast";

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
  const [loadingDelete, setLoadingDelete] = useState(false);

  const { users, loading, usersError, refreshUsersData } =
    useUsersDataProvider();

  const { t } = useTranslation();
  const { addToast } = useToast();

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
    setLoadingDelete(true);
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
          console.log("Error: ", error);
          throw new Error(error.msg || "UNEXPECTED_ERROR");
        }
        addToast({
          message: t("USER_DELETED", { ns: "validation" }),
          type: "success",
        });
      })
      .catch(e =>
        addToast({ message: t(e.message, { ns: "validation" }), type: "error" })
      )
      .finally(() => {
        refreshUsersData();
        setLoadingDelete(false);
      });
  }

  if (loading) return <Spinner />;

  if (usersError)
    return (
      <div>
        <p>{t("unexpected_error_message")}</p>
      </div>
    );

  const userList = users.map(user => {
    let role = "";

    switch (user.role) {
      case "admin":
        role = "Admin";
        break;
      case "manager":
        role = t("manager");
        break;
      case "employee":
        role = t("employee");
        break;
      default:
        role = t("employee");
    }
    return (
      <li key={user.id} className={styles.userElement}>
        <h3>{`${user.first_name} ${
          user.last_name === null ? "" : user.last_name
        }`}</h3>
        <p>{user.username}</p>
        <span>{role}</span>
        <div className={styles.buttonContainer}>
          <button
            className={styles.deleteBtn}
            onClick={() => deleteUser(user.id)}
            disabled={loadingDelete}
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
    );
  });

  return (
    <>
      <Button title={t("create")} onClick={() => setIsOpen(true)} />
      <ul className={styles.list}>{userList}</ul>
      <Modal
        isOpen={isOpen}
        onClose={() => {
          setIsOpen(false);
          resetState();
        }}
        header={userData.id === "" ? t("create_user") : t("edit_user")}
      >
        <UserForm
          user={userData}
          setIsOpen={setIsOpen}
          refreshUsersData={refreshUsersData}
          resetState={resetState}
        />
      </Modal>
    </>
  );
}

Users.propTypes = {
  users: PropTypes.object.isRequired,
  loading: PropTypes.bool.isRequired,
};
