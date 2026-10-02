"use client";

import React, { useState } from "react";
import { Check, Loader2, Sparkles, User, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { QUANTUM_AVATARS, getAvatar } from "@/lib/profile/avatars";

export interface UserProfile {
  id: string;
  email: string;
  fullName: string;
  username: string;
  bio: string;
  organization: string;
  quantumTrack: string;
  avatarId: string;
  joinedAt: string;
}

interface EditProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
  profile: UserProfile;
  onProfileUpdated: (updated: UserProfile) => void;
}

const QUANTUM_TRACKS = [
  "Quantum Software & Algorithms",
  "Hardware & Qubit Control",
  "Quantum Information Theory",
  "Quantum Chemistry & VQE",
];

export function EditProfileModal({
  isOpen,
  onClose,
  profile,
  onProfileUpdated,
}: EditProfileModalProps) {
  const [fullName, setFullName] = useState(profile.fullName);
  const [username, setUsername] = useState(profile.username.replace(/^@/, ""));
  const [bio, setBio] = useState(profile.bio);
  const [organization, setOrganization] = useState(profile.organization);
  const [quantumTrack, setQuantumTrack] = useState(profile.quantumTrack);
  const [avatarId, setAvatarId] = useState(profile.avatarId);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState("");

  if (!isOpen) return null;

  async function handleSave(e: React.FormEvent) {
    e.preventDefault();
    setIsSaving(true);
    setError("");

    try {
      const formattedUsername = username.trim() ? `@${username.trim().replace(/^@/, "")}` : profile.username;
      const res = await fetch("/api/profile", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          fullName: fullName.trim() || profile.fullName,
          username: formattedUsername,
          bio: bio.trim(),
          organization: organization.trim() || "Independent Learner",
          quantumTrack,
          avatarId,
        }),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || "Failed to update profile.");
      }

      const updated: UserProfile = {
        ...profile,
        fullName: fullName.trim() || profile.fullName,
        username: formattedUsername,
        bio: bio.trim(),
        organization: organization.trim() || "Independent Learner",
        quantumTrack,
        avatarId,
      };

      onProfileUpdated(updated);
      if (typeof window !== "undefined") {
        window.dispatchEvent(
          new CustomEvent("quantlearn:profile-updated", { detail: updated })
        );
      }
      onClose();
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "An error occurred.");
    } finally {
      setIsSaving(false);
    }
  }

  const selectedAvatar = getAvatar(avatarId);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-background/80 backdrop-blur-md animate-in fade-in duration-200">
      <div
        className="relative w-full max-w-xl max-h-[90vh] overflow-y-auto rounded-3xl border border-border/80 bg-card p-6 sm:p-8 shadow-2xl space-y-6"
        role="dialog"
        aria-labelledby="edit-profile-title"
      >
        {/* Header */}
        <div className="flex items-center justify-between border-b border-border/60 pb-4">
          <div className="space-y-1">
            <h2 id="edit-profile-title" className="text-xl font-bold tracking-tight text-foreground flex items-center gap-2">
              <User className="size-5 text-primary" />
              Edit Quantum Learner Profile
            </h2>
            <p className="text-xs text-muted-foreground">
              Personalize your public identity, display badge, and research focus.
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="rounded-full p-2 text-muted-foreground hover:bg-muted hover:text-foreground transition-colors"
            aria-label="Close modal"
          >
            <X className="size-4" />
          </button>
        </div>

        {error && (
          <div className="rounded-xl border border-destructive/30 bg-destructive/10 p-3 text-xs text-destructive">
            {error}
          </div>
        )}

        <form onSubmit={handleSave} className="space-y-5">
          {/* Avatar Selector */}
          <div className="space-y-2.5">
            <Label className="text-xs font-semibold text-foreground">
              Choose Quantum Avatar
            </Label>
            <div className="grid grid-cols-5 gap-2.5">
              {QUANTUM_AVATARS.map((avatar) => {
                const isSelected = avatarId === avatar.id;
                return (
                  <button
                    key={avatar.id}
                    type="button"
                    onClick={() => setAvatarId(avatar.id)}
                    className={`relative flex flex-col items-center justify-center gap-1.5 rounded-2xl border p-3 transition-all duration-200 ${
                      isSelected
                        ? `${avatar.borderClass} ${avatar.bgClass} shadow-sm ring-2 ring-primary/40 scale-105`
                        : "border-border/60 bg-muted/30 hover:border-border hover:bg-muted/70"
                    }`}
                  >
                    <div className="size-8 flex items-center justify-center">
                      {avatar.icon}
                    </div>
                    <span className="text-[10px] font-medium text-foreground truncate w-full text-center">
                      {avatar.name.split(" ")[0]}
                    </span>
                    {isSelected && (
                      <span className="absolute -top-1 -right-1 flex size-4 items-center justify-center rounded-full bg-primary text-primary-foreground shadow-xs">
                        <Check className="size-2.5 stroke-[3]" />
                      </span>
                    )}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Full Name & Username */}
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-1.5">
              <Label htmlFor="fullName" className="text-xs font-semibold text-foreground">
                Display Name
              </Label>
              <Input
                id="fullName"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                placeholder="e.g. Vedant Sharma"
                required
                className="rounded-xl"
              />
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="username" className="text-xs font-semibold text-foreground">
                Username (@handle)
              </Label>
              <div className="relative">
                <span className="absolute left-3 top-2.5 text-xs text-muted-foreground">@</span>
                <Input
                  id="username"
                  value={username}
                  onChange={(e) => setUsername(e.target.value.replace(/[^a-zA-Z0-9_]/g, ""))}
                  placeholder="handle"
                  required
                  className="rounded-xl pl-7"
                />
              </div>
            </div>
          </div>

          {/* College / Organization */}
          <div className="space-y-1.5">
            <Label htmlFor="organization" className="text-xs font-semibold text-foreground">
              Institution / Affiliation
            </Label>
            <Input
              id="organization"
              value={organization}
              onChange={(e) => setOrganization(e.target.value)}
              placeholder="e.g. IIT Delhi / IBM Quantum Researcher / Independent Learner"
              className="rounded-xl"
            />
          </div>

          {/* Bio */}
          <div className="space-y-1.5">
            <div className="flex items-center justify-between">
              <Label htmlFor="bio" className="text-xs font-semibold text-foreground">
                Bio / Quantum Mission
              </Label>
              <span className="text-[10px] text-muted-foreground font-mono">
                {bio.length}/160
              </span>
            </div>
            <Textarea
              id="bio"
              value={bio}
              onChange={(e) => setBio(e.target.value.slice(0, 160))}
              placeholder="Tell others what quantum concepts you are exploring..."
              rows={3}
              className="rounded-xl resize-none text-xs"
            />
          </div>

          {/* Preferred Quantum Track */}
          <div className="space-y-2">
            <Label className="text-xs font-semibold text-foreground">
              Primary Learning Focus
            </Label>
            <div className="grid grid-cols-2 gap-2">
              {QUANTUM_TRACKS.map((track) => {
                const isSelected = quantumTrack === track;
                return (
                  <button
                    key={track}
                    type="button"
                    onClick={() => setQuantumTrack(track)}
                    className={`rounded-xl border px-3 py-2 text-left text-xs font-medium transition-all ${
                      isSelected
                        ? "border-primary/40 bg-primary/10 text-primary shadow-xs"
                        : "border-border/60 bg-muted/20 text-muted-foreground hover:bg-muted/60 hover:text-foreground"
                    }`}
                  >
                    {track}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center justify-end gap-3 pt-3 border-t border-border/60">
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
              disabled={isSaving}
              className="rounded-xl text-xs"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={isSaving}
              className="rounded-xl text-xs font-semibold gap-2 shadow-md"
            >
              {isSaving ? (
                <>
                  <Loader2 className="size-3.5 animate-spin" />
                  Saving...
                </>
              ) : (
                <>
                  <Sparkles className="size-3.5" />
                  Save Changes
                </>
              )}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
