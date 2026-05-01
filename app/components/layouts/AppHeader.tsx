"use client";

import Link from "next/link";
import styles from "./AppHeader.module.css";
import { useRouter } from "next/navigation";
import { clearToken } from "@/app/lib/auth";
import { useEffect, useState } from "react";
import { getStoredUserId } from "@/app/lib/auth-guard";

export default function AppHeader() {
  const [isUserLoggedIn, setIsUserLoggedIn] = useState<boolean>(false);
  const router = useRouter();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    // getStoredUserId() retourne probablement un id utilisateur s'il est connecté.
    // Le double `!!` transforme la valeur en booléen :
    // - valeur existante => true
    // - null / undefined / "" => false
    const syncAuthState = () => {
      setIsUserLoggedIn(!!getStoredUserId());
    };

    syncAuthState();

    // On écoute un événement personnalisé "auth-changed".
    // Cet événement permet à d'autres parties de l'application
    // de signaler qu'une connexion ou déconnexion a eu lieu.
    window.addEventListener("auth-changed", syncAuthState);

    // Fonction de nettoyage exécutée quand le composant est démonté.
    // Elle évite de laisser un event listener actif inutilement.
    return () => {
      window.removeEventListener("auth-changed", syncAuthState);
    };
  }, []);

  const handleLogout = () => {
    // Supprime le token ou les informations d'authentification.
    clearToken();
    setIsUserLoggedIn(false);
    // Déclenche l'événement "auth-changed" pour informer le reste de l'application
    // que l'état d'authentification a changé.
    window.dispatchEvent(new Event("auth-changed"));
    // Redirige l'utilisateur vers la page de connexion.
    router.push("/login");
  };

  return (
    <>
      <header className={styles.headerWrapper}>
        <nav className={styles.header}>
          <div className={styles.headerMobile}>
            <img
              src="/home-logo.svg"
              alt="Kasa footer"
              width={24}
              height={24}
            />
            <button
              className={`${styles.burger} ${isMobileMenuOpen ? styles.active : ""}`}
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            >
              burger menu
            </button>
          </div>
          <div className={styles.headerLeft}>
            <Link aria-label="Aller à l'accueil" href="/properties">
              Accueil
            </Link>
            <Link aria-label="A propos" href="/about">
              À propos
            </Link>
            <Link aria-label="Voir le profil" href="/profile">
              Mon profil
            </Link>
          </div>
          <div className={styles.headerCenter}>
            <Link aria-label="Voir les propriétés" href="/properties">
              <img src="/kasa-logo.svg" alt="Kasa" width={120} height={40} />
            </Link>
          </div>
          <div className={styles.headerRight}>
            <Link aria-label="Ajout de logement" href="/propertie">
              + Ajouter un logement
            </Link>
            <div className={styles.headerIcons}>
              <Link aria-label="Voir les favoris" href="/favorites">
                <img
                  src="/heart-icon.svg"
                  alt="Favoris"
                  width={20}
                  height={20}
                />
              </Link>
              <img src="/line.svg" alt="Séparateur" width={1} height={20} />
              <Link aria-label="Aller aux messages" href="/messages">
                <img src="/comment.svg" alt="Messages" width={20} height={20} />
              </Link>
              <img src="/line.svg" alt="Séparateur" width={1} height={20} />
              {isUserLoggedIn ? (
                <button
                  aria-label="Se déconnecter"
                  className={styles.logoutButton}
                  onClick={handleLogout}
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
                      d="M8.25 9V5.25A2.25 2.25 0 0 1 10.5 3h6a2.25 2.25 0 0 1 2.25 2.25v13.5A2.25 2.25 0 0 1 16.5 21h-6a2.25 2.25 0 0 1-2.25-2.25V15m-3 0-3-3m0 0 3-3m-3 3H15"
                    />
                  </svg>
                </button>
              ) : (
                <Link aria-label="Se connecter" href="/login">
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
                      d="M17.982 18.725A7.488 7.488 0 0 0 12 15.75a7.488 7.488 0 0 0-5.982 2.975m11.963 0a9 9 0 1 0-11.963 0m11.963 0A8.966 8.966 0 0 1 12 21a8.966 8.966 0 0 1-5.982-2.275M15 9.75a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z"
                    />
                  </svg>
                </Link>
              )}
            </div>
          </div>
        </nav>
      </header>

      {isMobileMenuOpen && (
        <div className={styles.mobileMenu}>
          <Link
            aria-label="Aller à l'accueil"
            href="/properties"
            onClick={() => setIsMobileMenuOpen(false)}
          >
            Accueil
          </Link>
          <Link
            aria-label="A propos"
            href="/about"
            onClick={() => setIsMobileMenuOpen(false)}
          >
            À propos
          </Link>
          <Link
            aria-label="Voir le profil"
            href="/profile"
            onClick={() => setIsMobileMenuOpen(false)}
          >
            Mon profil
          </Link>
          <Link
            aria-label="Voir les favoris"
            href="/favorites"
            onClick={() => setIsMobileMenuOpen(false)}
          >
            Favoris
          </Link>
          <Link
            aria-label="Aller aux messages"
            href="/messages"
            onClick={() => setIsMobileMenuOpen(false)}
          >
            Messages
          </Link>
          <Link
            onClick={() => setIsMobileMenuOpen(false)}
            aria-label="Ajout de logement"
            href="/propertie"
            className={styles.linkButton}
          >
            Ajouter un logement
          </Link>
          {isUserLoggedIn ? (
            <button
              aria-label="Se déconnecter"
              className={styles.logoutButton}
              onClick={handleLogout}
            >
              Se déconnecter
            </button>
          ) : (
            <Link aria-label="Se connecter" href="/login">
              Se connecter
            </Link>
          )}
        </div>
      )}
    </>
  );
}
