"use client";

import { useRouter } from "next/navigation";
import styles from "./CreateProperty.module.css";

export default function CreatePropertyPage() {
  const router = useRouter();

  return (
    <div className={styles.createProperty__page}>
      <div className={styles.createProperty__page__actions}>
        <button
          onClick={() => router.push("/properties")}
          className={styles.properties__backButton}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={1.5}
            stroke="currentColor"
            className="size-4"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M10.5 19.5 3 12m0 0 7.5-7.5M3 12h18"
            />
          </svg>
          Retour
        </button>
        <div className={styles.properties__addProperty}>
          <h1>Ajouter une propriété</h1>
          <button>Ajouter</button>
        </div>
      </div>

      <div className={styles.createproperty__container}>
        <div className={styles.createproperty__form_container}>
          <form className={styles.createproperty__form}>
            <label
              className={styles.createProperty__label}
              htmlFor="Property title"
            >
              Titre de la propriété
            </label>
            <input
              className={styles.createProperty__input}
              type="text"
              id="property-title"
              placeholder="Ex : Appartement cosy au coeur de paris"
              required
            />
            <label
              className={styles.createProperty__label}
              htmlFor="Description"
            >
              Description
            </label>
            <textarea
              rows={4}
              cols={50}
              className={styles.createProperty__input}
              id="description"
              placeholder="Ex : Décrivez votre propriété en détail..."
              required
            />
            <label
              className={styles.createProperty__label}
              htmlFor="Code postal"
            >
              Code postal
            </label>
            <input
              className={styles.createProperty__input}
              type="number"
              id="postal-code"
              required
            />
            <label
              className={styles.createProperty__label}
              htmlFor="Localisation"
            >
              Localisation
            </label>
            <input
              className={styles.createProperty__input}
              type="text"
              id="property-localisation"
              required
            />
          </form>
        </div>
        <div className={styles.createProperty__coverImage}>
          <div className={styles.imageCard}>
            <div className={styles.imageBlock}>
              <label htmlFor="coverImage" className={styles.imageField__label}>
                Image de couverture
              </label>

              <div className={styles.imageField__row}>
                <div className={styles.imageField__fakeInput}></div>

                <label
                  htmlFor="coverImage"
                  className={styles.imageField__button}
                >
                  +
                </label>
              </div>

              <input
                id="coverImage"
                name="coverImage"
                type="file"
                accept="image/*"
                hidden
              />
            </div>

            <div className={styles.imageBlock}>
              <label
                htmlFor="propertyImage1"
                className={styles.imageField__label}
              >
                Image du logement
              </label>

              <div className={styles.imageField__row}>
                <div className={styles.imageField__fakeInput}></div>

                <label
                  htmlFor="propertyImage1"
                  className={styles.imageField__button}
                >
                  +
                </label>
              </div>

              <input
                id="propertyImage1"
                name="propertyImages"
                type="file"
                accept="image/*"
                hidden
              />

              <p className={styles.imageField__link}>+ Ajouter une image</p>
            </div>
          </div>

          <div className={styles.hostCard}>
            <label htmlFor="host-name" className={styles.imageField__label}>
              Nom de l'hôte
            </label>
            <input
              className={styles.createProperty__input}
              type="text"
              id="host-name"
              required
            />

            <div className={styles.imageBlock}>
              <label htmlFor="hostImage1" className={styles.imageField__label}>
                Photo de profil
              </label>

              <div className={styles.imageField__row}>
                <div className={styles.imageField__fakeInput}></div>

                <label
                  htmlFor="hostImage1"
                  className={styles.imageField__button}
                >
                  +
                </label>
              </div>

              <input
                id="hostImage1"
                name="hostImage1"
                type="file"
                accept="image/*"
                hidden
              />

              <p className={styles.imageField__link}>+ Ajouter une image</p>
            </div>
          </div>
        </div>
        <div className={styles.property__equipments}>
          <h2 className={styles.property__equipments__title}>Equipements</h2>
          <label
            htmlFor="Equipments"
            className={styles.property__equipments_item}
          >
            <input type="checkbox" name="equipments" />
            <span>Micro-Ondes</span>
          </label>

          <label
            htmlFor="Equipments"
            className={styles.property__equipments_item}
          >
            <input type="checkbox" name="equipments" />
            <span>Douche italienne</span>
          </label>

          <label
            htmlFor="Equipments"
            className={styles.property__equipments_item}
          >
            <input type="checkbox" name="equipments" />
            <span>Frigo</span>
          </label>

          <label
            htmlFor="Equipments"
            className={styles.property__equipments_item}
          >
            <input type="checkbox" name="equipments" />
            <span>WIFI</span>
          </label>

          <label
            htmlFor="Equipments"
            className={styles.property__equipments_item}
          >
            <input type="checkbox" name="equipments" />
            <span>Parking</span>
          </label>

          <label
            htmlFor="Equipments"
            className={styles.property__equipments_item}
          >
            <input type="checkbox" name="equipments" />
            <span>Sèche Cheveux</span>
          </label>

          <label
            htmlFor="Equipments"
            className={styles.property__equipments_item}
          >
            <input type="checkbox" name="equipments" />
            <span>Machine à laver</span>
          </label>

          <label
            htmlFor="Equipments"
            className={styles.property__equipments_item}
          >
            <input type="checkbox" name="equipments" />
            <span>Cuisine équipée</span>
          </label>

          <label
            htmlFor="Equipments"
            className={styles.property__equipments_item}
          >
            <input type="checkbox" name="equipments" />
            <span>Télévision</span>
          </label>

          <label
            htmlFor="Equipments"
            className={styles.property__equipments_item}
          >
            <input type="checkbox" name="equipments" />
            <span>Chambre Séparée</span>
          </label>

          <label
            htmlFor="Equipments"
            className={styles.property__equipments_item}
          >
            <input type="checkbox" name="equipments" />
            <span>Climatisation</span>
          </label>

          <label
            htmlFor="Equipments"
            className={styles.property__equipments_item}
          >
            <input type="checkbox" name="equipments" />
            <span>Frigo Américain</span>
          </label>

          <label
            htmlFor="Equipments"
            className={styles.property__equipments_item}
          >
            <input type="checkbox" name="equipments" />
            <span>Clic-clac</span>
          </label>

          <label
            htmlFor="Equipments"
            className={styles.property__equipments_item}
          >
            <input type="checkbox" name="equipments" />
            <span>Four</span>
          </label>

          <label
            htmlFor="Equipments"
            className={styles.property__equipments_item}
          >
            <input type="checkbox" name="equipments" />
            <span>Rangements</span>
          </label>

          <label
            htmlFor="Equipments"
            className={styles.property__equipments_item}
          >
            <input type="checkbox" name="equipments" />
            <span>Lit</span>
          </label>

          <label
            htmlFor="Equipments"
            className={styles.property__equipments_item}
          >
            <input type="checkbox" name="equipments" />
            <span>Bouilloire</span>
          </label>

          <label
            htmlFor="Equipments"
            className={styles.property__equipments_item}
          >
            <input type="checkbox" name="equipments" />
            <span>SDB</span>
          </label>

          <label
            htmlFor="Equipments"
            className={styles.property__equipments_item}
          >
            <input type="checkbox" name="equipments" />
            <span>Toilettes sèches</span>
          </label>

          <label
            htmlFor="Equipments"
            className={styles.property__equipments_item}
          >
            <input type="checkbox" name="equipments" />
            <span>Cintres</span>
          </label>

          <label
            htmlFor="Equipments"
            className={styles.property__equipments_item}
          >
            <input type="checkbox" name="equipments" />
            <span>Baie vitrée</span>
          </label>

          <label
            htmlFor="Equipments"
            className={styles.property__equipments_item}
          >
            <input type="checkbox" name="equipments" />
            <span>Hotte</span>
          </label>

          <label
            htmlFor="Equipments"
            className={styles.property__equipments_item}
          >
            <input type="checkbox" name="equipments" />
            <span>Baignoire</span>
          </label>

          <label
            htmlFor="Equipments"
            className={styles.property__equipments_item}
          >
            <input type="checkbox" name="equipments" />
            <span>Vue Parc</span>
          </label>
        </div>
        <div className={styles.property__category}>
          <h2 className={styles.property__category__title}>Catégories</h2>
          <div className={styles.property__category__buttons}>
            <button type="button" className={styles.property__category__chip}>
              Parc
            </button>
            <button type="button" className={styles.property__category__chip}>
              Night Life
            </button>
            <button type="button" className={styles.property__category__chip}>
              Culture
            </button>
            <button type="button" className={styles.property__category__chip}>
              Nature
            </button>
            <button type="button" className={styles.property__category__chip}>
              Touristique
            </button>

            <button type="button" className={styles.property__category__chip}>
              Vue sur mer
            </button>
            <button type="button" className={styles.property__category__chip}>
              Pour les couples
            </button>
            <button type="button" className={styles.property__category__chip}>
              Famille
            </button>
            <button type="button" className={styles.property__category__chip}>
              Forêt
            </button>
          </div>
          <div className={styles.custom__category}>
            <h2 className={styles.custom__category__title}>
              Ajouter une catégorie personnalisée
            </h2>
            <input
              type="text"
              className={styles.custom__category__input}
              placeholder="Nouveau tag"
              aria-label="Nouveau tag"
            />

            <label
              htmlFor="categoryImage"
              className={styles.imageField__button}
            >
              +
            </label>

            <button type="button" className={styles.custom__category__link}>
              + Ajouter un tag
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
