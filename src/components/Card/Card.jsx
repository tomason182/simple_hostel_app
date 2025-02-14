import styles from "./Card.module.css";
import PropTypes from "prop-types";

export default function Card({
  title,
  subtitle,
  children,
  customStyle,
  actions,
}) {
  return (
    <div className={styles.cardContainer}>
      <div className={styles.titleContainer}>
        <h3>{title}</h3>
        {subtitle && <p>{subtitle}</p>}
      </div>
      <div style={customStyle?.children} className={styles.body}>
        {children}
      </div>
      {actions && (
        <div className={styles.actionsContainer} style={customStyle?.actions}>
          {actions.map((action, index) => (
            <button
              key={index}
              onClick={action.onClick}
              className={styles.actionButton}
            >
              {action.label}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

Card.propTypes = {
  title: PropTypes.string.isRequired,
  subtitle: PropTypes.string,
  children: PropTypes.node.isRequired,
  customStyle: PropTypes.object,
  actions: PropTypes.arrayOf(
    PropTypes.shape({
      onClick: PropTypes.func,
      label: PropTypes.string,
    })
  ),
};
