"use client";

import { FormEvent, useState } from "react";
import Link from "next/link";

type Memory = {
  product: string;
  version?: string;
  issue: string;
  experience: string;
  source: string;
};

export default function ChatPage() {
  const [product, setProduct] = useState("");
  const [question, setQuestion] = useState("");
  const [loading, setLoading] = useState(false);
  const [asked, setAsked] = useState(false);

  // Correction state
  const [showCorrection, setShowCorrection] = useState(false);
  const [correction, setCorrection] = useState("");
  const [explanation, setExplanation] = useState("");
  const [correctionLoading, setCorrectionLoading] = useState(false);
  const [correctionSubmitted, setCorrectionSubmitted] = useState(false);

  // Temporary mock memory
  const mockMemory: Memory = {
    product: "Product X",
    version: "4.2",
    issue: "E401 Authentication Error",
    experience:
      "Restarting did not resolve previous cases. Updating authentication mapping resolved the issue for customers using legacy authentication.",
    source: "Team Experience",
  };

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (!product.trim() || !question.trim()) {
      return;
    }

    setLoading(true);
    setAsked(false);

    // Temporary mock request.
    // This will later be replaced by the real backend API.
    setTimeout(() => {
      setLoading(false);
      setAsked(true);
    }, 1000);
  }

  function handleOpenCorrection() {
    setShowCorrection(true);
    setCorrectionSubmitted(false);
  }

  function handleCancelCorrection() {
    setShowCorrection(false);
  }

  function handleSubmitCorrection() {
    if (!correction.trim()) {
      return;
    }

    setCorrectionLoading(true);

    // Temporary mock correction request.
    // This will later use POST /api/memory/correct.
    setTimeout(() => {
      setCorrectionLoading(false);
      setCorrectionSubmitted(true);
    }, 1000);
  }

  function handleEditCorrection() {
    setCorrectionSubmitted(false);
    setShowCorrection(true);
  }

  return (
    <main className="min-h-screen bg-slate-950 text-white">
      {/* Header */}
      <header className="border-b border-slate-800">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-5">
          <Link href="/" className="text-xl font-semibold">
            ProductOps Memory
          </Link>

          <nav className="flex gap-6 text-sm text-slate-300">
            <Link href="/chat" className="text-white">
              Ask Agent
            </Link>

            <Link href="/teach" className="transition hover:text-white">
              Teach Memory
            </Link>

            <Link href="/memories" className="transition hover:text-white">
              Memories
            </Link>
          </nav>
        </div>
      </header>

      <div className="mx-auto max-w-5xl px-6 py-12">
        {/* Page heading */}
        <div className="mb-10">
          <p className="mb-3 text-sm font-medium text-slate-400">
            PRODUCTOPS MEMORY
          </p>

          <h1 className="text-4xl font-bold tracking-tight">
            Ask the Agent
          </h1>

          <p className="mt-3 max-w-2xl text-slate-400">
            Ask a product question and see what your team has learned from
            previous experiences.
          </p>
        </div>

        {/* Question form */}
        <section className="rounded-2xl border border-slate-800 bg-slate-900 p-6">
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Product */}
            <div>
              <label
                htmlFor="product"
                className="mb-2 block text-sm font-medium"
              >
                Product
              </label>

              <input
                id="product"
                type="text"
                value={product}
                onChange={(event) => setProduct(event.target.value)}
                placeholder="e.g. Product X"
                className="w-full rounded-lg border border-slate-700 bg-slate-950 px-4 py-3 text-white outline-none transition focus:border-slate-400"
              />
            </div>

            {/* Question */}
            <div>
              <label
                htmlFor="question"
                className="mb-2 block text-sm font-medium"
              >
                Your question
              </label>

              <textarea
                id="question"
                value={question}
                onChange={(event) => setQuestion(event.target.value)}
                placeholder="I'm getting an E401 authentication error. What should I check?"
                rows={5}
                className="w-full resize-none rounded-lg border border-slate-700 bg-slate-950 px-4 py-3 text-white outline-none transition focus:border-slate-400"
              />
            </div>

            {/* Ask button */}
            <button
              type="submit"
              disabled={
                loading || !product.trim() || !question.trim()
              }
              className="rounded-lg bg-white px-6 py-3 font-semibold text-slate-950 transition hover:bg-slate-200 disabled:cursor-not-allowed disabled:opacity-50"
            >
              {loading
                ? "Searching organizational memory..."
                : "Ask ProductOps Memory"}
            </button>
          </form>
        </section>

        {/* Loading message */}
        {loading && (
          <div className="mt-8 rounded-2xl border border-slate-800 bg-slate-900 p-6">
            <p className="text-slate-300">
              Searching organizational memory...
            </p>
          </div>
        )}

        {/* Mock response */}
        {asked && !loading && (
          <div className="mt-8 space-y-6">
            {/* Agent Answer */}
            <section className="rounded-2xl border border-slate-800 bg-slate-900 p-6">
              <div className="mb-4 flex items-center justify-between gap-4">
                <h2 className="text-xl font-semibold">
                  Agent Answer
                </h2>

                <span className="whitespace-nowrap rounded-full border border-slate-700 px-3 py-1 text-xs text-slate-300">
                  Memory found
                </span>
              </div>

              <p className="leading-7 text-slate-300">
                For Product X, check whether the affected customer is using
                legacy authentication. Previous team experience shows that
                restarting the service did not resolve this E401 issue.
                Updating the authentication mapping resolved previous cases.
              </p>
            </section>

            {/* Organizational Memory */}
            <section>
              <div className="mb-4">
                <h2 className="text-xl font-semibold">
                  Organizational Memory
                </h2>

                <p className="mt-1 text-sm text-slate-400">
                  Relevant experience recalled from the team.
                </p>
              </div>

              {/* Memory Card */}
              <article className="rounded-2xl border border-slate-800 bg-slate-900 p-6">
                <div className="mb-5 flex items-start justify-between gap-4">
                  <div>
                    <h3 className="text-lg font-semibold">
                      {mockMemory.issue}
                    </h3>

                    <p className="mt-1 text-sm text-slate-400">
                      {mockMemory.product}
                      {mockMemory.version &&
                        ` • Version ${mockMemory.version}`}
                    </p>
                  </div>

                  <span className="whitespace-nowrap rounded-full border border-slate-700 px-3 py-1 text-xs text-slate-300">
                    {mockMemory.source}
                  </span>
                </div>

                <p className="leading-7 text-slate-300">
                  {mockMemory.experience}
                </p>

                {!correctionSubmitted && (
                  <button
                    type="button"
                    onClick={handleOpenCorrection}
                    className="mt-6 rounded-lg border border-slate-700 px-4 py-2 text-sm font-medium transition hover:bg-slate-800"
                  >
                    Correct this knowledge
                  </button>
                )}
              </article>
            </section>

            {/* Correction Form */}
            {showCorrection && !correctionSubmitted && (
              <section className="rounded-2xl border border-slate-800 bg-slate-900 p-6">
                <div className="mb-6">
                  <h2 className="text-xl font-semibold">
                    Correct Organizational Knowledge
                  </h2>

                  <p className="mt-2 text-sm text-slate-400">
                    Help your team keep this knowledge accurate and up to
                    date.
                  </p>
                </div>

                <div className="space-y-6">
                  {/* Product */}
                  <div>
                    <label className="mb-2 block text-sm font-medium">
                      Product
                    </label>

                    <input
                      type="text"
                      value={mockMemory.product}
                      readOnly
                      className="w-full rounded-lg border border-slate-700 bg-slate-950 px-4 py-3 text-slate-400"
                    />
                  </div>

                  {/* Version */}
                  <div>
                    <label className="mb-2 block text-sm font-medium">
                      Version
                    </label>

                    <input
                      type="text"
                      value="5"
                      readOnly
                      className="w-full rounded-lg border border-slate-700 bg-slate-950 px-4 py-3 text-slate-400"
                    />
                  </div>

                  {/* Previous knowledge */}
                  <div>
                    <label className="mb-2 block text-sm font-medium">
                      Previous knowledge
                    </label>

                    <div className="rounded-lg border border-slate-700 bg-slate-950 p-4 text-sm leading-6 text-slate-400">
                      {mockMemory.experience}
                    </div>
                  </div>

                  {/* Correction */}
                  <div>
                    <label
                      htmlFor="correction"
                      className="mb-2 block text-sm font-medium"
                    >
                      Correction
                    </label>

                    <textarea
                      id="correction"
                      value={correction}
                      onChange={(event) =>
                        setCorrection(event.target.value)
                      }
                      placeholder="The previous workaround is outdated after Product X v5. The current solution is OAuth configuration."
                      rows={4}
                      className="w-full resize-none rounded-lg border border-slate-700 bg-slate-950 px-4 py-3 text-white outline-none transition focus:border-slate-400"
                    />
                  </div>

                  {/* Additional explanation */}
                  <div>
                    <label
                      htmlFor="explanation"
                      className="mb-2 block text-sm font-medium"
                    >
                      Additional explanation
                    </label>

                    <textarea
                      id="explanation"
                      value={explanation}
                      onChange={(event) =>
                        setExplanation(event.target.value)
                      }
                      placeholder="Explain what changed or why the previous knowledge is no longer valid."
                      rows={3}
                      className="w-full resize-none rounded-lg border border-slate-700 bg-slate-950 px-4 py-3 text-white outline-none transition focus:border-slate-400"
                    />
                  </div>

                  {/* Buttons */}
                  <div className="flex flex-wrap gap-3">
                    <button
                      type="button"
                      onClick={handleCancelCorrection}
                      disabled={correctionLoading}
                      className="rounded-lg border border-slate-700 px-5 py-3 text-sm font-medium transition hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-50"
                    >
                      Cancel
                    </button>

                    <button
                      type="button"
                      disabled={
                        correctionLoading || !correction.trim()
                      }
                      onClick={handleSubmitCorrection}
                      className="rounded-lg bg-white px-5 py-3 text-sm font-semibold text-slate-950 transition hover:bg-slate-200 disabled:cursor-not-allowed disabled:opacity-50"
                    >
                      {correctionLoading
                        ? "Updating organizational memory..."
                        : "Submit Correction"}
                    </button>
                  </div>
                </div>
              </section>
            )}

            {/* Correction Success */}
            {correctionSubmitted && (
              <section className="rounded-2xl border border-slate-700 bg-slate-900 p-6">
                <div className="flex flex-col gap-5">
                  <div>
                    <div className="mb-2 flex items-center gap-3">
                      <div className="flex h-8 w-8 items-center justify-center rounded-full bg-white text-sm font-bold text-slate-950">
                        ✓
                      </div>

                      <h2 className="text-xl font-semibold">
                        Correction Submitted
                      </h2>
                    </div>

                    <p className="text-slate-400">
                      Correction submitted to organizational memory.
                    </p>
                  </div>

                  {/* Show submitted correction */}
                  <div className="rounded-lg border border-slate-700 bg-slate-950 p-4">
                    <p className="mb-2 text-xs font-medium uppercase tracking-wide text-slate-500">
                      Updated knowledge
                    </p>

                    <p className="leading-7 text-slate-300">
                      {correction}
                    </p>

                    {explanation.trim() && (
                      <p className="mt-3 border-t border-slate-800 pt-3 text-sm leading-6 text-slate-400">
                        {explanation}
                      </p>
                    )}
                  </div>

                  <div>
                    <button
                      type="button"
                      onClick={handleEditCorrection}
                      className="rounded-lg border border-slate-700 px-5 py-3 text-sm font-medium transition hover:bg-slate-800"
                    >
                      Edit Correction
                    </button>
                  </div>
                </div>
              </section>
            )}
          </div>
        )}
      </div>
    </main>
  );
}