import styles from "./ToolTip.module.css";
import { useState } from "react";
import PropTypes from "prop-types";

export default function ToolTip({
  content,
  position = "top",
  trigger = "hover",
  children,
  customStyle = {},
}) {
  const [visible, setVisible] = useState(false);

  const handleMouseEnter = () => {
    if (trigger === "hover") setVisible(true);
  };

  const handleMouseLeave = () => {
    if (trigger === "hover") setVisible(false);
  };

  const handleClick = () => {
    if (trigger === "click") setVisible(!visible);
  };

  return (
    <div
      className={styles.toolTipWrapper}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      onClick={handleClick}
      style={customStyle.wrapper}
    >
      {children}
      {visible && (
        <div
          className={`${styles.toolTip} ${styles[position]}`}
          style={customStyle.toolTip}
        >
          {content}
        </div>
      )}
    </div>
  );
}

ToolTip.propTypes = {
  content: PropTypes.node.isRequired,
  position: PropTypes.oneOf(["top", "right", "bottom", "left"]).isRequired,
  trigger: PropTypes.oneOf(["hover", "click"]).isRequired,
  children: PropTypes.node.isRequired,
  customStyle: PropTypes.shape({
    wrapper: PropTypes.object,
    toolTip: PropTypes.object,
  }),
};
