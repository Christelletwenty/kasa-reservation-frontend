//List properties
export interface Property {
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
  pictures?: string[];
  equipments?: string[];
  tags?: string[];
}

//Create a property
// Omit permet de créer un type en excluant certaines propriétés d'un autre type.
// Ici, on crée un type CreateProperty qui est basé sur le type Property, mais sans les propriétés "slug", "rating_avg" et "ratings_count".
// On ajoute également une propriété "host_id" qui est nécessaire pour créer une nouvelle propriété, mais qui n'est pas présente dans le type Property original.
export interface CreateProperty extends Omit<
  Property,
  "id" | "slug" | "rating_avg" | "ratings_count" | "host"
> {
  host_id: number;
  equipments: string[];
  tags: string[];
}

//Update a proprerty
export interface UpdatePorperty {
  id: string;
  title: string;
  description: string;
  cover: string;
  location: string;
  host_id: number;
  price_per_night: number;
}
