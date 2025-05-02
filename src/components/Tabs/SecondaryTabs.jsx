import styles from "./SecondaryTabs.module.css";
import { useState } from "react";
import PropTypes from "prop-types";

export default function SecondaryTabs({ tabs, defaultActiveTab = 0 }) {
  const [activeTab, setActiveTab] = useState(defaultActiveTab);
  const [activeSubTabIndex, setActiveSubTabIndex] = useState(null);

  function handleTabClick(index) {
    setActiveTab(index);
    const tab = tabs[index];
    if (tab.subTabs?.length) {
      setActiveSubTabIndex(0);
    } else {
      setActiveSubTabIndex(null);
    }
  }

  function handleSubTabClick(subIndex) {
    setActiveSubTabIndex(subIndex);
  }

  const currentTab = tabs[activeTab];

  return (
    <div className={styles.tabsWrapper}>
      <div className={styles.tabsHeader}>
        {tabs.map((tab, index) => (
          <div key={index}>
            <button
              className={`${styles.tabButton} ${
                index === activeTab ? styles.activeTabBtn : ""
              }`}
              onClick={() => handleTabClick(index)}
            >
              {tab.label}
            </button>

            {index === activeTab && tab.subTabs && (
              <div className={styles.subTabList}>
                {tab.subTabs.map((sub, subIndex) => (
                  <button
                    key={subIndex}
                    className={`${styles.subTabButton} ${
                      subIndex === activeSubTabIndex
                        ? styles.activeSubTabBtn
                        : ""
                    }`}
                    onClick={() => handleSubTabClick(subIndex)}
                  >
                    {sub.label}
                  </button>
                ))}
              </div>
            )}
          </div>
        ))}
      </div>
      <div className={styles.tabContent}>
        {currentTab.subTabs
          ? currentTab.subTabs[activeSubTabIndex]?.content ?? (
              <p>Please, select a submenu item.</p>
            )
          : currentTab.content}
      </div>
    </div>
  );
}

SecondaryTabs.propTypes = {
  tabs: PropTypes.arrayOf(
    PropTypes.shape({
      label: PropTypes.string.isRequired,
      content: PropTypes.node.isRequired,
      subTabs: PropTypes.arrayOf(
        PropTypes.shape({
          label: PropTypes.string.isRequired,
          content: PropTypes.node.isRequired,
        })
      ),
    })
  ).isRequired,
  defaultActiveTab: PropTypes.number.isRequired,
  onTabChange: PropTypes.func.isRequired,
};
