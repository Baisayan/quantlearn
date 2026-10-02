"use client";

import React, { useEffect, useState } from "react";
import {
  Atom,
  Building2,
  Calendar,
  CheckCircle2,
  Edit3,
  Mail,
  Sparkles,
  Trophy,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { EditProfileModal, UserProfile } from "./edit-profile-modal";
import { getAvatar, getMasteryTier } from "@/lib/profile/avatars";

interface ProfileCardProps {
  initialEmail: string;
  completedCount: number;
  totalChapters: number;
}

export function ProfileCard({
  initialEmail,
  completedCount,
  totalChapters,
}: ProfileCardProps) {
  const emailPrefix = initialEmail ? initialEmail.split("@")[0] : "learner";
  const defaultName = emailPrefix
    .replace(/[._]/g, " ")
    .replace(/\b\w/g, (c) => c.toUpperCase());

  const [profile, setProfile] = useState<UserProfile>({
    id: "",
    email: initialEmail,
    fullName: defaultName,
    username: `@${emailPrefix.replace(/[^a-zA-Z0-9_]/g, "")}`,
    bio: "Quantum computing enthusiast exploring superposition, VQE, and Grover search on QuantLearn.",
    organization: "Independent Learner",
    quantumTrack: "Quantum Software & Algorithms",
    avatarId: "qubit-core",
    joinedAt: "Oct 2026",
  });

  const [isEditModalOpen, setIsEditModalOpen] = useState(false);

  useEffect(() => {
    let mounted = true;
    async function loadProfile() {
      try {
        const res = await fetch("/api/profile");
        if (res.ok) {
          const data = await res.json();
          if (mounted && data.profile) {
            setProfile(data.profile);
          }
        }
      } catch {
        // Fall back to defaults
      }
    }
    loadProfile();

    function onProfileUpdated(e: Event) {
      const customEvent = e as CustomEvent<UserProfile>;
      if (customEvent.detail) {
        setProfile(customEvent.detail);
      }
    }

    window.addEventListener("quantlearn:profile-updated", onProfileUpdated);
    return () => {
      mounted = false;
      window.removeEventListener("quantlearn:profile-updated", onProfileUpdated);
    };
  }, []);

  const avatar = getAvatar(profile.avatarId);
  const mastery = getMasteryTier(completedCount);
  const completionPercent = Math.round((completedCount / totalChapters) * 100);

  return (
    <>
      <Card className="relative overflow-hidden rounded-3xl border-border/80 bg-gradient-to-br from-card via-card to-primary/5 shadow-md">
        {/* Glow Accent Top Right */}
        <div className="pointer-events-none absolute -right-16 -top-16 size-48 rounded-full bg-primary/10 blur-3xl" />

        <CardContent className="p-6 sm:p-8">
          <div className="flex flex-col gap-6 sm:flex-row sm:items-start sm:justify-between">
            {/* Left: Avatar + Details */}
            <div className="flex flex-col gap-5 sm:flex-row sm:items-center">
              {/* Avatar Emblem */}
              <div className="relative group shrink-0">
                <div
                  className={`flex size-20 items-center justify-center rounded-3xl border-2 ${avatar.borderClass} ${avatar.bgClass} shadow-lg transition-transform duration-300 group-hover:scale-105`}
                >
                  <div className="scale-125">{avatar.icon}</div>
                </div>
                <span
                  title={avatar.name}
                  className="absolute -bottom-2 -right-1 rounded-full border border-primary/30 bg-card px-2 py-0.5 text-[9px] font-bold uppercase tracking-wider text-primary shadow-xs"
                >
                  {avatar.name.split(" ")[0]}
                </span>
              </div>

              {/* Identity & Metadata */}
              <div className="space-y-2">
                <div className="flex flex-wrap items-center gap-2.5">
                  <h2 className="text-2xl font-bold tracking-tight text-foreground sm:text-3xl">
                    {profile.fullName}
                  </h2>
                  <span className="flex items-center gap-1 rounded-full border border-primary/20 bg-primary/10 px-2.5 py-0.5 text-xs font-semibold text-primary">
                    <CheckCircle2 className="size-3.5" />
                    Verified Learner
                  </span>
                </div>

                <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-muted-foreground">
                  <span className="font-semibold text-primary">{profile.username}</span>
                  <span className="flex items-center gap-1">
                    <Mail className="size-3.5 opacity-70" />
                    {profile.email}
                  </span>
                  <span className="flex items-center gap-1">
                    <Building2 className="size-3.5 opacity-70" />
                    {profile.organization}
                  </span>
                  <span className="flex items-center gap-1">
                    <Calendar className="size-3.5 opacity-70" />
                    {profile.joinedAt}
                  </span>
                </div>

                {/* Bio */}
                <p className="max-w-xl text-xs sm:text-sm text-foreground/80 leading-relaxed italic">
                  "{profile.bio}"
                </p>
              </div>
            </div>

            {/* Right: Edit Profile Button */}
            <div className="flex shrink-0 items-center gap-2">
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => setIsEditModalOpen(true)}
                className="rounded-xl gap-2 border-primary/30 bg-card/80 text-xs font-semibold hover:border-primary/60 hover:bg-primary/10 hover:text-primary transition-all shadow-xs"
              >
                <Edit3 className="size-3.5" />
                Edit Profile
              </Button>
            </div>
          </div>

          {/* Bottom Bar: Mastery Tier & Track */}
          <div className="mt-6 flex flex-col gap-4 border-t border-border/60 pt-5 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex flex-wrap items-center gap-3">
              {/* Mastery Level Badge */}
              <div
                className={`flex items-center gap-2 rounded-xl border px-3 py-1.5 text-xs font-semibold shadow-xs ${mastery.badgeClass}`}
              >
                <Trophy className="size-4" />
                <span>
                  {mastery.title} · Level {mastery.level}
                </span>
              </div>

              {/* Quantum Track Pill */}
              <div className="flex items-center gap-1.5 rounded-xl border border-border/80 bg-muted/40 px-3 py-1.5 text-xs font-medium text-foreground/80">
                <Atom className="size-3.5 text-primary" />
                <span>{profile.quantumTrack}</span>
              </div>
            </div>

            {/* Mini Progress to Next Tier */}
            <div className="flex items-center gap-3 sm:max-w-xs sm:flex-1 sm:justify-end">
              <div className="flex flex-col items-end gap-1 w-full max-w-[200px]">
                <div className="flex justify-between w-full text-[10px] text-muted-foreground">
                  <span>Curriculum Mastery</span>
                  <span className="font-mono font-semibold text-primary">{completionPercent}%</span>
                </div>
                <Progress value={completionPercent} className="h-2 w-full" />
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      <EditProfileModal
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        profile={profile}
        onProfileUpdated={(updated) => setProfile(updated)}
      />
    </>
  );
}
