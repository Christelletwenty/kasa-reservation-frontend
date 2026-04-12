"use client";
import { Property } from "@/app/types/properties";
import styles from "./PropertiesCard.module.css";
import { useState } from "react";
import {
  addPropertiesToFavorites,
  deletePropertiesFromFavorites,
} from "@/app/lib/favorites-api";

type PropertiesProps = {
  property: Property;
  favorites?: boolean;
  favoriteChanged: (fav: boolean) => void;
};

export default function PropertyCard({
  property,
  favorites,
  favoriteChanged,
}: PropertiesProps) {
  const [isFavorite, setIsFavorite] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useState(() => {
    setIsFavorite(!!favorites);
  });

  const handleFavorite = async () => {
    try {
      setIsLoading(true);
      setError(null);

      if (isFavorite) {
        await deletePropertiesFromFavorites(property.id);
        setIsFavorite(false);
        favoriteChanged(false);
      } else {
        await addPropertiesToFavorites(property.id);
        setIsFavorite(true);
        favoriteChanged(true);
      }
    } catch (err) {
      setError("Erreur lors de l'ajout aux favoris");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className={styles.properties__card}>
      <div className={styles.properties__imageWrapper}>
        <img
          className={styles.properties__imagecard}
          src={property.cover}
          alt="Property picture"
        />
        {error && <p className={styles.properties__error}>{error}</p>}
        <button
          onClick={handleFavorite}
          disabled={isLoading}
          className={`${styles.properties__favorites} ${isFavorite ? styles.properties__favoritesActive : ""}`}
        >
          {/* <img src="favorites-icon.png" alt="Favorites" /> */}
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="currentColor"
            viewBox="0 0 24 24"
            strokeWidth={1.5}
            stroke="white"
            className="size-4"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12Z"
            />
          </svg>
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
