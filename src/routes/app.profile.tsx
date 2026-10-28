import { createFileRoute, Link } from "@tanstack/react-router";
import { UserRound } from "lucide-react";
import { PageTitle } from "@/components/workspace/Shared";
import { usePreferences } from "@/components/preferences/usePreferences";
export const Route = createFileRoute("/app/profile")({ component: Profile });
function Profile() {
  const { t } = usePreferences();
  return (
    <>
      <PageTitle
        eyebrow={t("MON COMPTE", "MY ACCOUNT")}
        title={t("Ton espace personnel", "Your personal workspace")}
        description={t(
          "Le prototype ne dispose pas encore d’authentification. Aucune identité ni connexion n’est inventée.",
          "Authentication is not connected in this prototype. No identity or connection is invented.",
        )}
      />
      <section className="panel max-w-3xl">
        <span className="inline-flex rounded-full bg-primary/10 p-4 text-primary-text">
          <UserRound size={30} />
        </span>
        <dl className="mt-6 divide-y">
          {[
            [t("Nom", "Name"), t("Visiteur", "Visitor")],
            [t("Email", "Email"), t("Non renseigné", "Not provided")],
            [t("Identifiant", "Account ID"), t("Non disponible", "Not available")],
            [
              t("État du compte", "Account status"),
              t("Démonstration · Non authentifié", "Demo · Not authenticated"),
            ],
          ].map(([label, value]) => (
            <div key={label} className="flex flex-wrap justify-between gap-3 py-4 text-sm">
              <dt className="text-muted-foreground">{label}</dt>
              <dd className="font-medium">{value}</dd>
            </div>
          ))}
        </dl>
        <Link to="/app/settings" className="btn-primary mt-6">
          {t("Ouvrir les paramètres", "Open settings")}
        </Link>
      </section>
    </>
  );
}
