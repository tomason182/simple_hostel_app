import { useTranslation } from "react-i18next";
import styles from "./Location.module.css";
import { useState, useEffect } from "react";
import { MapContainer, TileLayer, Marker, useMapEvents } from "react-leaflet";
import Modal from "../../../components/Modal/Modal";
import LocationForm from "../../../forms/LocationForm";
import PropTypes from "prop-types";

const initialLocationState = {
  country: "",
  alpha_2_code: "",
  state: "",
  city: "",
  postal_code: "",
  street: "",
  house_number: "",
  lat: "",
  lon: "",
  osm_id: "",
};

export default function Location({ property }) {
  const [initialCenter, setInitialCenter] = useState([20, 0]);
  const [mapZoom, setMapZoom] = useState(2);
  const [location, setLocation] = useState(initialLocationState);
  const [marker, setMarker] = useState({
    lat: "",
    lon: "",
  });
  const [loadingLocation, setLoadingLocation] = useState(false);
  const [errorLocation, setErrorLocation] = useState(null);
  const [isOpen, setIsOpen] = useState(false);
  const { t, i18n } = useTranslation();

  useEffect(() => {
    if (property.address) {
      const address = property.address;
      setMarker({
        lat: address.lat,
        lon: address.lon,
      });
      setInitialCenter([address.lat || 20, address.lon || 0]);
      setMapZoom(address.lat ? 20 : 2);
    }
  }, []);

  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        position => {
          const { latitude, longitude } = position.coords;
          console.log("User Location obtained: ", latitude, longitude);
          setInitialCenter([latitude, longitude]);
          setMapZoom(13);
          setMarker({ lat: latitude, lon: longitude });
        },
        error => {
          console.warn(`Error(${error.code}): ${error.message}`);

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

  console.log(location);

  function handleChange(e) {
    const { name, value } = e.target;

    setMarker(prev => ({
      ...prev,
      [name]: value,
    }));
  }

  async function handleLocationSearch(event) {
    event.preventDefault();
    try {
      const url = `${
        import.meta.env.VITE_URL_BASE
      }/data-provider/location-search/lat/${marker.lat}/lon/${
        marker.lon
      }/lang/${language}`;

      setLoadingLocation(true);
      setErrorLocation(null);

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
        alpha_2_code: address.country_code || "",
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
        lat: Math.round(data.lat * 1000000) / 1000000 || "",
        lon: Math.round(data.lon * 1000000) / 1000000 || "",
        osm_id: data.osm_id || "",
      });

      setIsOpen(true);
    } catch (err) {
      console.error("Error fetching location", err);
      setErrorLocation(err.message);
    } finally {
      setLoadingLocation(false);
    }
  }

  function MapClickHandler() {
    useMapEvents({
      click(e) {
        const { lat, lng } = e.latlng;
        setMarker({ lat, lon: lng });
      },
    });
    return null;
  }

  return (
    <div className={styles.container}>
      <h1>{t("property_location")}</h1>
      <div className={styles.subContainer}>
        <div className={styles.searchLocation}>
          <form onSubmit={handleLocationSearch}>
            <label>
              latitude
              <input
                type="text"
                name="lat"
                value={marker.lat}
                required
                onChange={handleChange}
              />
            </label>
            <label>
              longitude
              <input
                type="text"
                name="lon"
                value={marker.lon}
                required
                onChange={handleChange}
              />
            </label>
            <button className={styles.searchButton} disabled={loadingLocation}>
              {loadingLocation ? "Loading" : t("search")}
            </button>
          </form>
          {errorLocation && (
            <p className={styles.errorBanner}>{errorLocation}</p>
          )}
        </div>

        <div id="map" className={styles.mapContainer}>
          <MapContainer
            key={`${initialCenter[0]}-${initialCenter[1]}`}
            center={marker?.lat ? [marker.lat, marker.lon] : initialCenter}
            zoom={marker?.lat ? 16 : mapZoom}
            scrollWheelZoom={true}
            style={{ height: "100%", width: "100%" }}
          >
            <TileLayer
              attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />
            <MapClickHandler />
            {marker.lat && <Marker position={[marker.lat, marker.lon]} />}
          </MapContainer>
        </div>
      </div>
      <Modal
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
        header="Property Location"
      >
        <LocationForm
          locationData={location}
          setLocationData={setLocation}
          setIsOpen={setIsOpen}
        />
      </Modal>
    </div>
  );
}

Location.propTypes = {
  property: PropTypes.object.isRequired,
};
