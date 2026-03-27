import Link from "next/link";

export default function NotFound() {
  return (
    <main className="notfoundContainer">
      <h1 className="notfoundTitle">404</h1>

      <p className="notfoundText">
        Il semble que la page que vous cherchez ait pris des vacances… ou n’ait
        jamais existé.
      </p>
      <div className="notfoundActions">
        <Link href="/" className="notfoundButton">
          Accueil
        </Link>

        <Link href="/logements" className="notfoundButton">
          Logements
        </Link>
      </div>
    </main>
  );
}
