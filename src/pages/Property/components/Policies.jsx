import styles from "./Policies.module.css";
import PropTypes from "prop-types";
import Card from "../../../components/Card/Card";
import Modal from "../../../components/Modal/Modal";
import { useCallback, useEffect, useMemo, useState } from "react";
// Import forms
import ReservationPoliciesForm from "../../../forms/ReservationPoliciesForm";
import AdvancePaymentPolicyForm from "../../../forms/AdvancePaymentPolicyForm";
import CancellationPoliciesForm from "../../../forms/CancellationPoliciesForm";
import OtherPoliciesForm from "../../../forms/OtherPoliciesForm";
import ChildrenPoliciesForm from "../../../forms/ChildrenPoliciesForm";
import Spinner from "../../../components/Spinner/Spinner";

import { useTranslation } from "react-i18next";

export default function Policies() {
  const [policies, setPolicies] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isOpen, setIsOpen] = useState(false);
  const [form, setForm] = useState(null);

  const { t } = useTranslation();

  const fetchPropertyPolicies = useCallback(() => {
    const url = import.meta.env.VITE_URL_BASE + "/properties/policies";
    const options = {
      mode: "cors",
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include",
    };
    setLoading(true);

    fetch(url, options)
      .then(response => {
        if (response.status >= 400) {
          throw new Error("Server Error");
        }
        return response.json();
      })
      .then(data => setPolicies(data))
      .catch(e => setError(e.message))
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    fetchPropertyPolicies();
  }, [fetchPropertyPolicies]);

  // Policies States
  const reservationPolicies = useMemo(
    () => ({
      min_length_stay: policies.reservationPolicies?.min_length_stay || 1,
      max_length_stay: policies.reservationPolicies?.max_length_stay || 0,
      min_advance_booking:
        policies.reservationPolicies?.min_advance_booking || 0,
      check_in_from: policies.reservationPolicies?.check_in_from || "",
      check_in_to: policies.reservationPolicies?.check_in_to || "",
      check_out_until: policies.reservationPolicies?.check_out_until || "",
      payment_methods_accepted:
        policies.reservationPolicies?.payment_methods_accepted || [],
    }),
    [policies]
  ); // Recalculate only when policies change

  const advancePaymentPolicies = useMemo(
    () => ({
      required:
        policies.advancePaymentPolicies?.advance_payment_required || false,
      deposit_amount: policies.advancePaymentPolicies?.deposit_amount || 0,
    }),
    [policies]
  );

  const cancellationPolicies = useMemo(
    () => policies?.cancellationPolicies,
    [policies]
  );

  const childrenPolicies = useMemo(
    () => ({
      children_allowed: policies.childrenPolicies?.allow_children || false,
      min_age: policies.childrenPolicies?.children_min_age || 0,
      allowed_room_types: policies.childrenPolicies?.minors_room_types || null,
      free_stay_age: policies.childrenPolicies?.free_stay_age || 0,
    }),
    [policies]
  );

  const otherPolicies = useMemo(
    () => ({
      external_guest_allowed:
        policies.otherPolicies?.external_guest_allowed || false,
      pets_allowed: policies.otherPolicies?.pets_allowed || false,
      quiet_hours_from: policies.otherPolicies?.quiet_hours_from || null,
      quiet_hours_to: policies.otherPolicies?.quiet_hours_to || null,
      smoking_areas: policies.otherPolicies?.smoking_areas || false,
    }),
    [policies]
  );

  const formSelector = useMemo(
    () => ({
      1: {
        header: <h3 className={styles.header}>{t("reservation_policies")}</h3>,
        form: (
          <ReservationPoliciesForm
            reservationPoliciesData={reservationPolicies}
            closeModal={() => setIsOpen(false)}
            refreshPropertyPolicies={fetchPropertyPolicies}
          />
        ),
      },
      2: {
        header: (
          <h3 className={styles.header}>{t("advance_payment_policies")}</h3>
        ),
        form: (
          <AdvancePaymentPolicyForm
            advancePaymentData={advancePaymentPolicies}
            closeModal={() => setIsOpen(false)}
            refreshPropertyPolicies={fetchPropertyPolicies}
          />
        ),
      },
      3: {
        header: <h3 className={styles.header}>{t("cancellation_policies")}</h3>,
        form: (
          <CancellationPoliciesForm
            cancellationPolicies={cancellationPolicies}
            refreshPropertyPolicies={fetchPropertyPolicies}
            closeModal={() => setIsOpen(false)}
          />
        ),
      },
      4: {
        header: <h3 className={styles.header}>{t("children_policies")}</h3>,
        form: (
          <ChildrenPoliciesForm
            childrenPoliciesData={childrenPolicies}
            closeModal={() => setIsOpen(false)}
            refreshPropertyData={fetchPropertyPolicies}
          />
        ),
      },
      5: {
        header: <h3 className={styles.header}>{t("other_policies")}</h3>,
        form: (
          <OtherPoliciesForm
            otherPoliciesData={otherPolicies}
            closeModal={() => setIsOpen(false)}
            refreshPropertyData={fetchPropertyPolicies}
          />
        ),
      },
    }),
    [
      reservationPolicies,
      advancePaymentPolicies,
      cancellationPolicies,
      childrenPolicies,
      otherPolicies,
      fetchPropertyPolicies,
      t,
    ]
  );

  function handleFormSelection(id) {
    setForm(formSelector[id]);
  }

  const actionReservation = [
    {
      label: t("edit"),
      onClick: () => {
        handleFormSelection(1);
        setIsOpen(true);
      },
    },
  ];

  const actionChildren = [
    {
      label: t("edit"),
      onClick: () => {
        handleFormSelection(4);
        setIsOpen(true);
      },
    },
  ];

  const actionOthers = [
    {
      label: t("edit"),
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

  if (loading) return <Spinner />;

  if (error) return <h1>{t("unexpected_error_message")}</h1>;

  return (
    <>
      <div className={styles.policiesContainer}>
        <Card title={t("reservation_policies")} actions={actionReservation}>
          {reservationPolicies.min_length_stay === 0 ? (
            <p>{t("no_reservation_policy_message")}</p>
          ) : (
            <ul className={styles.list}>
              <li>
                <span>{t("min_length_of_stay")}:</span>
                <span>
                  {t("night", { count: reservationPolicies.min_length_stay })}
                </span>
              </li>
              <li>
                <span>{t("max_length_of_stay")}:</span>
                <span>
                  {t("night", { count: reservationPolicies.max_length_stay })}
                </span>
              </li>
              <li>
                <span>{t("allow_same_day_reservation")}:</span>
                <span>
                  {reservationPolicies.min_advance_booking !== 0
                    ? "No"
                    : t("yes")}
                </span>
              </li>
              <li>
                <span>{t("min_advance_booking")}:</span>
                <span>
                  {t("day", { count: reservationPolicies.min_advance_booking })}
                </span>
              </li>
              <li>
                <span>{t("check_in")}:</span>
                <span>
                  {reservationPolicies.check_in_from}-
                  {reservationPolicies.check_in_to}
                </span>
              </li>
              <li>
                <span>{t("check_out")}:</span>
                <span>{reservationPolicies.check_out_until}</span>
              </li>
              <li>
                <span>{t("payment_methods")}:</span>
                <ul>
                  {reservationPolicies.payment_methods_accepted.map(method => {
                    let paymentMethod = "";
                    switch (method) {
                      case "debit_credit":
                        paymentMethod = t("debit_credit");
                        break;
                      case "cash":
                        paymentMethod = t("cash");
                        break;
                      case "bank_transfer":
                        paymentMethod = t("bank_transfer");
                        break;
                      case "bitcoin":
                        paymentMethod = "bitcoin";
                    }
                    return <li key={method}>{paymentMethod}</li>;
                  })}
                </ul>
              </li>
            </ul>
          )}
        </Card>
        <Card
          title={t("advance_payment_and_cancellation_policies")}
          customStyle={customStyle}
        >
          <h4>{t("advance_payment")}</h4>
          <ul className={styles.list}>
            <li>
              {advancePaymentPolicies.required === false
                ? t("advance_payment_no_required_message")
                : t("advance_payment_required_message", {
                    count: advancePaymentPolicies.deposit_amount * 100,
                  })}
            </li>
          </ul>
          <button
            className={styles.button}
            onClick={() => {
              handleFormSelection(2);
              setIsOpen(true);
            }}
          >
            {t("edit")}
          </button>
          <br />
          <h4>{t("cancellations")}</h4>
          <ul className={styles.list}>
            {cancellationPolicies[0] === null ? (
              <li>{t("no_cancellation_message")}</li>
            ) : advancePaymentPolicies.required === false ? (
              t("cancellation_policies_not_display")
            ) : (
              cancellationPolicies.map(policy => (
                <li key={policy.id}>
                  {t("deposit_refunded", {
                    amount: policy.amount_refund * 100,
                    count: policy.days_before_arrival,
                  })}
                </li>
              ))
            )}
          </ul>
          <button
            className={styles.button}
            onClick={() => {
              handleFormSelection(3);
              setIsOpen(true);
            }}
          >
            {t("edit")}
          </button>
        </Card>

        <Card
          title={t("children_policies")}
          actions={actionChildren}
          customStyle={customStyle}
        >
          <ul className={styles.list}>
            {childrenPolicies.children_allowed === 0 ||
            childrenPolicies.children_allowed === false ? (
              <li>{t("children_not_allowed")}</li>
            ) : (
              <>
                <li>
                  {t("children_allowed", { count: childrenPolicies.min_age })}
                </li>
                <li>
                  {childrenPolicies.allowed_room_types === "only_private"
                    ? t("children_private_room_only")
                    : childrenPolicies.allowed_room_types === "only_dorm"
                    ? t("children_dorm_room_only")
                    : t("children_any_room")}
                </li>
                <li>
                  {childrenPolicies.free_stay_age > 0 &&
                    `Children of ${childrenPolicies?.free_stay_age} years old can stay for free`}
                </li>
              </>
            )}
          </ul>
        </Card>
        <Card
          title="Other Property Policies"
          actions={actionOthers}
          customStyle={customStyle}
        >
          <h4>{t("house_rules")}</h4>
          <ul className={styles.list}>
            <li>
              <span>{t("quite_hours")}:</span>
            </li>
            <ul className={styles.list} style={{ marginLeft: "2rem" }}>
              <li>
                <span>{t("from")}:</span>
                <span>{otherPolicies.quiet_hours_from || "--"}</span>
              </li>
              <li>
                <span>{t("until")}:</span>
                <span>{otherPolicies.quiet_hours_to || "--"}</span>
              </li>
            </ul>
            <li>
              <span>{t("smoking_areas")}:</span>
              <span>{otherPolicies.smoking_areas ? t("yes") : "No"}</span>
            </li>
            <li>
              <span>{t("external_guest_allowed")}</span>
              <span>
                {otherPolicies.external_guest_allowed ? t("yes") : "No"}
              </span>
            </li>
            <li>
              <span>{t("pets_allowed")}</span>
              <span>{otherPolicies.pets_allowed ? t("yes") : "No"}</span>
            </li>
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
      <Modal
        header={form?.header}
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
      >
        {form?.form}
      </Modal>
    </>
  );
}

Policies.propTypes = {
  policies: PropTypes.object.isRequired,
  isLoading: PropTypes.bool.isRequired,
  error: PropTypes.string,
};
