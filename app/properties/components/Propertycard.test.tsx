// On importe les outils de React Testing Library.
// render permet d'afficher un composant dans le test.
// screen permet de chercher des éléments dans ce composant.
// fireEvent permet de simuler une action utilisateur, comme un clic.
// waitFor permet d'attendre qu'une action async soit terminée.
import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import PropertyCard from "./PropertyCard";
import { addPropertiesToFavorites } from "@/app/lib/favorites-api";

// On crée une fausse fonction push.
// Elle va remplacer la vraie navigation Next.js.
const mockPush = jest.fn();

// On mocke le fichier favorites-api : le test ne fait aucun vrai appel backend.
jest.mock("@/app/lib/favorites-api", () => ({
  addPropertiesToFavorites: jest.fn(),
  deletePropertiesFromFavorites: jest.fn(),
}));

// On mocke next/navigation. On remplace push par notre mockPush pour vérifier qu'il est bien appelé.
jest.mock("next/navigation", () => ({
  useRouter: () => ({
    push: mockPush,
  }),
}));

// On mocke la modale de suppression. On la remplace par un composant vide qui ne rend rien.
jest.mock("./DeletePropertyModal", () => ({
  __esModule: true,
  default: () => null,
}));

// On crée une fausse propriété.
// Elle simule une propriété que l'API pourrait retourner.
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

// describe regroupe tous les tests liés au composant PropertyCard.
describe("PropertyCard", () => {
  // beforeEach est exécuté avant chaque test.
  // Ici, on remet les mocks à zéro pour éviter qu'un test influence un autre test.
  beforeEach(() => {
    jest.clearAllMocks();
  });

  // Premier test : on vérifie que la carte affiche bien les infos principales.
  it("affiche les informations principales", () => {
    // On affiche le composant PropertyCard avec une fausse propriété.
    render(
      <PropertyCard
        property={mockProperty}
        favorites={false}
        canDelete={false}
        favoriteChanged={jest.fn()}
      />,
    );

    // On vérifie que le titre est affiché.
    expect(screen.getByText("Appartement cosy")).toBeInTheDocument();
    // On vérifie que la localisation est affichée.
    expect(screen.getByText("Paris")).toBeInTheDocument();
    // On vérifie que le prix est affiché.
    expect(screen.getByText("120€")).toBeInTheDocument();
  });

  // Deuxième test : on vérifie que le clic sur la carte redirige vers la page détail.
  it("redirige vers le détail au clic", () => {
    render(
      <PropertyCard
        property={mockProperty}
        favorites={false}
        canDelete={false}
        favoriteChanged={jest.fn()}
      />,
    );

    // On simule un clic utilisateur sur le titre de la propriété.
    fireEvent.click(screen.getByText("Appartement cosy"));

    // On vérifie que router.push a bien été appelé avec la bonne URL.
    // Ici, on s'attend à aller vers /properties/prop-1.
    expect(mockPush).toHaveBeenCalledWith("/properties/prop-1");
  });

  // Troisième test : on vérifie l'ajout aux favoris.
  it("ajoute la propriété aux favoris", async () => {
    // On dit que la fausse API addPropertiesToFavorites doit réussir.
    // mockResolvedValue simule une réponse async réussie.
    (addPropertiesToFavorites as jest.Mock).mockResolvedValue({ ok: true });

    // On crée une fausse fonction callback.
    // Elle permet de vérifier que le composant prévient son parent
    // quand le favori a changé.
    const onFavoriteChanged = jest.fn();

    render(
      <PropertyCard
        property={mockProperty}
        favorites={false}
        canDelete={false}
        canFavorite={true}
        favoriteChanged={onFavoriteChanged}
      />,
    );

    // On simule un clic sur le bouton "Favoris".
    fireEvent.click(screen.getByRole("button", { name: "Favoris" }));

    // Comme l'ajout aux favoris est une action async,
    // on attend que l'appel API soit bien effectué.
    await waitFor(() => {
      expect(addPropertiesToFavorites).toHaveBeenCalledWith("prop-1");
    });

    // On vérifie que le callback favoriteChanged a été appelé avec true.
    // Cela signifie : "la propriété est maintenant en favori".
    expect(onFavoriteChanged).toHaveBeenCalledWith(true);
  });
});
