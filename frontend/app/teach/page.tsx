"use client";

import { FormEvent, useState } from "react";
import Link from "next/link";
import { teachMemory } from "@/lib/api";
import type { MemorySource } from "@/lib/types";

type MemoryForm = {
  product: string;
  version: string;
  issue: string;
  happened: string;
  tried: string;
  worked: string;
  failed: string;
  context: string;
  source: MemorySource;
};

const initialForm: MemoryForm = {
  product: "",
  version: "",
  issue: "",
  happened: "",
  tried: "",
  worked: "",
  failed: "",
  context: "",
  source: "team_experience",
};

export default function TeachPage() {
  const [form, setForm] = useState<MemoryForm>(initialForm);
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  function handleChange(
    field: keyof MemoryForm,
    value: string
  ) {
    setForm((previous) => ({
      ...previous,
      [field]: value,
    }));
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    setError("");

    if (
      !form.product.trim() ||
      !form.issue.trim() ||
      !form.happened.trim() ||
      !form.worked.trim()
    ) {
      setError(
        "Please complete Product, Issue, What happened?, and What worked?"
      );
      return;
    }

    setLoading(true);

    try {
      const experience = [
        `What happened: ${form.happened.trim()}`,
        form.tried.trim() && `What was tried: ${form.tried.trim()}`,
        `What worked: ${form.worked.trim()}`,
        form.failed.trim() && `What failed: ${form.failed.trim()}`,
      ].filter(Boolean).join("\n");
      const context = form.context.trim() || undefined;
      await teachMemory({
        product: form.product.trim(),
        version: form.version.trim() || undefined,
        issue: form.issue.trim(),
        experience,
        source: form.source,
        context,
      });
      setSubmitted(true);
    } catch (requestError) {
      setError(requestError instanceof Error ? requestError.message : "Could not save this memory");
    } finally {
      setLoading(false);
    }
  }

  function teachAnotherMemory() {
    setForm(initialForm);
    setSubmitted(false);
    setError("");
  }

  if (submitted) {
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
                className="text-white"
              >
                Teach Memory
              </Link>

              <Link
                href="/memories"
                className="transition hover:text-white"
              >
                Memories
              </Link>
            </nav>
          </div>
        </header>

        {/* Content */}
        <section className="mx-auto max-w-7xl px-6 py-12">
          <p className="mb-4 text-sm uppercase tracking-widest text-slate-400">
            ProductOps Memory
          </p>

          <h1 className="text-5xl font-semibold tracking-tight">
            Teach Memory
          </h1>

          <p className="mt-4 text-xl text-slate-400">
            Teach the agent something your team learned from a real
            product experience.
          </p>

          {/* Success Card */}
          <div className="mt-14 rounded-3xl border border-slate-700 bg-[#111827] p-10 shadow-2xl">
            <div className="flex items-center gap-5">
              <div className="flex h-14 w-14 items-center justify-center rounded-full bg-white text-2xl text-slate-900">
                ✓
              </div>

              <div>
                <h2 className="text-3xl font-semibold">
                  Knowledge Added
                </h2>

                <p className="mt-2 text-lg text-slate-400">
                  Knowledge successfully added to organizational memory.
                </p>
              </div>
            </div>

            {/* Memory Summary */}
            <div className="mt-10 rounded-2xl border border-slate-700 bg-[#020617] p-8">
              <div className="grid gap-8 md:grid-cols-2">
                <InfoItem
                  label="PRODUCT"
                  value={form.product}
                />

                <InfoItem
                  label="VERSION"
                  value={form.version || "Not specified"}
                />

                <InfoItem
                  label="ISSUE"
                  value={form.issue}
                />

                <InfoItem
                  label="SOURCE"
                  value={formatSource(form.source)}
                />
              </div>

              <div className="my-8 border-t border-slate-800" />

              <InfoItem
                label="WHAT HAPPENED?"
                value={form.happened}
              />

              <div className="my-8 border-t border-slate-800" />

              <InfoItem
                label="WHAT WORKED?"
                value={form.worked}
              />

              {form.failed && (
                <>
                  <div className="my-8 border-t border-slate-800" />

                  <InfoItem
                    label="WHAT FAILED?"
                    value={form.failed}
                  />
                </>
              )}

              {form.tried && (
                <>
                  <div className="my-8 border-t border-slate-800" />

                  <InfoItem
                    label="WHAT DID YOU TRY?"
                    value={form.tried}
                  />
                </>
              )}

              {form.context && (
                <>
                  <div className="my-8 border-t border-slate-800" />

                  <InfoItem
                    label="ADDITIONAL CONTEXT"
                    value={form.context}
                  />
                </>
              )}
            </div>

            {/* Actions */}
            <div className="mt-10 flex flex-wrap gap-4">
              <button
                type="button"
                onClick={teachAnotherMemory}
                className="rounded-xl bg-white px-8 py-4 font-semibold text-slate-950 transition hover:bg-slate-200"
              >
                Teach Another Memory
              </button>

              <Link
                href="/chat"
                className="rounded-xl border border-slate-600 px-8 py-4 font-medium text-white transition hover:bg-slate-800"
              >
                Ask the Agent
              </Link>
            </div>
          </div>
        </section>
      </main>
    );
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
              className="text-white"
            >
              Teach Memory
            </Link>

            <Link
              href="/memories"
              className="transition hover:text-white"
            >
              Memories
            </Link>
          </nav>
        </div>
      </header>

      {/* Page */}
      <section className="mx-auto max-w-5xl px-6 py-12">
        <p className="mb-4 text-sm uppercase tracking-widest text-slate-400">
          ProductOps Memory
        </p>

        <h1 className="text-5xl font-semibold tracking-tight">
          Teach Memory
        </h1>

        <p className="mt-4 text-xl text-slate-400">
          Teach the agent something your team learned from a real
          product experience.
        </p>

        {/* Form Card */}
        <form
          onSubmit={handleSubmit}
          className="mt-12 rounded-3xl border border-slate-700 bg-[#111827] p-8 shadow-2xl"
        >
          <div className="grid gap-6 md:grid-cols-2">
            {/* Product */}
            <FormField
              label="Product"
              required
              value={form.product}
              onChange={(value) =>
                handleChange("product", value)
              }
              placeholder="Product X"
            />

            {/* Version */}
            <FormField
              label="Product Version"
              value={form.version}
              onChange={(value) =>
                handleChange("version", value)
              }
              placeholder="4.2"
            />

            {/* Issue */}
            <div className="md:col-span-2">
              <FormField
                label="Issue"
                required
                value={form.issue}
                onChange={(value) =>
                  handleChange("issue", value)
                }
                placeholder="E401 authentication error"
              />
            </div>
          </div>

          {/* What happened */}
          <div className="mt-6">
            <TextAreaField
              label="What happened?"
              required
              value={form.happened}
              onChange={(value) =>
                handleChange("happened", value)
              }
              placeholder="Describe what happened in the real product experience..."
            />
          </div>

          {/* What did you try */}
          <div className="mt-6">
            <TextAreaField
              label="What did you try?"
              value={form.tried}
              onChange={(value) =>
                handleChange("tried", value)
              }
              placeholder="What troubleshooting steps or approaches did you try?"
            />
          </div>

          {/* What worked */}
          <div className="mt-6">
            <TextAreaField
              label="What worked?"
              required
              value={form.worked}
              onChange={(value) =>
                handleChange("worked", value)
              }
              placeholder="What actually resolved the issue?"
            />
          </div>

          {/* What failed */}
          <div className="mt-6">
            <TextAreaField
              label="What failed?"
              value={form.failed}
              onChange={(value) =>
                handleChange("failed", value)
              }
              placeholder="What did not work?"
            />
          </div>

          {/* Additional context */}
          <div className="mt-6">
            <TextAreaField
              label="Additional context"
              value={form.context}
              onChange={(value) =>
                handleChange("context", value)
              }
              placeholder="Customer configuration, environment, version details, or anything else useful..."
            />
          </div>

          {/* Source */}
          <div className="mt-6">
            <label
              htmlFor="source"
              className="mb-2 block text-sm font-medium text-slate-200"
            >
              Source / Type
            </label>

            <select
              id="source"
              value={form.source}
              onChange={(event) =>
                handleChange("source", event.target.value)
              }
              className="w-full rounded-xl border border-slate-700 bg-[#020617] px-4 py-3 text-white outline-none transition focus:border-slate-400 focus:ring-2 focus:ring-slate-700"
            >
              <option value="team_experience">
                Team Experience
              </option>

              <option value="historical_experience">
                Historical Experience
              </option>

              <option value="official_knowledge">
                Official Information
              </option>
            </select>
          </div>

          {/* Error */}
          {error && (
            <div
              role="alert"
              className="mt-6 rounded-xl border border-red-900 bg-red-950/40 px-5 py-4 text-sm text-red-200"
            >
              {error}
            </div>
          )}

          {/* Submit */}
          <div className="mt-8">
            <button
              type="submit"
              disabled={loading}
              className="rounded-xl bg-white px-8 py-4 font-semibold text-slate-950 transition hover:bg-slate-200 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {loading
                ? "Saving knowledge..."
                : "Teach Memory"}
            </button>
          </div>
        </form>
      </section>
    </main>
  );
}

/* -----------------------------
   Reusable Form Components
------------------------------ */

type FormFieldProps = {
  label: string;
  value: string;
  placeholder?: string;
  required?: boolean;
  onChange: (value: string) => void;
};

function FormField({
  label,
  value,
  placeholder,
  required,
  onChange,
}: FormFieldProps) {
  return (
    <div>
      <label
        className="mb-2 block text-sm font-medium text-slate-200"
      >
        {label}
        {required && (
          <span className="ml-1 text-slate-400">*</span>
        )}
      </label>

      <input
        type="text"
        value={value}
        placeholder={placeholder}
        required={required}
        onChange={(event) =>
          onChange(event.target.value)
        }
        className="w-full rounded-xl border border-slate-700 bg-[#020617] px-4 py-3 text-white placeholder:text-slate-600 outline-none transition focus:border-slate-400 focus:ring-2 focus:ring-slate-700"
      />
    </div>
  );
}

type TextAreaFieldProps = {
  label: string;
  value: string;
  placeholder?: string;
  required?: boolean;
  onChange: (value: string) => void;
};

function TextAreaField({
  label,
  value,
  placeholder,
  required,
  onChange,
}: TextAreaFieldProps) {
  return (
    <div>
      <label
        className="mb-2 block text-sm font-medium text-slate-200"
      >
        {label}
        {required && (
          <span className="ml-1 text-slate-400">*</span>
        )}
      </label>

      <textarea
        value={value}
        placeholder={placeholder}
        required={required}
        rows={4}
        onChange={(event) =>
          onChange(event.target.value)
        }
        className="w-full resize-y rounded-xl border border-slate-700 bg-[#020617] px-4 py-3 text-white placeholder:text-slate-600 outline-none transition focus:border-slate-400 focus:ring-2 focus:ring-slate-700"
      />
    </div>
  );
}

function InfoItem({
  label,
  value,
}: {
  label: string;
  value: string;
}) {
  return (
    <div>
      <p className="text-sm font-medium uppercase tracking-wider text-slate-500">
        {label}
      </p>

      <p className="mt-2 whitespace-pre-wrap text-lg leading-8 text-slate-200">
        {value}
      </p>
    </div>
  );
}

function formatSource(source: string) {
  const labels: Record<string, string> = {
    team_experience: "Team Experience",
    historical_experience: "Historical Experience",
    official_knowledge: "Official Information",
  };

  return labels[source] ?? source;
}
