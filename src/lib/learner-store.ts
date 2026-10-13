// DEMO & CLOUD Learner state, backed by localStorage and optionally Firebase Firestore.
import { useSyncExternalStore } from "react";
import { ALL_LESSONS } from "@/data/curriculum";
import type { CharacterId } from "@/data/curriculum";

export type LearnerProfile = {
  name: string;
  dob: string;
  age: number;
  grade: string;
  avatarId: CharacterId;
  nativeLanguage: string;
  hasCompletedTour: boolean;
};

export type LearnerState = {
  name: string;
  dob: string;
  age: number;
  grade: string;
  avatarId: CharacterId;
  nativeLanguage: string;
  hasCompletedTour: boolean;
  xp: number;
  streak: number;
  todayXp: number;
  dailyGoal: number;
  completed: string[]; // lesson IDs
  speakingSessions: number;
  lastActiveDate: string; // ISO date string "YYYY-MM-DD"
  achievements: string[]; // badge IDs
};

const KEY = "lingosprout-learner-v3";

const DEFAULT: LearnerState = {
  name: "Sprout Adventurer",
  dob: "2018-05-15",
  age: 7,
  grade: "Grade 2",
  avatarId: "milo",
  nativeLanguage: "English",
  hasCompletedTour: false,
  xp: 0,
  streak: 0,
  todayXp: 0,
  dailyGoal: 30,
  completed: [],
  speakingSessions: 0,
  lastActiveDate: "",
  achievements: [],
};

let state: LearnerState = DEFAULT;
let loaded = false;
const listeners = new Set<() => void>();

function todayStr() {
  return new Date().toISOString().slice(0, 10);
}

function load() {
  if (loaded || typeof window === "undefined") return;
  loaded = true;
  try {
    const raw = localStorage.getItem(KEY);
    if (raw) {
      const saved = { ...DEFAULT, ...JSON.parse(raw) };
      // Reset todayXp if it's a new day
      const today = todayStr();
      if (saved.lastActiveDate && saved.lastActiveDate !== today) {
        const yesterday = new Date();
        yesterday.setDate(yesterday.getDate() - 1);
        const yesterdayStr = yesterday.toISOString().slice(0, 10);
        if (saved.lastActiveDate !== yesterdayStr) {
          saved.streak = 0;
        }
        saved.todayXp = 0;
        saved.lastActiveDate = today;
      }
      state = saved;
    }
  } catch {
    /* ignore parse errors */
  }
}

function set(next: Partial<LearnerState>) {
  state = { ...state, ...next };
  localStorage.setItem(KEY, JSON.stringify(state));
  listeners.forEach((l) => l());
}

export function useLearner() {
  return useSyncExternalStore(
    (cb) => {
      load();
      listeners.add(cb);
      cb();
      return () => listeners.delete(cb);
    },
    () => state,
    () => DEFAULT,
  );
}

export const learner = {
  updateProfile(profile: Partial<LearnerProfile>) {
    set(profile);
  },

  setName(name: string) {
    set({ name: name.trim() || "Sprout Adventurer" });
  },

  setAvatar(avatarId: CharacterId) {
    set({ avatarId });
  },

  setTourCompleted(hasCompletedTour = true) {
    set({ hasCompletedTour });
  },

  setDailyGoal(dailyGoal: number) {
    set({ dailyGoal });
  },

  completeLesson(id: string, xp: number) {
    if (state.completed.includes(id)) return;
    const completed = [...state.completed, id];
    const today = todayStr();
    const newTodayXp = state.todayXp + xp;
    
    let streak = state.streak;
    if (state.lastActiveDate !== today) {
      const yesterday = new Date();
      yesterday.setDate(yesterday.getDate() - 1);
      const yesterdayStr = yesterday.toISOString().slice(0, 10);
      streak = state.lastActiveDate === yesterdayStr ? state.streak + 1 : 1;
    }

    const newAchievements = [...state.achievements];
    if (completed.length === 1 && !newAchievements.includes("first-lesson")) {
      newAchievements.push("first-lesson");
    }
    if (completed.length === 5 && !newAchievements.includes("five-lessons")) {
      newAchievements.push("five-lessons");
    }
    if (streak >= 3 && !newAchievements.includes("streak-3")) {
      newAchievements.push("streak-3");
    }
    set({
      completed,
      xp: state.xp + xp,
      todayXp: newTodayXp,
      streak,
      lastActiveDate: today,
      achievements: newAchievements,
    });
  },

  addXp(xp: number) {
    set({ xp: state.xp + xp, todayXp: state.todayXp + xp });
  },

  speakingDone() {
    const today = todayStr();
    const newAchievements = [...state.achievements];
    if (!newAchievements.includes("first-speak")) newAchievements.push("first-speak");
    set({
      speakingSessions: state.speakingSessions + 1,
      xp: state.xp + 5,
      todayXp: state.todayXp + 5,
      lastActiveDate: today,
      achievements: newAchievements,
    });
  },

  reset() {
    set(DEFAULT);
  },
};

export type NodeStatus = "done" | "current" | "open" | "locked";

export function lessonStatus(id: string, completed: string[]): NodeStatus {
  if (completed.includes(id)) return "done";
  const allIds = ALL_LESSONS.map((l) => l.id);
  const idx = allIds.indexOf(id);
  const firstIncompleteIdx = allIds.findIndex((lid) => !completed.includes(lid));
  if (idx === firstIncompleteIdx) return "current";
  if (idx === firstIncompleteIdx + 1) return "open";
  return "locked";
}

export const nextLesson = (completed: string[]) => ALL_LESSONS.find((l) => !completed.includes(l.id));
export const levelOf = (xp: number) => Math.floor(xp / 100) + 1;

// Achievement definitions
export type Achievement = {
  id: string;
  name: string;
  description: string;
  icon: string;
};

export const ACHIEVEMENTS: Achievement[] = [
  { id: "first-lesson", name: "First steps!", description: "Completed your very first lesson.", icon: "🌱" },
  { id: "five-lessons", name: "On a roll!", description: "Completed 5 lessons.", icon: "⭐" },
  { id: "first-speak", name: "Speak up!", description: "Tried the speaking studio.", icon: "🎤" },
  { id: "streak-3", name: "3-day streak!", description: "Learnt for 3 days in a row.", icon: "🔥" },
  { id: "level-2", name: "Level up!", description: "Reached Level 2 learner.", icon: "🏆" },
];
