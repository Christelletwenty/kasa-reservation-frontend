"use client";
import styles from "./PropertiesDetailPage.module.css";

export default function PropertyDetailPage() {
  return (
    <div className={styles.properties__detailPage}>
      <button className={styles.properties__detailTitle}>
        <img src="back.png" alt="Back" />
        Retour aux annonces
      </button>
    </div>
  );
}
