import { useEffect, useState } from "react";

import { AuthContext } from "./AuthContext";
import { getMyInfo, logout as logoutApi } from "../api/authApi";
import {
  getAccessToken,
  getRefreshToken,
  saveTokens,
  clearTokens,
} from "../api/client";

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [isAuthLoading, setIsAuthLoading] = useState(true);

  useEffect(() => {
    let active = true;

    const initializeAuth = async () => {
      if (!getAccessToken() && !getRefreshToken()) {
        if (active) setIsAuthLoading(false);
        return;
      }

      try {
        const userData = await getMyInfo();

        if (active) {
          setUser(userData);
        }
      } catch {
        if (active) {
          setUser(null);
        }
      } finally {
        if (active) {
          setIsAuthLoading(false);
        }
      }
    };

    initializeAuth();

    const handleAuthLogout = () => {
      setUser(null);
    };

    window.addEventListener("auth:logout", handleAuthLogout);

    return () => {
      active = false;
      window.removeEventListener("auth:logout", handleAuthLogout);
    };
  }, []);

  const login = (data) => {
    saveTokens(data.accessToken, data.refreshToken);
    setUser(data.user);
  };

  const logout = async () => {
    const refreshToken = getRefreshToken();

    try {
      if (refreshToken) {
        await logoutApi(refreshToken);
      }
    } catch (error) {
      console.error("로그아웃 API 요청 실패:", error);
    } finally {
      clearTokens();
      setUser(null);
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isLoggedIn: !!user,
        isAuthLoading,
        login,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}
