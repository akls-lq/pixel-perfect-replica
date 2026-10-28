import { createFileRoute } from "@tanstack/react-router";
import { PageTitle } from "@/components/workspace/Shared";
import { usePreferences } from "@/components/preferences/usePreferences";
export const Route = createFileRoute("/app/settings")({ component: Settings });
function Settings() {
  const { t, theme, changeTheme, language, setLanguage } = usePreferences();
  return (
    <>
      <PageTitle
        eyebrow={t("À TA FAÇON", "YOUR WAY")}
        title={t("Paramètres", "Settings")}
        description={t(
          "Personnalise ton interface. Seuls le thème, la langue et les critères de recherche sont conservés dans ce navigateur.",
          "Personalise your interface. Only theme, language and search criteria are saved in this browser.",
        )}
      />
      <div className="grid items-start gap-5 xl:grid-cols-2">
        <section className="panel">
          <h2 className="font-semibold">{t("Apparence et langue", "Appearance and language")}</h2>
          <label className="mt-6 block text-sm">
            {t("Thème", "Theme")}
            <select
              className="field"
              value={theme}
              onChange={(e) => changeTheme(e.target.value as "light" | "dark")}
            >
              <option value="light">{t("Clair", "Light")}</option>
              <option value="dark">{t("Sombre", "Dark")}</option>
            </select>
          </label>
          <label className="mt-5 block text-sm">
            {t("Langue de l’interface", "Interface language")}
            <select
              className="field"
              value={language}
              onChange={(e) => setLanguage(e.target.value as "fr" | "en")}
            >
              <option value="fr">Français</option>
              <option value="en">English</option>
            </select>
          </label>
        </section>
        <section className="panel">
          <h2 className="font-semibold">
            {t("Paiement · Présentation de démonstration", "Payments · Demo presentation")}
          </h2>
          <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
            {t(
              "Aucun abonnement actif ni paiement connecté. Ces moyens sont présentés pour une intégration future.",
              "No active subscription or connected payments. These methods are shown for a future integration.",
            )}
          </p>
          <div className="my-6 grid grid-cols-2 gap-3">
            {["Visa", "Mastercard", "Apple Pay", "PayPal"].map((label) => (
              <div
                key={label}
                className="rounded-xl border bg-background/50 p-4 text-center text-sm font-semibold"
              >
                {label}
              </div>
            ))}
          </div>
          <p className="text-xs leading-relaxed text-muted-foreground">
            {t(
              "Stripe sera un prestataire de paiement futur, pas un moyen de paiement supplémentaire. Aucune transaction ni donnée bancaire n’est collectée ici.",
              "Stripe is a future payment provider, not an additional payment method. No transactions or banking details are collected here.",
            )}
          </p>
        </section>
      </div>
    </>
  );
}
