"use client";

import Image from "next/image";
import styles from "./AppFooter.module.css";

export default function AppFooter() {
  return (
    <footer className={styles.footer}>
      <div className={styles.inner}>
        <img src="/home-logo.svg" alt="Kasa footer" width={48} height={48} />
        <span className={styles.copy}>© 2025 Kasa. All rights reserved</span>
      </div>
    </footer>
  );
}
