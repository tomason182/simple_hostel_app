import { useEffect, useState } from "react";
import styles from "./defaultFormStyle.module.css";
import PropTypes from "prop-types";

export default function RoomSelectionForm({
  selectedRooms,
  setReservationFormData,
  availability,
  setIndex,
}) {
  const [isDisabled, setIsDisable] = useState(true);

  useEffect(() => {
    let hasBedAssigned = false;

    selectedRooms.forEach(room => {
      if (room.value > 0) {
        hasBedAssigned = true;
      }
    });

    setIsDisable(!hasBedAssigned);
  }, [selectedRooms]);

  function handleRoomSelection(e) {
    const { name, value, dataset } = e.target;
    setReservationFormData(prev => {
      let selectedRooms = [...prev.selectedRooms];
      const findRoom = selectedRooms.find(room => room.id === name);

      if (findRoom) {
        selectedRooms = prev.selectedRooms.filter(room => room.id != name);
      }

      const selectedRoom = {
        id: name,
        value: value,
        totalPrice: dataset.price * value,
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
          {a.avgRate} {availability?.currencies.base_currency}/
          {a.type === "dorm" ? "pers" : "room"}
        </td>
        <td>
          <select
            name={a.id}
            id={a.id}
            data-price={a.avgRate}
            onChange={handleRoomSelection}
          >
            {Array.from({ length: a.availability + 1 }, (_, i) => (
              <option key={`${a.id}-${i}`}>{i}</option>
            ))}
          </select>
        </td>
      </tr>
    ));
  return (
    <>
      <table className={styles.roomSelectTable}>
        <caption>Select Rooms</caption>
        <thead>
          <tr>
            <th scope="col">Room type</th>
            <th scope="col">Number of Guest</th>
            <th scope="col">Price for {availability.totalNights} nights</th>
            <th scope="col">Select rooms</th>
          </tr>
        </thead>
        <tbody>
          {roomList.length === 0 ? (
            <tr style={{ height: "150px" }}>
              <th colSpan={4} style={{ textAlign: "center", fontSize: "16px" }}>
                No rooms available for the selected days
              </th>
            </tr>
          ) : (
            roomList
          )}
        </tbody>
      </table>
      <div className={styles.buttonGroup}>
        <button className={styles.cancelButton} onClick={() => setIndex(0)}>
          Back
        </button>
        <button className={styles.submitButton} disabled={isDisabled}>
          Continue
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
