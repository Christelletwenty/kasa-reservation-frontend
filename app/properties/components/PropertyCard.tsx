"use client";
import { Property } from "@/app/types/properties";
import styles from "./PropertiesCard.module.css";

type PropertiesProps = {
  property: Property;
};

export default function PropertyCard({ property }: PropertiesProps) {
  return (
    <div className={styles.properties__card}>
      <div className={styles.properties__imageWrapper}>
        <img
          className={styles.properties__imagecard}
          src={property.pictures?.[0]}
          alt="Property picture"
        />
        <button className={styles.properties__favorites}>
          <img src="favorites-icon.png" alt="Favorites" />
        </button>
      </div>

      <div className={styles.properties__cardContent}>
        <h1 className={styles.properties__titlecard}>{property.title}</h1>
        <p className={styles.properties__locationcard}>{property.location}</p>
        <p className={styles.properties__pricecard}>
          {property.price_per_night}€ <span>par nuit</span>
        </p>
      </div>
    </div>
  );
}
