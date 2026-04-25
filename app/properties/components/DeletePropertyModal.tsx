"use client";

import { deleteProperty } from "@/app/lib/properties-api";
import { useState } from "react";
import styles from "./DeletePropertyModal.module.css";

// Définition du type des props attendues par le composant.
type DeletePropertyModalProps = {
  isOpen: boolean;
  propertyId: string;
  onClose: () => void;
  onConfirm: () => void;
};

export default function DeletePropertyModal({
  isOpen,
  propertyId,
  onClose,
  onConfirm,
}: DeletePropertyModalProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Si la modal n’est pas ouverte, on ne rend rien dans le DOM.
  // Cela évite d’afficher la fenêtre de confirmation inutilement.
  if (!isOpen) {
    return null;
  }

  const handleConfirmDelete = async (): Promise<void> => {
    try {
      setIsLoading(true);
      setError(null);

      // Appel API qui supprime la propriété correspondant à l'id reçu en prop.
      await deleteProperty(propertyId);
      // Si la suppression réussit, on prévient le composant parent.
      // Le parent pourra fermer la modal, recharger les données, etc.
      onConfirm();
    } catch (err) {
      setError("Erreur lors de la suppression de la propriété");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className={styles.modalOverlay} onClick={onClose}>
      <div className={styles.modalContent} onClick={(e) => e.stopPropagation()}>
        <h2>Supprimer cette propriété ?</h2>
        <p>Cette action est irréversible.</p>

        {error && <p className={styles.error}>{error}</p>}

        <div className={styles.modalActions}>
          <button onClick={onClose} disabled={isLoading}>
            Annuler
          </button>
          <button onClick={handleConfirmDelete} disabled={isLoading}>
            {isLoading ? "Suppression..." : "Confirmer"}
          </button>
        </div>
      </div>
    </div>
  );
}
