"use client";

import { FormEvent, useState } from "react";
import Link from "next/link";
import { recallMemory } from "@/lib/api";
import type { MemoryResult } from "@/lib/types";

export default function MemoriesPage() {
  const [query, setQuery] = useState("");
  const [product, setProduct] = useState("");
  const [memories, setMemories] = useState<MemoryResult[]>([]);
  const [loading, setLoading] = useState(false);
  const [searched, setSearched] = useState(false);
  const [error, setError] = useState("");

  async function handleSearch(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!query.trim()) return;
    setLoading(true);
    setError("");
    try {
      const result = await recallMemory({
        query: query.trim(),
        product: product.trim() || undefined,
        limit: 20,
      });
      setMemories(result.memories);
      setSearched(true);
    } catch (requestError) {
      setError(requestError instanceof Error ? requestError.message : "Could not search memories");
      setMemories([]);
      setSearched(true);
    } finally {
      setLoading(false);
    }
  }

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

        <form onSubmit={handleSearch} className="mt-10 grid gap-4 rounded-2xl border border-slate-800 bg-[#111827] p-6 md:grid-cols-[1fr_16rem_auto] md:items-end">
          <div>
            <label htmlFor="memory-query" className="mb-2 block text-sm font-medium">Search team knowledge</label>
            <input id="memory-query" value={query} onChange={(event) => setQuery(event.target.value)} required placeholder="Describe an issue, solution, or product experience" className="w-full rounded-lg border border-slate-700 bg-slate-950 px-4 py-3 text-white outline-none focus:border-slate-400" />
          </div>
          <div>
            <label htmlFor="memory-product" className="mb-2 block text-sm font-medium">Product (optional)</label>
            <input id="memory-product" value={product} onChange={(event) => setProduct(event.target.value)} placeholder="Product X" className="w-full rounded-lg border border-slate-700 bg-slate-950 px-4 py-3 text-white outline-none focus:border-slate-400" />
          </div>
          <button type="submit" disabled={loading || !query.trim()} className="rounded-lg bg-white px-6 py-3 font-semibold text-slate-950 disabled:cursor-not-allowed disabled:opacity-50">{loading ? "Searching..." : "Search"}</button>
        </form>
        <p className="mt-3 text-sm text-slate-500">Results are relevant memories returned by search; this API does not provide a complete memory listing.</p>

        {/* Memory count */}
        <div className="mt-10 grid gap-4 sm:grid-cols-3">
          <SummaryCard
            value={memories.length.toString()}
            label="Matching Memories"
          />

          <SummaryCard
            value={
              memories.filter((memory) => memory.source.toLowerCase().includes("team")).length.toString()
            }
            label="Team Experiences"
          />

          <SummaryCard
            value={
              memories.filter((memory) => memory.text.toLowerCase().includes("corrected knowledge")).length.toString()
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

          {loading && <p role="status" className="text-slate-400">Searching organizational memory...</p>}
          {error && <p role="alert" className="rounded-xl border border-red-900 bg-red-950/40 px-5 py-4 text-sm text-red-200">{error}</p>}
          {!loading && !error && searched && memories.length === 0 && <p className="text-slate-400">No relevant memories were found for that search.</p>}
          {!searched && !loading && <p className="text-slate-400">Search for a product issue or experience to find relevant memories.</p>}
          <div className="space-y-6">
            {memories.map((memory, index) => (
              <MemoryCard
                key={`${memory.rank}-${index}`}
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
  memory: MemoryResult;
}) {
  const sourceInfo = getSourceInfo(memory.source);

  return (
    <article className="rounded-3xl border border-slate-800 bg-[#111827] p-7 transition hover:border-slate-600">
      {/* Top */}
      <div className="flex flex-col gap-5 md:flex-row md:items-start md:justify-between">
        <div>
          <div className="flex flex-wrap items-center gap-3">
            <h3 className="text-2xl font-semibold">
              Memory {memory.rank ?? ""}
            </h3>

            <span
              className={`rounded-full border px-3 py-1 text-xs font-medium ${sourceInfo.badgeClass}`}
            >
              {sourceInfo.label}
            </span>
          </div>

          <p className="mt-2 text-slate-400">
            Retrieved organizational knowledge
          </p>
        </div>

        <span className="rounded-full border border-slate-700 px-3 py-1 text-xs text-slate-400">
          {memory.source}
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
          {memory.text}
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
      </div>

      {/* Actions */}
      <div className="mt-7 flex flex-wrap gap-3">
        <Link
          href={`/chat?issue=${encodeURIComponent(memory.text)}`}
          className="rounded-xl border border-slate-700 px-5 py-2.5 text-sm font-medium text-white transition hover:bg-slate-800"
        >
          Ask About This
        </Link>

        {memory.source.toLowerCase().includes("team") && (
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

function getSourceInfo(source: string) {
  const normalized = source.toLowerCase();
  const label = normalized.includes("corrected") ? "Updated Knowledge" : normalized.includes("team") ? "Team Experience" : "Historical Memory";
  return { label, badgeClass: "border-slate-600 text-slate-200" };
}
