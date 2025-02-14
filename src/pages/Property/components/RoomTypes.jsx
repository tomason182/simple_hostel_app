import styles from "./RoomTypes.module.css";
import { useState } from "react";
import { useContext } from "react";
import { RoomTypeContext } from "../../../data_providers/RoomTypesDataProvider";
import Button from "../../../components/Button/Button";
import Spinner from "../../../components/Spinner/Spinner";
import Card from "../../../components/Card/Card";
import Modal from "../../../components/Modal/Modal";
import RoomTypeForm from "../../../forms/RoomTypeForm";

export default function RoomTypes() {
  const { roomTypesData, isLoading, error } = useContext(RoomTypeContext);

  const [isOpen, setIsOpen] = useState(false);

  if (isLoading) return <Spinner />;

  const customStyle = {
    actions: {
      display: "flex",
      justifyContent: "space-between",
    },
  };

  const actions = [
    {
      onClick: () => alert("Room Type deleted!"),
      label: (
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
      ),
    },
    {
      onClick: () => setIsOpen(true),
      label: (
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
      ),
    },
  ];

  return (
    <>
      <Button title="Create room type" onClick={() => setIsOpen(true)} />
      <div style={{ display: "flex", gap: "1rem", padding: "1rem" }}>
        {roomTypesData.length === 0 ? (
          <p>No room types found. Please create a room type</p>
        ) : (
          roomTypesData.map(room => (
            <Card
              key={room.id}
              title={room.description}
              actions={actions}
              customStyle={customStyle}
            >
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
            </Card>
          ))
        )}
      </div>
      <Modal isOpen={isOpen} onClose={() => setIsOpen(false)}>
        <RoomTypeForm />
      </Modal>
    </>
  );
}
