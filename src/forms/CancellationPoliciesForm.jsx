import styles from "./defaultFormStyle.module.css";
import PropTypes from "prop-types";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import { useToast } from "../hooks/useToast";

export default function CancellationPoliciesForm({
  cancellationPolicies,
  refreshPropertyPolicies,
  closeModal,
}) {
  const [formOpen, setFormOpen] = useState(false);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  const [formData, setFormData] = useState({
    id: null,
    days_before_arrival: 0,
    amount_refund: 0,
  });

  const { t } = useTranslation();
  const { addToast } = useToast();

  function handleFormChange(e) {
    const { name, value } = e.target;

    setFormData(prev => ({
      ...prev,
      [name]: value,
    }));
  }

  function handleDelete(id) {
    const url =
      import.meta.env.VITE_URL_BASE +
      "/properties/policies/delete-cancellation-policies/" +
      id;
    const options = {
      mode: "cors",
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include",
    };

    setLoading(true);
    setError(null);
    fetch(url, options)
      .then(response => {
        if (response.status >= 400) {
          throw new Error("Un error occurred. Unable to delete policy.");
        }
        return response.json();
      })
      .then(() => {
        closeModal();
        refreshPropertyPolicies();
        addToast({
          message: t("POLICY_DELETE_SUCCESS", { ns: "validation" }),
          type: "success",
        });
      })
      .catch(e => setError(e.message))
      .finally(() => setLoading(false));
  }

  function handleFormSubmit() {
    let url = "";
    let options = {};

    const id = formData.id;
    if (id === null) {
      url =
        import.meta.env.VITE_URL_BASE +
        "/properties/policies/cancellation-policies";
      options = {
        mode: "cors",
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify(formData),
      };
    } else {
      url =
        import.meta.env.VITE_URL_BASE +
        "/properties/policies/update-cancellation-policies/" +
        id;
      options = {
        mode: "cors",
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify(formData),
      };
    }

    setError(null);
    setLoading(true);

    fetch(url, options)
      .then(response => {
        if (response.status >= 400) {
          throw new Error("Server error. Unable to add a new policy.");
        }

        return response.json();
      })
      .then(data => {
        if (data.status && data.status === "error") {
          setError(data.msg);
          return false;
        }
        closeModal();
        refreshPropertyPolicies();
        addToast({
          message: t("POLICY_CREATE_SUCCESS", { ns: "validation" }),
          type: "success",
        });
      })
      .catch(e => setError(e.message))
      .finally(() => setLoading(false));
  }

  const percent = [
    0, 0.1, 0.15, 0.2, 0.25, 0.3, 0.35, 0.4, 0.45, 0.5, 0.55, 0.6, 0.65, 0.7,
    0.75, 0.8, 0.85, 0.9, 0.95, 1,
  ];

  const amount = percent.map(i => (
    <option key={i} value={i}>
      {Math.round(i * 100)}%
    </option>
  ));

  return (
    <div>
      <ul className={styles.list}>
        {cancellationPolicies[0] === null ? (
          <li>{t("no_policies")}</li>
        ) : (
          cancellationPolicies.map(policy => (
            <li key={policy.id}>
              {t("deposit_refunded", {
                amount: policy.amount_refund * 100,
                count: policy.days_before_arrival,
              })}
              <div>
                <button
                  onClick={() => handleDelete(policy.id)}
                  disabled={loading}
                  className={styles.deleteButton}
                >
                  {t("delete")}
                </button>
                <button
                  disabled={loading}
                  onClick={() => {
                    setFormData({
                      id: policy.id,
                      days_before_arrival: policy.days_before_arrival,
                      amount_refund: policy.amount_refund,
                    });
                    setFormOpen(true);
                  }}
                  className={styles.editButton}
                >
                  {t("edit")}
                </button>
              </div>
            </li>
          ))
        )}
      </ul>
      {formOpen ? (
        <>
          <ul className={styles.list}>
            <li>
              <label className={styles.labelFlex}>
                {t("days_before_arrival")}:
                <input
                  type="number"
                  name="days_before_arrival"
                  value={formData.days_before_arrival}
                  onChange={handleFormChange}
                  className={styles.inputSmall}
                />
              </label>
              <br />
              <label className={styles.labelFlex}>
                {t("amount_to_refunded")}:
                <select
                  name="amount_refund"
                  id="amount_refund"
                  value={formData.amount_refund}
                  onChange={handleFormChange}
                  className={styles.inputSmall}
                >
                  {amount}
                </select>
              </label>
              <div className={styles.buttonGroup}>
                <button
                  className={styles.cancelButton}
                  onClick={() => setFormOpen(false)}
                >
                  {t("cancel")}
                </button>
                <button
                  className={styles.submitButton}
                  disabled={loading}
                  onClick={() => handleFormSubmit()}
                >
                  {t("save")}
                </button>
              </div>
            </li>
          </ul>
        </>
      ) : (
        <br />
      )}
      {!formOpen && (
        <button
          className={styles.submitButton}
          onClick={() => setFormOpen(true)}
        >
          {t("add")}
        </button>
      )}
      {error && <p className={styles.error}>{error}</p>}
    </div>
  );
}

CancellationPoliciesForm.propTypes = {
  cancellationPolicies: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.number.isRequired,
      amount_refund: PropTypes.number.isRequired,
      days_before_arrival: PropTypes.number.isRequired,
    })
  ).isRequired,
  refreshPropertyPolicies: PropTypes.func.isRequired,
  closeModal: PropTypes.func.isRequired,
};
