// Fictitious credentials only. Never use these for a real account.
export type Account = { id: string; company: string; url: string; email: string; password: string };
export const accountSamples: Account[] = [
  {
    id: "1",
    company: "Atelier Nova",
    url: "https://careers.example.com/nova",
    email: "camille.demo@example.com",
    password: "DEMO-Nova!7xQ#92zT",
  },
  {
    id: "2",
    company: "Studio Halo",
    url: "https://careers.example.com/halo",
    email: "camille.demo@example.com",
    password: "DEMO-Halo#9pV!46mR",
  },
  {
    id: "3",
    company: "Cèdre Conseil",
    url: "https://careers.example.com/cedre",
    email: "candidat.demo@example.com",
    password: "DEMO-Cedre!5sK#83jW",
  },
];
