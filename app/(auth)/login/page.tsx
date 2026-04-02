"use client";
import styles from "./LoginPage.module.css";

export default function LoginPage() {
  return (
    <div className={styles.login__page}>
      <h1>Heureux de vous revoir</h1>
      <p>
        Connectez-vous pour retrouver vos réservations, vos annonces et tout ce
        qui rend vos séjours uniques.
      </p>
      <div className={styles.login__form__container}>
        <form className={styles.login__form}>
          <label className={styles.login__label} htmlFor="email">
            Adresse email
          </label>
          <input
            className={styles.login__input}
            type="email"
            id="email"
            required
          />
          <label className={styles.login__label} htmlFor="password">
            Mot de passe
          </label>
          <input
            className={styles.login__input}
            type="password"
            id="password"
            required
          />
          <button className={styles.login__button}>Se connecter</button>
          <a className={styles.login__link} href="#">
            Mot de passe oublié
          </a>
        </form>
        <p className={styles.login__footer}>
          Pas encore de compte ?{" "}
          <a className={styles.login__link} href="/register">
            Inscrivez-vous
          </a>
        </p>
      </div>
    </div>
  );
}
