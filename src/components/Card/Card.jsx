import styles from "./Card.module.css";
import PropTypes from "prop-types";

export default function Card({
  title,
  subtitle,
  children,
  bodyClassName,
  actions,
}) {
  return (
    <div className={styles.cardContainer}>
      <div className={styles.titleContainer}>
        <h3>{title}</h3>
        {subtitle && <p>{subtitle}</p>}
      </div>
      <div className={bodyClassName}>{children}</div>
      {actions && (
        <div className={styles.actionsContainer}>
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
  bodyClassName: PropTypes.string.isRequired,
  actions: PropTypes.arrayOf(
    PropTypes.shape({
      onClick: PropTypes.func,
      label: PropTypes.string,
    })
  ),
};
