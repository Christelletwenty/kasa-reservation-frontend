"use client";
import { useState } from "react";
import styles from "./LoginPage.module.css";
import { useRouter } from "next/navigation";
import { AuthLogin } from "@/app/types/auth";
import { login } from "@/app/lib/auth-api";
import { saveAuth } from "@/app/lib/auth";

export default function LoginPage() {
  const router = useRouter();
  const [form, setForm] = useState<AuthLogin>({ email: "", password: "" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      //On appelle l'api avec les données du formulaire
      const loginResponse = await login(form);

      // On vérifie que la réponse contient bien un token et un utilisateur.
      // Sans ces deux informations, la connexion n'est pas considérée comme valide.
      if (!loginResponse.token || !loginResponse.user) {
        setError(
          loginResponse.error || "Une erreur est survenue lors de la connexion",
        );
        return;
      }

      // Si la connexion est valide, on sauvegarde les données d'authentification.
      // Cela permet de garder l'utilisateur connecté sur les prochaines pages.
      saveAuth(loginResponse);
      // On redirige l'utilisateur vers la page des propriétés.
      // replace évite que la page de login reste dans l'historique de navigation.
      router.replace("/properties");
      // On force Next.js à rafraîchir les données côté serveur/client.
      router.refresh();
    } catch (err) {
      let message = "Une erreur est survenue";
      if (err instanceof Error) {
        if (err.message.toLowerCase() === "invalid credentials") {
          message = "Email ou mot de passe incorrect";
        } else {
          message = err.message;
        }
      }
      setError(message);
    } finally {
      setLoading(false);
      // On déclenche un événement global personnalisé.
      // Cela peut permettre à d'autres composants de l'application
      // de savoir que l'état d'authentification a changé.
      window.dispatchEvent(new Event("auth-changed"));
    }
  }

  return (
    <div className={styles.login__page}>
      <h1>Heureux de vous revoir</h1>
      <p>
        Connectez-vous pour retrouver vos réservations, vos annonces et tout ce
        qui rend vos séjours uniques.
      </p>
      <div className={styles.login__form__container}>
        <form onSubmit={onSubmit} className={styles.login__form}>
          <label className={styles.login__label} htmlFor="email">
            Adresse email
          </label>
          <input
            className={styles.login__input}
            type="email"
            id="email"
            required
            value={form.email}
            onChange={(e) => setForm({ ...form, email: e.target.value })}
          />
          <label className={styles.login__label} htmlFor="password">
            Mot de passe
          </label>
          <input
            className={styles.login__input}
            type="password"
            id="password"
            required
            value={form.password}
            onChange={(e) => setForm({ ...form, password: e.target.value })}
          />

          {error ? <p className="login__error">{error}</p> : null}

          <button
            type="submit"
            disabled={loading}
            className={styles.login__button}
          >
            {loading ? "Connexion en cours..." : "Se connecter"}
          </button>
          <a className={styles.login__link} href="/forgot-password">
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
