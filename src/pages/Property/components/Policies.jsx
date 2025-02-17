import styles from "./Policies.module.css";
import Card from "../../../components/Card/Card";
import Modal from "../../../components/Modal/Modal";
import { useState } from "react";
// Import forms
import AdvancePaymentForm from "../../../forms/AdvancePaymentForm";

export default function Policies() {
  const [isOpen, setIsOpen] = useState(false);
  const [form, setForm] = useState(null);

  const formSelector = {
    1: <AdvancePaymentForm closeModal={() => setIsOpen(false)} />,
  };

  function handleFormSelection(id) {
    setForm(formSelector[id]);
  }

  const actionPayment = [
    {
      label: "Edit",
      onClick: () => {
        handleFormSelection(1);
        setIsOpen(true);
      },
    },
  ];

  const actionCancel = [
    {
      label: "Edit",
      onClick: () => {
        handleFormSelection(2);
        setIsOpen(true);
      },
    },
  ];

  const actionChildren = [
    {
      label: "Edit",
      onClick: () => {
        handleFormSelection(3);
        setIsOpen(true);
      },
    },
  ];

  const actionPets = [
    {
      label: "Edit",
      onClick: () => {
        handleFormSelection(4);
        setIsOpen(true);
      },
    },
  ];

  const actionOthers = [
    {
      label: "Edit",
      onClick: () => {
        handleFormSelection(5);
        setIsOpen(true);
      },
    },
  ];

  const customStyle = {
    children: {
      textAlign: "left",
    },
  };

  return (
    <>
      <div className={styles.policiesContainer}>
        <Card
          title="Advance Payment"
          actions={actionPayment}
          customStyle={customStyle}
        >
          <p>
            The deposit amount is 30% of the total reservation amount and will
            be arrange between you (the owner) and the guest
          </p>
        </Card>
        <Card
          title="Cancellation Policies"
          actions={actionCancel}
          customStyle={customStyle}
        >
          <p>The deposit will not be return if the guest cancel at any time.</p>
        </Card>
        <Card
          title="Children policies"
          actions={actionChildren}
          customStyle={customStyle}
        >
          <p>Children of all age are allowed only in private rooms.</p>
        </Card>
        <Card
          title="Pets policies"
          actions={actionPets}
          customStyle={customStyle}
        >
          <p>Pets are not allowed in your property</p>
        </Card>
        <Card
          title="Other Property Policies"
          actions={actionOthers}
          customStyle={customStyle}
        >
          <p>Check-in & Check-out times</p>
          <ul>
            <li>Check-in from 14:00 PM to 21:00 PM</li>
            <li>Check-out until 11:00 AM</li>
          </ul>
        </Card>
      </div>
      <div className={styles.policiesDescription}>
        <h2>Policies Information</h2>
        <h3>Advance payment Policies</h3>
        <p>
          When a guest makes a reservation through your webpage using the Simple
          Hostel booking engine, the reservation will initially be marked as
          &quot;Provisional&quot; in your calendar. As the property owner, you
          are responsible for contacting the guest to arrange the required
          deposit payment. The reservation will remain provisional until the
          payment is confirmed.
        </p>
        <h3>Cancellation Policies</h3>
        <p>
          When a guest cancels a reservation, you can define whether the advance
          payment will be refunded or not. Your cancellation policy helps set
          clear expectations for guests and ensures a fair process for both
          parties.
        </p>
        <h3>Children Policies</h3>
        <p>
          Define whether children are allowed in your property. If permitted,
          you can specify which types of rooms they can stay in, such as private
          rooms only or any room. This policy helps set clear expectations for
          families and ensures a suitable accommodation experience.
        </p>
        <h3>Pets Policies</h3>
        <p>Specify whether pets are allowed in your property.</p>
      </div>
      <Modal isOpen={isOpen} onClose={() => setIsOpen(false)}>
        {form}
      </Modal>
    </>
  );
}
