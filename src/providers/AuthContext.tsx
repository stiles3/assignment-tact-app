"use client";
import React, { createContext, useContext, useState, useEffect } from "react";

import { gql, useQuery } from "@apollo/client";
import Cookies from "js-cookie";

interface AuthContextType {
  token: string;
  setToken: (token: string) => void;
  deleteToken: () => void;
  isAuth: boolean;
  user: any;
  setUser: (user: any) => void;
}

const GET_USER = gql`
  query GetUser {
    getUser {
      data {
        id
        username
      }
      message
      status
    }
  }
`;

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{
  children: React.ReactNode;
}> = ({ children }) => {
  const { data, loading, error } = useQuery(GET_USER);
  const [user, setUser] = useState(null);
  const [isAuth, setIsAuth] = useState(false);
  const [token, setToken] = useState<string>(() => {
    const storedToken = Cookies.get("token");
    return storedToken ? storedToken : "";
  });

  useEffect(() => {
    if (data) {
      setUser(data);
    }
  }, [data]);

  const updateToken = (newToken: string) => {
    setToken(newToken);
    Cookies.set("token", newToken);
    // localStorage.setItem("token", newToken);
    setIsAuth(true);
  };
  const deleteToken = () => {
    localStorage.removeItem("token");
    setIsAuth(false);
  };

  return (
    <AuthContext.Provider
      value={{
        token,
        setToken: updateToken,
        deleteToken,
        isAuth,
        user,
        setUser,
      }}
    >
      {loading ? <div>Loading...</div> : children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
