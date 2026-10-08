import { sql } from "drizzle-orm";
import {
  Activity,
  ArrowRight,
  Cloud,
  Cpu,
  Database,
  HardDrive,
  Server,
  Shield,
} from "lucide-react";
import Link from "next/link";
import {
  BodyText,
  PageHeading,
  SectionHeading,
} from "@/components/ui/typography";
import { db } from "@/db";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export default async function ArchitecturePage() {
  const start = performance.now();

  let dbStatus = "Offline";
  let dbLatency = 0;
  let dbVersion = "Unknown";
  let userCount = 0;

  try {
    const res = await db.execute(sql`SELECT version();`);
    dbVersion = (res[0] as any).version;
    const countRes = await db.execute(sql`SELECT count(*) from users;`);
    userCount = parseInt((countRes[0] as any).count, 10);
    dbStatus = "Online";
  } catch (e) {
    console.error(e);
  }

  const end = performance.now();
  dbLatency = Math.round(end - start);

  const isS3Configured =
    !!process.env.AWS_REGION && !!process.env.AWS_S3_BUCKET_NAME;

  return (
    <div className="min-h-screen bg-background flex flex-col selection:bg-primary/20 selection:text-primary">
      <header className="border-b border-border bg-card">
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2">
            <Activity className="w-5 h-5 text-primary" />
            <span className="font-bold text-foreground">
              Legalnorms consultations
            </span>
          </Link>
          <Link
            href="/"
            className="text-sm font-medium text-muted-foreground hover:text-foreground flex items-center gap-2"
          >
            Back to Home <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </header>

      <main className="flex-1 max-w-7xl mx-auto w-full px-6 py-12">
        <div className="mb-12">
          <PageHeading className="mb-4">Live Platform Architecture</PageHeading>
          <BodyText className="max-w-3xl">
            This operational dashboard visualizes the live end-to-end
            architecture of the Legalnorms consultations platform. Metrics are
            generated in real-time from the production environment, tracking the
            flow of requests from the Edge down to persistent storage.
          </BodyText>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Edge & Frontend */}
          <div className="col-span-1 flex flex-col gap-4">
            <NodeCard
              title="Next.js Client & Edge"
              icon={<Server className="w-6 h-6 text-orange-500" />}
              status="Online"
              metrics={[
                { label: "Environment", value: process.env.NODE_ENV },
                { label: "Framework", value: "Next.js 15 (App Router)" },
                { label: "Rendering", value: "React Server Components" },
              ]}
            />

            <div className="flex justify-center my-2">
              <div className="w-1 h-12 bg-border relative">
                <div className="absolute top-0 left-1/2 -translate-x-1/2 w-3 h-3 bg-orange-500 rounded-full animate-ping" />
              </div>
            </div>

            <NodeCard
              title="Authentication Layer"
              icon={<Shield className="w-6 h-6 text-purple-500" />}
              status="Active"
              metrics={[
                { label: "Provider", value: "Custom Auth (jose)" },
                { label: "Session Type", value: "HTTP-Only Cookies" },
                { label: "Total Users", value: userCount.toString() },
              ]}
            />
          </div>

          {/* Database Layer */}
          <div className="col-span-1 flex flex-col gap-4 lg:mt-24">
            <div className="hidden lg:flex justify-center items-center h-full absolute -ml-16 mt-20">
              <div className="w-16 h-1 bg-border relative">
                <div className="absolute left-0 top-1/2 -translate-y-1/2 w-3 h-3 bg-purple-500 rounded-full animate-ping" />
              </div>
            </div>

            <NodeCard
              title="Relational Database"
              icon={<Database className="w-6 h-6 text-green-500" />}
              status={dbStatus}
              metrics={[
                { label: "Engine", value: "PostgreSQL" },
                { label: "ORM", value: "Drizzle ORM" },
                { label: "Latency", value: `${dbLatency}ms` },
                {
                  label: "Version",
                  value: dbVersion.split(" ")[1] || "PostgreSQL",
                },
              ]}
              isActive={dbStatus === "Online"}
            />
          </div>

          {/* Cloud Storage */}
          <div className="col-span-1 flex flex-col gap-4">
            <div className="hidden lg:flex justify-center items-center h-full absolute -ml-16 mt-20">
              <div className="w-16 h-1 bg-border relative">
                <div className="absolute right-0 top-1/2 -translate-y-1/2 w-3 h-3 bg-green-500 rounded-full animate-ping" />
              </div>
            </div>

            <NodeCard
              title="Object Storage"
              icon={<Cloud className="w-6 h-6 text-orange-500" />}
              status={isS3Configured ? "Connected" : "Not Configured"}
              metrics={[
                { label: "Provider", value: "AWS S3" },
                { label: "Region", value: process.env.AWS_REGION || "N/A" },
                {
                  label: "Bucket",
                  value: process.env.AWS_S3_BUCKET_NAME || "N/A",
                },
              ]}
              isActive={isS3Configured}
            />
          </div>
        </div>

        <div className="mt-20 border border-border bg-card rounded-xl p-8 shadow-sm">
          <SectionHeading className="mb-6 flex items-center gap-3">
            <Cpu className="w-6 h-6 text-primary" /> Server Operational Metrics
          </SectionHeading>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            <MetricItem
              label="Memory Usage"
              value={`${Math.round(process.memoryUsage().rss / 1024 / 1024)} MB`}
            />
            <MetricItem
              label="Heap Total"
              value={`${Math.round(process.memoryUsage().heapTotal / 1024 / 1024)} MB`}
            />
            <MetricItem
              label="Uptime"
              value={`${Math.round(process.uptime())}s`}
            />
            <MetricItem label="Node Version" value={process.version} />
          </div>
        </div>
      </main>
    </div>
  );
}

function NodeCard({
  title,
  icon,
  status,
  metrics,
  isActive = true,
}: {
  title: string;
  icon: React.ReactNode;
  status: string;
  metrics: { label: string; value: string | undefined }[];
  isActive?: boolean;
}) {
  return (
    <div
      className={`p-6 bg-card border ${isActive ? "border-border shadow-sm" : "border-destructive/30 bg-destructive/5"} rounded-xl transition-all`}
    >
      <div className="flex justify-between items-start mb-6">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-secondary rounded-lg">{icon}</div>
          <h3 className="font-bold text-foreground text-lg">{title}</h3>
        </div>
        <span
          className={`text-xs font-bold px-2.5 py-1 rounded-full ${isActive ? "bg-green-500/10 text-green-500" : "bg-destructive/10 text-destructive"}`}
        >
          {status}
        </span>
      </div>

      <div className="space-y-3">
        {metrics.map((m, i) => (
          <div key={i} className="flex justify-between text-sm">
            <span className="text-muted-foreground">{m.label}</span>
            <span className="font-semibold text-foreground truncate max-w-[60%]">
              {m.value || "N/A"}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}

function MetricItem({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex flex-col gap-1">
      <span className="text-sm font-medium text-muted-foreground">{label}</span>
      <span className="text-xl font-bold text-foreground">{value}</span>
    </div>
  );
}
