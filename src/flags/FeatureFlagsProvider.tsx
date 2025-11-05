'use client'

import { createContext, ReactNode, useContext } from 'react'

type Flags = Record<string, boolean>

const defaultFlags: Flags = {
  donate: true,
}

const FlagsContext = createContext<Flags>(defaultFlags)

export function FeatureFlagsProvider({ children, flags }: { children: ReactNode; flags?: Flags }) {
  return <FlagsContext.Provider value={{ ...defaultFlags, ...(flags || {}) }}>{children}</FlagsContext.Provider>
}

export function useFeature(flag: keyof typeof defaultFlags) {
  const flags = useContext(FlagsContext)
  return flags[flag]
}


