"use client";
import { Property } from "@/app/types/properties";
import styles from "./PropertiesCard.module.css";
import { useEffect, useState } from "react";
import {
  addPropertiesToFavorites,
  deletePropertiesFromFavorites,
} from "@/app/lib/favorites-api";
import { useRouter } from "next/navigation";
import Link from "next/link";
import DeletePropertyModal from "./DeletePropertyModal";

type PropertiesProps = {
  property: Property;
  favorites?: boolean;
  favoriteChanged: (fav: boolean) => void;
  canDelete: boolean;
  onDelete?: () => void;
  canFavorite?: boolean;
  canEdit?: boolean;
};

export default function PropertyCard({
  property,
  favorites,
  favoriteChanged,
  canDelete = false,
  onDelete,
  canFavorite = false,
  canEdit = false,
}: PropertiesProps) {
  const router = useRouter();
  const [isFavorite, setIsFavorite] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [deleteModal, setDeleteModal] = useState(false);

  useEffect(() => {
    setIsFavorite(!!favorites);
  }, [favorites]);

  const handleFavorite = async (e: React.MouseEvent<HTMLButtonElement>) => {
    // Empêche le clic de remonter jusqu’à la carte
    // Sans ça, cliquer sur le cœur redirigerait vers la page détail
    e.stopPropagation();
    try {
      setIsLoading(true);
      setError(null);

      // Si la propriété est déjà en favori, on la retire
      if (isFavorite) {
        await deletePropertiesFromFavorites(property.id);
        setIsFavorite(false);
        favoriteChanged(false);
      } else {
        // Sinon, on ajoute la propriété aux favoris
        await addPropertiesToFavorites(property.id);
        setIsFavorite(true);
        favoriteChanged(true);
      }
    } catch (err) {
      setError("Erreur lors de l'ajout aux favoris");
    } finally {
      // finally est toujours exécuté, succès ou erreur
      // On réactive donc le bouton
      setIsLoading(false);
    }
  };

  // Redirige vers la page détail de la propriété
  const handleNavToDetail = () => {
    router.push(`/properties/${property.id}`);
  };

  // Ouvre la modal de suppression
  const handleOpenDeleteModal = (
    e: React.MouseEvent<HTMLButtonElement>,
  ): void => {
    // Empêche la navigation vers le détail quand on clique sur supprimer
    e.stopPropagation();
    setDeleteModal(true);
  };

  // Ferme la modal de suppression
  const handleCloseDeleteModal = (
    e?: React.MouseEvent<HTMLButtonElement>,
  ): void => {
    // Le ? permet d’appeler stopPropagation uniquement si e existe
    e?.stopPropagation();
    setDeleteModal(false);
  };

  // Fonction appelée quand la suppression a bien été confirmée dans la modal
  const handleDeleteSuccess = (): void => {
    setDeleteModal(false);
    // On prévient le parent qu’une propriété a été supprimée
    // Le ?. évite une erreur si onDelete n’a pas été fourni
    onDelete?.();
  };

  return (
    <div onClick={handleNavToDetail} className={styles.properties__card}>
      <div className={styles.properties__imageWrapper}>
        <img
          className={styles.properties__imagecard}
          src={property.cover}
          alt="Property picture"
        />
        {error && <p className={styles.properties__error}>{error}</p>}
        {canFavorite && (
          <button
            onClick={handleFavorite}
            disabled={isLoading}
            className={`${styles.properties__favorites} ${isFavorite ? styles.properties__favoritesActive : ""}`}
          >
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
        )}

        {canDelete && (
          <button
            className={styles.deleteButton_modal}
            onClick={handleOpenDeleteModal}
            disabled={isLoading}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="currentColor"
              viewBox="0 0 24 24"
              strokeWidth={1.5}
              stroke="white"
              className="size-6"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 0 0-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 0 0-7.5 0"
              />
            </svg>
          </button>
        )}

        {canEdit && (
          <Link
            href={`/propertie/${property.id}`}
            onClick={(e) => e.stopPropagation()}
            className={styles.updateButton_modal}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="currentColor"
              viewBox="0 0 24 24"
              strokeWidth={1.5}
              stroke="white"
              className="size-6"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="m16.862 4.487 1.687-1.688a1.875 1.875 0 1 1 2.652 2.652L10.582 16.07a4.5 4.5 0 0 1-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 0 1 1.13-1.897l8.932-8.931Zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0 1 15.75 21H5.25A2.25 2.25 0 0 1 3 18.75V8.25A2.25 2.25 0 0 1 5.25 6H10"
              />
            </svg>
          </Link>
        )}
      </div>

      <div className={styles.properties__cardContent}>
        <h1 className={styles.properties__titlecard}>{property.title}</h1>
        <p className={styles.properties__locationcard}>{property.location}</p>
        <p className={styles.properties__pricecard}>
          {property.price_per_night}€ <span>par nuit</span>
        </p>
      </div>

      <DeletePropertyModal
        isOpen={deleteModal}
        propertyId={property.id}
        onClose={handleCloseDeleteModal}
        onConfirm={handleDeleteSuccess}
      />
    </div>
  );
}
