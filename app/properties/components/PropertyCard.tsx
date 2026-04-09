"use client";

import { Property } from "@/app/types/properties";

type PropertiesProps = {
  property: Property;
};

export default function PropertyCard({ property }: PropertiesProps) {
  return (
    <div>
      <img src={property.pictures?.[0]} alt="Property picture" />
      <h1>{property.title}</h1>
      <p>{property.location}</p>
      <p>{property.price_per_night}</p>
    </div>
  );
}
