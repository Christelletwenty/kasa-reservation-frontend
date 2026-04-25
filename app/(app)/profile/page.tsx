"use client";

import { ChangeEvent, useEffect, useState } from "react";
import styles from "./Profile.module.css";
import { User } from "@/app/types/users";
import { getStoredUserId } from "@/app/lib/auth-guard";
import { BACKEND_URL } from "@/app/lib/config";
import { getUserById, updateUserById } from "@/app/lib/users-api";
import { uploadImage } from "@/app/lib/upload-api";

// Type représentant l'état du formulaire.
type FormState = {
  name: string;
  picture: string | null;
  role: string;
};

export default function MyProfilePage() {
  // Récupère l'id de l'utilisateur connecté depuis le stockage session.
  const currentUserId = getStoredUserId();

  const [user, setUser] = useState<User | null>(null);
  // Stocke les valeurs affichées dans le formulaire.
  const [form, setForm] = useState<FormState>({
    name: "",
    picture: null,
    role: "",
  });

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [picturePreview, setPicturePreview] = useState<string | null>(null);
  const [removePicture, setRemovePicture] = useState(false);

  useEffect(() => {
    const loadUser = async () => {
      // Si aucun id utilisateur n'est trouvé, on ne peut pas charger le profil.
      if (!currentUserId) {
        setError("Impossible de récupérer l'utilisateur connecté.");
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        setError("");
        setSuccess("");

        const fetchedUser = await getUserById(Number(currentUserId));

        setUser(fetchedUser);
        // On initialise le formulaire avec les données reçues.
        setForm({
          name: fetchedUser.name ?? "",
          picture: fetchedUser.picture ?? null,
          role: fetchedUser.role ?? "",
        });

        // On initialise aussi l'aperçu de l'image.
        setPicturePreview(fetchedUser.picture ?? null);
        setSelectedFile(null);
        setRemovePicture(false);
      } catch (err) {
        const message =
          err instanceof Error
            ? err.message
            : "Erreur lors du chargement du profil";
        setError(message);
      } finally {
        setLoading(false);
      }
    };

    // On appelle la fonction async sans attendre son résultat directement dans useEffect.
    void loadUser();
  }, [currentUserId]);

  // Remet le formulaire dans l'état exact de l'utilisateur actuel.
  // Utilisé quand on annule l'édition ou après une sauvegarde.
  const resetFormFromUser = (currentUser: User) => {
    setForm({
      name: currentUser.name ?? "",
      picture: currentUser.picture ?? null,
      role: currentUser.role ?? "",
    });

    setPicturePreview(currentUser.picture ?? null);
    setSelectedFile(null);
    setRemovePicture(false);
  };

  // Détermine quelle image afficher dans la balise <img>.
  const getPictureSrc = (): string => {
    // Si l'utilisateur a supprimé sa photo ou s'il n'y en a pas,
    // on affiche une image par défaut.
    if (removePicture || !picturePreview) {
      return "/default-avatar.png";
    }

    // Si l'image est déjà une URL complète, on l'utilise directement.
    // Sinon, on ajoute l'URL du backend devant le chemin.
    return picturePreview.startsWith("http")
      ? picturePreview
      : `${BACKEND_URL}${picturePreview}`;
  };

  // Active le mode édition.
  const handleStartEdit = () => {
    setError("");
    setSuccess("");
    setIsEditing(true);
  };

  // Annule les modifications et restaure les valeurs d'origine.
  const handleCancelEdit = () => {
    if (!user) return;

    resetFormFromUser(user);
    setError("");
    setSuccess("");
    setIsEditing(false);
  };

  // Met à jour un champ du formulaire.
  // Ici seul le champ "name" est modifiable.
  const handleInputChange = (field: "name", value: string) => {
    setForm((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  // Déclenché lorsqu'un utilisateur choisit une nouvelle image.
  const handlePictureChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // On garde le fichier sélectionné pour pouvoir l'envoyer au backend au moment du save.
    setSelectedFile(file);
    // Si une nouvelle image est sélectionnée, on annule l'état "suppression".
    setRemovePicture(false);
    // Crée une URL temporaire locale pour afficher immédiatement un aperçu.
    setPicturePreview(URL.createObjectURL(file));
  };

  // Supprime la photo côté interface.
  // La suppression réelle côté backend sera faite au moment de la sauvegarde.
  const handleRemovePicture = () => {
    setSelectedFile(null);
    setRemovePicture(true);
    setPicturePreview(null);

    setForm((prev) => ({
      ...prev,
      picture: null,
    }));
  };

  // Sauvegarde les modifications du profil.
  const handleSave = async () => {
    if (!currentUserId || !user) {
      setError("Utilisateur introuvable.");
      return;
    }

    try {
      setSaving(true);
      setError("");
      setSuccess("");

      // Par défaut, on conserve l'image actuelle.
      let nextPicture = user.picture ?? null;

      // Si l'utilisateur a demandé la suppression de l'image,
      // on envoie une valeur vide au backend.
      if (removePicture) {
        nextPicture = "";
        // Sinon, s'il a choisi un nouveau fichier,
        // on upload l'image avant de mettre à jour le profil.
      } else if (selectedFile) {
        const uploadedImage = await uploadImage(selectedFile, "user-picture");
        nextPicture = uploadedImage.url;
      }

      const updatedUser = await updateUserById(Number(currentUserId), {
        name: form.name.trim(),
        picture: nextPicture,
      });

      setUser(updatedUser);
      resetFormFromUser(updatedUser);
      setIsEditing(false);
      setSuccess("Les informations du profil ont bien été mises à jour.");
    } catch (err) {
      const message =
        err instanceof Error
          ? err.message
          : "Erreur lors de la mise à jour du profil";
      setError(message);
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className={styles.profile__page}>
        <h1 className={styles.profile__title}>Mon compte</h1>
        <p>Chargement du profil...</p>
      </div>
    );
  }

  return (
    <div className={styles.profile__page}>
      <h1 className={styles.profile__title}>Mon compte</h1>

      {!isEditing ? (
        <div className={styles.profile__actions}>
          <button
            type="button"
            className={styles.modify__profile}
            onClick={handleStartEdit}
          >
            Modifier les informations du profil
          </button>
        </div>
      ) : (
        <div className={styles.profile__actions}>
          <button
            type="button"
            className={styles.modify__profile}
            onClick={handleSave}
            disabled={saving}
          >
            {saving ? "Enregistrement..." : "Enregistrer"}
          </button>

          <button
            type="button"
            className={styles.cancel__profile}
            onClick={handleCancelEdit}
            disabled={saving}
          >
            Annuler
          </button>
        </div>
      )}

      {error && <p className={styles.error}>{error}</p>}
      {success && <p className={styles.success}>{success}</p>}

      <div className={styles.profile__form__container}>
        <form
          className={styles.profile__form}
          onSubmit={(e) => e.preventDefault()}
        >
          <div className={styles.profile__picture__section}>
            <img
              src={getPictureSrc()}
              alt="Photo de profil"
              className={styles.profile__picture}
            />

            {isEditing && (
              <>
                <div className={styles.picture__actions}>
                  <label
                    htmlFor="profilePicture"
                    className={styles.change__picture__button}
                  >
                    Changer la photo
                  </label>

                  <input
                    id="profilePicture"
                    name="profilePicture"
                    type="file"
                    accept="image/*"
                    hidden
                    onChange={handlePictureChange}
                  />

                  {(picturePreview || user?.picture) && !removePicture && (
                    <button
                      type="button"
                      className={styles.delete__picture__button}
                      onClick={handleRemovePicture}
                    >
                      Supprimer la photo
                    </button>
                  )}
                </div>

                {selectedFile && (
                  <p className={styles.picture__filename}>
                    Nouvelle photo sélectionnée : {selectedFile.name}
                  </p>
                )}
              </>
            )}
          </div>

          <label htmlFor="name" className={styles.label}>
            Nom
            <input
              className={styles.input}
              type="text"
              id="name"
              value={form.name}
              readOnly={!isEditing}
              onChange={(e) => handleInputChange("name", e.target.value)}
            />
          </label>
          <label className={styles.label}>
            Rôle
            <input
              className={styles.input}
              type="text"
              value={form.role}
              readOnly
            />
          </label>
        </form>
      </div>
    </div>
  );
}
