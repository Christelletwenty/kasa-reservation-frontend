"use client";

import { ChangeEvent, useEffect, useState } from "react";
import styles from "./Profile.module.css";
import { User } from "@/app/types/users";
import { getStoredUserId } from "@/app/lib/auth-guard";
import { BACKEND_URL } from "@/app/lib/config";
import { getUserById, updateUserById } from "@/app/lib/users-api";
import { uploadImage } from "@/app/lib/upload-api";

type EditableRole = "client" | "owner" | "admin";

type FormState = {
  name: string;
  picture: string | null;
  role: EditableRole;
};

export default function MyProfilePage() {
  const currentUserId = getStoredUserId();

  const [user, setUser] = useState<User | null>(null);
  const [form, setForm] = useState<FormState>({
    name: "",
    picture: null,
    role: "client",
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
        console.log(fetchedUser);
        setForm({
          name: fetchedUser.name ?? "",
          picture: fetchedUser.picture ?? null,
          role: fetchedUser.role,
        });

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

    void loadUser();
  }, [currentUserId]);

  const resetFormFromUser = (currentUser: User) => {
    setForm({
      name: currentUser.name ?? "",
      picture: currentUser.picture ?? null,
      role: currentUser.role,
    });

    setPicturePreview(currentUser.picture ?? null);
    setSelectedFile(null);
    setRemovePicture(false);
  };

  const getPictureSrc = (): string => {
    if (removePicture || !picturePreview) {
      return "/default-avatar.png";
    }

    return picturePreview.startsWith("http")
      ? picturePreview
      : `${BACKEND_URL}${picturePreview}`;
  };

  const handleStartEdit = () => {
    setError("");
    setSuccess("");
    setIsEditing(true);
  };

  const handleCancelEdit = () => {
    if (!user) return;

    resetFormFromUser(user);
    setError("");
    setSuccess("");
    setIsEditing(false);
  };

  const handleInputChange = (field: "name" | "email", value: string) => {
    setForm((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handlePictureChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setSelectedFile(file);
    setRemovePicture(false);
    setPicturePreview(URL.createObjectURL(file));
  };

  const handleRemovePicture = () => {
    setSelectedFile(null);
    setRemovePicture(true);
    setPicturePreview(null);

    setForm((prev) => ({
      ...prev,
      picture: null,
    }));
  };

  const canToggleRole = form.role === "client" || form.role === "owner";

  const handleRoleToggle = () => {
    setForm((prev) => ({
      ...prev,
      role: prev.role === "client" ? "owner" : "client",
    }));
  };

  const handleSave = async () => {
    if (!currentUserId || !user) {
      setError("Utilisateur introuvable.");
      return;
    }

    try {
      setSaving(true);
      setError("");
      setSuccess("");

      let nextPicture = user.picture ?? null;

      if (removePicture) {
        nextPicture = "";
      } else if (selectedFile) {
        const uploadedImage = await uploadImage(selectedFile, "user-picture");
        nextPicture = uploadedImage.url;
      }

      const updatedUser = await updateUserById(Number(currentUserId), {
        name: form.name.trim(),
        picture: nextPicture,
        role: form.role,
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
        <button
          type="button"
          className={styles.modify__profile}
          onClick={handleStartEdit}
        >
          Modifier les informations du profil
        </button>
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

          <label className={styles.label} htmlFor="role-toggle">
            Rôle
            {form.role === "admin" ? (
              <input
                className={styles.input}
                type="text"
                value="Admin"
                readOnly
              />
            ) : (
              <div className={styles.roleSwitchRow}>
                <span>Client</span>
                <input
                  id="role-toggle"
                  type="checkbox"
                  checked={form.role === "owner"}
                  disabled={!isEditing}
                  onChange={() =>
                    setForm((prev) => ({
                      ...prev,
                      role: prev.role === "client" ? "owner" : "client",
                    }))
                  }
                />
                <span>Owner</span>
              </div>
            )}
          </label>
        </form>
      </div>
    </div>
  );
}
