"use client"

import { createContext, useContext, useState, type ReactNode } from "react"

type AdminModeContextValue = {
  isAdmin: boolean
  adminMode: boolean
  setAdminMode: (value: boolean) => void
  setIsAdmin: (value: boolean) => void
}

const AdminModeContext = createContext<AdminModeContextValue>({
  isAdmin: false,
  adminMode: false,
  setAdminMode: () => {},
  setIsAdmin: () => {},
})

export function useAdminMode() {
  return useContext(AdminModeContext)
}

export function AdminModeProvider({ children }: { children: ReactNode }) {
  const [isAdmin, setIsAdmin] = useState(false)
  const [adminMode, setAdminMode] = useState(false)

  return (
    <AdminModeContext.Provider
      value={{ isAdmin, adminMode, setAdminMode, setIsAdmin }}
    >
      {children}
    </AdminModeContext.Provider>
  )
}
