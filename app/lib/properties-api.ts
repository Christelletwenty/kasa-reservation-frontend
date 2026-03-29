import {
  CreateProperty,
  CreatePropertyResponse,
  Properties,
  UpdatePorperty,
  UpdatePorpertyResponse,
} from "../types/properties";
import { apiFetch } from "./api";

export function getProperties(): Promise<Properties> {
  return apiFetch<Properties>("/api/properties", {
    method: "GET",
    auth: true,
  });
}

export function createProperty(createPropertyPayload: CreateProperty) {
  return apiFetch<CreatePropertyResponse>("/api/properties", {
    method: "POST",
    auth: true,
    body: JSON.stringify(createPropertyPayload),
  });
}

export function getPropertyById(id: string): Promise<CreatePropertyResponse> {
  return apiFetch<CreatePropertyResponse>(`/api/properties/${id}`, {
    method: "GET",
    auth: true,
  });
}

export function updateProperty(
  updatePropertyPayload: UpdatePorperty,
): Promise<UpdatePorpertyResponse> {
  return apiFetch<UpdatePorpertyResponse>(
    `/api/properties/${updatePropertyPayload.id}`,
    {
      method: "PATCH",
      auth: true,
      body: JSON.stringify(updatePropertyPayload),
    },
  );
}

export function deleteProperty(id: string): Promise<void> {
  return apiFetch<void>(`/api/properties/${id}`, {
    method: "DELETE",
    auth: true,
  });
}
