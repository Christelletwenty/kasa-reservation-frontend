"use client";

import Link from "next/link";
import Image from "next/image";
import styles from "./AppHeader.module.css";
import { useRouter } from "next/navigation";
import { clearToken } from "@/app/lib/auth";

export default function AppHeader() {
  const router = useRouter();
  const handleLogout = () => {
    //suppression du token d'authent
    clearToken();
    //redirection vers la page de connexion
    router.push("/login");
  };

  return (
    <header className={styles.headerWrapper}>
      <nav className={styles.header}>
        <div className={styles.headerLeft}>
          <Link href="/properties">Accueil</Link>
          <Link href="/about">À propos</Link>
          <Link href="/profile">Mon profil</Link>
        </div>
        <div className={styles.headerCenter}>
          <Link href="/properties">
            <img src="/kasa-logo.svg" alt="Kasa" width={120} height={40} />
          </Link>
        </div>
        <div className={styles.headerRight}>
          <Link href="/propertie">+ Ajouter un logement</Link>
          <div className={styles.headerIcons}>
            <Link href="/favorites">
              <img src="/heart-icon.svg" alt="Favoris" width={20} height={20} />
            </Link>
            <img src="/line.svg" alt="Séparateur" width={1} height={20} />
            <Link href="/messages">
              <img src="/comment.svg" alt="Messages" width={20} height={20} />
            </Link>
            <img src="/line.svg" alt="Séparateur" width={1} height={20} />
            <button className={styles.logoutButton} onClick={handleLogout}>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 28 28"
                strokeWidth={1.5}
                stroke="currentColor"
                className="size-6"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M8.25 9V5.25A2.25 2.25 0 0 1 10.5 3h6a2.25 2.25 0 0 1 2.25 2.25v13.5A2.25 2.25 0 0 1 16.5 21h-6a2.25 2.25 0 0 1-2.25-2.25V15m-3 0-3-3m0 0 3-3m-3 3H15"
                />
              </svg>
            </button>
          </div>
        </div>
      </nav>
    </header>
  );
}
