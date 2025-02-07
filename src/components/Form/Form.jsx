import { useState, useEffect } from "react";
import PropTypes from "prop-types";

export default function Form({ fields, onSubmit, externalErrors = {} }) {
  const [formData, setFormData] = useState(
    fields.reduce(
      (acc, field) => ({ ...acc, [field.name]: field.defaultValue || "" }),
      {}
    )
  );
  const [errors, setErrors] = useState({});

  useEffect(() => {
    setErrors(externalErrors);
  }, [externalErrors]);

  const validate = () => {
    const newErrors = {};
    fields.forEach(({ name, required, pattern, minLength, maxLength }) => {
      const value = formData[value];
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
    if (validate()) onSubmit(formData);
  };

  return (
    <form onSubmit={handleSubmit}>
      {fields.map(({ name, label, type, placeholder }) => (
        <div key={name}>
          <label>
            {label}
            {type === "checkbox" ? (
              <input
                type={type}
                name={name}
                checked={formData[name]}
                onChange={handleChange}
              />
            ) : (
              <input
                type={type}
                name={name}
                value={formData[name]}
                placeholder={placeholder}
                onChange={handleChange}
              />
            )}
          </label>
          {errors[name] && <span style={{ color: "red" }}>{errors[name]}</span>}
        </div>
      ))}
      <button type="submit">Submit</button>
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
      minLength: PropTypes.number,
      maxLength: PropTypes.number,
      pattern: PropTypes.string,
    })
  ),
  onSubmit: PropTypes.func.isRequired,
  externalErrors: PropTypes.object,
};
