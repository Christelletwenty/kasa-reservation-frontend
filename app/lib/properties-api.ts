import { CreateProperty, Property, UpdatePorperty } from "../types/properties";
import { apiFetch } from "./api";

export function getProperties(): Promise<Property[]> {
  return apiFetch<Property[]>("/api/properties", {
    method: "GET",
    auth: false,
  });
}

export function createProperty(createPropertyPayload: CreateProperty) {
  return apiFetch<Property>("/api/properties", {
    method: "POST",
    auth: true,
    body: JSON.stringify(createPropertyPayload),
  });
}

export function getPropertyById(id: string): Promise<Property> {
  return apiFetch<Property>(`/api/properties/${id}`, {
    method: "GET",
    auth: false,
  });
}

export function updateProperty(
  updatePropertyPayload: UpdatePorperty,
): Promise<Property> {
  return apiFetch<Property>(`/api/properties/${updatePropertyPayload.id}`, {
    method: "PATCH",
    auth: true,
    body: JSON.stringify(updatePropertyPayload),
  });
}

export function deleteProperty(id: string): Promise<void> {
  return apiFetch<void>(`/api/properties/${id}`, {
    method: "DELETE",
    auth: true,
  });
}
