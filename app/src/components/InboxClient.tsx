"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { isSupabaseConfigured, supabase } from "@/lib/supabase";

type Conversation = {
  id: string;
  listing_id: string | null;
  response_id: string | null;
  participant_a: string;
  participant_b: string;
  last_message: string | null;
  last_message_at: string | null;
  created_at: string;
  updated_at: string;
};

function formatDate(value: string | null) {
  if (!value) return "No messages yet";
  return new Intl.DateTimeFormat("en", {
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  }).format(new Date(value));
}

export function InboxClient() {
  const [userId, setUserId] = useState("");
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState("");

  useEffect(() => {
    let active = true;

    async function loadInbox() {
      if (!supabase || !isSupabaseConfigured) {
        setMessage("Supabase is not configured. Add Vercel env vars first.");
        setLoading(false);
        return;
      }

      const { data: userResult, error: userError } = await supabase.auth.getUser();

      if (!active) return;

      if (userError || !userResult.user) {
        setMessage("Please log in to view your inbox.");
        setLoading(false);
        return;
      }

      setUserId(userResult.user.id);

      const { data, error } = await supabase
        .from("conversations")
        .select("id, listing_id, response_id, participant_a, participant_b, last_message, last_message_at, created_at, updated_at")
        .or(`participant_a.eq.${userResult.user.id},participant_b.eq.${userResult.user.id}`)
        .order("updated_at", { ascending: false });

      if (!active) return;

      if (error) {
        setMessage(`${error.message}. Run the messages SQL migration first.`);
        setLoading(false);
        return;
      }

      setConversations(data ?? []);
      setLoading(false);
    }

    loadInbox();

    return () => {
      active = false;
    };
  }, []);

  return (
    <div className="mt-8 grid gap-5">
      {loading ? (
        <div className="rounded-[2rem] border border-white/10 bg-white/10 p-6 text-white/70">Loading inbox...</div>
      ) : message ? (
        <div className="rounded-[2rem] border border-white/10 bg-white/10 p-6 text-cyan-100">{message}</div>
      ) : conversations.length ? (
        conversations.map((conversation) => {
          const otherUser = conversation.participant_a === userId ? conversation.participant_b : conversation.participant_a;

          return (
            <Link
              key={conversation.id}
              href={`/inbox/${conversation.id}`}
              className="block rounded-[2rem] border border-white/10 bg-white/10 p-6 hover:bg-white/15"
            >
              <div className="flex flex-wrap items-start justify-between gap-4">
                <div>
                  <h2 className="text-xl font-bold">Conversation</h2>
                  <p className="mt-1 text-sm text-white/45">With user {otherUser.slice(0, 8)}...</p>
                  <p className="mt-4 text-white/70">{conversation.last_message || "No messages yet. Open chat to send the first one."}</p>
                </div>
                <p className="rounded-full bg-white/10 px-4 py-2 text-sm text-cyan-100">
                  {formatDate(conversation.last_message_at ?? conversation.updated_at)}
                </p>
              </div>
            </Link>
          );
        })
      ) : (
        <div className="rounded-[2rem] border border-white/10 bg-white/10 p-6">
          <h2 className="text-2xl font-bold">No conversations yet</h2>
          <p className="mt-3 text-white/65">Respond to a listing or create your own listing to start receiving messages.</p>
          <div className="mt-6 flex flex-wrap gap-3">
            <Link href="/nearby" className="rounded-full bg-white px-6 py-3 font-semibold text-slate-950 hover:bg-cyan-100">
              Browse nearby
            </Link>
            <Link href="/profile#listing" className="rounded-full border border-white/15 px-6 py-3 font-semibold text-white hover:bg-white/10">
              Create listing
            </Link>
          </div>
        </div>
      )}
    </div>
  );
}
