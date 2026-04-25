"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

import { useAuthGuard } from "@/app/hooks/useAuthGuard";
import { createProperty } from "@/app/lib/properties-api";
import { CreateProperty } from "@/app/types/properties";
import PropertieForm from "./components/PropertieForm";

export default function CreatePropertyPage() {
  const router = useRouter();
  // On appelle le hook d'authentification.
  // currentUser contient l'utilisateur connecté.
  // authLoading indique si la vérification de connexion est encore en cours.
  const { user: currentUser, isLoading: authLoading } = useAuthGuard();
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (form: CreateProperty) => {
    try {
      setLoading(true);
      setError("");

      await createProperty(form);
      // Si la création réussit, on redirige l'utilisateur vers la page des propriétés.
      router.push("/properties");
    } catch (err) {
      const message =
        err instanceof Error ? err.message : "Une erreur est survenue";
      setError(message);
    } finally {
      setLoading(false);
    }
  };

  // Tant que la vérification de l'authentification est en cours,
  // on affiche un simple message de chargement.
  if (authLoading) {
    return <p>Chargement...</p>;
  }

  // Si le chargement est terminé mais qu'aucun utilisateur n'est connecté,
  // on empêche l'accès au formulaire.
  if (!currentUser) {
    return <p>Vous devez être connecté pour créer une propriété.</p>;
  }

  // Si l'utilisateur est connecté, on affiche le formulaire.
  // On lui passe :
  // - currentUser : l'utilisateur connecté
  // - onSubmit : la fonction à appeler lors de la soumission du formulaire
  return <PropertieForm currentUser={currentUser} onSubmit={handleSubmit} />;
}
