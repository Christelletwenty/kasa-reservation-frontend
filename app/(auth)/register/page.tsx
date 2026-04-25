"use client";
import { useRouter } from "next/navigation";
import styles from "./RegisterPage.module.css";
import { AuthRegister } from "@/app/types/auth";
import { useState } from "react";
import { register } from "@/app/lib/auth-api";
import { setToken } from "@/app/lib/auth";
import { USER_STORAGE_KEY } from "@/app/lib/config";

export default function RegisterPage() {
  const router = useRouter();
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  // État contenant les données du formulaire
  // Chaque champ est contrôlé par React grâce à value + onChange
  const [form, setForm] = useState<AuthRegister>({
    name: "",
    email: "",
    password: "",
    role: "owner",
  });

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError("");

    // Vérification côté frontend du mot de passe
    // Même si le backend doit aussi vérifier, ça améliore l'expérience utilisateur
    if (!form.password || form.password.length < 6) {
      setError("Le mot de passe doit contenir au moins 6 caractères");
      return;
    }

    setLoading(true);

    try {
      const registerResponse = await register(form);
      if (registerResponse.error) {
        setError(registerResponse.error);
        return;
      }

      // Sauvegarde du token reçu après inscription
      // Il servira à authentifier les futures requêtes utilisateur
      setToken(registerResponse.token);
      // Sauvegarde des informations utilisateur dans le sessionStorage
      // sessionStorage garde les données tant que l'onglet reste ouvert
      sessionStorage.setItem(
        USER_STORAGE_KEY,
        JSON.stringify(registerResponse.user),
      );
      router.replace("/properties");
      // Force Next.js à rafraîchir les données côté client/serveur
      router.refresh();
      return;
    } catch (err) {
      let message = "Une erreur est survenue";
      if (err instanceof Error) {
        if (err.message.toLowerCase() === "email already registered") {
          message = "Email déjà utilisé";
        } else {
          message = err.message;
        }
      }
      setError(message);
    } finally {
      setLoading(false);
      // Déclenche un événement global personnalisé
      // D'autres composants peuvent écouter "auth-changed"
      // pour se mettre à jour après connexion/inscription
      window.dispatchEvent(new Event("auth-changed"));
    }
  }

  return (
    <div className={styles.register__page}>
      <h1>Rejoignez la communauté Kasa</h1>
      <p>
        Créez votre compte et commencez à voyager autrement : réservez des
        logements uniques, découvrez de nouvelles destinations et partagez vos
        propres lieux avec d’autres voyageurs.
      </p>
      <div className={styles.register__form__container}>
        <form className={styles.register__form} onSubmit={onSubmit}>
          <label className={styles.register__label} htmlFor="name">
            Nom
          </label>
          <input
            className={styles.register__input}
            type="name"
            id="name"
            required
            value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
          />
          <label className={styles.register__label} htmlFor="prenom">
            Prénom
          </label>
          <input className={styles.register__input} type="text" id="prenom" />
          <label htmlFor="email" className={styles.register__label}>
            Adresse email
          </label>
          <input
            className={styles.register__input}
            type="email"
            id="email"
            required
            value={form.email}
            onChange={(e) => setForm({ ...form, email: e.target.value })}
          />
          <label htmlFor="password" className={styles.register__label}>
            Mot de passe
          </label>
          <input
            className={styles.register__input}
            type="password"
            id="password"
            required
            minLength={6}
            value={form.password}
            onChange={(e) => setForm({ ...form, password: e.target.value })}
          />

          <label className={styles.register__conditions}>
            <input type="checkbox" required />
            J'accepte les{" "}
            <a target="_blank" href="/conditions">
              conditions générales d'utilisation
            </a>
          </label>

          {error ? <p className="register__error">{error}</p> : null}

          <button
            type="submit"
            className={styles.register__button}
            disabled={loading}
          >
            {loading ? "Inscription en cours..." : "S'inscrire"}
          </button>
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
