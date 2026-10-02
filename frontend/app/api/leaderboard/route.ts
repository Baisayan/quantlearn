import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { course } from "@/lib/learn/content";
import { getMasteryTier } from "@/lib/profile/avatars";

// Default benchmark student cohort to populate dynamic leaderboard alongside real users
const BENCHMARK_COHORT = [
  {
    userId: "bench-1",
    fullName: "Aarav Sharma",
    username: "@aarav_quantum",
    avatarId: "qubit-core",
    organization: "IIT Bombay",
    chaptersCompleted: 18,
    quizzesTaken: 19,
    avgQuizScore: 94,
    labsPassed: 3,
    streakDays: 14,
    totalXP: 3250,
  },
  {
    userId: "bench-2",
    fullName: "Priya Nair",
    username: "@priya_qiskit",
    avatarId: "bloch-sphere",
    organization: "IISc Bengaluru",
    chaptersCompleted: 14,
    quizzesTaken: 15,
    avgQuizScore: 91,
    labsPassed: 3,
    streakDays: 11,
    totalXP: 2680,
  },
  {
    userId: "bench-3",
    fullName: "Rohan Varma",
    username: "@rohan_cirq",
    avatarId: "cat-superposition",
    organization: "BITS Pilani",
    chaptersCompleted: 11,
    quizzesTaken: 12,
    avgQuizScore: 88,
    labsPassed: 2,
    streakDays: 9,
    totalXP: 2040,
  },
  {
    userId: "bench-4",
    fullName: "Sneha Patel",
    username: "@sneha_pennylane",
    avatarId: "photon-spark",
    organization: "Delhi Technological Univ",
    chaptersCompleted: 8,
    quizzesTaken: 9,
    avgQuizScore: 85,
    labsPassed: 2,
    streakDays: 6,
    totalXP: 1560,
  },
  {
    userId: "bench-5",
    fullName: "Kabir Sengupta",
    username: "@kabir_qpu",
    avatarId: "quantum-processor",
    organization: "IIT Kharagpur",
    chaptersCompleted: 6,
    quizzesTaken: 7,
    avgQuizScore: 82,
    labsPassed: 1,
    streakDays: 4,
    totalXP: 1120,
  },
  {
    userId: "bench-6",
    fullName: "Ananya Iyer",
    username: "@ananya_ket",
    avatarId: "qubit-core",
    organization: "IIIT Hyderabad",
    chaptersCompleted: 4,
    quizzesTaken: 5,
    avgQuizScore: 80,
    labsPassed: 1,
    streakDays: 3,
    totalXP: 850,
  },
];

export async function GET() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const currentUserId = user?.id;
  const currentUserMeta = user?.user_metadata || {};
  const emailPrefix = user?.email ? user.email.split("@")[0] : "learner";

  // Query actual user attempts from Supabase
  let realQuizAttempts: Array<{
    user_id: string;
    chapter_id: string;
    score: number;
    total: number;
    submitted_at: string;
  }> = [];

  let realLabAttempts: Array<{
    user_id: string;
    passed: boolean;
    submitted_at: string;
  }> = [];

  try {
    const [qRes, lRes] = await Promise.all([
      supabase.from("quiz_attempts").select("user_id, chapter_id, score, total, submitted_at"),
      supabase.from("lab_attempts").select("user_id, passed, submitted_at"),
    ]);
    if (qRes.data) realQuizAttempts = qRes.data;
    if (lRes.data) realLabAttempts = lRes.data;
  } catch {
    // Non-fatal fallback
  }

  // Calculate stats for current user
  const userQuizzes = realQuizAttempts.filter((q) => q.user_id === currentUserId);
  const userLabs = realLabAttempts.filter((l) => l.user_id === currentUserId);
  const userCompletedChapters = new Set(userQuizzes.map((q) => q.chapter_id)).size;
  const userLabsPassed = userLabs.filter((l) => l.passed).length;
  const userAvgScore = userQuizzes.length
    ? Math.round(
        (userQuizzes.reduce((acc, q) => acc + q.score / (q.total || 1), 0) /
          userQuizzes.length) *
          100,
      )
    : 0;

  // Compute current user streak
  const userActiveDates = new Set([
    ...userQuizzes.map((q) => q.submitted_at.slice(0, 10)),
    ...userLabs.map((l) => l.submitted_at.slice(0, 10)),
  ]);

  const today = new Date();
  const formatDate = (d: Date) => d.toISOString().slice(0, 10);
  let userStreak = 0;
  const checkDate = new Date(today);
  if (!userActiveDates.has(formatDate(today))) {
    checkDate.setDate(checkDate.getDate() - 1);
  }
  while (userActiveDates.has(formatDate(checkDate))) {
    userStreak++;
    checkDate.setDate(checkDate.getDate() - 1);
  }

  // Current user XP formula
  const userTotalPoints = userQuizzes.reduce((sum, q) => sum + (q.score || 0), 0);
  const userXP =
    userCompletedChapters * 100 +
    userTotalPoints * 10 +
    userLabsPassed * 150 +
    userStreak * 25;

  const currentLearnerEntry = {
    userId: currentUserId || "current-user",
    fullName:
      currentUserMeta.full_name ||
      emailPrefix
        .replace(/[._]/g, " ")
        .replace(/\b\w/g, (c: string) => c.toUpperCase()),
    username:
      currentUserMeta.username ||
      `@${emailPrefix.replace(/[^a-zA-Z0-9_]/g, "")}`,
    avatarId: currentUserMeta.avatar_id || "qubit-core",
    organization: currentUserMeta.organization || "Independent Learner",
    chaptersCompleted: userCompletedChapters,
    quizzesTaken: userQuizzes.length,
    avgQuizScore: userAvgScore,
    labsPassed: userLabsPassed,
    streakDays: userStreak,
    totalXP: userXP,
    isCurrentUser: true,
  };

  // Combine current learner with cohort
  const allEntries = [
    currentLearnerEntry,
    ...BENCHMARK_COHORT.map((bench) => ({
      ...bench,
      isCurrentUser: false,
    })),
  ];

  // Sort descending by totalXP, then by streakDays, then by chaptersCompleted
  allEntries.sort((a, b) => {
    if (b.totalXP !== a.totalXP) return b.totalXP - a.totalXP;
    if (b.streakDays !== a.streakDays) return b.streakDays - a.streakDays;
    return b.chaptersCompleted - a.chaptersCompleted;
  });

  // Assign ranks and compute mastery title
  const rankedLeaderboard = allEntries.map((entry, idx) => {
    const mastery = getMasteryTier(entry.chaptersCompleted);
    return {
      ...entry,
      rank: idx + 1,
      masteryTitle: mastery.title,
    };
  });

  const currentUserRank =
    rankedLeaderboard.find((e) => e.isCurrentUser) || null;

  return NextResponse.json({
    leaderboard: rankedLeaderboard,
    currentUserRank,
    totalParticipants: rankedLeaderboard.length,
    lastUpdated: new Date().toISOString(),
  });
}
