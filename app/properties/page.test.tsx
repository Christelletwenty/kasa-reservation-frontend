// On importe les outils principaux pour tester du React.
// render : affiche un composant dans un faux DOM
// screen : permet de chercher des éléments affichés
import { render, screen } from "@testing-library/react";
import { getStoredUserId } from "../lib/auth-guard";
import { getFavoritesUsers } from "../lib/favorites-api";
// On importe la page qu’on veut tester
import { getProperties } from "../lib/properties-api";
import PropertiesPage from "./page";

// On mocke l'API des propriétés.
// Au lieu d'appeler la vraie API, on utilise une fausse fonction.
jest.mock("../lib/properties-api", () => ({
  getProperties: jest.fn(),
}));

// On mocke l'API des favoris
jest.mock("../lib/favorites-api", () => ({
  getFavoritesUsers: jest.fn(),
}));

// On mocke la récupération de l'utilisateur connecté
jest.mock("../lib/auth-guard", () => ({
  getStoredUserId: jest.fn(),
}));

// On mocke le composant PropertyCard
// On ne veut pas tester PropertyCard ici, seulement PropertiesPage
jest.mock("./components/PropertyCard", () => ({
  __esModule: true,
  default: ({ property }: { property: { title: string } }) => (
    <div data-testid="property-card">{property.title}</div>
  ),
}));

// On crée une fausse propriété
// Elle simule ce que l’API pourrait retourner
const mockProperty = {
  id: "prop-1",
  slug: "appartement-cosy",
  title: "Appartement cosy",
  description: "Bel appartement",
  cover: "/img.jpg",
  location: "Paris",
  price_per_night: 120,
  rating_avg: 4.5,
  ratings_count: 8,
  host: {
    id: 42,
    name: "Alice",
    picture: "/alice.jpg",
  },
};

// On regroupe tous les tests liés à PropertiesPage
describe("PropertiesPage", () => {
  // Avant chaque test :
  // on reset tous les mocks pour éviter les effets de bord
  beforeEach(() => {
    jest.clearAllMocks();
  });

  // Premier test : affichage du titre de la page
  it("affiche le titre de la page", async () => {
    // On simule : aucun utilisateur connecté
    (getStoredUserId as jest.Mock).mockReturnValue(null);
    // L’API retourne une propriété
    (getProperties as jest.Mock).mockResolvedValue([mockProperty]);
    // Aucun favori
    (getFavoritesUsers as jest.Mock).mockResolvedValue([]);

    // On affiche la page
    render(<PropertiesPage />);

    // On vérifie que le titre apparaît : findByRole = attend que l’élément apparaisse (asynchrone)
    expect(
      await screen.findByRole("heading", {
        name: /Chez vous, partout ailleurs/i,
      }),
    ).toBeInTheDocument();
  });

  // Deuxième test : affichage des propriétés
  it("affiche les propriétés récupérées", async () => {
    // Pas connecté, 1 propriété, pas de favoris
    (getStoredUserId as jest.Mock).mockReturnValue(null);
    (getProperties as jest.Mock).mockResolvedValue([mockProperty]);
    (getFavoritesUsers as jest.Mock).mockResolvedValue([]);

    // On affiche la page
    render(<PropertiesPage />);

    // Si ce text apparaît ça veut dire que la propriété a été affichée
    expect(await screen.findByText("Appartement cosy")).toBeInTheDocument();
  });

  // Troisième test : gestion des erreurs
  it("affiche un message d'erreur si le chargement échoue", async () => {
    (getStoredUserId as jest.Mock).mockReturnValue(null);
    (getProperties as jest.Mock).mockRejectedValue(new Error("API down"));

    render(<PropertiesPage />);

    // On vérifie que le message d’erreur s’affiche
    expect(
      await screen.findByText("Erreur lors du chargement des propriétés"),
    ).toBeInTheDocument();
  });
});
