"use client";

import { FormEvent, useState } from "react";
import styles from "./ResetPasswordPage.module.css";
import { useSearchParams, useRouter } from "next/navigation";
import { resetPassword } from "@/app/lib/auth-api";

export default function ResetPasswordPage() {
  const searchParams = useSearchParams();
  const router = useRouter();

  // On récupère le token depuis l'URL (ex: ?token=abc123)
  const token = searchParams.get("token");

  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    // Vérification : token présent
    if (!token) {
      setError("Token invalide.");
      return;
    }

    // Vérification : les deux mots de passe doivent être identiques
    if (password !== confirmPassword) {
      setError("Les mots de passe ne correspondent pas.");
      return;
    }

    try {
      setLoading(true);
      setError("");
      setSuccess("");

      const res = await resetPassword({
        token,
        password,
      });

      // Si l'API renvoie une erreur
      if (!res.ok) {
        throw new Error(res.error || "Erreur lors du reset.");
      }

      setSuccess("Mot de passe modifié avec succès 🎉");

      // Redirection vers login après 1.5 secondes
      setTimeout(() => {
        router.push("/login");
      }, 1500);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Une erreur est survenue.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={styles.reset__page}>
      <h1 className={styles.reset__title}>Réinitialiser le mot de passe</h1>
      <p className={styles.reset__subtitle}>
        Entrez un nouveau mot de passe sécurisé pour votre compte
      </p>

      <div className={styles.reset__containerForm}>
        <form onSubmit={handleSubmit} className={styles.reset__form}>
          <input
            className={styles.reset__input}
            type="password"
            placeholder="Nouveau mot de passe"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />

          <input
            className={styles.reset__input}
            type="password"
            placeholder="Confirmer le mot de passe"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            required
          />

          {error && <p className={styles.reset__error}>{error}</p>}
          {success && <p className={styles.reset__success}>{success}</p>}

          <button
            type="submit"
            disabled={loading}
            className={styles.reset__button}
          >
            {loading ? "Envoi..." : "Valider"}
          </button>
        </form>
      </div>
    </div>
  );
}
