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
        <ul className={styles.selectionList}>
          <li>
            <button onClick={() => setIndex(0)}>{t("property")}</button>
          </li>
          <li>
            <button onClick={() => setIndex(1)}>{t("room_types")}</button>
          </li>
        </ul>
      </div>
      <div className={styles.rightContainer}>
        {index === 0 && <PropertyPhotos />}
        {index === 1 && <RoomsPhotos />}
      </div>
    </div>
  );
}
