"use client";

import { useCallback, useEffect, useState } from "react";
import type { Profile, SwipeAction } from "../types";

function uniqProfilesById(list: Profile[]): Profile[] {
  const seen = new Set<string>();
  const out: Profile[] = [];
  for (const p of list) {
    if (seen.has(p.id)) continue;
    seen.add(p.id);
    out.push(p);
  }
  return out;
}

export function useSwipeDeck(initial: Profile[]) {
  const sanitized = uniqProfilesById(initial);
  const [stack, setStack] = useState<Profile[]>(sanitized);
  const [history, setHistory] = useState<{ profile: Profile; action: SwipeAction }[]>(
    [],
  );

  useEffect(() => {
    const next = uniqProfilesById(initial);
    queueMicrotask(() => {
      setStack(next);
      setHistory([]);
    });
  }, [initial]);

  const top = stack[0];

  const commit = useCallback((action: SwipeAction) => {
    setStack((prev) => {
      if (prev.length === 0) return prev;
      const [head, ...rest] = prev;
      setHistory((h) => [{ profile: head, action }, ...h]);
      return rest;
    });
  }, []);

  const rewind = useCallback(() => {
    setHistory((h) => {
      if (h.length === 0) return h;
      const [last, ...rest] = h;
      setStack((s) => {
        if (s[0]?.id === last.profile.id) return s;
        return [last.profile, ...s];
      });
      return rest;
    });
  }, []);

  const reset = useCallback(() => {
    setStack(uniqProfilesById(initial));
    setHistory([]);
  }, [initial]);

  return { stack, top, history, commit, rewind, reset, isEmpty: stack.length === 0 };
}
