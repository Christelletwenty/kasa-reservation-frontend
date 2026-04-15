"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

import { useAuthGuard } from "@/app/hooks/useAuthGuard";
import { createProperty } from "@/app/lib/properties-api";
import { uploadImage } from "@/app/lib/upload-api";
import { CreateProperty } from "@/app/types/properties";
import { BACKEND_URL } from "@/app/lib/config";
import { updateUserById } from "@/app/lib/users-api";
import PropertieForm from "./components/PropertieForm";

export default function CreatePropertyPage() {
  const router = useRouter();
  const { user: currentUser, isLoading: authLoading } = useAuthGuard();
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (form: CreateProperty) => {
    try {
      setLoading(true);
      setError("");

      await createProperty(form);
      router.push("/properties");
    } catch (err) {
      const message =
        err instanceof Error ? err.message : "Une erreur est survenue";
      setError(message);
    } finally {
      setLoading(false);
    }
  };

  if (authLoading) {
    return <p>Chargement...</p>;
  }

  if (!currentUser) {
    return <p>Vous devez être connecté pour créer une propriété.</p>;
  }

  return <PropertieForm currentUser={currentUser} onSubmit={handleSubmit} />;
}
