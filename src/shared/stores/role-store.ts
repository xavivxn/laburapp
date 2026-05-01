"use client";

import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";

export type Role = "employee" | "employer";

type RoleState = {
  role: Role;
  setRole: (role: Role) => void;
  toggle: () => void;
};

export const useRoleStore = create<RoleState>()(
  persist(
    (set, get) => ({
      role: "employee",
      setRole: (role) => set({ role }),
      toggle: () =>
        set({ role: get().role === "employee" ? "employer" : "employee" }),
    }),
    {
      name: "laburapp:role",
      storage: createJSONStorage(() => localStorage),
    },
  ),
);
