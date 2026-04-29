// On importe les outils de test React
// render : affiche le composant
// screen : permet de chercher des éléments dans le DOM
import { render, screen } from "@testing-library/react";
// On importe la page à tester
import FavoritesPage from "./page";
import { getFavoritesUsers } from "@/app/lib/favorites-api";
import { getStoredUserId } from "@/app/lib/auth-guard";

// On mocke l'API des favoris
// Au lieu d'appeler le vrai backend, on remplace la fonction par un mock
jest.mock("@/app/lib/favorites-api", () => ({
  getFavoritesUsers: jest.fn(),
}));

// On mocke la récupération de l'utilisateur connecté
jest.mock("@/app/lib/auth-guard", () => ({
  getStoredUserId: jest.fn(),
}));

// On mocke le composant PropertyCard
// Ici on simplifie au maximum : au lieu d'afficher toute la carte,
// on affiche juste le titre de la propriété
jest.mock("@/app/properties/components/PropertyCard", () => ({
  __esModule: true,
  default: ({ property }: { property: { title: string } }) => (
    <div>{property.title}</div>
  ),
}));

// On crée une fausse propriété qui simule une réponse API
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
    id: 7,
    name: "Alice",
    picture: "/alice.jpg",
  },
};

// On regroupe tous les tests liés à FavoritesPage
describe("FavoritesPage", () => {
  // Exécuté avant chaque test
  beforeEach(() => {
    // On reset tous les mocks pour éviter les effets entre tests
    jest.clearAllMocks();
    // On simule un utilisateur connecté avec l'id 7
    (getStoredUserId as jest.Mock).mockReturnValue(7);
  });

  // Test 1 : aucun favori
  it("affiche un message quand aucun favori n'est présent", async () => {
    // On simule une API qui retourne une liste vide
    // => aucun favori
    (getFavoritesUsers as jest.Mock).mockResolvedValue([]);

    // On affiche la page
    render(<FavoritesPage />);

    // On vérifie que le message "aucun favori" apparaît
    // findByText attend que le texte apparaisse (async)
    expect(
      await screen.findByText("Vous n'avez aucun favoris pour le moment"),
    ).toBeInTheDocument();
  });

  // Test 2 : des favoris existent
  it("affiche les favoris récupérés depuis l'API", async () => {
    // On simule une API qui retourne une propriété
    (getFavoritesUsers as jest.Mock).mockResolvedValue([mockProperty]);

    // On affiche la page
    render(<FavoritesPage />);

    // On vérifie que le titre de la propriété apparaît
    // Si oui, ça veut dire que la page a bien affiché les favoris
    expect(await screen.findByText("Appartement cosy")).toBeInTheDocument();
    // On vérifie que l'API a été appelée avec le bon userId
    // (celui qu'on a mocké dans beforeEach : 7)
    expect(getFavoritesUsers).toHaveBeenCalledWith(7);
  });
});
