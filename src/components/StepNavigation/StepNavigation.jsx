import PropTypes from "prop-types";
import styles from "./StepNavigation.module.css";
import { Fragment } from "react";

export default function StepNavigation({
  activeStep,
  steps,
  onStepClick,
  clickableSteps = false,
  style = {},
}) {
  return (
    <div className={styles.stepContainer} style={style}>
      <div className={styles.progressContainer}>
        {steps.map((step, index) => (
          <Fragment key={index}>
            <div
              className={`${styles.step} ${
                index <= activeStep ? styles.active : ""
              }`}
              onClick={() =>
                clickableSteps && onStepClick && onStepClick(index)
              }
            >
              <span>{step.label}</span>
            </div>
            {index < steps.length - 1 && (
              <div
                className={`${styles.line} ${
                  index < activeStep ? styles.active : ""
                }`}
              ></div>
            )}
          </Fragment>
        ))}
      </div>
    </div>
  );
}

StepNavigation.propTypes = {
  activeStep: PropTypes.number.isRequired,
  steps: PropTypes.arrayOf(PropTypes.string).isRequired,
  onStepClick: PropTypes.func,
  clickableSteps: PropTypes.bool,
  style: PropTypes.object,
};
