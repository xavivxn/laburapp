"use client";

import { useCallback, useEffect, useState } from "react";
import type { Profile, SwipeAction } from "../types";

export function useSwipeDeck(initial: Profile[]) {
  const [stack, setStack] = useState<Profile[]>(initial);
  const [history, setHistory] = useState<{ profile: Profile; action: SwipeAction }[]>(
    [],
  );

  useEffect(() => {
    queueMicrotask(() => {
      setStack(initial);
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
      setStack((s) => [last.profile, ...s]);
      return rest;
    });
  }, []);

  const reset = useCallback(() => {
    setStack(initial);
    setHistory([]);
  }, [initial]);

  return { stack, top, history, commit, rewind, reset, isEmpty: stack.length === 0 };
}
