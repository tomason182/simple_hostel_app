import styles from "./RoomTypes.module.css";
import { useState } from "react";
import PropTypes from "prop-types";

import Button from "../../../components/Button/Button";
import Spinner from "../../../components/Spinner/Spinner";
import Modal from "../../../components/Modal/Modal";
import RoomTypeForm from "../../../forms/RoomTypeForm";

import { useTranslation } from "react-i18next";
import { useToast } from "../../../hooks/useToast";

export default function RoomTypes({
  roomTypes,
  isLoading,
  error,
  refreshRoomTypeData,
}) {
  const [roomToEdit, setRoomToEdit] = useState({
    id: 0,
    description: "",
    type: "private",
    gender: "mixed",
    max_occupancy: 0,
    inventory: 0,
  });

  const [isOpen, setIsOpen] = useState(false);
  const [loadingDelete, setLoadingDelete] = useState(false);

  const { t } = useTranslation();
  const { addToast } = useToast();

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

  async function deleteRoomType(id) {
    try {
      setLoadingDelete(true);
      const url = import.meta.env.VITE_URL_BASE + "/room-types/delete/" + id;
      const options = {
        mode: "cors",
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
      };

      const response = await fetch(url, options);

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.msg || "UNEXPECTED_ERROR");
      }

      addToast({
        message: t("ROOM_TYPE_DELETED", { ns: "validation" }),
        type: "success",
      });
      refreshRoomTypeData();
    } catch (e) {
      addToast({ message: t(e.message, { ns: "validation" }), type: "error" });
    } finally {
      setLoadingDelete(false);
    }
  }

  if (isLoading) return <Spinner />;

  if (error) return <p>{t("unexpected_error_message")}</p>;
  return (
    <>
      <Button title={t("create")} onClick={() => setIsOpen(true)} />
      <div style={{ display: "flex", gap: "1rem", padding: "1rem" }}>
        {roomTypes.length === 0 ? (
          <p className={styles.noRooms}>{t("no_room_types_message")}</p>
        ) : (
          roomTypes.map(room => {
            let type = "";
            let gender = "";
            switch (room.type) {
              case "dorm":
                type = t("dorm");
                break;
              case "private":
                type = t("private");
            }

            switch (room.gender) {
              case "mixed":
                gender = t("mixed");
                break;
              case "female":
                gender = t("female");
            }

            return (
              <div key={room.id} className={styles.roomContainer}>
                <h4>{room.description}</h4>
                <dl className={styles.list}>
                  <dt>{t("type")}</dt>
                  <dd>{type}</dd>
                  <dt>{t("gender")}</dt>
                  <dd>{gender}</dd>
                  <dt>{t("max_occupancy")}</dt>
                  <dd>{room.max_occupancy}</dd>
                  <dt>{t("inventory")}</dt>
                  <dd>{room.inventory}</dd>
                </dl>
                <div className={styles.buttonContainer}>
                  <button
                    className={styles.deleteBtn}
                    onClick={() => {
                      deleteRoomType(room.id);
                      refreshRoomTypeData();
                    }}
                    disabled={loadingDelete}
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
            );
          })
        )}
      </div>

      <Modal
        isOpen={isOpen}
        onClose={() => {
          setIsOpen(false);
          resetState();
        }}
        header={
          roomToEdit.id === 0 ? t("create_new_room_type") : t("edit_room_type")
        }
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

RoomTypes.propTypes = {
  roomTypes: PropTypes.array.isRequired,
  isLoading: PropTypes.bool.isRequired,
  error: PropTypes.string,
  refreshRoomTypeData: PropTypes.func.isRequired,
};
