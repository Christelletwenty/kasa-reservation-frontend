"use client";
import { getPropertyById } from "@/app/lib/properties-api";
import styles from "./PropertiesDetailPage.module.css";
import { useEffect, useState } from "react";
import { Property } from "@/app/types/properties";
import { useParams, useRouter } from "next/navigation";
import { BACKEND_URL } from "@/app/lib/config";
import Link from "next/link";
import { getStoredUserId } from "@/app/lib/auth-guard";

export default function PropertyDetailPage() {
  const router = useRouter();
  // Permet de récupérer les paramètres dynamiques de l'URL
  const params = useParams();

  const [property, setProperty] = useState<Property | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const id = params.id as string;
  const currentUserId = getStoredUserId();
  const isLoggedIn = currentUserId !== null;
  // Vérifie si l'utilisateur connecté est le propriétaire du logement
  // On convertit les deux valeurs en string pour éviter les problèmes de comparaison number/string
  const isOwner = String(currentUserId) === String(property?.host.id);

  useEffect(() => {
    // Si aucun ID n'est trouvé dans l'URL, on affiche une erreur
    if (!id) {
      setError("ID du logement non trouvé");
      setLoading(false);
      return;
    }
    const fetchProperty = async () => {
      try {
        setLoading(true);
        setError("");
        // Appel API pour récupérer le logement correspondant à l'id
        const propertyResponse = await getPropertyById(id);
        // On stocke le logement récupéré dans le state
        setProperty(propertyResponse);
      } catch (err) {
        setError("Erreur lors du chargement du logement");
      } finally {
        setLoading(false);
      }
    };
    // Appelle la fonction de récupération du logement
    fetchProperty();
  }, [id]); // Le useEffect se relance si l'id change

  if (loading) {
    return <div>Chargement...</div>;
  }
  if (error) {
    return <div>{error}</div>;
  }

  // Si aucun logement n'est trouvé après le chargement
  if (!property) {
    return <div>Logement non trouvée</div>;
  }

  // On récupère la photo de profil de l'hôte depuis la propriété.
  const hostPicture = property.host.picture;

  // Ici on construit l'URL finale à utiliser dans la balise <img src="...">
  const hostPictureSrc =
    // On vérifie que hostPicture existe (pas null ou undefined) et qu'elle commence par "http"
    hostPicture && hostPicture.startsWith("http")
      ? hostPicture
      : // Sinon, si hostPicture existe MAIS ne commence pas par "http" c'est une URL relative (ex: "/uploads/xxx.jpg")
        hostPicture
        ? `${BACKEND_URL}${hostPicture}`
        : "";

  return (
    <div className={styles.properties__detailPage}>
      <button
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
        Retour aux annonces
      </button>
      <div className={styles.properties__wrapper}>
        <div className={styles.properties__container}>
          <div className={styles.properties__detailImages}>
            {property.pictures && property.pictures.length > 0 && (
              <>
                <img
                  src={property.pictures[0]}
                  alt="main"
                  className={styles.properties__mainImage}
                />

                <div className={styles.properties__secondaryImages}>
                  {property.pictures.slice(1, 5).map((pic, index) => (
                    <img key={index} src={pic} alt={`img-${index}`} />
                  ))}
                </div>
              </>
            )}
          </div>
          <div className={styles.properties__details}>
            <div className={styles.properties__detailPropertie}>
              <h1 className={styles.properties__detailPropertieTitle}>
                {property.title}
              </h1>
              <p className={styles.properties__detailPropertieLocation}>
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
                    d="M15 10.5a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z"
                  />
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1 1 15 0Z"
                  />
                </svg>

                {property.location}
              </p>
              <p className={styles.properties__detailPropertieDescription}>
                {property.description}
              </p>
            </div>
            <div className={styles.properties__equipmentStat}>
              <div className={styles.properties__equipmentsCard}>
                <h2 className={styles.properties__equipmentsTitle}>
                  Équipements
                </h2>
                <ul className={styles.properties__equipmentsChips}>
                  {property.equipments?.map((equipment, index) => (
                    <li key={index}>{equipment}</li>
                  ))}
                </ul>
              </div>
              <div className={styles.properties__category}>
                <h2 className={styles.properties__categoryTitle}>Catégorie</h2>
                <ul className={styles.properties__categoryChips}>
                  {property.tags?.map((tag, index) => (
                    <li key={index}>{tag}</li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </div>
        <div className={styles.properties__detailHost}>
          <h2 className={styles.properties__detailHostTitle}>Votre hôte</h2>
          <div className={styles.properties__detailHostInfo}>
            {hostPictureSrc ? (
              <img src={hostPictureSrc} alt={property.host.name} />
            ) : (
              <div className={styles.properties__hostPlaceholder}>
                {property.host.name?.[0]?.toUpperCase() ?? "?"}
              </div>
            )}
            <p className={styles.properties__detailUserName}>
              {property.host.name}
            </p>
            <p className={styles.properties__detailUserRating}>
              {" "}
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="#933619"
                viewBox="0 0 24 24"
                strokeWidth={1.5}
                stroke="#933619"
                className="size-4"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M11.48 3.499a.562.562 0 0 1 1.04 0l2.125 5.111a.563.563 0 0 0 .475.345l5.518.442c.499.04.701.663.321.988l-4.204 3.602a.563.563 0 0 0-.182.557l1.285 5.385a.562.562 0 0 1-.84.61l-4.725-2.885a.562.562 0 0 0-.586 0L6.982 20.54a.562.562 0 0 1-.84-.61l1.285-5.386a.562.562 0 0 0-.182-.557l-4.204-3.602a.562.562 0 0 1 .321-.988l5.518-.442a.563.563 0 0 0 .475-.345L11.48 3.5Z"
                />
              </svg>
              {property.rating_avg}
            </p>
          </div>
          {!isOwner && (
            <div className={styles.properties__detailHostActions}>
              <Link
                className={styles.properties__contactHost}
                href={
                  isLoggedIn ? `/messages?hostId=${property.host.id}` : "/login"
                }
              >
                Contacter l'hôte
              </Link>
              <Link
                className={styles.properties__sendMessage}
                href={
                  isLoggedIn ? `/messages?hostId=${property.host.id}` : "/login"
                }
              >
                Envoyer un message
              </Link>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
