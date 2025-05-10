import { useEffect, useState } from "react";
import styles from "./defaultFormStyle.module.css";
import PropTypes from "prop-types";
import { MapContainer, TileLayer, Marker, useMapEvents } from "react-leaflet";
import "leaflet/dist/leaflet.css";

import { useTranslation } from "react-i18next";
import { useToast } from "../hooks/useToast";

const GEO_USERNAME = import.meta.env.VITE_GEO_USERNAME;

export default function ProperTyDetailsForm({
  setIsOpen,
  propertyDetailsData,
  refreshPropertyData,
}) {
  const [formData, setFormData] = useState({
    alpha_2_code: "",
    country_name: "",
    region_code: "",
    region_name: "",
    city_name: "",
    street: "",
    postal_code: "",
    latitude: "",
    longitude: "",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const { t } = useTranslation();
  const { addToast } = useToast();

  useEffect(() => {
    setFormData({
      alpha_2_code: propertyDetailsData?.alpha_2_code || "",
      country_name: propertyDetailsData?.country_name || "",
      region_code: propertyDetailsData?.region_code || "",
      region_name: propertyDetailsData?.region_name || "",
      city_name: propertyDetailsData?.city || "",
      postal_code: propertyDetailsData?.postal_code || "",
      street: propertyDetailsData?.street || "",
      latitude: propertyDetailsData?.latitude || "",
      longitude: propertyDetailsData?.longitude || "",
    });
  }, [propertyDetailsData]);

  async function handleSubmit(e) {
    e.preventDefault(e);

    const url =
      import.meta.env.VITE_URL_BASE + "/properties/update/property-info";
    const options = {
      mode: "cors",
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include",
      body: JSON.stringify(formData),
    };
    setLoading(true);
    try {
      const response = await fetch(url, options);

      if (!response.ok) {
        const error = await response.json();
        console.error(error);
        throw new Error(
          error.msg || t("UNEXPECTED_ERROR", { ns: "validation" })
        );
      }
      addToast({
        message: t("PROPERTY_UPDATE_SUCCESS", { ns: "validation" }),
        type: "success",
      });
      setIsOpen(false);
      refreshPropertyData();
    } catch (e) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className={styles.container}>
      <div className={styles.gridContainer}></div>
    </div>
  );
}

ProperTyDetailsForm.propTypes = {
  setIsOpen: PropTypes.func.isRequired,
  propertyDetailsData: PropTypes.object.isRequired,
  refreshPropertyData: PropTypes.func.isRequired,
};
