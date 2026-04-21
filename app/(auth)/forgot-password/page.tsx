"use client";

import { FormEvent, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import styles from "./ForgotPasswordPage.module.css";
import { resetPasswordRequest } from "@/app/lib/auth-api";

export default function ForgotPasswordPage() {
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    try {
      setLoading(true);
      setError("");
      setSuccess("");

      const response = await resetPasswordRequest({
        email: email.trim(),
      });

      if (!response.ok) {
        throw new Error(response.message || "Une erreur est survenue.");
      }

      setSuccess(response.message || "Demande envoyée avec succès.");

      // comme ton backend renvoie le token, on redirige directement
      router.push(
        `/reset-password?token=${encodeURIComponent(response.token)}`,
      );
    } catch (err) {
      const message =
        err instanceof Error
          ? err.message
          : "Impossible d'envoyer la demande de réinitialisation.";
      setError(message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={styles.forgotPassword__page}>
      <div className={styles.forgotPassword__card}>
        <h1 className={styles.forgotPassword__title}>Mot de passe oublié</h1>

        <p className={styles.forgotPassword__text}>
          Entrez votre adresse email pour recevoir un lien ou poursuivre la
          réinitialisation de votre mot de passe.
        </p>

        <form onSubmit={handleSubmit} className={styles.forgotPassword__form}>
          <label htmlFor="email" className={styles.label}>
            Adresse email
            <input
              id="email"
              type="email"
              className={styles.input}
              placeholder="exemple@email.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </label>

          {error ? <p className={styles.error}>{error}</p> : null}
          {success ? <p className={styles.success}>{success}</p> : null}

          <button
            type="submit"
            className={styles.submit__button}
            disabled={loading}
          >
            {loading ? "Envoi..." : "Réinitialiser le mot de passe"}
          </button>
        </form>

        <Link href="/login" className={styles.back__link}>
          Retour à la connexion
        </Link>
      </div>
    </div>
  );
}
