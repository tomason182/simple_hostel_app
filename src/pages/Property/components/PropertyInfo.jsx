import styles from "./PropertyInfo.module.css";
import Spinner from "../../../components/Spinner/Spinner";
import Card from "../../../components/Card/Card";
import PropTypes from "prop-types";
import Modal from "../../../components/Modal/Modal";
import { useState } from "react";
// Forms
import ContactInfoForm from "../../../forms/ContactInfoForm";
import ProperTyDetailsForm from "../../../forms/PropertyDetailsForm";

// Countries
import countries from "../../../utils/country_code.json";

export default function PropertyInfo({
  propertyData,
  loadingPropertyData,
  propertyError,
  refreshPropertyData,
}) {
  const [isOpen, setIsOpen] = useState(false);
  const [index, setIndex] = useState(0);

  const contactInfoData = {
    email: propertyData.contact_info?.email || "",
    phone_number: propertyData.contact_info?.phone_number || "",
    country_code: propertyData.contact_info?.country_code || "",
  };

  const propertyDetailsData = {
    alpha_2_code: propertyData.address?.alpha_2_code,
    city: propertyData.address?.city,
    postal_code: propertyData.address?.postal_code,
    street: propertyData.address?.street,
    payment_currency: propertyData.currencies?.payment_currency,
    base_currency: propertyData.currencies?.base_currency,
  };

  // Select property country

  const country = countries.find(
    c => c.value === propertyDetailsData.alpha_2_code
  );

  const contactDetailsActions = [
    {
      label: "Edit",
      onClick: () => {
        setIndex(0);
        setIsOpen(true);
      },
    },
  ];

  const propertyDetailsActions = [
    {
      label: "Edit",
      onClick: () => {
        setIndex(1), setIsOpen(true);
      },
    },
  ];

  const forms = [
    {
      header: "Edit Contact Info",
      children: (
        <ContactInfoForm
          contactInfoData={contactInfoData}
          setIsOpen={setIsOpen}
          refreshPropertyData={refreshPropertyData}
        />
      ),
    },
    {
      header: "Edit Property Info",
      children: (
        <ProperTyDetailsForm
          setIsOpen={setIsOpen}
          propertyDetailsData={propertyDetailsData}
          refreshPropertyData={refreshPropertyData}
        />
      ),
    },
  ];

  if (propertyError) return <div>Unexpected error occurred</div>;

  return (
    <>
      <h1>{propertyData.property_name}</h1>
      <div className={styles.gridContainer}>
        <Card title="Contact Details" actions={contactDetailsActions}>
          {loadingPropertyData ? (
            <Spinner />
          ) : (
            <ul className={styles.list}>
              <li>
                <span>Email:</span>
                <span>{contactInfoData.email}</span>
              </li>
              <li>
                <span>Phone number:</span>{" "}
                <span>
                  {contactInfoData.country_code}
                  {contactInfoData.phone_number}
                </span>
              </li>
            </ul>
          )}
        </Card>
        <Card title="Property Details" actions={propertyDetailsActions}>
          {loadingPropertyData ? (
            <Spinner />
          ) : (
            <ul className={styles.list}>
              <li>
                <span>Hostel ID:</span> <span>{propertyData.id}</span>
              </li>
              <li>
                <span>Currency Preference:</span>
                <ul className={styles.innerList}>
                  <li>
                    <span>Base currency:</span>
                    <span>{propertyData?.currencies.base_currency}</span>
                  </li>
                  <li>
                    <span>Payment currency:</span>
                    <span>{propertyData?.currencies.payment_currency}</span>
                  </li>
                </ul>
              </li>
              <li>
                <span>Street:</span>
                <span>{propertyData?.address.street}</span>
              </li>
              <li>
                <span>City:</span>
                <span>{propertyData?.address.city}</span>
              </li>
              <li>
                <span>Country:</span>
                <span>{country.label}</span>
              </li>
              <li>
                <span>Postal code:</span>
                <span>{propertyData?.address.postal_code}</span>
              </li>
            </ul>
          )}
        </Card>
        <Card title="Integration Status">
          <ul className={styles.list}>
            <li>
              <span>Website status:</span>
            </li>
            <li>
              <span>Book engine status:</span>
            </li>
            <li>
              <span>OTAs connected:</span>
            </li>
          </ul>
        </Card>
        <Card title="Billing Information">
          <ul className={styles.list}>
            <li>
              <span>Current plan:</span>
            </li>
            <li>
              <span>Next billing date:</span>
            </li>
            <li>
              <span>Last payment status:</span>
            </li>
            <li>
              <span>Payment method:</span>
            </li>
          </ul>
        </Card>
      </div>
      <Modal
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
        header={forms[index].header}
      >
        {forms[index].children}
      </Modal>
    </>
  );
}

PropertyInfo.propTypes = {
  propertyData: PropTypes.object.isRequired,
  loadingPropertyData: PropTypes.bool.isRequired,
  propertyError: PropTypes.string,
  refreshPropertyData: PropTypes.func.isRequired,
};
