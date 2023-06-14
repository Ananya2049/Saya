import { createContext, useContext, useState } from "react";

const Context = createContext();

export function UserProvider({ children }) {
    const [name, setName] = useState("");
    const [token, setToken] = useState("");
  const [isAdmin, setIsAdmin] = useState("");
  const [email, setEmail] = useState("");

  const saveEmail = (email) => {
    setEmail(email);
    localStorage.setItem("email", email);
  };
  const saveName = (name) => {
    setName(name);
    localStorage.setItem("name", name);
  };
  const saveToken = (token) => {
    setToken(token);
    localStorage.setItem("token", token);
  };
  const saveIsAdmin = (isAdmin) => {
    setIsAdmin(isAdmin);
    localStorage.setItem("isAdmin", isAdmin);
  };

  return (
    <Context.Provider value={{ name, saveName, token, saveToken, isAdmin, saveIsAdmin, email, saveEmail }}>{children}</Context.Provider>
  );
}

export function useUserContext() {
  return useContext(Context);
}