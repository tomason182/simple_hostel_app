import { useEffect, useState } from "react";
import styles from "./PropertyInfo.module.css";
import Spinner from "../../../components/Spinner/Spinner";
import Card from "../../../components/Card/Card";

export default function PropertyInfo() {
  const [propertyData, setPropertyData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const property = {
      id: 1,
      property_name: "El Hostel de Tomas",
      contact_info: {
        phone_number: "+549221221221",
        email: "test@email.com",
      },
      addresses: {
        street: "calle 123",
        city: "Azul",
        postal_code: "12345",
        country_code: "AR",
      },
      currency: "usd",
    };
    setPropertyData(property);
    setLoading(false);
  }, [setPropertyData]);

  if (loading) return <Spinner />;

  return (
    <>
      <h1>{propertyData.property_name}</h1>
      <div className={styles.gridContainer}>
        <Card title="Contact Details">
          <ul>
            <li>Name</li>
            <li>Email</li>
            <li>Phone number</li>
            <li>Alternative Contact</li>
          </ul>
        </Card>
        <Card title="Property Details">
          <ul>
            <li>Hostel ID</li>
            <li>Currency Preference</li>
            <li>Street</li>
            <li>City</li>
            <li>Country</li>
            <li>Postal code</li>
          </ul>
        </Card>
        <Card title="Integration Status">
          <ul>
            <li>Website status</li>
            <li>Book engine status</li>
            <li>OTAs connected</li>
          </ul>
        </Card>
        <Card title="Billing Information">
          <ul>
            <li>Current plan</li>
            <li>Next billing date</li>
            <li>Last payment status</li>
            <li>Payment method</li>
          </ul>
        </Card>
        <Card title="Team members"></Card>
      </div>
    </>
  );
}
