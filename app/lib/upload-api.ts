import { apiFetch } from "./api";

export function uploadImage(
  file: File,
  purpose: "property-cover" | "property-picture" | "user-picture",
  propertyId?: string,
) {
  const formData = new FormData();
  formData.append("file", file);
  formData.append("purpose", purpose);

  if (propertyId) {
    formData.append("property_id", propertyId);
  }

  return apiFetch<{ url: string }>("/api/uploads/image", {
    method: "POST",
    auth: true,
    body: formData,
  });
}
