"use client";
import styles from "./RegisterPage.module.css";

export default function RegisterPage() {
  return (
    <div className={styles.register__page}>
      <h1>Rejoignez la communauté Kasa</h1>
      <p>
        Créez votre compte et commencez à voyager autrement : réservez des
        logements uniques, découvrez de nouvelles destinations et partagez vos
        propres lieux avec d’autres voyageurs.
      </p>
      <div className={styles.register__form__container}>
        <form className={styles.register__form}>
          <label className={styles.register__label} htmlFor="name">
            Nom
          </label>
          <input
            className={styles.register__input}
            type="name"
            id="name"
            required
          />
          <label className={styles.register__label} htmlFor="prenom">
            Prénom
          </label>
          <input
            className={styles.register__input}
            type="prenom"
            id="prenom"
            required
          />
          <label htmlFor="email" className={styles.register__label}>
            Adresse email
          </label>
          <input
            className={styles.register__input}
            type="email"
            id="email"
            required
          />
          <label htmlFor="password" className={styles.register__label}>
            Mot de passe
          </label>
          <input
            className={styles.register__input}
            type="password"
            id="password"
            required
          />

          <label className={styles.register__conditions}>
            <input type="checkbox" required />
            J'accepte les {""}
            <a href="/conditions">conditions générales d'utilisation</a>
          </label>

          <button type="submit" className={styles.register__button}>
            S'inscrire
          </button>
          <a className={styles.register__link} href="#">
            Mot de passe oublié
          </a>
        </form>
        <p className={styles.register__footer}>
          Déjà membre ?{" "}
          <a className={styles.register__link} href="/login">
            Se connecter
          </a>
        </p>
      </div>
    </div>
  );
}
