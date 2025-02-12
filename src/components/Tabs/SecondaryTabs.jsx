import styles from "./SecondaryTabs.module.css";
import { useState } from "react";
import PropTypes from "prop-types";

export default function SecondaryTabs({
  tabs,
  defaultActiveTab = 0,
  onTabChange,
}) {
  const [activeTab, setActiveTab] = useState(defaultActiveTab);

  function handleTabClick(index) {
    setActiveTab(index);
    if (onTabChange) {
      onTabChange(index);
    }
  }

  return (
    <div className={styles.tabsWrapper}>
      <div className={styles.tabsHeader}>
        {tabs.map((tab, index) => (
          <button
            key={index}
            className={`${styles.tabButton} ${
              index === activeTab ? styles.activeTabBtn : ""
            }`}
            onClick={() => handleTabClick(index)}
          >
            {tab.label}
          </button>
        ))}
      </div>
      <div className={styles.tabContent}>{tabs[activeTab].content}</div>
    </div>
  );
}

SecondaryTabs.propTypes = {
  tabs: PropTypes.arrayOf(
    PropTypes.shape({
      label: PropTypes.string.isRequired,
      content: PropTypes.node.isRequired,
    })
  ),
  defaultActiveTab: PropTypes.number.isRequired,
  onTabChange: PropTypes.func.isRequired,
};
