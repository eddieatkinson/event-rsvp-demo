"use client";

import { useState } from "react";

const API = process.env.NEXT_PUBLIC_API_URL;

type RsvpStatus = "yes" | "no" | "maybe";

type Rsvp = {
  name: string;
  status: RsvpStatus;
};

type Event = {
  _id: string;
  title: string;
  date: string;
  rsvps?: Rsvp[];
};

const statusStyles: Record<RsvpStatus, string> = {
  yes: "bg-emerald-500/10 text-emerald-300 border-emerald-500/40",
  no: "bg-rose-500/10 text-rose-300 border-rose-500/40",
  maybe: "bg-amber-500/10 text-amber-200 border-amber-500/40",
};

export default function Home() {
  const [title, setTitle] = useState("");
  const [date, setDate] = useState("");
  const [event, setEvent] = useState<Event | null>(null);

  const [name, setName] = useState("");
  const [status, setStatus] = useState<RsvpStatus>("yes");

  const [isCreating, setIsCreating] = useState(false);
  const [isSavingRsvp, setIsSavingRsvp] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function createEvent() {
    if (!title || !date || !API) return;

    setIsCreating(true);
    setError(null);

    try {
      const res = await fetch(`${API}/events`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ title, date }),
      });

      const data = await res.json();
      if (!res.ok || data.error) {
        throw new Error(data.error || "Failed to create event");
      }

      setEvent(data);
    } catch (err: any) {
      console.error("Error creating event:", err);
      setError(err?.message || "Something went wrong creating the event.");
    } finally {
      setIsCreating(false);
    }
  }

  async function addRsvp() {
    if (!event?._id || !name || !API) return;

    setIsSavingRsvp(true);
    setError(null);

    try {
      const res = await fetch(`${API}/events/${event._id}/rsvp`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, status }),
      });

      const data = await res.json();

      if (!res.ok || data.error) {
        throw new Error(data.error || "Failed to save RSVP");
      }

      setEvent(data);
      setName("");
    } catch (err: any) {
      console.error("Error saving RSVP:", err);
      setError(err?.message || "Something went wrong saving the RSVP.");
    } finally {
      setIsSavingRsvp(false);
    }
  }

  const hasEvent = Boolean(event);

  return (
    <main className="min-h-screen bg-linear-to-br from-slate-950 via-slate-900 to-slate-950 text-slate-50 flex items-center justify-center px-4 py-10">
      <div className="w-full max-w-3xl rounded-2xl bg-slate-900/80 border border-slate-800 shadow-2xl shadow-slate-950/40 backdrop-blur px-6 py-6 sm:p-8 space-y-6">
        <header className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <div className="inline-flex items-center gap-2 rounded-full border border-slate-700 bg-slate-900/70 px-3 py-1 text-xs font-medium text-slate-300">
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" />
              Live demo
            </div>
            <h1 className="mt-3 text-2xl sm:text-3xl font-semibold tracking-tight text-slate-50">
              Event RSVP Demo
            </h1>
            <p className="mt-1 text-sm text-slate-400">
              Create a simple event, collect RSVPs, and preview everyone who is
              comingall in one place.
            </p>
          </div>

          <div className="mt-2 sm:mt-0 text-xs text-right text-slate-500">
            <p className="font-medium text-slate-300">
              {hasEvent ? "Step 2 of 2" : "Step 1 of 2"}
            </p>
            <p>{hasEvent ? "Collect RSVPs" : "Create your event"}</p>
          </div>
        </header>

        {error && (
          <div className="rounded-lg border border-rose-700/70 bg-rose-950/60 px-3 py-2 text-sm text-rose-200">
            {error}
          </div>
        )}

        <div className="grid gap-6 md:grid-cols-[minmax(0,1.15fr)_minmax(0,1fr)]">
          {/* Left column: create event / event details */}
          <section className="space-y-4 rounded-xl border border-slate-800 bg-slate-900/70 px-4 py-4 sm:px-5 sm:py-5">
            <header className="flex items-center justify-between gap-3">
              <div>
                <h2 className="text-sm font-semibold uppercase tracking-[0.16em] text-slate-400">
                  {hasEvent ? "Event details" : "Create event"}
                </h2>
                <p className="mt-1 text-xs text-slate-500">
                  {hasEvent
                    ? "Share these details with your guests."
                    : "Just a title and date to get started."}
                </p>
              </div>
            </header>

            {!hasEvent ? (
              <div className="space-y-4">
                <div>
                  <label className="block text-xs font-medium text-slate-200">
                    Event title
                  </label>
                  <input
                    className="mt-1 w-full rounded-lg border border-slate-700 bg-slate-900/70 px-3 py-2 text-sm text-slate-50 placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                    placeholder="Team offsite, birthday dinner, movie night..."
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium text-slate-200">
                    Date
                  </label>
                  <input
                    type="date"
                    className="mt-1 w-full rounded-lg border border-slate-700 bg-slate-900/70 px-3 py-2 text-sm text-slate-50 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                    value={date}
                    onChange={(e) => setDate(e.target.value)}
                  />
                </div>

                <button
                  type="button"
                  onClick={createEvent}
                  disabled={!title || !date || isCreating || !API}
                  className="inline-flex w-full items-center justify-center gap-2 rounded-lg bg-linear-to-r from-indigo-500 to-sky-500 px-3 py-2 text-sm font-medium text-white shadow-md shadow-indigo-950/40 transition hover:from-indigo-400 hover:to-sky-400 disabled:cursor-not-allowed disabled:opacity-60"
                >
                  {isCreating ? "Creating event..." : "Create event"}
                </button>

                {!API && (
                  <p className="text-xs text-amber-300/90">
                    NEXT_PUBLIC_API_URL is not configured. Add it to your
                    environment to enable the demo.
                  </p>
                )}
              </div>
            ) : (
              <div className="space-y-3 text-sm">
                <div>
                  <p className="text-[0.7rem] uppercase tracking-[0.16em] text-slate-500">
                    Title
                  </p>
                  <p className="mt-1 text-base font-medium text-slate-50">
                    {event?.title}
                  </p>
                </div>
                <div>
                  <p className="text-[0.7rem] uppercase tracking-[0.16em] text-slate-500">
                    Date
                  </p>
                  <p className="mt-1 text-sm text-slate-200">{event?.date}</p>
                </div>
                <div className="mt-3 inline-flex items-center gap-2 rounded-full border border-slate-700 bg-slate-900/80 px-3 py-1 text-[0.7rem] text-slate-300">
                  <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" />
                  Event is live—start collecting RSVPs.
                </div>
              </div>
            )}
          </section>

          {/* Right column: RSVP form & list */}
          <section className="space-y-4 rounded-xl border border-slate-800 bg-slate-900/70 px-4 py-4 sm:px-5 sm:py-5">
            <header className="flex items-center justify-between gap-3">
              <div>
                <h2 className="text-sm font-semibold uppercase tracking-[0.16em] text-slate-400">
                  RSVPs
                </h2>
                <p className="mt-1 text-xs text-slate-500">
                  Capture responses and see who is "in", "out", or "maybe".
                </p>
              </div>
            </header>

            <div className="space-y-3">
              <div className="flex flex-col gap-3 sm:flex-row sm:items-end">
                <div className="flex-1">
                  <label className="block text-xs font-medium text-slate-200">
                    Guest name
                  </label>
                  <input
                    className="mt-1 w-full rounded-lg border border-slate-700 bg-slate-900/70 px-3 py-2 text-sm text-slate-50 placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-sky-500 focus:border-sky-500"
                    placeholder="Add yourself or a teammate"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    disabled={!hasEvent}
                  />
                </div>

                <div className="w-full sm:w-36">
                  <label className="block text-xs font-medium text-slate-200">
                    Status
                  </label>
                  <select
                    className="mt-1 w-full rounded-lg border border-slate-700 bg-slate-900/70 px-3 py-2 text-sm text-slate-50 focus:outline-none focus:ring-2 focus:ring-sky-500 focus:border-sky-500"
                    value={status}
                    onChange={(e) => setStatus(e.target.value as RsvpStatus)}
                    disabled={!hasEvent}
                  >
                    <option value="yes">Yes</option>
                    <option value="no">No</option>
                    <option value="maybe">Maybe</option>
                  </select>
                </div>
              </div>

              <button
                type="button"
                onClick={addRsvp}
                disabled={!hasEvent || !name || isSavingRsvp || !API}
                className="inline-flex w-full items-center justify-center gap-2 rounded-lg bg-sky-500 px-3 py-2 text-sm font-medium text-slate-950 shadow-md shadow-sky-950/40 transition hover:bg-sky-400 disabled:cursor-not-allowed disabled:opacity-60"
              >
                {isSavingRsvp ? "Saving RSVP..." : "Submit RSVP"}
              </button>
            </div>

            <div className="pt-2 border-t border-slate-800/80 mt-3 space-y-2">
              <div className="flex items-center justify-between text-xs text-slate-500">
                <span>
                  {event?.rsvps?.length
                    ? `${event.rsvps.length} response${
                        event.rsvps.length === 1 ? "" : "s"
                      }`
                    : "No responses yet"}
                </span>
              </div>

              <div className="max-h-48 space-y-2 overflow-y-auto pr-1">
                {event?.rsvps?.length ? (
                  event.rsvps.map((rsvp, index) => (
                    <div
                      key={`${rsvp.name}-${index}`}
                      className="flex items-center justify-between gap-3 rounded-lg border border-slate-800 bg-slate-900/70 px-3 py-2 text-sm text-slate-100"
                    >
                      <div className="flex flex-col">
                        <span className="font-medium">{rsvp.name}</span>
                        <span className="text-xs text-slate-500">Guest</span>
                      </div>
                      <span
                        className={`inline-flex items-center rounded-full border px-2.5 py-1 text-[0.7rem] font-medium uppercase tracking-[0.12em] ${statusStyles[rsvp.status]}`}
                      >
                        {rsvp.status}
                      </span>
                    </div>
                  ))
                ) : (
                  <p className="text-xs text-slate-500">
                    Once guests start responding, you&apos;ll see them listed
                    here.
                  </p>
                )}
              </div>
            </div>
          </section>
        </div>
      </div>
    </main>
  );
}
