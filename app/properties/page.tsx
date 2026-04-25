"use client";

import { useEffect, useState } from "react";
import { Property } from "../types/properties";
import PropertyCard from "./components/PropertyCard";
import styles from "./PropertiesPage.module.css";
import { getProperties } from "../lib/properties-api";
import { getFavoritesUsers } from "../lib/favorites-api";
import { getStoredUserId } from "../lib/auth-guard";

export default function PropertiesPage() {
  const [properties, setProperties] = useState<Property[]>([]);
  const [favProperties, setFavProperties] = useState<Property[]>([]);
  const [currentUserId, setCurrentUserId] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const isLoggedIn = currentUserId !== null;

  /**
   * EFFECT: Chargement initial des données
   *
   * - Récupère l’utilisateur courant
   * - Charge les propriétés
   * - Charge les favoris si user connecté
   */
  useEffect(() => {
    const userId = getStoredUserId();
    setCurrentUserId(userId);

    (async () => {
      try {
        setLoading(true);
        setError("");

        // Récupération des propriétés
        const propertiesResponse = await getProperties();
        setProperties(propertiesResponse);

        // Si utilisateur connecté → récupération des favoris
        if (userId !== null) {
          const favoritesResponse = await getFavoritesUsers(userId);
          setFavProperties(favoritesResponse);
        } else {
          // Pas connecté → aucun favori
          setFavProperties([]);
        }
      } catch (err) {
        setError("Erreur lors du chargement des propriétés");
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  if (loading) {
    return <div>Chargement...</div>;
  }

  if (error) {
    return <div>{error}</div>;
  }

  return (
    <div className={styles.properties__page}>
      <div className={styles.properties__content}>
        <h1 className={styles.properties__title}>
          Chez vous, partout ailleurs
        </h1>
        <p className={styles.properties__description}>
          Avec Kasa, vivez des séjours uniques dans des hébergements chaleureux,
          sélectionnés avec soin par nos hôtes.
        </p>
        <img
          src="kasa-properties.png"
          alt="kasa-properties"
          className={styles.properties__image}
        />
      </div>

      <div className={styles.properties__cards}>
        {properties.map((p) => (
          <PropertyCard
            key={p.id}
            property={p}
            canFavorite={isLoggedIn}
            canEdit={currentUserId === p.host.id}
            canDelete={currentUserId === p.host.id}
            favorites={favProperties.some((fav) => fav.id === p.id)}
            favoriteChanged={(fav) => {
              if (fav) {
                setFavProperties((prev) => [...prev, p]);
              } else {
                setFavProperties((prev) =>
                  prev.filter((fav) => fav.id !== p.id),
                );
              }
            }}
            onDelete={() => {
              setProperties((prev) =>
                prev.filter((property) => property.id !== p.id),
              );
              setFavProperties((prev) => prev.filter((fav) => fav.id !== p.id));
            }}
          />
        ))}
      </div>

      <div className={styles.properties__howItWorks}>
        <h2 className={styles.properties__howItWorksTitle}>
          Comment ça marche ?
        </h2>
        <p className={styles.properties__howItWorksDescription}>
          Que vous partiez pour un week-end improvisé, des vacances en famille
          ou un voyage professionnel, Kasa vous aide à trouver un lieu qui vous
          ressemble.
        </p>

        <div className={styles.properties__howItWorksSteps}>
          <div className={styles.properties__howItWorksStep}>
            <h3 className={styles.properties__howItWorksStepTitle}>
              Recherchez
            </h3>
            <p className={styles.properties__howItWorksStepDescription}>
              Entrez votre destination, vos dates et laissez Kasa faire le reste
            </p>
          </div>

          <div className={styles.properties__howItWorksStep}>
            <h3 className={styles.properties__howItWorksStepTitle}>Réservez</h3>
            <p className={styles.properties__howItWorksStepDescription}>
              Profitez d’une plateforme sécurisée et de profils d’hôtes
              vérifiés.
            </p>
          </div>

          <div className={styles.properties__howItWorksStep}>
            <h3 className={styles.properties__howItWorksStepTitle}>
              Vivez l’expérience
            </h3>
            <p className={styles.properties__howItWorksStepDescription}>
              Installez-vous, profitez de votre séjour, et sentez-vous chez
              vous, partout.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
