"use client";

import { useAuthGuard } from "@/app/hooks/useAuthGuard";
import PropertieForm from "../components/PropertieForm";
import { CreateProperty, Property } from "@/app/types/properties";
import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { getPropertyById } from "@/app/lib/properties-api";
import { User } from "@/app/types/users";

export default function UpdatePropertyPage() {
  const params = useParams();
  const { user: currentUser, isLoading: authLoading } = useAuthGuard();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [property, setProperty] = useState<Property | null>(null);

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

  function handleSubmit(form: CreateProperty) {
    console.log(form);
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
      currentUser={property.host as User}
      onSubmit={handleSubmit}
    />
  );
}
