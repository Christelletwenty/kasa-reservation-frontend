import type { Metadata } from "next";
import "./globals.css";
import AppShell from "@/app/components/layouts/AppShell";

export const metadata: Metadata = {
  title: "Kasa",
  description: "Plateforme de réservation",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="fr">
      <body>
        <body>
          <AppShell>{children}</AppShell>
        </body>
      </body>
    </html>
  );
}
