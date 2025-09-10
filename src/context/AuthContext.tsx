import { createContext, useContext, useEffect, useMemo, useState } from "react";
import { useAccount } from "wagmi";

type Role = "admin" | "seller" | "buyer" | null;

type AuthUser = {
  role: Role;
  name?: string;
  address?: string;
};

type AuthContextType = {
  user: AuthUser | null;
  login: (role: Exclude<Role, null>, name?: string) => void;
  logout: () => void;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const { address } = useAccount();
  const [user, setUser] = useState<AuthUser | null>(null);

  useEffect(() => {
    const stored = localStorage.getItem("auth.user");
    if (stored) setUser(JSON.parse(stored));
  }, []);

  useEffect(() => {
    if (!user) return;
    const updated: AuthUser = { ...user, address: address ?? user.address };
    setUser(updated);
    localStorage.setItem("auth.user", JSON.stringify(updated));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [address]);

  const login = (role: Exclude<Role, null>, name?: string) => {
    const u: AuthUser = { role, name, address: address ?? undefined };
    setUser(u);
    localStorage.setItem("auth.user", JSON.stringify(u));
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem("auth.user");
  };

  const value = useMemo(() => ({ user, login, logout }), [user]);

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
};
