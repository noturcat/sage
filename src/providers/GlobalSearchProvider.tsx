"use client";

import React, { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState } from "react";
import GlobalSearch from "@/components/organisms/global-search/GlobalSearch";

type GlobalSearchContextValue = {
  isOpen: boolean;
  open: () => void;
  close: () => void;
  toggle: () => void;
};

const GlobalSearchContext = createContext<GlobalSearchContextValue | null>(null);

export function useGlobalSearch(): GlobalSearchContextValue {
  const ctx = useContext(GlobalSearchContext);
  if (!ctx) {
    throw new Error("useGlobalSearch must be used within GlobalSearchProvider");
  }
  return ctx;
}

type ProviderProps = {
  children: React.ReactNode;
};

export default function GlobalSearchProvider({ children }: ProviderProps) {
  const [isOpen, setIsOpen] = useState(false);
  const openRef = useRef(setIsOpen);

  const open = useCallback(() => {
    setIsOpen(true)
  }, []);
  const close = useCallback(() => setIsOpen(false), []);
  const toggle = useCallback(() => setIsOpen(v => !v), []);

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      const isInputLike = (target: EventTarget | null) => {
        if (!(target instanceof HTMLElement)) return false;
        const tag = target.tagName.toLowerCase();
        return tag === "input" || tag === "textarea" || target.isContentEditable;
      };

      if (isInputLike(e.target)) return;

      const key = e.key.toLowerCase();
      const meta = e.metaKey; // Cmd on macOS
      const ctrl = e.ctrlKey; // Control on Windows/Linux

      // Open: Cmd+K, Ctrl+K, Cmd+Space (Spotlight style)
      if ((key === "k" && (meta || ctrl)) || (e.code === "Space" && meta)) {
        e.preventDefault();
        openRef.current(true);
      }

      // Close with Escape
      if (key === "escape") {
        setIsOpen(false);
      }
    };

    window.addEventListener("keydown", handler, { passive: false });
    return () => window.removeEventListener("keydown", handler);
  }, []);

  const value = useMemo<GlobalSearchContextValue>(() => ({ isOpen, open, close, toggle }), [isOpen, open, close, toggle]);

  return (
    <GlobalSearchContext.Provider value={value}>
      {children}
      <GlobalSearch open={isOpen} onClose={close} />
    </GlobalSearchContext.Provider>
  );
}


