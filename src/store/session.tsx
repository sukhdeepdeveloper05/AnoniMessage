"use client";

import { type Session } from "next-auth";
import { createContext, useContext } from "react";

interface SessionState {
  session: Session | null;
}

const SessionContext = createContext<SessionState>({
  session: null,
});

export const SessionProvider = ({
  children,
  session,
}: {
  children: React.ReactNode;
  session: Session | null;
}) => {
  return (
    <SessionContext.Provider value={{ session }}>
      {children}
    </SessionContext.Provider>
  );
};

export const useSessionStore = () => {
  const context = useContext(SessionContext);
  if (!context) {
    throw new Error("useSessionStore must be used within SessionProvider");
  }

  return context;
};
