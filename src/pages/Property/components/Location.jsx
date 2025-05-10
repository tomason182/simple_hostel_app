import { useTranslation } from "react-i18next";
import styles from "./Location.module.css";
import { useState, useCallback, useEffect } from "react";
import Spinner from "../../../components/Spinner/Spinner";
import { MapContainer, TileLayer, Marker, useMapEvents } from "react-leaflet";
import PropTypes from "prop-types";

const EditIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="18"
    height="18"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.5"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M17 3a2.828 2.828 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5L17 3z"></path>
  </svg>
);

function EditableField({
  labelKey,
  value,
  isEditing,
  onToggleEdit,
  onChange,
  fieldName,
}) {
  const { t } = useTranslation();

  return (
    <li>
      <span>{t(labelKey)}:</span>
      <div className={styles.valueContainer}>
        {isEditing ? (
          <input
            type="text"
            value={value || ""}
            onChange={e => onChange(fieldName, e.target.value)}
            className={styles.editInput}
            autoFocus
          />
        ) : (
          <span>{value || t("not_available")}</span>
        )}
        <button
          type="button"
          onClick={() => onToggleEdit(fieldName)}
          className={styles.editButton}
          aria-label={`${isEditing ? t("save") : t("edit")} ${t(labelKey)}`}
        >
          <EditIcon />
        </button>
      </div>
    </li>
  );
}

function MapEventsComponent({ onMapClick }) {
  useMapEvents({
    click: e => {
      onMapClick(e);
    },
  });

  return null;
}

const initialLocationState = {
  country: "",
  country_code: "",
  state: "",
  city: "",
  postal_code: "",
  street: "",
  house_number: "",
  lat: "",
  lon: "",
  osm_id: "",
  osm_type: "",
};

export default function Location() {
  const [initialCenter, setInitialCenter] = useState([20, 0]);
  const [mapZoom, setMapZoom] = useState(2);
  const [userLocationDenied, setUserLocationDenied] = useState(false);
  const [location, setLocation] = useState(initialLocationState);
  const [marker, setMarker] = useState(null);
  const [loadingLocation, setLoadingLocation] = useState(false);
  const [errorLocation, setErrorLocation] = useState(null);
  const { t, i18n } = useTranslation();

  const [editingFields, setEditingFields] = useState({
    postal_code: false,
    street: false,
    house_number: false,
  });

  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        position => {
          const { latitude, longitude } = position.coords;
          console.log("User Location obtained: ", latitude, longitude);
          setInitialCenter([latitude, longitude]);
          setMapZoom(13);

          // Opcional: Si quieres que el primer marcador y los detalles se carguen automáticamente:
          // setMarker({ lat: latitude, lng: longitude });
          // handleMapClick({ latlng: { lat: latitude, lng: longitude } }); // Reutiliza tu lógica de clic
        },
        error => {
          console.warn(`Error(${error.code}): ${error.message}`);
          if (error.code === error.PERMISSION_DENIED) {
            setUserLocationDenied(true);
          }
          // Aquí podrías considerar una alternativa como la geolocalización por IP
        },
        {
          enableHighAccuracy: true, // Intenta obtener la ubicación más precisa
          timeout: 10000, // Tiempo máximo para obtener la ubicación (10 segundos)
          maximumAge: 0, // No usar una ubicación en caché
        }
      );
    } else {
      console.log("Geolocation is not supported by this browser.");
      // Navegador no soporta geolocalización, mantenemos el centro y zoom por defecto.
      // Aquí podrías considerar una alternativa como la geolocalización por IP
    }
  }, []);

  const language = i18n.resolvedLanguage || "en";

  function handleToggleEdit(fieldName) {
    setEditingFields(prev => ({
      ...prev,
      [fieldName]: !prev[fieldName],
    }));
  }

  function handleInputChange(fieldName, value) {
    setLoadingLocation(prev => ({
      ...prev,
      [fieldName]: value,
    }));
  }

  const handleMapClick = useCallback(
    async event => {
      const { lat, lng } = event.latlng;
      setMarker({ lat, lng });

      const url =
        import.meta.env.VITE_URL_BASE +
        "/data-provider/location-search/" +
        `lat/${lat}/lng/${lng}/lang/${language}`;

      setLoadingLocation(true);
      setErrorLocation(null);

      setEditingFields({
        postal_code: false,
        street: false,
        house_number: false,
      });

      try {
        const response = await fetch(url, { mode: "cors" });

        if (response.status === 500) {
          throw new Error("API_ERROR_500");
        }

        if (!response.ok) {
          const errorData = await response
            .json()
            .catch(() => ({ msg: "UNEXPECTED_ERROR" }));
          throw new Error(errorData.msg || "UNEXPECTED_ERROR");
        }

        const data = await response.json();
        const address = data?.address;

        if (!address) {
          throw new Error("ADDRESS_NOT_FOUND");
        }

        setLocation({
          country: address.country || "",
          country_code: address.country_code || "",
          state: address.state || "",
          city:
            address.city ||
            address.town ||
            address.village ||
            address.municipality ||
            "",
          postal_code: address.postcode || "",
          street: address.road || "",
          house_number: address.house_number || "",
          lat: data.lat || "",
          lon: data.lon || "",
          osm_id: data.osm_id || "",
          osm_type: data.osm_type || "",
        });
      } catch (err) {
        console.error("Error fetching location", err);
        setErrorLocation(err.message);
      } finally {
        setLoadingLocation(false);
      }
    },
    [
      language,
      setLocation,
      setMarker,
      setLoadingLocation,
      setErrorLocation,
      setEditingFields,
    ]
  );

  function handleSaveLocation() {
    console.log("Saving location: ", location);
    alert("location saved");
    setEditingFields({
      postal_code: false,
      street: false,
      house_number: false,
    });
  }

  return (
    <div className={styles.container}>
      <h1>{t("property_location")}</h1>
      <div className={styles.subContainer}>
        <div className={styles.locationDetails}>
          {loadingLocation ? (
            <Spinner />
          ) : errorLocation ? (
            <div className={styles.errorBanner}>
              <p>{t(errorLocation)}</p>
              <button onClick={() => setErrorLocation(null)}>
                {t("dismiss")}
              </button>
            </div>
          ) : (
            <>
              <ul>
                <li>
                  <span>{t("city")}:</span>
                  <span>{location.city || t("not_available")}</span>
                </li>
                <li>
                  <span>{t("state")}:</span>
                  <span>{location.state || t("not_available")}</span>
                </li>
                <li>
                  <span>{t("country")}:</span>
                  <span>{location.country || t("not_available")}</span>
                </li>
                <EditableField
                  labelKey="postal_code"
                  value={location.postal_code}
                  isEditing={editingFields.postal_code}
                  onToggleEdit={handleToggleEdit}
                  onChange={handleInputChange}
                  fieldName="postal_code"
                />
                <EditableField
                  labelKey="street"
                  value={location.street}
                  isEditing={editingFields.street}
                  onToggleEdit={handleToggleEdit}
                  onChange={handleInputChange}
                  fieldName="street"
                />
                <EditableField
                  labelKey="house_number"
                  value={location.house_number}
                  isEditing={editingFields.house_number}
                  onToggleEdit={handleToggleEdit}
                  onChange={handleInputChange}
                  fieldName="house_number"
                />
              </ul>
              <button
                className={styles.saveButton}
                onClick={handleSaveLocation}
              >
                {t("save")}
              </button>
            </>
          )}
        </div>

        <div id="map" className={styles.mapContainer}>
          <MapContainer
            key={`${initialCenter[0]}-${initialCenter[1]}`}
            center={marker?.lat ? [marker.lat, marker.lng] : initialCenter}
            zoom={marker ? 16 : mapZoom}
            scrollWheelZoom={true}
            style={{ height: "100%", width: "100%" }}
          >
            <TileLayer
              attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />
            <MapEventsComponent onMapClick={handleMapClick} />
            {marker && <Marker position={[marker.lat, marker.lng]} />}
          </MapContainer>
        </div>
      </div>
    </div>
  );
}

MapEventsComponent.propTypes = {
  onMapClick: PropTypes.func.isRequired,
};

EditableField.propTypes = {
  labelKey: PropTypes.string.isRequired,
  value: PropTypes.string.isRequired,
  isEditing: PropTypes.bool.isRequired,
  onToggleEdit: PropTypes.func.isRequired,
  onChange: PropTypes.func.isRequired,
  fieldName: PropTypes.string.isRequired,
};
