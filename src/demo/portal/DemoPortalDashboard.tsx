import { Link } from "react-router-dom";
import {
  Area,
  CartesianGrid,
  ComposedChart,
  Line,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { ArrowRight, Inbox, Package, TrendingUp, Wallet } from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { inquiryTrend } from "../data";
import { useDemo } from "../store";

const NAVY = "hsl(228 80% 13%)";
const STEEL = "hsl(219 42% 62%)";

function StatCard({
  label,
  value,
  hint,
  icon: Icon,
}: {
  label: string;
  value: string;
  hint: string;
  icon: LucideIcon;
}) {
  return (
    <div className="rounded-2xl border border-border bg-background p-5">
      <div className="mb-3 flex items-center justify-between">
        <span className="text-sm font-medium text-muted-foreground">{label}</span>
        <Icon size={16} className="text-muted-foreground" />
      </div>
      <p className="text-3xl font-semibold tracking-tight">{value}</p>
      <p className="mt-1 text-xs text-muted-foreground">{hint}</p>
    </div>
  );
}

export default function DemoPortalDashboard() {
  const { inquiries, orders } = useDemo();

  const ulaeste = inquiries.filter((i) => !i.laest && !i.papirkurv);
  const aktive = orders.filter((o) => o.status === "Afventer" || o.status === "Behandler");
  const fuldfoert = orders.filter((o) => o.status === "Fuldført");
  const omsaetning = fuldfoert.reduce((sum, o) => sum + o.beloeb, 0);
  const iPipeline = aktive.reduce((sum, o) => sum + o.beloeb, 0);

  const kraeverHandling = [
    ...ulaeste.map((i) => ({
      id: i.id,
      type: "henvendelse" as const,
      titel: i.navn,
      tekst: i.emne,
      link: `/demo/portal/indbakke?id=${i.id}`,
    })),
    ...orders
      .filter((o) => o.status === "Afventer")
      .map((o) => ({
        id: o.id,
        type: "ordre" as const,
        titel: o.kunde,
        tekst: o.beskrivelse,
        link: `/demo/portal/ordrer?id=${o.id}`,
      })),
  ];

  return (
    <div className="mx-auto max-w-6xl space-y-6">
      <header>
        <h1 className="text-2xl font-semibold tracking-tight md:text-3xl">Overblik</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          {new Date().toLocaleDateString("da-DK", { weekday: "long", day: "numeric", month: "long" })}
        </p>
      </header>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard
          label="Ulæste"
          value={String(ulaeste.length)}
          hint={ulaeste.length ? "Venter på svar" : "Alt er besvaret"}
          icon={Inbox}
        />
        <StatCard label="Aktive ordrer" value={String(aktive.length)} hint="Afventer eller i gang" icon={Package} />
        <StatCard
          label="I pipeline"
          value={`${iPipeline.toLocaleString("da-DK")} kr.`}
          hint="Ikke faktureret endnu"
          icon={TrendingUp}
        />
        <StatCard
          label="Fuldført"
          value={`${omsaetning.toLocaleString("da-DK")} kr.`}
          hint={`${fuldfoert.length} afsluttede ordrer`}
          icon={Wallet}
        />
      </div>

      <div className="grid gap-6 lg:grid-cols-5">
        {/* Graf */}
        <div className="rounded-2xl border border-border bg-background p-5 lg:col-span-3">
          <div className="mb-5 flex items-center justify-between">
            <div>
              <h2 className="font-semibold">Henvendelser pr. uge</h2>
              <p className="text-xs text-muted-foreground">De seneste seks uger</p>
            </div>
            <div className="flex items-center gap-4 text-xs">
              <span className="flex items-center gap-1.5">
                <span className="h-2 w-2 rounded-full" style={{ background: NAVY }} />
                Henvendelser
              </span>
              <span className="flex items-center gap-1.5">
                <span className="h-2 w-2 rounded-full" style={{ background: STEEL }} />
                Ordrer
              </span>
            </div>
          </div>

          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <ComposedChart data={inquiryTrend} margin={{ top: 4, right: 8, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="fillHenvendelser" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor={NAVY} stopOpacity={0.22} />
                    <stop offset="100%" stopColor={NAVY} stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(219 42% 88%)" vertical={false} />
                <XAxis dataKey="uge" tickLine={false} axisLine={false} fontSize={12} stroke="hsl(228 30% 45%)" />
                <YAxis tickLine={false} axisLine={false} fontSize={12} stroke="hsl(228 30% 45%)" width={40} />
                <Tooltip
                  contentStyle={{
                    borderRadius: 12,
                    border: "1px solid hsl(219 42% 81%)",
                    fontSize: 13,
                  }}
                />
                <Area
                  type="monotone"
                  dataKey="henvendelser"
                  name="Henvendelser"
                  stroke={NAVY}
                  strokeWidth={2}
                  fill="url(#fillHenvendelser)"
                />
                <Line
                  type="monotone"
                  dataKey="ordrer"
                  name="Ordrer"
                  stroke={STEEL}
                  strokeWidth={2}
                  dot={{ r: 3, fill: STEEL, strokeWidth: 0 }}
                />
              </ComposedChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Kræver handling */}
        <div className="rounded-2xl border border-border bg-background p-5 lg:col-span-2">
          <h2 className="mb-1 font-semibold">Kræver handling</h2>
          <p className="mb-4 text-xs text-muted-foreground">Ulæste henvendelser og ordrer, der afventer</p>

          {kraeverHandling.length === 0 ? (
            <p className="py-10 text-center text-sm text-muted-foreground">Ingenting venter. Godt gået.</p>
          ) : (
            <ul className="space-y-2">
              {kraeverHandling.slice(0, 6).map((item) => (
                <li key={`${item.type}-${item.id}`}>
                  <Link
                    to={item.link}
                    className="group flex items-start gap-3 rounded-xl border border-border p-3 transition-colors hover:bg-muted/60"
                  >
                    {item.type === "henvendelse" ? (
                      <Inbox size={15} className="mt-0.5 shrink-0 text-muted-foreground" />
                    ) : (
                      <Package size={15} className="mt-0.5 shrink-0 text-muted-foreground" />
                    )}
                    <div className="min-w-0 flex-1">
                      <p className="truncate text-sm font-medium">{item.titel}</p>
                      <p className="truncate text-xs text-muted-foreground">{item.tekst}</p>
                    </div>
                    <ArrowRight
                      size={14}
                      className="mt-1 shrink-0 text-muted-foreground transition-transform group-hover:translate-x-0.5"
                    />
                  </Link>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </div>
  );
}
