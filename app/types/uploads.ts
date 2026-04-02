export type Purpose = "property-cover" | "property-picture" | "user-picture";

//Uploads
export interface UploadImage {
  file: File;
  purpose?: Purpose;
  property_id?: string;
}

export interface UploadImageResponse {
  url: string;
  filename: string;
  size: number;
  mimeinterface: string;
  purpose: string;
  property_id: number;
  instructions: string;
}

export interface DeleteImageResponse {
  filename: string;
}

export interface DeleteImageResponse {
  ok: true;
  deleted: string[];
  not_found: string[];
  errors: [
    {
      filename: string;
      error: string;
    },
  ];
  results: [{}];
}
