"use client";

import { deleteProperty } from "@/app/lib/properties-api";
import { useState } from "react";
import styles from "./DeletePropertyModal.module.css";

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

  if (!isOpen) {
    return null;
  }

  const handleConfirmDelete = async (): Promise<void> => {
    try {
      setIsLoading(true);
      setError(null);

      await deleteProperty(propertyId);
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
