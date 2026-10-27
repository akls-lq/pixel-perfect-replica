import { useWorkspace } from "@/components/workspace/useWorkspace";
import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { Eye, EyeOff, Copy, KeyRound, Plus, ExternalLink, Trash2, ShieldCheck } from "lucide-react";
import { PageTitle, EmptyState } from "@/components/workspace/Shared";
import { safeUrl } from "@/lib/workspace-data";
export const Route = createFileRoute("/app/accounts")({
  head: () => ({ meta: [{ title: "Comptes employeurs — Crétoria" }] }),
  component: Accounts,
});
function Accounts() {
  const { accounts, setAccounts } = useWorkspace();
  const [visible, setVisible] = useState<string[]>([]);
  const [form, setForm] = useState(false);
  const [draft, setDraft] = useState({ company: "", url: "", email: "", password: "" });
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [q, setQ] = useState("");
  async function copy(value: string) {
    try {
      await navigator.clipboard.writeText(value);
      setMessage("Identifiant de démonstration copié.");
      setError("");
    } catch {
      setError(
        "La copie est indisponible dans ce navigateur. Révèle le champ pour le copier manuellement.",
      );
    }
  }
  function generate() {
    const chars = "ABCDEFGHJKLMNPQRSTUVWXYZabcdefghjkmnpqrstuvwxyz23456789!@#$%";
    const bytes = crypto.getRandomValues(new Uint8Array(20));
    const password = "Aa7!" + Array.from(bytes, (b) => chars[b % chars.length]).join("");
    setDraft((d) => ({ ...d, password }));
  }
  const list = accounts.filter((a) =>
    `${a.company} ${a.email}`.toLowerCase().includes(q.toLowerCase()),
  );
  return (
    <>
      <PageTitle
        eyebrow="TON RÉPERTOIRE EMPLOYEURS"
        title="Tes accès, au même endroit."
        description="Une vue front-end des comptes associés aux sites employeurs. Aucun compte réel n’a été créé par Crétoria."
      >
        <button onClick={() => setForm((f) => !f)} aria-expanded={form} className="btn-primary">
          <Plus size={16} /> Ajouter un compte démo
        </button>
      </PageTitle>
      <div className="mb-6 flex items-start gap-3 rounded-xl border border-primary/20 bg-primary/5 p-4 text-xs leading-relaxed">
        <ShieldCheck className="shrink-0 text-primary-text" size={20} />
        <p>
          <strong>Identifiants fictifs uniquement.</strong> Les mots de passe ci-dessous sont des
          exemples. N’entre pas de vrai mot de passe dans ce prototype : il n’existe pas encore de
          coffre chiffré ni de compte utilisateur. Rien n’est stocké sur un serveur ou dans le
          stockage du navigateur ; un rechargement efface les ajouts. Les sites example.com ne sont
          pas des portails employeurs réels.
        </p>
      </div>
      {message && (
        <p role="status" className="mb-4 rounded-lg bg-teal-50 p-3 text-sm text-teal-800">
          {message}
        </p>
      )}
      {error && (
        <p role="alert" className="mb-4 rounded-lg bg-red-50 p-3 text-sm text-red-800">
          {error}
        </p>
      )}
      {form && (
        <form
          className="panel mb-6"
          onSubmit={(e) => {
            e.preventDefault();
            setMessage("");
            setError("");
            if (
              !draft.company.trim() ||
              !safeUrl(draft.url) ||
              !draft.email.match(/^[^\s@]+@[^\s@]+\.[^\s@]+$/) ||
              draft.password.length < 12
            ) {
              setError(
                "Vérifie le nom, l’URL complète, l’email et le mot de passe fictif (12 caractères minimum).",
              );
              return;
            }
            setAccounts((xs) => [...xs, { ...draft, id: crypto.randomUUID() }]);
            setDraft({ company: "", url: "", email: "", password: "" });
            setForm(false);
            setMessage("Compte fictif ajouté à cette session. Aucun compte externe créé.");
          }}
        >
          <h2 className="font-bold">Ajouter un exemple de compte</h2>
          <div className="mt-4 grid gap-4 sm:grid-cols-2">
            <label className="text-xs font-bold">
              Nom de l’employeur
              <input
                required
                maxLength={100}
                className="field"
                value={draft.company}
                onChange={(e) => setDraft((d) => ({ ...d, company: e.target.value }))}
              />
            </label>
            <label className="text-xs font-bold">
              Site employeur
              <input
                required
                type="url"
                className="field"
                placeholder="https://careers.example.com"
                value={draft.url}
                onChange={(e) => setDraft((d) => ({ ...d, url: e.target.value }))}
              />
            </label>
            <label className="text-xs font-bold">
              Email fictif
              <input
                required
                type="email"
                autoComplete="off"
                className="field"
                placeholder="candidat@example.com"
                value={draft.email}
                onChange={(e) => setDraft((d) => ({ ...d, email: e.target.value }))}
              />
            </label>
            <label className="text-xs font-bold">
              Mot de passe fictif
              <input
                required
                type="password"
                minLength={12}
                autoComplete="new-password"
                className="field"
                value={draft.password}
                onChange={(e) => setDraft((d) => ({ ...d, password: e.target.value }))}
              />
              <button type="button" onClick={generate} className="mt-2 text-xs text-primary-text">
                Générer un exemple robuste
              </button>
            </label>
          </div>
          <div className="mt-5 flex gap-3">
            <button type="submit" className="btn-primary">
              Ajouter à la démo
            </button>
            <button
              type="button"
              onClick={() => setForm(false)}
              className="rounded-lg border px-4 text-sm"
            >
              Annuler
            </button>
          </div>
        </form>
      )}
      <label className="mb-5 block max-w-md text-xs font-bold">
        Rechercher un employeur ou un email
        <input
          className="field"
          value={q}
          onChange={(e) => setQ(e.target.value)}
          placeholder="Nom d’entreprise…"
        />
      </label>
      {list.length === 0 ? (
        <EmptyState title="Aucun compte dans cette sélection.">
          Change la recherche ou ajoute un exemple.
        </EmptyState>
      ) : (
        <div className="grid gap-4 lg:grid-cols-2">
          {list.map((a) => (
            <article key={a.id} className="panel">
              <div className="flex items-start gap-3">
                <span className="rounded-xl bg-primary/10 p-3 text-primary-text">
                  <KeyRound size={21} />
                </span>
                <div className="min-w-0 flex-1">
                  <h2 className="font-bold">{a.company}</h2>
                  <p className="mt-1 text-xs text-muted-foreground">Compte fictif · Non connecté</p>
                </div>
                <button
                  onClick={() => {
                    setAccounts((xs) => xs.filter((x) => x.id !== a.id));
                    setVisible((xs) => xs.filter((x) => x !== a.id));
                  }}
                  aria-label={`Supprimer le compte ${a.company}`}
                  className="rounded-lg border p-2 text-muted-foreground"
                >
                  <Trash2 size={15} />
                </button>
              </div>
              <a
                href={a.url}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-4 flex items-center gap-2 break-all text-xs font-semibold text-primary-text"
              >
                <ExternalLink size={13} className="shrink-0" />
                {a.url}
              </a>
              <dl className="mt-5 space-y-4">
                <div>
                  <dt className="text-xs font-semibold text-muted-foreground">Email choisi</dt>
                  <dd className="mt-1 flex items-center justify-between gap-2 rounded-lg bg-background px-3 py-2">
                    <span className="min-w-0 break-all text-sm">{a.email}</span>
                    <button
                      onClick={() => void copy(a.email)}
                      aria-label={`Copier l’email ${a.company}`}
                      className="shrink-0 p-1 text-primary-text"
                    >
                      <Copy size={15} />
                    </button>
                  </dd>
                </div>
                <div>
                  <dt className="text-xs font-semibold text-muted-foreground">
                    Mot de passe fictif
                  </dt>
                  <dd className="mt-1 flex items-center gap-2 rounded-lg bg-background px-3 py-2">
                    <span className="min-w-0 flex-1 break-all font-mono text-sm">
                      {visible.includes(a.id) ? a.password : "••••••••••••••••"}
                    </span>
                    <button
                      onClick={() =>
                        setVisible((xs) =>
                          xs.includes(a.id) ? xs.filter((x) => x !== a.id) : [...xs, a.id],
                        )
                      }
                      aria-label={`${visible.includes(a.id) ? "Masquer" : "Afficher"} le mot de passe ${a.company}`}
                      aria-pressed={visible.includes(a.id)}
                      className="shrink-0 p-1 text-primary-text"
                    >
                      {visible.includes(a.id) ? <EyeOff size={16} /> : <Eye size={16} />}
                    </button>
                    <button
                      onClick={() => void copy(a.password)}
                      aria-label={`Copier le mot de passe ${a.company}`}
                      className="shrink-0 p-1 text-primary-text"
                    >
                      <Copy size={15} />
                    </button>
                  </dd>
                </div>
              </dl>
            </article>
          ))}
        </div>
      )}
    </>
  );
}
