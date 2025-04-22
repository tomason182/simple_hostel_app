import styles from "./PropertyPhotos.module.css";

export default function PropertyPhotos() {
  return (
    <>
      <div className={styles.upload}>
        <label className={styles.uploadLabel}>
          Select property images
          <input type="file" multiple accept="image/*" />
        </label>
      </div>
      <div className={styles.imagesGrid}></div>
    </>
  );
}
