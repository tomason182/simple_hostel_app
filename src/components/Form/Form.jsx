import { useState, useEffect } from "react";
import PropTypes from "prop-types";
import styles from "./Form.module.css";

export default function Form({
  fields,
  onSubmit,
  externalErrors = {},
  customStyle,
}) {
  const [formData, setFormData] = useState(
    fields.reduce(
      (acc, field) => ({ ...acc, [field.name]: field.defaultValue || "" }),
      {}
    )
  );
  const [errors, setErrors] = useState({});

  /*   useEffect(() => {
    setErrors(externalErrors);
  }, [externalErrors]); */

  const validate = () => {
    const newErrors = {};
    fields.forEach(({ name, required, pattern, minLength, maxLength }) => {
      const value = formData[name];
      if (required && !value) newErrors[name] = "This field is required";
      if (pattern && new RegExp(pattern).test(value))
        newErrors[name] = "Invalid format";
      if (minLength && value.length < minLength)
        newErrors[name] = `Must be at least ${minLength} characters`;
      if (maxLength && value.length > maxLength)
        newErrors[name] = `Must be at least ${maxLength} characters`;
    });
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = e => {
    const { name, value, type, checked } = e.target;

    setFormData({ ...formData, [name]: type === "checkbox" ? checked : value });
  };

  const handleSubmit = e => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <form
      onSubmit={handleSubmit}
      className={styles.form}
      style={customStyle?.form}
    >
      {fields.map(
        ({
          name,
          label,
          type,
          placeholder,
          disabled,
          required,
          minLength,
          maxLength,
        }) => (
          <div
            key={name}
            className={styles.formGroup}
            style={customStyle?.formGroup}
          >
            <label className={styles.label}>
              {label}
              {type === "checkbox" ? (
                <input
                  className={styles.checkbox}
                  type={type}
                  name={name}
                  checked={formData[name]}
                  onChange={handleChange}
                  required={required}
                />
              ) : (
                <input
                  className={styles.input}
                  type={type}
                  name={name}
                  value={formData[name]}
                  placeholder={placeholder}
                  onChange={handleChange}
                  required={required}
                  disabled={disabled}
                  minLength={minLength}
                  maxLength={maxLength}
                />
              )}
            </label>
            {errors[name] && (
              <span className={styles.error}>{errors[name]}</span>
            )}
          </div>
        )
      )}
      <button
        className={styles.submitButton}
        type="submit"
        style={customStyle?.formButton}
      >
        Submit
      </button>
    </form>
  );
}

Form.propTypes = {
  fields: PropTypes.objectOf(
    PropTypes.shape({
      name: PropTypes.string.isRequired,
      label: PropTypes.string,
      type: PropTypes.string.isRequired,
      required: PropTypes.bool.isRequired,
      disable: PropTypes.bool,
      minLength: PropTypes.number,
      maxLength: PropTypes.number,
      pattern: PropTypes.string,
    })
  ),
  onSubmit: PropTypes.func.isRequired,
  externalErrors: PropTypes.object,
  customStyle: PropTypes.object,
};
