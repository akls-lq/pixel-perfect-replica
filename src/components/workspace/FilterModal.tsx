import * as Dialog from "@radix-ui/react-dialog";
import { useState } from "react";
import { X, ChevronDown } from "lucide-react";
import {
  emptyCriteria,
  options,
  futureMonths,
  type Group,
  type SearchCriteria,
  type Option,
} from "@/lib/autopilot-data";
import { usePreferences } from "@/components/preferences/usePreferences";
export function FilterModal({
  open,
  onClose,
  value,
  onApply,
}: {
  open: boolean;
  onClose: () => void;
  value: SearchCriteria;
  onApply: (v: SearchCriteria) => void;
}) {
  const { t } = usePreferences();
  const [draft, setDraft] = useState(value);
  const [more, setMore] = useState(false);
  const salaryError =
    draft.salaryMin !== "" &&
    draft.salaryMax !== "" &&
    Number(draft.salaryMin) > Number(draft.salaryMax);
  const toggle = (group: Group, v: string) =>
    setDraft((d) => ({
      ...d,
      [group]: d[group].includes(v) ? d[group].filter((x) => x !== v) : [...d[group], v],
    }));
  const months = futureMonths(new Date());
  function section(group: Group, fr: string, en: string, choices: Option[], disclosure = false) {
    const controls = (
      <div className="grid gap-x-6 gap-y-5 sm:grid-cols-2">
        {choices.map((o) => (
          <label key={o.value} className="flex items-start gap-3 text-sm">
            <input
              className="mt-0.5 h-4 w-4 shrink-0 accent-[var(--primary)]"
              type="checkbox"
              checked={draft[group].includes(o.value)}
              onChange={() => toggle(group, o.value)}
            />
            {t(o.fr, o.en)}
          </label>
        ))}
      </div>
    );
    return (
      <fieldset key={group} className="border-b py-7 last:border-0">
        <legend className="float-left mb-6 w-full text-base font-bold">{t(fr, en)}</legend>
        <div className="clear-both">
          {disclosure ? (
            <details>
              <summary className="mb-5 flex cursor-pointer list-none items-center justify-between rounded-xl border p-3 text-sm text-muted-foreground">
                {draft[group].length
                  ? `${draft[group].length} ${t("sélection(s)", "selected")}`
                  : t("Sélectionner des critères", "Select criteria")}
                <ChevronDown size={16} />
              </summary>
              {controls}
            </details>
          ) : (
            controls
          )}
        </div>
      </fieldset>
    );
  }
  return (
    <Dialog.Root
      open={open}
      onOpenChange={(o) => {
        if (!o) onClose();
      }}
    >
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm" />
        <Dialog.Content className="fixed left-1/2 top-1/2 z-50 flex max-h-[90dvh] w-[900px] max-w-[95vw] -translate-x-1/2 -translate-y-1/2 flex-col rounded-[2rem] border bg-popover shadow-elegant">
          <div className="flex shrink-0 items-start justify-between gap-4 border-b px-6 py-6 md:px-9">
            <div>
              <Dialog.Title className="text-xl font-extrabold">
                {t("Plus de critères", "More criteria")}
              </Dialog.Title>
              <Dialog.Description className="mt-1 text-xs text-muted-foreground">
                {t(
                  "Combine tes préférences. Rien ne sera lancé automatiquement.",
                  "Combine preferences. Nothing will run automatically.",
                )}
              </Dialog.Description>
            </div>
            <Dialog.Close
              className="rounded-full p-2 hover:bg-secondary"
              aria-label={t("Fermer les critères", "Close criteria")}
            >
              <X size={21} />
            </Dialog.Close>
          </div>
          <div className="min-h-0 overflow-y-auto px-6 md:px-9">
            <fieldset className="border-b py-7">
              <legend className="float-left mb-2 w-full text-base font-bold">
                {t("Fourchette de salaire", "Salary range")}
              </legend>
              <p id="salary-unit" className="clear-both mb-5 text-xs text-muted-foreground">
                {t(
                  "En euros brut par an. Les deux bornes sont facultatives.",
                  "Gross annual salary in euros. Both limits are optional.",
                )}
              </p>
              <div className="grid gap-4 sm:grid-cols-2">
                {(["salaryMin", "salaryMax"] as const).map((key) => (
                  <label key={key} className="text-sm font-medium">
                    {key === "salaryMin"
                      ? t("Salaire minimum", "Minimum salary")
                      : t("Salaire maximum", "Maximum salary")}
                    <input
                      type="number"
                      inputMode="numeric"
                      min="0"
                      max="99999999"
                      step="1"
                      value={draft[key]}
                      onChange={(e) => {
                        const next = e.target.value;
                        if (next === "" || /^\d{1,8}$/.test(next))
                          setDraft((d) => ({ ...d, [key]: next }));
                      }}
                      aria-describedby={`salary-unit${salaryError ? " salary-error" : ""}`}
                      aria-invalid={salaryError || undefined}
                      placeholder={key === "salaryMin" ? "30 000" : "55 000"}
                      className="field"
                    />
                  </label>
                ))}
              </div>
              {salaryError && (
                <p id="salary-error" role="alert" className="mt-3 text-sm text-red-800">
                  {t(
                    "Le salaire minimum doit être inférieur ou égal au maximum.",
                    "The minimum salary must not exceed the maximum.",
                  )}
                </p>
              )}
            </fieldset>
            {section("durations", "Durée", "Duration", options("durations"))}
            {section("functions", "Fonction", "Job function", options("functions"), true)}
            {section("experience", "Expérience", "Experience", options("experience"))}
            {section(
              "languages",
              "Langue des offres",
              "Job listing language",
              options("languages"),
            )}
            {section("education", "Niveau d’études", "Education", options("education"))}
            {section("start", "Date de début", "Start date", [
              { value: "asap", fr: "Dès que possible", en: "As soon as possible" },
              ...months.slice(0, more ? 18 : 5),
            ])}
            <button
              onClick={() => setMore((m) => !m)}
              className="my-4 flex items-center gap-2 text-sm font-bold text-primary-text"
            >
              <ChevronDown size={15} />
              {more ? t("Afficher moins", "Show less") : t("Afficher plus", "Show more")}
            </button>
            {section("sectors", "Secteur d’activité", "Industry", options("sectors"), true)}
            {section(
              "application",
              "Type de candidature",
              "Application type",
              options("application"),
            )}
            {section("remote", "Télétravail", "Remote work", options("remote"))}
            {section("companies", "Catégorie d’entreprise", "Company type", options("companies"))}
          </div>
          <footer className="flex shrink-0 justify-end gap-5 border-t px-6 py-5 md:px-9">
            <button
              onClick={() => setDraft({ ...emptyCriteria })}
              className="text-sm font-semibold text-muted-foreground"
            >
              {t("Tout effacer", "Clear all")}
            </button>
            <button disabled={salaryError} onClick={() => onApply(draft)} className="btn-primary">
              {t("Appliquer", "Apply")}
            </button>
          </footer>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}
