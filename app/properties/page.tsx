"use client";

import PropertyCard from "./components/PropertyCard";
import styles from "./PropertiesPage.module.css";

export default function PropertiesPage() {
  return (
    <div className={styles.properties__page}>
      <div className={styles.properties__content}>
        <h1 className={styles.properties__title}>
          Chez vous , partout ailleurs
        </h1>
        <span className={styles.properties__description}>
          Avec Kasa, vivez des séjours uniques dans des hébergements chaleureux,
          sélectionnés avec soin par nos hôtes.
        </span>
        <img
          src="kasa-properties.png"
          alt="kasa-properties"
          className={styles.properties__image}
        />
      </div>
      <PropertyCard />
    </div>
  );
}
