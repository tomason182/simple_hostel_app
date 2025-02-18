import styles from "./PropertyInfo.module.css";
import Spinner from "../../../components/Spinner/Spinner";
import Card from "../../../components/Card/Card";
import PropTypes from "prop-types";

export default function PropertyInfo({
  propertyData,
  loadingPropertyData,
  propertyError,
  usersData,
  loadingUsersData,
  usersError,
}) {
  const contactDetailsActions = [
    {
      label: "Edit",
      onClick: () => alert("Edit contact details"),
    },
  ];

  const propertyDetailsActions = [
    {
      label: "Edit",
      onClick: () => alert("Edit property details"),
    },
  ];

  const teamMembersActions = [
    {
      label: "Edit",
      onClick: () => alert("Edit team Members"),
    },
  ];
  if (loadingPropertyData) return <Spinner />;

  return (
    <>
      <h1>{propertyData.property_name}</h1>
      <div className={styles.gridContainer}>
        <Card title="Contact Details" actions={contactDetailsActions}>
          <ul className={styles.list}>
            <li>
              <span>Name:</span> {propertyData.contact_info.name}
            </li>
            <li>
              <span>Email:</span> {propertyData.contact_info.email}
            </li>
            <li>
              <span>Phone number:</span>{" "}
              {propertyData.contact_info.phone_number}
            </li>
          </ul>
        </Card>
        <Card title="Property Details" actions={propertyDetailsActions}>
          <ul className={styles.list}>
            <li>
              <span>Hostel ID:</span> {propertyData.id}
            </li>
            <li>
              <span>Currency Preference:</span>
              <ul>
                <li>
                  <span>Base currency:</span> {propertyData.base_currency}
                </li>
                <li>
                  <span>Payment currency:</span> {propertyData.payment_currency}
                </li>
              </ul>
            </li>
            <li>
              <span>Street:</span> {propertyData.street}
            </li>
            <li>
              <span>City:</span> {propertyData.city}
            </li>
            <li>
              <span>Country:</span> {propertyData.country_code}
            </li>
            <li>
              <span>Postal code:</span> {propertyData.postal_code}
            </li>
          </ul>
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
        <Card title="Team members" actions={teamMembersActions}>
          {loadingUsersData ? (
            <Spinner />
          ) : (
            <ul className={styles.teamMembersList}>
              {usersData.map(user => (
                <li key={user.id}>
                  <p>
                    {user.first_name} {user.last_name}
                  </p>
                  <span>{user.role}</span>
                </li>
              ))}
            </ul>
          )}
        </Card>
      </div>
    </>
  );
}

PropertyInfo.propTypes = {
  propertyData: PropTypes.object.isRequired,
  loadingPropertyData: PropTypes.bool.isRequired,
  propertyError: PropTypes.string,
  usersData: PropTypes.object.isRequired,
  loadingUsersData: PropTypes.bool.isRequired,
  usersError: PropTypes.string.isRequired,
};
