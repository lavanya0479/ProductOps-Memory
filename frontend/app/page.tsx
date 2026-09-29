import Link from "next/link";

export default function Home() {
  return (
    <main className="min-h-screen bg-slate-950 text-white">
      {/* Header */}
      <header className="border-b border-slate-800">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-5">
          <Link href="/" className="text-xl font-semibold">
            ProductOps Memory
          </Link>

          <nav className="flex gap-6 text-sm text-slate-300">
            <Link href="/chat" className="hover:text-white">
              Ask Agent
            </Link>
            <Link href="/teach" className="hover:text-white">
              Teach Memory
            </Link>
            <Link href="/memories" className="hover:text-white">
              Memories
            </Link>
          </nav>
        </div>
      </header>

      {/* Hero */}
      <section className="mx-auto flex max-w-6xl flex-col items-center px-6 py-24 text-center">
        <div className="mb-6 rounded-full border border-slate-700 bg-slate-900 px-4 py-2 text-sm text-slate-300">
          AI Organizational Memory
        </div>

        <h1 className="max-w-4xl text-5xl font-bold tracking-tight sm:text-6xl">
          Remember what your team learned the hard way.
        </h1>

        <p className="mt-6 max-w-2xl text-lg leading-8 text-slate-400">
          ProductOps Memory is an AI organizational memory for product teams
          that remembers previous experiences, solutions, failures, and
          corrections.
        </p>

        {/* Main actions */}
        <div className="mt-10 grid w-full max-w-3xl gap-4 sm:grid-cols-3">
          <Link
            href="/chat"
            className="rounded-xl bg-white px-6 py-5 text-center font-semibold text-slate-950 transition hover:bg-slate-200"
          >
            <div className="text-lg">Ask the Agent</div>
            <div className="mt-1 text-sm font-normal text-slate-600">
              Find previous team experience
            </div>
          </Link>

          <Link
            href="/teach"
            className="rounded-xl border border-slate-700 bg-slate-900 px-6 py-5 text-center font-semibold transition hover:border-slate-500 hover:bg-slate-800"
          >
            <div className="text-lg">Teach Memory</div>
            <div className="mt-1 text-sm font-normal text-slate-400">
              Add knowledge your team learned
            </div>
          </Link>

          <Link
            href="/memories"
            className="rounded-xl border border-slate-700 bg-slate-900 px-6 py-5 text-center font-semibold transition hover:border-slate-500 hover:bg-slate-800"
          >
            <div className="text-lg">View Memories</div>
            <div className="mt-1 text-sm font-normal text-slate-400">
              Explore organizational knowledge
            </div>
          </Link>
        </div>
      </section>

      {/* Memory concept */}
      <section className="border-t border-slate-800">
        <div className="mx-auto max-w-6xl px-6 py-16">
          <div className="grid gap-8 md:grid-cols-3">
            <div>
              <div className="mb-3 text-sm font-medium text-slate-400">
                01
              </div>
              <h2 className="text-xl font-semibold">Teach</h2>
              <p className="mt-2 text-sm leading-6 text-slate-400">
                Capture what your team discovered from real product problems.
              </p>
            </div>

            <div>
              <div className="mb-3 text-sm font-medium text-slate-400">
                02
              </div>
              <h2 className="text-xl font-semibold">Remember</h2>
              <p className="mt-2 text-sm leading-6 text-slate-400">
                Recall relevant experiences when a similar problem appears.
              </p>
            </div>

            <div>
              <div className="mb-3 text-sm font-medium text-slate-400">
                03
              </div>
              <h2 className="text-xl font-semibold">Improve</h2>
              <p className="mt-2 text-sm leading-6 text-slate-400">
                Correct outdated knowledge so future answers use the update.
              </p>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}