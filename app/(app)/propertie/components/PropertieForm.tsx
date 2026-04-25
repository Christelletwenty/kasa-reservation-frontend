"use client";
import { CreateProperty, Property } from "@/app/types/properties";
import styles from "./CreateProperty.module.css";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { User } from "@/app/types/users";
import { BACKEND_URL } from "@/app/lib/config";
import { uploadImage } from "@/app/lib/upload-api";
import { updateUserById } from "@/app/lib/users-api";

// Définition des props attendues par le composant.
type PropertiesProps = {
  // Propriété optionnelle : si elle existe, le formulaire est prérempli en mode édition.
  property?: Property;
  // Utilisateur connecté, utilisé notamment pour définir l'hôte de la propriété.
  currentUser: User;
  // Fonction appelée lorsque le formulaire est validé
  onSubmit: (form: CreateProperty) => void;
};

export default function PropertieForm({
  property,
  currentUser,
  onSubmit,
}: PropertiesProps) {
  const router = useRouter();
  const [profilePicture, setProfilePicture] = useState<string | null>(null);
  const [customTag, setCustomTag] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const isEditMode = Boolean(property);

  useEffect(() => {
    // Sécurité : si currentUser n'existe pas encore, on ne fait rien.
    if (!currentUser) return;

    // On met à jour uniquement `host_id`, en conservant le reste du formulaire.
    setForm((prev) => ({
      ...prev,
      host_id: currentUser.id,
    }));
  }, [currentUser]);

  // Liste statique des équipements possibles.
  // Elle sert à générer les checkboxes dans le formulaire.
  const possibleEquipments = [
    "Micro-Ondes",
    "Douche italienne",
    "Frigo",
    "WIFI",
    "Parking",
    "Sèche Cheveux",
    "Machine à laver",
    "Cuisine équipée",
    "Télévision",
    "Chambre Séparée",
    "Climatisation",
    "Frigo Américain",
    "Clic-clac",
    "Four",
    "Rangements",
    "Lit",
    "Bouilloire",
    "SDB",
    "Toilettes sèches",
    "Cintres",
    "Baie vitrée",
    "Hotte",
    "Baignoire",
    "Vue Parc",
  ];

  // Liste statique des catégories proposées à l'utilisateur.
  // L'utilisateur peut aussi ajouter ses propres tags personnalisés plus bas.
  const possibleCategories = [
    "Parc",
    "Night Life",
    "Culture",
    "Nature",
    "Touristique",
    "Vue sur mer",
    "Pour les couples",
    "Famille",
    "Forêt",
  ];
  // État principal du formulaire.
  const [form, setForm] = useState<CreateProperty>({
    title: "",
    description: "",
    cover: "",
    location: "",
    price_per_night: 0,
    pictures: [],
    equipments: [],
    host_id: 0,
    tags: [],
  });

  // Ce useEffect est utilisé pour préremplir le formulaire en mode édition.
  useEffect(() => {
    if (property) {
      setForm({
        title: property.title,
        description: property.description,
        cover: property.cover,
        location: property.location,
        price_per_night: property.price_per_night,
        pictures: property.pictures,
        equipments: property.equipments ?? [],
        host_id: currentUser.id,
        tags: property.tags ?? [],
      });
    }
  }, [property, currentUser]);

  // Priorité à `profilePicture`, car c'est la nouvelle image uploadée localement.
  // Si aucune nouvelle image n'a été uploadée, on utilise celle du currentUser.
  const pictureToDisplay = profilePicture ?? currentUser?.picture;

  // Supprime une image du logement à partir de son index dans le tableau.
  const handleRemovePicture = (indexToRemove: number) => {
    setForm((prev) => ({
      ...prev,
      // On recrée un tableau en gardant toutes les images sauf celle à supprimer.
      pictures: (prev.pictures ?? []).filter(
        (_, index) => index !== indexToRemove,
      ),
    }));
  };

  // Supprime la photo de profil de l'utilisateur courant.
  // La suppression est faite côté backend en mettant `picture` à une chaîne vide.
  const handleRemoveProfilePicture = async () => {
    // Sécurité : si aucun utilisateur courant n'est disponible, on arrête la fonction.
    if (!currentUser) return;

    try {
      setLoading(true);
      setError("");

      await updateUserById(currentUser.id, {
        picture: "",
      });

      setProfilePicture(null);
      // On demande à Next.js de rafraîchir les données affichées.
      router.refresh();
    } catch (err) {
      const message =
        err instanceof Error
          ? err.message
          : "Erreur lors de la suppression de la photo de profil";
      setError(message);
    } finally {
      setLoading(false);
    }
  };

  // Gère le changement de photo de profil.
  // Cette fonction est appelée lorsqu'un utilisateur sélectionne un fichier image.
  const handleProfilePictureChange = async (
    e: React.ChangeEvent<HTMLInputElement>,
  ) => {
    // On récupère le premier fichier sélectionné.
    const file = e.target.files?.[0];
    // Si aucun fichier n'est sélectionné ou si aucun utilisateur n'est disponible,
    // on arrête la fonction.
    if (!file || !currentUser) return;

    try {
      setLoading(true);
      setError("");

      const uploadedImage = await uploadImage(file, "user-picture");
      setProfilePicture(uploadedImage.url);

      await updateUserById(currentUser.id, {
        picture: uploadedImage.url,
      });

      router.refresh();
    } catch (err) {
      const message =
        err instanceof Error
          ? err.message
          : "Erreur lors de l'upload de la photo de profil";
      setError(message);
    } finally {
      setLoading(false);
    }
  };

  // Gère l'upload de l'image de couverture de la propriété.
  const handleCoverChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    // Si aucun fichier n'est choisi, on ne fait rien.
    if (!file) return;

    try {
      setLoading(true);
      setError("");

      // Upload du fichier côté backend.
      const uploadedImage = await uploadImage(file, "property-cover");

      // On met à jour le champ `cover` dans le formulaire.
      // BACKEND_URL est ajouté devant l'URL relative retournée par l'API.
      setForm((prev) => ({
        ...prev,
        cover: `${BACKEND_URL}${uploadedImage.url}`,
      }));
    } catch (err) {
      const message =
        err instanceof Error
          ? err.message
          : "Erreur lors de l'upload de l'image de couverture";
      setError(message);
    } finally {
      setLoading(false);
    }
  };

  // Gère l'upload de plusieurs images du logement.
  const handlePicturesChange = async (
    e: React.ChangeEvent<HTMLInputElement>,
  ) => {
    const files = e.target.files;
    if (!files) return;

    try {
      setLoading(true);
      setError("");

      // `files` est une FileList, pas un vrai tableau.
      // On utilise Array.from(files) pour pouvoir utiliser `.map()` dessus.
      // Promise.all permet d'attendre que tous les uploads soient terminés.
      const uploadedImages = await Promise.all(
        Array.from(files).map((file) => uploadImage(file, "property-picture")),
      );

      // On transforme les réponses de l'API en URLs complètes utilisables dans les images.
      const uploadedUrls = uploadedImages.map(
        (image) => `${BACKEND_URL}${image.url}`,
      );

      // On ajoute les nouvelles images à celles déjà présentes dans le formulaire.
      setForm((prev) => ({
        ...prev,
        pictures: [...(prev.pictures ?? []), ...uploadedUrls],
      }));
    } catch (err) {
      const message =
        err instanceof Error
          ? err.message
          : "Erreur lors de l'upload des images du logement";
      setError(message);
    } finally {
      setLoading(false);
    }
  };

  // Raccourci pratique pour éviter d'écrire `form.pictures ?? []` partout dans le JSX.
  const pictures = form.pictures ?? [];

  // Même logique pour les tags : on garantit toujours un tableau.
  const tags = form.tags ?? [];

  // Liste finale des catégories à afficher.
  const allCategories = [
    ...possibleCategories,
    ...tags.filter((tag) => !possibleCategories.includes(tag)),
  ];

  return (
    <div className={styles.createProperty__page}>
      <form
        onSubmit={(e) => {
          e.preventDefault();
          onSubmit(form);
        }}
        className={styles.createproperty__container}
      >
        <div className={styles.createProperty__page__actions}>
          <button
            type="button"
            onClick={() => router.push("/properties")}
            className={styles.properties__backButton}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={1.5}
              stroke="currentColor"
              className="size-4"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M10.5 19.5 3 12m0 0 7.5-7.5M3 12h18"
              />
            </svg>
            Retour
          </button>

          <div className={styles.properties__addProperty}>
            <h1>{property ? "Modifier" : "Ajouter"} une propriété</h1>
            <button type="submit" disabled={loading}>
              {loading ? "En cours..." : property ? "Modifier" : "Ajouter"}
            </button>
          </div>
        </div>
        <div className={styles.createproperty__form_container}>
          <div className={styles.properties__addProperty}></div>
          <div className={styles.createproperty__form}>
            <label
              className={styles.createProperty__label}
              htmlFor="property-title"
            >
              Titre de la propriété
            </label>
            <input
              className={styles.createProperty__input}
              type="text"
              id="property-title"
              placeholder="Ex : Appartement cosy au coeur de Paris"
              required
              value={form.title}
              onChange={(e) =>
                setForm((prev) => ({ ...prev, title: e.target.value }))
              }
            />

            <label
              className={styles.createProperty__label}
              htmlFor="description"
            >
              Description
            </label>
            <textarea
              rows={4}
              cols={50}
              className={styles.createProperty__input}
              id="description"
              placeholder="Ex : Décrivez votre propriété en détail..."
              required
              value={form.description}
              onChange={(e) =>
                setForm((prev) => ({
                  ...prev,
                  description: e.target.value,
                }))
              }
            />

            <label
              className={styles.createProperty__label}
              htmlFor="postal-code"
            >
              Code postal
            </label>
            <input
              className={styles.createProperty__input}
              type="number"
              id="postal-code"
            />

            <label
              className={styles.createProperty__label}
              htmlFor="property-localisation"
            >
              Localisation
            </label>
            <input
              className={styles.createProperty__input}
              type="text"
              id="property-localisation"
              required
              value={form.location}
              onChange={(e) =>
                setForm((prev) => ({ ...prev, location: e.target.value }))
              }
            />

            <label
              className={styles.createProperty__label}
              htmlFor="price-per-night"
            >
              Prix par nuit
            </label>
            <input
              className={styles.createProperty__input}
              type="number"
              id="price-per-night"
              min="0"
              step="0.01"
              required
              value={form.price_per_night}
              onChange={(e) =>
                setForm((prev) => ({
                  ...prev,
                  price_per_night: parseFloat(e.target.value) || 0,
                }))
              }
            />
          </div>
        </div>

        <div className={styles.createProperty__coverImage}>
          <div className={styles.imageCard}>
            <div className={styles.imageBlock}>
              <label htmlFor="coverImage" className={styles.imageField__label}>
                Image de couverture
              </label>

              <div className={styles.imageField__row}>
                <div className={styles.imageField__fakeInput}>
                  {form.cover ? "Image ajoutée" : ""}
                </div>

                <label
                  htmlFor="coverImage"
                  className={styles.imageField__button}
                >
                  +
                </label>
              </div>

              <input
                id="coverImage"
                name="coverImage"
                type="file"
                accept="image/*"
                hidden
                onChange={handleCoverChange}
              />

              {form.cover && (
                <div className={styles.imageWrapper}>
                  <img
                    src={form.cover}
                    alt="Image de couverture"
                    className={styles.imagePreview}
                  />
                  <button
                    type="button"
                    className={styles.imageDelete}
                    onClick={() => setForm((prev) => ({ ...prev, cover: "" }))}
                  >
                    ✕
                  </button>
                </div>
              )}
            </div>

            <div className={styles.imageBlock}>
              <label
                htmlFor="propertyImage1"
                className={styles.imageField__label}
              >
                Image du logement
              </label>

              <div className={styles.imageField__row}>
                <div className={styles.imageField__fakeInput}>
                  {pictures.length > 0
                    ? `${pictures.length} image(s) ajoutée(s)`
                    : ""}
                </div>

                <label
                  htmlFor="propertyImage1"
                  className={styles.imageField__button}
                >
                  +
                </label>
              </div>

              <input
                id="propertyImage1"
                name="propertyImages"
                type="file"
                accept="image/*"
                multiple
                hidden
                onChange={handlePicturesChange}
              />

              <p className={styles.imageField__link}>+ Ajouter une image</p>

              {pictures.length > 0 && (
                <div className={styles.previewGrid}>
                  {pictures.map((picture, index) => (
                    <div
                      key={`${picture}-${index}`}
                      className={styles.imageWrapper}
                    >
                      <img
                        key={`${picture}-${index}`}
                        src={picture}
                        alt={`Photo du logement ${index + 1}`}
                        className={styles.imagePreview}
                      />
                      <button
                        type="button"
                        className={styles.imageDelete}
                        onClick={() => handleRemovePicture(index)}
                      >
                        ✕
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          <div className={styles.hostCard}>
            <label htmlFor="hostName" className={styles.imageField__label}>
              Nom de l'hôte
            </label>
            <p className={styles.createProperty__hostname}>
              {currentUser.name ?? ""}
            </p>
            <label htmlFor="profileImage" className={styles.imageField__label}>
              Photo de profil
            </label>

            <div className={styles.imageField__row}>
              <div className={styles.imageField__fakeInput}>
                {currentUser.picture ? "Image ajoutée" : "Aucune image"}
              </div>

              <label
                htmlFor="profileImage"
                className={styles.imageField__button}
              >
                +
              </label>
            </div>

            <input
              id="profileImage"
              name="profileImage"
              type="file"
              accept="image/*"
              hidden
              onChange={handleProfilePictureChange}
            />

            <p className={styles.imageField__link}>+ Ajouter une image</p>

            {pictureToDisplay && (
              <div className={styles.imageWrapper}>
                <img
                  src={`${pictureToDisplay.startsWith("http") ? "" : BACKEND_URL}${pictureToDisplay}`}
                  alt="Photo de profil"
                  className={styles.imagePreview}
                />
                <button
                  type="button"
                  className={styles.imageDelete}
                  onClick={handleRemoveProfilePicture}
                >
                  ✕
                </button>
              </div>
            )}
          </div>
        </div>

        {!isEditMode && (
          <div className={styles.property__equipments}>
            <h2 className={styles.property__equipments__title}>Equipements</h2>

            {possibleEquipments.map((equipment) => (
              <label
                key={equipment}
                className={styles.property__equipments_item}
              >
                <input
                  type="checkbox"
                  name="equipments"
                  checked={form.equipments.includes(equipment)}
                  onChange={(event) =>
                    setForm((prev) => {
                      const checked = event.target.checked;

                      const currentEquipments = prev.equipments ?? [];

                      const newEquipments = checked
                        ? [...currentEquipments, equipment]
                        : currentEquipments.filter((e) => e !== equipment);

                      return {
                        ...prev,
                        equipments: newEquipments,
                      };
                    })
                  }
                />
                <span>{equipment}</span>
              </label>
            ))}
          </div>
        )}

        {!isEditMode && (
          <div className={styles.property__category}>
            <h2 className={styles.property__category__title}>Catégories</h2>

            <div className={styles.property__category__buttons}>
              {allCategories.map((category) => {
                const isSelected = tags.includes(category);

                return (
                  <button
                    key={category}
                    type="button"
                    onClick={() =>
                      setForm((prev) => {
                        const currentTags = prev.tags ?? [];

                        const newTags = currentTags.includes(category)
                          ? currentTags.filter((t) => t !== category)
                          : [...currentTags, category];

                        return {
                          ...prev,
                          tags: newTags,
                        };
                      })
                    }
                    className={`${styles.property__category__chip} ${
                      isSelected ? styles.selected : ""
                    }`}
                  >
                    {category}
                  </button>
                );
              })}
            </div>

            <div className={styles.custom__category}>
              <h2 className={styles.custom__category__title}>
                Ajouter une catégorie personnalisée
              </h2>

              <input
                type="text"
                className={styles.custom__category__input}
                placeholder="Nouveau tag"
                aria-label="Nouveau tag"
                value={customTag}
                onChange={(e) => setCustomTag(e.target.value)}
              />

              <button
                type="button"
                className={styles.imageField__button}
                onClick={() => {
                  if (!customTag.trim()) return;

                  setForm((prev) => {
                    const currentTags = prev.tags ?? [];

                    // éviter les doublons
                    if (currentTags.includes(customTag)) return prev;

                    return {
                      ...prev,
                      tags: [...currentTags, customTag],
                    };
                  });

                  setCustomTag(""); // reset input
                }}
              >
                +
              </button>

              <button
                type="button"
                className={styles.custom__category__link}
                onClick={() => {
                  if (!customTag.trim()) return;

                  setForm((prev) => {
                    const currentTags = prev.tags ?? [];

                    if (currentTags.includes(customTag)) return prev;

                    return {
                      ...prev,
                      tags: [...currentTags, customTag],
                    };
                  });

                  setCustomTag("");
                }}
              >
                + Ajouter un tag
              </button>
            </div>
          </div>
        )}

        {error && <p className={styles.error}>{error}</p>}
      </form>
    </div>
  );
}
