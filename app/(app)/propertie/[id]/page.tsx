"use client";

import { useAuthGuard } from "@/app/hooks/useAuthGuard";
import PropertieForm from "../components/PropertieForm";
import { CreateProperty, Property } from "@/app/types/properties";
import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { getPropertyById, updateProperty } from "@/app/lib/properties-api";
import { User } from "@/app/types/users";

export default function UpdatePropertyPage() {
  const params = useParams();
  const { user: currentUser, isLoading: authLoading } = useAuthGuard();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [property, setProperty] = useState<Property | null>(null);
  const router = useRouter();

  const id = params.id as string;

  useEffect(() => {
    if (!id) {
      setError("ID du logement non trouvé");
      setLoading(false);
      return;
    }

    const fetchProperty = async () => {
      try {
        setLoading(true);
        setError("");
        const propertyResponse = await getPropertyById(id);
        setProperty(propertyResponse);
      } catch (err) {
        setError("Erreur lors du chargement du logement");
      } finally {
        setLoading(false);
      }
    };
    fetchProperty();
  }, [id]);

  async function handleSubmit(form: CreateProperty) {
    try {
      setLoading(true);
      setError("");

      const updatedProperty = await updateProperty({
        id,
        ...form,
      });

      setProperty(updatedProperty);
      router.push("/properties");
      router.refresh();
    } catch (err) {
      const message =
        err instanceof Error
          ? err.message
          : "Erreur lors de la mise à jour du logement";
      setError(message);
    } finally {
      setLoading(false);
    }
  }

  if (authLoading || loading) {
    return <p>Chargement...</p>;
  }

  if (!currentUser) {
    return <p>Vous devez être connecté pour créer une propriété.</p>;
  }

  if (!property) {
    return <p>La propriété que vous voulez modifier n'existe pas.</p>;
  }

  return (
    <PropertieForm
      property={property}
      currentUser={currentUser}
      onSubmit={handleSubmit}
    />
  );
}
