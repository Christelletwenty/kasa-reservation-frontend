import { ApiError } from "./errors";

//List properties
export interface Properties {
  id: string;
  slug: string;
  title: string;
  description: string;
  cover: string;
  location: string;
  price_per_night: number;
  rating_avg: number;
  ratings_count: number;
  host: {
    id: number;
    name: string;
    picture: string;
  };
}

//Create a property
export interface CreateProperty {
  id: string;
  title: string;
  description: string;
  cover: string;
  location: string;
  price_per_night: number;
  host_id: number;
  host: {
    name: string;
    picture: string;
  };
  pictures: [string];
  equipments: [string];
  tags: [string];
}

export interface CreatePropertyResponse {
  id: string;
  slug: string;
  title: string;
  description: string;
  cover: string;
  location: string;
  price_per_night: number;
  rating_avg: number;
  ratings_count: number;
  host: {
    id: 0;
    name: string;
    picture: string;
  };
  pictures: [string];
  equipments: [string];
  tags: [string];
}

export interface CreatePropertyError extends ApiError {}

//Update a proprerty
export interface UpdatePorperty {
  id: string; //je l'ai ajouté mais il est pas dans l'api de swagger, du coup pas sur de moi là.
  title: string;
  description: string;
  cover: string;
  location: string;
  host_id: number;
  price_per_night: number;
}
export interface UpdatePorpertyResponse {
  id: string;
  slug: string;
  title: string;
  description: string;
  cover: string;
  location: string;
  price_per_night: number;
  rating_avg: number;
  ratings_count: number;
  host: {
    id: number;
    name: string;
    picture: string;
  };
  pictures: [string];
  equipments: [string];
  tags: [string];
}

export interface UpdatePorpertyError extends ApiError {}

export interface DeletePropertyError extends ApiError {}
