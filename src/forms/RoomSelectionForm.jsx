import { useEffect, useState } from "react";
import styles from "./defaultFormStyle.module.css";
import PropTypes from "prop-types";
import { useTranslation } from "react-i18next";

export default function RoomSelectionForm({
  selectedRooms,
  setReservationFormData,
  availability,
  setIndex,
}) {
  const [isDisabled, setIsDisable] = useState(true);

  const { t } = useTranslation();

  useEffect(() => {
    let hasBedAssigned = false;

    selectedRooms.forEach(room => {
      if (room.number_of_rooms > 0) {
        hasBedAssigned = true;
      }
    });

    setIsDisable(!hasBedAssigned);
  }, [selectedRooms]);

  function handleRoomSelection(e) {
    const { name, value, dataset } = e.target;
    setReservationFormData(prev => {
      let selectedRooms = [...prev.selectedRooms];
      const findRoom = selectedRooms.find(room => room.room_type_id === name);

      if (findRoom) {
        selectedRooms = prev.selectedRooms.filter(
          room => room.room_type_id != name
        );
      }

      const selectedRoom = {
        room_type_id: parseInt(name),
        number_of_rooms: parseInt(value),
        total_amount: dataset.price * value,
      };

      selectedRooms.push(selectedRoom);
      return {
        ...prev,
        selectedRooms: selectedRooms,
      };
    });
  }

  const roomList = availability.roomList
    .filter(a => a.availability > 0)
    .map(a => (
      <tr key={a.id}>
        <th>{a.description}</th>
        <td style={{ textAlign: "center" }}>
          {a.type === "dorm" ? 1 : a.max_occupancy}
        </td>
        <td style={{ textAlign: "center" }}>
          {a.totalRate} {availability?.currencies.base_currency}/
          {a.type === "dorm" ? "pers" : "room"}
        </td>
        <td>
          <select
            name={a.id}
            id={a.id}
            data-price={a.totalRate}
            onChange={handleRoomSelection}
          >
            {Array.from({ length: a.availability + 1 }, (_, i) => (
              <option key={`${a.id}-${i}`} value={i}>
                {i}
              </option>
            ))}
          </select>
        </td>
      </tr>
    ));
  return (
    <>
      <table className={styles.roomSelectTable}>
        <caption>{t("select_rooms")}</caption>
        <thead>
          <tr>
            <th scope="col">{t("room_type")}</th>
            <th scope="col">{t("guests")}</th>
            <th scope="col">
              {t("price_for")} {t("night", { count: availability.totalNights })}
            </th>
            <th scope="col">{t("select_beds")}</th>
          </tr>
        </thead>
        <tbody>
          {roomList.length === 0 ? (
            <tr style={{ height: "150px" }}>
              <th colSpan={4} style={{ textAlign: "center", fontSize: "16px" }}>
                {t("no_room_msg")}
              </th>
            </tr>
          ) : (
            roomList
          )}
        </tbody>
      </table>
      <br />
      <div className={styles.buttonGroup}>
        <button className={styles.cancelButton} onClick={() => setIndex(0)}>
          {t("back")}
        </button>
        <button
          className={styles.submitButton}
          disabled={isDisabled}
          onClick={() => setIndex(2)}
        >
          {t("continue")}
        </button>
      </div>
    </>
  );
}

RoomSelectionForm.propTypes = {
  selectedRooms: PropTypes.array,
  setReservationFormData: PropTypes.func,
  availability: PropTypes.object,
  setIndex: PropTypes.func,
};
