"use client";
import styles from "./AboutPage.module.css";

export default function AboutPage() {
  return (
    <div className={styles.about__page}>
      <div className={styles.about__content}>
        <h1 className={styles.about__title}>À propos</h1>
        <p className={styles.about__info}>
          Chez Kasa, nous croyons que chaque voyage mérite un lieu unique où se
          sentir bien.
        </p>
        <p className={styles.about__description}>
          Depuis notre création, nous mettons en relation des voyageurs en quête
          d’authenticité avec des hôtes passionnés qui aiment partager leur
          région et leurs bonnes adresses.
        </p>
        <img
          loading="lazy"
          src="about-kasa.png"
          alt="About kasa"
          className={styles.about__image}
        />
      </div>

      <div className={styles.about__mission}>
        <div className={styles.about__missioncontent}>
          <h2 className={styles.about__missiontitle}>
            Notre mission est simple:
          </h2>
          <ol className={styles.about__missionlist}>
            <li>Offrir une plateforme fiable et simple d’utilisation</li>
            <li>Proposer des hébergements variés et de qualité</li>
            <li>
              Favoriser des échanges humains et chaleureux entre hôtes et
              voyageurs
            </li>
          </ol>
          <p className={styles.about__missiondescription}>
            Que vous cherchiez un appartement cosy en centre-ville, une maison
            en bord de mer ou un chalet à la montagne, Kasa vous accompagne pour
            que chaque séjour devienne un souvenir inoubliable.
          </p>
        </div>

        <img
          loading="lazy"
          src="about-kasa-bis.png"
          alt="Mission kasa"
          className={styles.about__missionimage}
        />
      </div>
    </div>
  );
}
