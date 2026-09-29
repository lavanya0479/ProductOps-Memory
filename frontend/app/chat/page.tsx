"use client";

import { FormEvent, Suspense, useState } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { chatWithAgent, correctMemory } from "@/lib/api";
import type { MemoryResult } from "@/lib/types";

export default function ChatPage() {
  return <Suspense fallback={<main className="min-h-screen bg-slate-950" />}><ChatForm /></Suspense>;
}

function ChatForm() {
  const searchParams = useSearchParams();
  const [product, setProduct] = useState(searchParams.get("product") ?? "");
  const [version, setVersion] = useState("");
  const [question, setQuestion] = useState(searchParams.get("issue") ?? "");
  const [loading, setLoading] = useState(false);
  const [asked, setAsked] = useState(false);
  const [answer, setAnswer] = useState("");
  const [memories, setMemories] = useState<MemoryResult[]>([]);
  const [error, setError] = useState("");

  // Correction state
  const [showCorrection, setShowCorrection] = useState(false);
  const [correction, setCorrection] = useState("");
  const [explanation, setExplanation] = useState("");
  const [correctionLoading, setCorrectionLoading] = useState(false);
  const [correctionSubmitted, setCorrectionSubmitted] = useState(false);
  const [correctionError, setCorrectionError] = useState("");

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (!product.trim() || !question.trim()) {
      return;
    }

    setLoading(true);
    setAsked(false);
    setError("");
    try {
      const result = await chatWithAgent({
        message: question,
        product: product.trim(),
        version: version.trim() || undefined,
      });
      setAnswer(result.answer);
      setMemories(result.memories);
      setAsked(true);
    } catch (requestError) {
      setError(requestError instanceof Error ? requestError.message : "Could not reach the backend");
    } finally {
      setLoading(false);
    }
  }

  function handleOpenCorrection() {
    setShowCorrection(true);
    setCorrectionSubmitted(false);
  }

  function handleCancelCorrection() {
    setShowCorrection(false);
  }

  async function handleSubmitCorrection() {
    if (!correction.trim() || memories.length === 0) {
      return;
    }

    setCorrectionLoading(true);
    setCorrectionError("");
    try {
      await correctMemory({
        original_context: memories[0].text,
        correction: [correction.trim(), explanation.trim()].filter(Boolean).join("\n\nAdditional explanation: "),
        product: product.trim(),
        version: version.trim() || undefined,
      });
      setCorrectionSubmitted(true);
    } catch (requestError) {
      setCorrectionError(requestError instanceof Error ? requestError.message : "Could not save the correction");
    } finally {
      setCorrectionLoading(false);
    }
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

            <div>
              <label htmlFor="version" className="mb-2 block text-sm font-medium">Product version (optional)</label>
              <input
                id="version"
                type="text"
                value={version}
                onChange={(event) => setVersion(event.target.value)}
                placeholder="e.g. 5.0"
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

        {error && (
          <div role="alert" className="mt-8 rounded-xl border border-red-900 bg-red-950/40 px-5 py-4 text-sm text-red-200">
            {error}
          </div>
        )}

        {/* Backend response */}
        {asked && !loading && (
          <div className="mt-8 space-y-6">
            {/* Agent Answer */}
            <section className="rounded-2xl border border-slate-800 bg-slate-900 p-6">
              <div className="mb-4 flex items-center justify-between gap-4">
                <h2 className="text-xl font-semibold">
                  Agent Answer
                </h2>

                <span className="whitespace-nowrap rounded-full border border-slate-700 px-3 py-1 text-xs text-slate-300">
                  {memories.length ? "Memory found" : "No memory found"}
                </span>
              </div>

              <p className="leading-7 text-slate-300">{answer}</p>
            </section>

            {/* Organizational Memory */}
            {memories.length > 0 && <section>
              <div className="mb-4">
                <h2 className="text-xl font-semibold">
                  Organizational Memory
                </h2>

                <p className="mt-1 text-sm text-slate-400">
                  Relevant experience recalled from the team.
                </p>
              </div>

              {memories.map((memory, index) => <article key={`${memory.rank}-${index}`} className="mb-4 rounded-2xl border border-slate-800 bg-slate-900 p-6">
                <div className="mb-5 flex items-start justify-between gap-4">
                  <h3 className="text-lg font-semibold">Memory {memory.rank ?? index + 1}</h3>
                  <span className="whitespace-nowrap rounded-full border border-slate-700 px-3 py-1 text-xs text-slate-300">{memory.source}</span>
                </div>
                <p className="whitespace-pre-wrap leading-7 text-slate-300">{memory.text}</p>

                {index === 0 && !correctionSubmitted && (
                  <button
                    type="button"
                    onClick={handleOpenCorrection}
                    className="mt-6 rounded-lg border border-slate-700 px-4 py-2 text-sm font-medium transition hover:bg-slate-800"
                  >
                    Correct this knowledge
                  </button>
                )}
              </article>)}
            </section>
            }

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
                      value={product}
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
                      value={version}
                      onChange={(event) => setVersion(event.target.value)}
                      placeholder="Enter the version this correction applies to"
                      className="w-full rounded-lg border border-slate-700 bg-slate-950 px-4 py-3 text-slate-400"
                    />
                  </div>

                  {/* Previous knowledge */}
                  <div>
                    <label className="mb-2 block text-sm font-medium">
                      Previous knowledge
                    </label>

                    <div className="rounded-lg border border-slate-700 bg-slate-950 p-4 text-sm leading-6 text-slate-400">
                      {memories[0]?.text}
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
                  {correctionError && <p role="alert" className="text-sm text-red-300">{correctionError}</p>}
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
