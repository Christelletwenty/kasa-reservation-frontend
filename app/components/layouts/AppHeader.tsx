"use client";

import Link from "next/link";
import Image from "next/image";
import styles from "./AppHeader.module.css";

export default function AppHeader() {
  return (
    <header className={styles.headerWrapper}>
      <nav className={styles.header}>
        <div className={styles.headerLeft}>
          <Link href="/properties">Accueil</Link>
          <Link href="/about">À propos</Link>
        </div>
        <div className={styles.headerCenter}>
          <Link href="/properties">
            <img src="/kasa-logo.svg" alt="Kasa" width={120} height={40} />
          </Link>
        </div>
        <div className={styles.headerRight}>
          <Link href="/add">+ Ajouter un logement</Link>
          <div className={styles.headerIcons}>
            <Link href="/favorites">
              <img src="/heart-icon.svg" alt="Favoris" width={20} height={20} />
            </Link>
            <img src="/line.svg" alt="Séparateur" width={1} height={20} />
            <Link href="/messages">
              <img src="/comment.svg" alt="Messages" width={20} height={20} />
            </Link>
          </div>
        </div>
      </nav>
    </header>
  );
}
