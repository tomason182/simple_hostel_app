import styles from "./Photos.module.css";
import { useTranslation } from "react-i18next";
import RoomsPhotos from "./RoomsPhotos";
import PropertyPhotos from "./PropertyPhotos";
import { useState } from "react";

export default function Photos() {
  const { t } = useTranslation();
  const [index, setIndex] = useState(0);
  return (
    <div className={styles.mainContainer}>
      <div className={styles.leftContainer}>
        <button
          onClick={() => setIndex(0)}
          className={index === 0 ? styles.active : ""}
        >
          {t("property")}
        </button>

        <button
          onClick={() => setIndex(1)}
          className={index === 1 ? styles.active : ""}
        >
          {t("room_types")}
        </button>
      </div>
      <div className={styles.rightContainer}>
        {index === 0 && <PropertyPhotos />}
        {index === 1 && <RoomsPhotos />}
      </div>
    </div>
  );
}
