export type Activation = { start: string; end: string | null };
export type UsagePeriod = "day" | "week" | "month";
export const usageReference = new Date("2026-10-28T12:00:00Z");
export const mockActivations: Activation[] = Array.from({ length: 100 }, (_, i) => {
  const day = new Date(usageReference);
  day.setUTCDate(day.getUTCDate() - i);
  day.setUTCHours(7, 0, 0, 0);
  return {
    start: day.toISOString(),
    end: new Date(day.getTime() + (0.4 + (i % 6) * 0.35) * 3600000).toISOString(),
  };
}).filter((_, i) => i < 6 || i % 4 !== 0);
export function localDay(date: Date, zone: string) {
  const parts = new Intl.DateTimeFormat("en-GB", {
    timeZone: zone,
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).formatToParts(date);
  return ["year", "month", "day"].map((p) => parts.find((x) => x.type === p)!.value).join("-");
}
function shift(key: string, days: number) {
  const d = new Date(key + "T12:00:00Z");
  d.setUTCDate(d.getUTCDate() + days);
  return d.toISOString().slice(0, 10);
}
function periodKey(day: string, period: UsagePeriod) {
  if (period === "day") return day;
  if (period === "month") return day.slice(0, 7);
  const d = new Date(day + "T12:00:00Z");
  return shift(day, -((d.getUTCDay() + 6) % 7));
}
export function usageSummary(sessions: Activation[], now: Date, zone: string) {
  const merged: { start: number; end: number }[] = [];
  const ranges = sessions
    .map((s) => ({
      start: new Date(s.start).getTime(),
      end: Math.min(s.end ? new Date(s.end).getTime() : now.getTime(), now.getTime()),
    }))
    .filter((s) => Number.isFinite(s.start) && Number.isFinite(s.end) && s.end > s.start)
    .sort((a, b) => a.start - b.start);
  for (const r of ranges) {
    const previous = merged.at(-1);
    if (previous && r.start <= previous.end) previous.end = Math.max(previous.end, r.end);
    else merged.push({ ...r });
  }
  const daily: Record<string, number> = {};
  for (const range of merged) {
    let at = range.start;
    while (at < range.end) {
      const end = Math.min(range.end, (Math.floor(at / 900000) + 1) * 900000);
      const key = localDay(new Date(at), zone);
      daily[key] = (daily[key] ?? 0) + (end - at) / 3600000;
      at = end;
    }
  }
  const keys = Object.keys(daily).sort();
  let best = 0,
    run = 0,
    previous = "";
  for (const day of keys) {
    run = previous && shift(previous, 1) === day ? run + 1 : 1;
    best = Math.max(best, run);
    previous = day;
  }
  const today = localDay(now, zone);
  let current = 0;
  let cursor = daily[today] ? today : shift(today, -1);
  while (daily[cursor]) {
    current++;
    cursor = shift(cursor, -1);
  }
  return {
    daily,
    best,
    current,
    today,
    totalHours: Object.values(daily).reduce((a, b) => a + b, 0),
  };
}
export function usageChart(sessions: Activation[], period: UsagePeriod, now: Date, zone: string) {
  const { daily, today } = usageSummary(sessions, now, zone);
  const count = period === "day" ? 7 : period === "week" ? 8 : 6;
  let keys: string[] = [];
  if (period === "month") {
    const date = new Date(today + "T12:00:00Z");
    date.setUTCDate(1);
    keys = Array.from({ length: count }, (_, i) => {
      const d = new Date(date);
      d.setUTCMonth(d.getUTCMonth() - count + 1 + i);
      return d.toISOString().slice(0, 7);
    });
  } else
    keys = Array.from({ length: count }, (_, i) =>
      shift(
        period === "day" ? today : periodKey(today, "week"),
        (i - count + 1) * (period === "day" ? 1 : 7),
      ),
    );
  return keys.map((key) => ({
    key,
    hours: Object.entries(daily)
      .filter(([day]) => periodKey(day, period) === key)
      .reduce((sum, [, hours]) => sum + hours, 0),
  }));
}
