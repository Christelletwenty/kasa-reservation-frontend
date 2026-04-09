"use client";
import styles from "./ConditionsPage.module.css";

export default function ConditionsPage() {
  return (
    <div className={styles.conditions__page}>
      <h1>Conditions générales d'utilisation</h1>

      <section>
        <h2>1. Objet</h2>
        <p>
          Les présentes conditions générales d’utilisation (ci-après « CGU »)
          ont pour objet de définir les modalités et conditions dans lesquelles
          les utilisateurs peuvent accéder et utiliser l’application.
        </p>
        <p>
          En utilisant l’application, vous acceptez pleinement et sans réserve
          les présentes CGU.
        </p>
      </section>

      <section>
        <h2>2. Accès au service</h2>
        <p>
          L’application est accessible gratuitement à tout utilisateur disposant
          d’un accès à Internet.
        </p>
        <p>
          L’éditeur se réserve le droit de suspendre, limiter ou interrompre
          l’accès au service à tout moment, notamment pour des raisons de
          maintenance ou de sécurité.
        </p>
      </section>

      <section>
        <h2>3. Création de compte</h2>
        <p>
          Certaines fonctionnalités nécessitent la création d’un compte
          utilisateur.
        </p>
        <ul>
          <li>fournir des informations exactes et à jour</li>
          <li>ne pas usurper l’identité d’un tiers</li>
          <li>préserver la confidentialité de ses identifiants</li>
        </ul>
        <p>
          Toute utilisation frauduleuse du compte pourra entraîner sa suspension
          ou sa suppression.
        </p>
      </section>

      <section>
        <h2>4. Responsabilités</h2>
        <p>
          L’utilisateur est seul responsable de l’utilisation qu’il fait de
          l’application.
        </p>
        <p>
          L’éditeur ne pourra être tenu responsable des dommages indirects, des
          interruptions de service ou des erreurs dans les contenus.
        </p>
      </section>

      <section>
        <h2>5. Données personnelles</h2>
        <p>
          Les données personnelles collectées sont utilisées uniquement dans le
          cadre du fonctionnement de l’application.
        </p>
        <p>
          Conformément à la réglementation en vigueur, l’utilisateur dispose
          d’un droit d’accès, de rectification et de suppression de ses données.
        </p>
      </section>

      <section>
        <h2>6. Propriété intellectuelle</h2>
        <p>
          L’ensemble des éléments de l’application (design, contenu, code, etc.)
          est protégé par les lois relatives à la propriété intellectuelle.
        </p>
        <p>
          Toute reproduction ou exploitation sans autorisation est interdite.
        </p>
      </section>

      <section>
        <h2>7. Comportement des utilisateurs</h2>
        <ul>
          <li>ne pas utiliser le service à des fins illégales</li>
          <li>ne pas perturber le fonctionnement de l’application</li>
          <li>ne pas tenter d’accéder de manière frauduleuse aux systèmes</li>
        </ul>
      </section>

      <section>
        <h2>8. Modification des CGU</h2>
        <p>
          Les présentes CGU peuvent être modifiées à tout moment. Les
          utilisateurs seront informés des changements importants.
        </p>
      </section>

      <section>
        <h2>9. Droit applicable</h2>
        <p>
          Les présentes CGU sont régies par le droit applicable dans le pays de
          l’éditeur.
        </p>
      </section>
    </div>
  );
}
