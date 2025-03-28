import styles from "./RoomTypes.module.css";
import { useContext, useState } from "react";
import { RoomTypeContext } from "../../../data_providers/RoomTypesDataProvider";
import Button from "../../../components/Button/Button";
import Spinner from "../../../components/Spinner/Spinner";
import Modal from "../../../components/Modal/Modal";
import RoomTypeForm from "../../../forms/RoomTypeForm";

export default function RoomTypes() {
  const { roomTypes, isLoading, error, refreshRoomTypeData } =
    useContext(RoomTypeContext);
  const [roomToEdit, setRoomToEdit] = useState({
    id: 0,
    description: "",
    type: "private",
    gender: "mixed",
    max_occupancy: 0,
    inventory: 0,
  });

  const [isOpen, setIsOpen] = useState(false);

  function handleRoomToEdit(roomId) {
    const roomType = roomTypes.find(room => room.id === roomId);

    if (roomType !== undefined) {
      setRoomToEdit({
        id: roomType.id,
        description: roomType.description,
        type: roomType.type,
        gender: roomType.gender,
        max_occupancy: roomType.max_occupancy,
        inventory: roomType.inventory,
      });
    }
  }

  function resetState() {
    setRoomToEdit({
      id: 0,
      description: "",
      type: "private",
      gender: "mixed",
      max_occupancy: 0,
      inventory: 0,
    });
  }

  function deleteRoomType(id) {
    const url = import.meta.env.VITE_URL_BASE + "/room-types/delete/" + id;
    const options = {
      mode: "cors",
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include",
    };

    fetch(url, options)
      .then(response => {
        if (response.status >= 400) {
          throw new Error("Server Error");
        }
        return response.json();
      })
      .then(data => {
        if (data.status === "error") {
          alert(data.msg);
        } else {
          alert("Room type deleted successfully");
          refreshRoomTypeData();
        }
      })
      .catch(e => console.error(e.message));
  }

  if (isLoading) return <Spinner />;

  if (error) return <p>Server Error. Please, try again</p>;
  return (
    <>
      <Button title="Create room type" onClick={() => setIsOpen(true)} />
      <div style={{ display: "flex", gap: "1rem", padding: "1rem" }}>
        {roomTypes.length === 0 ? (
          <p>No room types found. Please create a room type</p>
        ) : (
          roomTypes.map(room => (
            <div key={room.id} className={styles.roomContainer}>
              <h4>{room.description}</h4>
              <dl className={styles.list}>
                <dt>Type</dt>
                <dd>{room.type}</dd>
                <dt>Gender</dt>
                <dd>{room.gender}</dd>
                <dt>Max occupancy</dt>
                <dd>{room.max_occupancy}</dd>
                <dt>Inventory</dt>
                <dd>{room.inventory}</dd>
              </dl>
              <div className={styles.buttonContainer}>
                <button
                  className={styles.deleteBtn}
                  onClick={() => {
                    deleteRoomType(room.id);
                    refreshRoomTypeData();
                  }}
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="20"
                    height="20"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="#000000"
                    strokeWidth="1"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <polyline points="3 6 5 6 21 6"></polyline>
                    <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
                    <line x1="10" y1="11" x2="10" y2="17"></line>
                    <line x1="14" y1="11" x2="14" y2="17"></line>
                  </svg>
                </button>
                <button
                  className={styles.editBtn}
                  onClick={() => {
                    setIsOpen(true);
                    handleRoomToEdit(room.id);
                  }}
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="20"
                    height="20"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="#000000"
                    strokeWidth="1"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <polygon points="14 2 18 6 7 17 3 17 3 13 14 2"></polygon>
                    <line x1="3" y1="22" x2="21" y2="22"></line>
                  </svg>
                </button>
              </div>
            </div>
          ))
        )}
      </div>

      <Modal
        isOpen={isOpen}
        onClose={() => {
          setIsOpen(false);
          resetState();
        }}
      >
        <RoomTypeForm
          roomData={roomToEdit}
          setIsOpen={setIsOpen}
          resetState={resetState}
          refreshRoomTypeData={refreshRoomTypeData}
        />
      </Modal>
    </>
  );
}
