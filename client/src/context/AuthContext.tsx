import React, { createContext, useContext, useEffect, useState } from "react";

interface AuthUser {
  id: number;
  name: string;
  email: string;
  role: string;
  balance: number;
  accountType: string;
  totalDeposits: number;
  totalWithdrawals: number;
}

interface AuthContextType {
  user: AuthUser | null;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<boolean>;
  logout: () => void;
  register: (
    name: string,
    email: string,
    password: string,
    role: string
  ) => Promise<boolean>;
  refreshUser: () => Promise<void>;
  fetchUser: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [user, setUser] = useState<AuthUser | null>(null);

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
  }, []);

  const isAuthenticated = !!user;

  const login = async (email: string, password: string): Promise<boolean> => {
    try {
      const response = await fetch("http://localhost:3000/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();
      if (!response.ok) throw new Error(data.error || "Login failed");

      const loggedInUser: AuthUser = {
        id: data.user.id,
        name: data.user.name,
        email: data.user.email,
        role: data.user.role,
        balance: data.user.balance,
        accountType:
          data.user.accountType ||
          (data.user.role === "admin" ? "Checking" : "Savings"),
        totalDeposits: data.user.totalDeposits,
        totalWithdrawals: data.user.totalWithdrawals,
      };

      setUser(loggedInUser);
      localStorage.setItem("user", JSON.stringify(loggedInUser));
      localStorage.setItem("token", data.token);

      return true;
    } catch (error) {
      console.error("Login failed:", error);
      return false;
    }
  };

  const register = async (
    name: string,
    email: string,
    password: string,
    role: string // ✅ changed from accountType
  ): Promise<boolean> => {
    try {
      const response = await fetch("http://localhost:3000/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, password, role }), // ✅ correct key
      });

      const data = await response.json();
      if (!response.ok) throw new Error(data.error || "Registration failed");

      const newUser: AuthUser = {
        id: data.user.id,
        name: data.user.name,
        email: data.user.email,
        role: data.user.role,
        balance: data.user.balance,
        accountType:
          data.user.accountType ||
          (data.user.role === "admin" ? "Checking" : "Savings"),
        totalDeposits: data.user.totalDeposits,
        totalWithdrawals: data.user.totalWithdrawals,
      };

      setUser(newUser);
      localStorage.setItem("user", JSON.stringify(newUser));
      localStorage.setItem("token", data.token);

      return true;
    } catch (error) {
      console.error("Registration failed:", error);
      return false;
    }
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem("user");
    localStorage.removeItem("token");
  };

  const fetchUser = async (): Promise<void> => {
    try {
      const token = localStorage.getItem("token");
      const userData = localStorage.getItem("user");
      if (!token || !userData) return;

      const parsedUser = JSON.parse(userData);
      const response = await fetch(
        `http://localhost:3000/api/users/${parsedUser.id}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const data = await response.json();
      if (response.ok) {
        const fetchedUser: AuthUser = {
          id: data.id,
          name: data.name,
          email: data.email,
          role: data.role,
          balance: data.balance,
          accountType: data.accountType,
          totalDeposits: data.totalDeposits,
          totalWithdrawals: data.totalWithdrawals,
        };
        setUser(fetchedUser);
        localStorage.setItem("user", JSON.stringify(fetchedUser));
      }
    } catch (error) {
      console.error("Failed to fetch user:", error);
    }
  };

  const refreshUser = async (): Promise<void> => {
    try {
      const token = localStorage.getItem("token");
      const userData = localStorage.getItem("user");
      if (!token || !userData) return;

      const parsedUser = JSON.parse(userData);
      const response = await fetch(
        `http://localhost:3000/api/users/${parsedUser.id}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const data = await response.json();
      if (response.ok) {
        const refreshedUser: AuthUser = {
          id: data.id,
          name: data.name,
          email: data.email,
          role: data.role,
          balance: data.balance,
          accountType: data.accountType,
          totalDeposits: data.totalDeposits,
          totalWithdrawals: data.totalWithdrawals,
        };
        setUser(refreshedUser);
        localStorage.setItem("user", JSON.stringify(refreshedUser));
      }
    } catch (error) {
      console.error("Failed to refresh user:", error);
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated,
        login,
        logout,
        register,
        refreshUser,
        fetchUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
