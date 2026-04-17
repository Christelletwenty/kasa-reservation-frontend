"use client";
import PropertyCard from "@/app/properties/components/PropertyCard";
import styles from "./FavoritesPage.module.css";
import { useEffect, useState } from "react";
import { Property } from "@/app/types/properties";
import { getFavoritesUsers } from "@/app/lib/favorites-api";
import { getStoredUserId } from "@/app/lib/auth-guard";

export default function FavoritesPage() {
  const [properties, setProperties] = useState<Property[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const currentUserId = getStoredUserId();

  useEffect(() => {
    (async () => {
      try {
        setLoading(true);
        setError("");

        const favoritesResponse = await getFavoritesUsers(getStoredUserId()!);
        setProperties(favoritesResponse);
      } catch (err) {
        setError("Erreur lors du chargement de vos favoris");
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  if (loading) {
    return <div>Chargement...</div>;
  }

  return (
    <div className={styles.favorites__page}>
      <div className={styles.favorites__content}>
        <h1 className={styles.favorites__title}>Vos favoris</h1>
        <p className={styles.favorites__description}>
          Retrouvez ici tous les logements que vous avez aimés. Prêts à réserver
          ? Un simple clic et votre prochain séjour est en route.
        </p>
        <div className={styles.favorites__notfound}>
          {properties.length === 0 ? (
            <>
              <p className={styles.favorites__notfound_txt}>
                Vous n'avez aucun favoris pour le moment
              </p>
              <img src="/no-favorites.svg" alt="Favorite not found" />
            </>
          ) : null}
        </div>
        <div className={styles.properties__cards}>
          {properties.map((p) => (
            <PropertyCard
              canFavorite={true}
              canEdit={currentUserId === p.host.id}
              canDelete={currentUserId === p.host.id}
              key={p.id}
              property={p}
              favorites={true}
              favoriteChanged={(fav) => {
                if (!fav) {
                  setProperties((prev) =>
                    prev.filter((prop) => prop.id !== p.id),
                  );
                }
              }}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
