"use client";

import Link from "next/link";

type MemoryType =
  | "team_experience"
  | "historical"
  | "updated_knowledge";

type Memory = {
  id: number;
  product: string;
  version: string;
  issue: string;
  experience: string;
  source: MemoryType;
  date: string;
  status: "Current" | "Historical" | "Updated";
};

const mockMemories: Memory[] = [
  {
    id: 1,
    product: "Product X",
    version: "4.2",
    issue: "E401 Authentication Error",
    experience:
      "Restarting did not resolve previous cases. Updating the authentication mapping resolved the issue for customers using legacy authentication.",
    source: "team_experience",
    date: "Sep 28, 2026",
    status: "Historical",
  },
  {
    id: 2,
    product: "Product X",
    version: "5.0",
    issue: "E401 Authentication Error",
    experience:
      "The previous authentication mapping workaround is outdated. The current solution is OAuth configuration.",
    source: "updated_knowledge",
    date: "Sep 29, 2026",
    status: "Updated",
  },
  {
    id: 3,
    product: "Product X",
    version: "4.2",
    issue: "Webhook Failure",
    experience:
      "Previous webhook failures were resolved by checking the customer's webhook endpoint configuration and retry settings.",
    source: "team_experience",
    date: "Sep 27, 2026",
    status: "Current",
  },
  {
    id: 4,
    product: "Product X",
    version: "4.0",
    issue: "Duplicate Event",
    experience:
      "Duplicate events were previously caused by retry behavior when acknowledgement was delayed.",
    source: "historical",
    date: "Sep 24, 2026",
    status: "Historical",
  },
];

export default function MemoriesPage() {
  return (
    <main className="min-h-screen bg-[#020617] text-white">
      {/* Header */}
      <header className="border-b border-slate-800">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-5">
          <Link
            href="/"
            className="text-xl font-semibold tracking-tight"
          >
            ProductOps Memory
          </Link>

          <nav className="flex items-center gap-8 text-sm text-slate-300">
            <Link
              href="/chat"
              className="transition hover:text-white"
            >
              Ask Agent
            </Link>

            <Link
              href="/teach"
              className="transition hover:text-white"
            >
              Teach Memory
            </Link>

            <Link
              href="/memories"
              className="text-white"
            >
              Memories
            </Link>
          </nav>
        </div>
      </header>

      {/* Page Header */}
      <section className="mx-auto max-w-7xl px-6 py-12">
        <p className="mb-4 text-sm uppercase tracking-widest text-slate-400">
          Organizational Memory
        </p>

        <div className="flex flex-col justify-between gap-6 md:flex-row md:items-end">
          <div>
            <h1 className="text-5xl font-semibold tracking-tight">
              Team Memories
            </h1>

            <p className="mt-4 max-w-2xl text-xl leading-8 text-slate-400">
              Knowledge your team has learned through real product
              experiences, including solutions, failures, and updates.
            </p>
          </div>

          <Link
            href="/teach"
            className="rounded-xl bg-white px-6 py-3 text-center font-semibold text-slate-950 transition hover:bg-slate-200"
          >
            Teach New Memory
          </Link>
        </div>

        {/* Memory count */}
        <div className="mt-10 grid gap-4 sm:grid-cols-3">
          <SummaryCard
            value={mockMemories.length.toString()}
            label="Memories"
          />

          <SummaryCard
            value={
              mockMemories.filter(
                (memory) => memory.source === "team_experience"
              ).length.toString()
            }
            label="Team Experiences"
          />

          <SummaryCard
            value={
              mockMemories.filter(
                (memory) => memory.source === "updated_knowledge"
              ).length.toString()
            }
            label="Updated Knowledge"
          />
        </div>

        {/* Memory List */}
        <section className="mt-12">
          <div className="mb-6">
            <h2 className="text-2xl font-semibold">
              Organizational Knowledge
            </h2>

            <p className="mt-2 text-slate-400">
              Memories returned by ProductOps Memory.
            </p>
          </div>

          <div className="space-y-6">
            {mockMemories.map((memory) => (
              <MemoryCard
                key={memory.id}
                memory={memory}
              />
            ))}
          </div>
        </section>
      </section>
    </main>
  );
}

/* -----------------------------
   Summary Card
------------------------------ */

function SummaryCard({
  value,
  label,
}: {
  value: string;
  label: string;
}) {
  return (
    <div className="rounded-2xl border border-slate-800 bg-[#111827] p-6">
      <p className="text-3xl font-semibold">{value}</p>

      <p className="mt-2 text-sm text-slate-400">
        {label}
      </p>
    </div>
  );
}

/* -----------------------------
   Memory Card
------------------------------ */

function MemoryCard({
  memory,
}: {
  memory: Memory;
}) {
  const sourceInfo = getSourceInfo(memory.source);

  return (
    <article className="rounded-3xl border border-slate-800 bg-[#111827] p-7 transition hover:border-slate-600">
      {/* Top */}
      <div className="flex flex-col gap-5 md:flex-row md:items-start md:justify-between">
        <div>
          <div className="flex flex-wrap items-center gap-3">
            <h3 className="text-2xl font-semibold">
              {memory.issue}
            </h3>

            <span
              className={`rounded-full border px-3 py-1 text-xs font-medium ${sourceInfo.badgeClass}`}
            >
              {sourceInfo.label}
            </span>
          </div>

          <p className="mt-2 text-slate-400">
            {memory.product}
            {" • "}
            Version {memory.version}
          </p>
        </div>

        <span className="rounded-full border border-slate-700 px-3 py-1 text-xs text-slate-400">
          {memory.status}
        </span>
      </div>

      {/* Divider */}
      <div className="my-6 border-t border-slate-800" />

      {/* Experience */}
      <div>
        <p className="text-sm font-medium uppercase tracking-wider text-slate-500">
          Experience
        </p>

        <p className="mt-3 max-w-5xl text-lg leading-8 text-slate-200">
          {memory.experience}
        </p>
      </div>

      {/* Metadata */}
      <div className="mt-7 grid gap-5 border-t border-slate-800 pt-6 sm:grid-cols-2">
        <div>
          <p className="text-xs uppercase tracking-wider text-slate-500">
            Source
          </p>

          <p className="mt-1 text-sm text-slate-300">
            {sourceInfo.label}
          </p>
        </div>

        <div>
          <p className="text-xs uppercase tracking-wider text-slate-500">
            Date
          </p>

          <p className="mt-1 text-sm text-slate-300">
            {memory.date}
          </p>
        </div>
      </div>

      {/* Actions */}
      <div className="mt-7 flex flex-wrap gap-3">
        <Link
          href={`/chat?product=${encodeURIComponent(
            memory.product
          )}&issue=${encodeURIComponent(memory.issue)}`}
          className="rounded-xl border border-slate-700 px-5 py-2.5 text-sm font-medium text-white transition hover:bg-slate-800"
        >
          Ask About This
        </Link>

        {memory.source === "team_experience" && (
          <Link
            href="/teach"
            className="rounded-xl border border-slate-700 px-5 py-2.5 text-sm font-medium text-slate-300 transition hover:bg-slate-800 hover:text-white"
          >
            Add Knowledge
          </Link>
        )}
      </div>
    </article>
  );
}

/* -----------------------------
   Source Labels
------------------------------ */

function getSourceInfo(source: MemoryType) {
  switch (source) {
    case "team_experience":
      return {
        label: "Team Experience",
        badgeClass:
          "border-slate-600 text-slate-200",
      };

    case "historical":
      return {
        label: "Historical Memory",
        badgeClass:
          "border-slate-700 text-slate-400",
      };

    case "updated_knowledge":
      return {
        label: "Updated Knowledge",
        badgeClass:
          "border-white/30 text-white",
      };
  }
}