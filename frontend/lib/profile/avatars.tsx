import React from "react";
import { Atom, Cat, Cpu, Globe, Sparkles } from "lucide-react";

export interface QuantumAvatar {
  id: string;
  name: string;
  description: string;
  colorClass: string;
  bgClass: string;
  borderClass: string;
  icon: React.ReactNode;
}

export const QUANTUM_AVATARS: QuantumAvatar[] = [
  {
    id: "qubit-core",
    name: "Qubit Core",
    description: "Superposition Ground State",
    colorClass: "text-violet-400",
    bgClass: "bg-violet-500/20",
    borderClass: "border-violet-500/40",
    icon: <Atom className="size-6 text-violet-400" />,
  },
  {
    id: "bloch-sphere",
    name: "Bloch Sphere",
    description: "Coherent State Vector",
    colorClass: "text-cyan-400",
    bgClass: "bg-cyan-500/20",
    borderClass: "border-cyan-500/40",
    icon: <Globe className="size-6 text-cyan-400" />,
  },
  {
    id: "cat-superposition",
    name: "Schrödinger's Cat",
    description: "Macro-Quantum Entanglement",
    colorClass: "text-emerald-400",
    bgClass: "bg-emerald-500/20",
    borderClass: "border-emerald-500/40",
    icon: <Cat className="size-6 text-emerald-400" />,
  },
  {
    id: "quantum-processor",
    name: "QPU Architect",
    description: "Superconducting Circuit Wire",
    colorClass: "text-amber-400",
    bgClass: "bg-amber-500/20",
    borderClass: "border-amber-500/40",
    icon: <Cpu className="size-6 text-amber-400" />,
  },
  {
    id: "photon-spark",
    name: "Entangled Photon",
    description: "Bell State Correlation",
    colorClass: "text-rose-400",
    bgClass: "bg-rose-500/20",
    borderClass: "border-rose-500/40",
    icon: <Sparkles className="size-6 text-rose-400" />,
  },
];

export function getAvatar(avatarId?: string): QuantumAvatar {
  return QUANTUM_AVATARS.find((a) => a.id === avatarId) || QUANTUM_AVATARS[0];
}

export function getMasteryTier(completedCount: number): {
  title: string;
  level: number;
  badgeClass: string;
  nextTier: string;
  chaptersToNext: number;
} {
  if (completedCount >= 20) {
    return {
      title: "Fault-Tolerant Architect",
      level: 5,
      badgeClass: "bg-amber-500/15 border-amber-500/30 text-amber-500",
      nextTier: "Quantum Laureate (Max)",
      chaptersToNext: 0,
    };
  }
  if (completedCount >= 15) {
    return {
      title: "Algorithm Engineer",
      level: 4,
      badgeClass: "bg-violet-500/15 border-violet-500/30 text-violet-400",
      nextTier: "Fault-Tolerant Architect",
      chaptersToNext: 20 - completedCount,
    };
  }
  if (completedCount >= 10) {
    return {
      title: "Entanglement Specialist",
      level: 3,
      badgeClass: "bg-cyan-500/15 border-cyan-500/30 text-cyan-400",
      nextTier: "Algorithm Engineer",
      chaptersToNext: 15 - completedCount,
    };
  }
  if (completedCount >= 5) {
    return {
      title: "Superposition Initiate",
      level: 2,
      badgeClass: "bg-emerald-500/15 border-emerald-500/30 text-emerald-400",
      nextTier: "Entanglement Specialist",
      chaptersToNext: 10 - completedCount,
    };
  }
  return {
    title: "Qubit Explorer",
    level: 1,
    badgeClass: "bg-primary/15 border-primary/30 text-primary",
    nextTier: "Superposition Initiate",
    chaptersToNext: 5 - completedCount,
  };
}
