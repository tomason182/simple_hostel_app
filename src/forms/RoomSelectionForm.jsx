import styles from "./defaultFormStyle.module.css";
import PropTypes from "prop-types";

export default function RoomSelectionForm({
  setReservationFormData,
  availability,
  setIndex,
}) {
  function handleRoomSelection(e) {
    const { name, value } = e.target;
    setReservationFormData(prev => {
      let selectedRooms = [...prev.selectedRooms];
      const findRoom = selectedRooms.find(room => room.id === name);

      if (findRoom) {
        selectedRooms = prev.selectedRooms.filter(room => room.id != name);
      }

      const selectedRoom = {
        id: name,
        value: value,
        totalPrice: 45,
      };

      selectedRooms.push(selectedRoom);
      return {
        ...prev,
        selectedRooms: selectedRooms,
      };
    });
  }

  const roomList = availability
    .filter(a => a.availability > 0)
    .map(a => (
      <tr key={a.id}>
        <th>{a.description}</th>
        <td>{a.type}</td>
        <td>
          <select name={a.id} id={a.id} onChange={handleRoomSelection}>
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
            <th scope="col">Type</th>
            <th scope="col">Select rooms</th>
          </tr>
        </thead>
        <tbody>
          {roomList.length === 0 ? (
            <tr style={{ height: "150px" }}>
              <th colSpan={3} style={{ textAlign: "center", fontSize: "16px" }}>
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
        <button
          className={styles.submitButton}
          disabled={roomList.length === 0}
        >
          Continue
        </button>
      </div>
    </>
  );
}

RoomSelectionForm.propTypes = {
  setReservationFormData: PropTypes.func,
  availability: PropTypes.object,
  setIndex: PropTypes.func,
};
