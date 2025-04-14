import { useState, useEffect } from "react";
import styles from "./Amenities.module.css";
import Spinner from "../../../components/Spinner/Spinner.jsx";
import { useTranslation } from "react-i18next";
import PropTypes from "prop-types";

export default function Amenities({
  roomTypes,
  loadingRoomTypes,
  errorRoomTypes,
  refreshRoomTypeData,
}) {
  const [amenities, setAmenities] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [loadingForm, setLoadingForm] = useState(false);

  const [formData, setFromData] = useState({
    room_id: "",
    amenities: [],
  });

  const { t, i18n } = useTranslation();
  const lng = i18n.resolvedLanguage;

  useEffect(() => {
    const language = lng || navigator.language || "en";
    const url =
      import.meta.env.VITE_URL_BASE + "/data-provider/amenities/" + language;
    const options = {
      mode: "cors",
      method: "GET",
      headers: {
        Content_type: "application/json",
      },
      credentials: "include",
    };

    setLoading(true);
    setError(null);

    fetch(url, options)
      .then(response => {
        if (response.status >= 400) {
          throw new Error("Server Error");
        }
        return response.json();
      })
      .then(data => setAmenities(data))
      .catch(err => setError(err.message))
      .finally(() => setLoading(false));
  }, [lng]);

  function handleChange(e) {
    const { name, value } = e.target;

    if (name === "room_id") {
      if (value === "") {
        setFromData({
          room_id: "",
          amenities: [],
        });
      }
      const selectedRoom = parseInt(value);
      const roomType = roomTypes.find(room => room.id === selectedRoom);
      setFromData({
        room_id: selectedRoom,
        amenities: roomType.amenities,
      });
      return;
    }

    if (name === "amenity") {
      const selectedAmenity = parseInt(value);
      if (formData.room_id === "") {
        alert("Please, select a room type first");
        return;
      }

      const isAmenitySelected = formData.amenities.includes(selectedAmenity);

      if (isAmenitySelected === false) {
        setFromData(prev => ({
          ...prev,
          amenities: [...prev.amenities, selectedAmenity],
        }));
      } else {
        setFromData(prev => ({
          ...prev,
          amenities: prev.amenities.filter(item => item !== selectedAmenity),
        }));
      }
    }
  }

  function handleSubmit(e) {
    e.preventDefault();

    const roomId = formData.room_id;

    if (roomId === "") {
      alert("Please, select a room first");
    }

    setLoadingForm(true);

    const url =
      import.meta.env.VITE_URL_BASE + "/room-types/amenities/" + roomId;
    const options = {
      mode: "cors",
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include",
      body: JSON.stringify(formData),
    };
    fetch(url, options)
      .then(response => {
        if (response.status >= 400) {
          throw new Error("Server Error");
        }
        return response.json();
      })
      .then(data => {
        if (data.status === "ok") {
          alert("Amenities updated successfully");
          refreshRoomTypeData();
          return;
        }
        alert("Unable to update amenities");
      })
      .catch(err => alert(`Unable to update amenities: ${err.message}`))
      .finally(() => setLoadingForm(false));
  }

  if (loading && loadingRoomTypes && loadingForm) return <Spinner />;
  if (error || errorRoomTypes) return <div>{error}</div>;

  const roomTypeList = roomTypes.map(room => (
    <option key={room.id} value={room.id}>
      {room.description}
    </option>
  ));

  const amenitiesInput = amenities.map(amenity => (
    <label key={amenity.id}>
      {amenity.name}
      <input
        type="checkbox"
        name="amenity"
        value={amenity.amenity_id}
        checked={formData.amenities.includes(amenity.amenity_id)}
        onChange={handleChange}
      />
    </label>
  ));
  return (
    <div>
      <div>
        <select name="room_id" onChange={handleChange}>
          <option value="">{t("select_one")}</option>
          {roomTypeList}
        </select>
      </div>
      <div>
        <form className={styles.amenitiesForm} onSubmit={handleSubmit}>
          <fieldset>
            <legend>Amenities</legend>
            {amenitiesInput}
          </fieldset>
          <button disabled={formData.room_id === ""}>{t("save")}</button>
        </form>
      </div>
    </div>
  );
}

Amenities.propTypes = {
  roomTypes: PropTypes.array.isRequired,
  loadingRoomTypes: PropTypes.bool.isRequired,
  errorRoomTypes: PropTypes.string,
  refreshRoomTypeData: PropTypes.func.isRequired,
};
