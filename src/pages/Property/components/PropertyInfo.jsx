import styles from "./PropertyInfo.module.css";
import Spinner from "../../../components/Spinner/Spinner";
import Card from "../../../components/Card/Card";
import PropTypes from "prop-types";
import Modal from "../../../components/Modal/Modal";
import { useState } from "react";
// Forms
import ContactInfoForm from "../../../forms/ContactInfoForm";
import PropertyCurrenciesForm from "../../../forms/PropertyCurrenciesForm";

// Countries
import countries from "../../../utils/country_code.json";
import { useTranslation } from "react-i18next";

export default function PropertyInfo({
  propertyData,
  loadingPropertyData,
  propertyError,
  refreshPropertyData,
  setActiveTab,
}) {
  const [isOpen, setIsOpen] = useState(false);
  const [index, setIndex] = useState(0);

  const { t } = useTranslation();

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
      label: t("edit"),
      onClick: () => {
        setIndex(0);
        setIsOpen(true);
      },
    },
  ];

  const propertyDetailsActions = [
    {
      label: t("edit"),
      onClick: () => {
        setActiveTab(1);
      },
    },
  ];

  const currenciesActions = [
    {
      label: t("edit"),
      onClick: () => {
        setIndex(1);
        setIsOpen(true);
      },
    },
  ];

  const forms = [
    {
      header: t("edit_contact_info"),
      children: (
        <ContactInfoForm
          contactInfoData={contactInfoData}
          setIsOpen={setIsOpen}
          refreshPropertyData={refreshPropertyData}
        />
      ),
    },
    {
      header: t("currency_preference"),
      children: (
        <PropertyCurrenciesForm
          setIsOpen={setIsOpen}
          propertyDetailsData={propertyDetailsData}
          refreshPropertyData={refreshPropertyData}
        />
      ),
    },
  ];

  if (propertyError)
    return (
      <div>
        <p>{t("unexpected_error_message")}</p>
      </div>
    );

  return (
    <>
      <div className={styles.gridContainer}>
        <Card title={t("contact_details")} actions={contactDetailsActions}>
          {loadingPropertyData ? (
            <Spinner />
          ) : (
            <ul className={styles.list}>
              <li>
                <span>{t("property_name")}</span>
                <span>{propertyData.property_name}</span>
              </li>
              <li>
                <span>Email:</span>
                <span>{contactInfoData.email}</span>
              </li>
              <li>
                <span>{t("phone_number")}:</span>
                <span>
                  {contactInfoData.country_code}
                  {contactInfoData.phone_number}
                </span>
              </li>
            </ul>
          )}
        </Card>
        <Card title={t("property_details")} actions={propertyDetailsActions}>
          {loadingPropertyData ? (
            <Spinner />
          ) : (
            <ul className={styles.list}>
              <li>
                <span>Hostel ID:</span> <span>{propertyData.id}</span>
              </li>
              <li>
                <span>{t("street")}:</span>
                <span>
                  {propertyData?.address.street}{" "}
                  {propertyData?.address.house_number}
                </span>
              </li>
              <li>
                <span>{t("city")}:</span>
                <span>{propertyData?.address.city}</span>
              </li>
              <li>
                <span>{t("country")}:</span>
                <span>{country?.label}</span>
              </li>
              <li>
                <span>{t("postal_code")}:</span>
                <span>{propertyData?.address.postal_code}</span>
              </li>
            </ul>
          )}
        </Card>
        <Card title={t("currency_preference")} actions={currenciesActions}>
          <ul className={styles.list}>
            <li>
              <span>{t("base_currency")}:</span>
              <span>{propertyDetailsData?.base_currency}</span>
            </li>
            <li>
              <span>{t("payment_currency")}:</span>
              <span>{propertyDetailsData?.payment_currency}</span>
            </li>
          </ul>
        </Card>
        <Card title="Billing Information">
          <ul className={styles.list}>
            <li>
              <span>{t("current_plan")}:</span>
            </li>
            <li>
              <span>{t("next_billing_date")}:</span>
            </li>
            <li>
              <span>{t("last_payment_status")}:</span>
            </li>
            <li>
              <span>{t("payment_method")}:</span>
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
  setActiveTab: PropTypes.func.isRequired,
};
