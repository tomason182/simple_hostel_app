import styles from "./Users.module.css";
import { useEffect, useState } from "react";
import Spinner from "../../../components/Spinner/Spinner";
import Button from "../../../components/Button/Button";
import UserForm from "../../../forms/UserForm";
import Modal from "../../../components/Modal/Modal";
export default function Users() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
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

  console.log(userData);

  useEffect(() => {
    const usersData = [
      {
        id: 1,
        username: "tomas@mail.com",
        first_name: "Tomas",
        last_name: "Rivero",
        role: "admin",
      },
      {
        id: 2,
        username: "silveti@mail.com",
        first_name: "Silvia",
        last_name: "Veti",
        role: "manager",
      },
    ];
    setUsers(usersData);
    setLoading(false);
  }, [setUsers]);

  function editUser(id) {
    const selectedUser = users.find(user => user.id === id);
    if (selectedUser) {
      setUserData({ ...selectedUser });
    }
  }

  if (loading) return <Spinner />;

  const userList = users.map(user => (
    <li key={user.id}>
      <h3>{`${user.first_name} ${user.last_name}`}</h3>
      <p>{user.username}</p>
      <span>{user.role}</span>
      <div className={styles.buttonContainer}>
        <button className={styles.deleteBtn}>
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
      <Modal isOpen={isOpen} onClose={() => setIsOpen(false)}>
        <UserForm user={userData} />
      </Modal>
    </div>
  );
}
