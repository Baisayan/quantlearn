import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

export async function GET() {
  const supabase = await createClient();
  const {
    data: { user },
    error,
  } = await supabase.auth.getUser();

  if (error || !user) {
    return NextResponse.json({ error: "Please sign in again." }, { status: 401 });
  }

  const meta = user.user_metadata || {};
  const emailPrefix = user.email ? user.email.split("@")[0] : "quantum_learner";

  const profile = {
    id: user.id,
    email: user.email || "",
    fullName:
      meta.full_name ||
      emailPrefix
        .replace(/[._]/g, " ")
        .replace(/\b\w/g, (c) => c.toUpperCase()),
    username:
      meta.username || `@${emailPrefix.replace(/[^a-zA-Z0-9_]/g, "")}`,
    bio:
      meta.bio ||
      "Quantum computing enthusiast exploring superposition, VQE, and Grover search on QuantLearn.",
    organization: meta.organization || "Independent Learner",
    quantumTrack: meta.quantum_track || "Quantum Software & Algorithms",
    avatarId: meta.avatar_id || "qubit-core",
    joinedAt: user.created_at
      ? new Date(user.created_at).toLocaleDateString("en-US", {
          month: "short",
          year: "numeric",
        })
      : "Oct 2026",
  };

  return NextResponse.json({ profile });
}

export async function POST(request: Request) {
  const supabase = await createClient();
  const {
    data: { user },
    error,
  } = await supabase.auth.getUser();

  if (error || !user) {
    return NextResponse.json({ error: "Please sign in again." }, { status: 401 });
  }

  let body;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid request payload." }, { status: 400 });
  }

  const { fullName, username, bio, organization, quantumTrack, avatarId } = body;

  const { error: updateError } = await supabase.auth.updateUser({
    data: {
      full_name: fullName,
      username: username ? (username.startsWith("@") ? username : `@${username}`) : undefined,
      bio,
      organization,
      quantum_track: quantumTrack,
      avatar_id: avatarId,
    },
  });

  if (updateError) {
    return NextResponse.json({ error: updateError.message }, { status: 500 });
  }

  return NextResponse.json({ success: true });
}
